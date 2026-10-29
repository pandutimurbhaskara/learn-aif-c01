import { describe, it, expect } from 'vitest'
import { isCorrect, shuffle, pickQuestions, drawExam, scaledScore, examRemainingMs, gradeExam, EXAM_PLAN } from './quiz'
import { emptyProgress, recordAnswer } from './progress'
import type { Question, DomainId } from '../content/types'

let seed = 1
const rng = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)

const single = (id: string, domain: DomainId = 1): Question => ({
  id, source: 'original', type: 'single', stem: id, domain, step: `${domain}.1`, concepts: [`${domain}.1.1`], explanation: 'e',
  options: [{ key: 'A', text: 'a' }, { key: 'B', text: 'b' }, { key: 'C', text: 'c' }], correct: ['B'],
})
const multi: Question = { ...single('m'), type: 'multi', correct: ['A', 'C'] }
const match: Question = {
  ...single('x'), type: 'match', options: undefined, correct: undefined,
  pairs: [{ prompt: 'p1', answer: 'T1' }, { prompt: 'p2', answer: 'T2' }], termBank: ['T1', 'T2'],
}
const pool = (counts: Record<DomainId, number>) =>
  (Object.entries(counts) as [string, number][]).flatMap(([d, n]) => Array.from({ length: n }, (_, i) => single(`d${d}-${i}`, Number(d) as DomainId)))

describe('isCorrect', () => {
  it('grades single', () => {
    expect(isCorrect(single('s'), ['B'])).toBe(true)
    expect(isCorrect(single('s'), ['A'])).toBe(false)
    expect(isCorrect(single('s'), [])).toBe(false)
  })
  it('grades multi as set equality', () => {
    expect(isCorrect(multi, ['C', 'A'])).toBe(true)
    expect(isCorrect(multi, ['A'])).toBe(false)
    expect(isCorrect(multi, ['A', 'B', 'C'])).toBe(false)
  })
  it('grades match pair by pair', () => {
    expect(isCorrect(match, ['T1', 'T2'])).toBe(true)
    expect(isCorrect(match, ['T1', 'T1'])).toBe(false)
  })
})

describe('shuffle', () => {
  it('returns a new permutation', () => {
    const xs = [1, 2, 3, 4, 5]
    const out = shuffle(xs, rng)
    expect(out).not.toBe(xs)
    expect([...out].sort()).toEqual(xs)
  })
})

describe('pickQuestions', () => {
  const qs = [single('a'), single('b'), single('c')]
  it('returns what exists when the pool is smaller than n', () => {
    expect(pickQuestions(qs, 10, { filter: 'all', progress: emptyProgress(), rng })).toHaveLength(3)
  })
  it('returns nothing for missed when nothing was missed', () => {
    expect(pickQuestions(qs, 10, { filter: 'missed', progress: emptyProgress(), rng })).toEqual([])
  })
  it('filters missed and unseen', () => {
    let p = recordAnswer(emptyProgress(), 'a', false, 1)
    p = recordAnswer(p, 'b', true, 1)
    expect(pickQuestions(qs, 10, { filter: 'missed', progress: p, rng }).map((q) => q.id)).toEqual(['a'])
    expect(pickQuestions(qs, 10, { filter: 'unseen', progress: p, rng }).map((q) => q.id)).toEqual(['c'])
  })
  it('serves unseen questions first for all', () => {
    const p = recordAnswer(recordAnswer(emptyProgress(), 'a', true, 1), 'b', true, 1)
    expect(pickQuestions(qs, 1, { filter: 'all', progress: p, rng })[0].id).toBe('c')
  })
})

describe('drawExam', () => {
  it('draws 65 split 13/16/18/9/9 by domain', () => {
    const exam = drawExam(pool({ 1: 30, 2: 30, 3: 30, 4: 30, 5: 30 }), rng)
    expect(exam).toHaveLength(65)
    const by = (d: number) => exam.filter((q) => q.domain === d).length
    expect([1, 2, 3, 4, 5].map(by)).toEqual([13, 16, 18, 9, 9])
    expect(Object.values(EXAM_PLAN).reduce((a, b) => a + b)).toBe(65)
  })
  it('fills a domain shortfall from other domains without duplicates', () => {
    const exam = drawExam(pool({ 1: 30, 2: 30, 3: 30, 4: 30, 5: 4 }), rng)
    expect(exam).toHaveLength(65)
    expect(new Set(exam.map((q) => q.id)).size).toBe(65)
    expect(exam.filter((q) => q.domain === 5)).toHaveLength(4)
  })
})

describe('scoring', () => {
  it('maps 0% to 100, 70% to 700 and 100% to 1000', () => {
    expect(scaledScore(0, 65)).toBe(100)
    expect(scaledScore(45.5, 65)).toBe(700)
    expect(scaledScore(65, 65)).toBe(1000)
  })
  it('counts down and stops at zero', () => {
    const s = { questionIds: [], answers: {}, flagged: [], startedAt: 1000, durationMs: 5000 }
    expect(examRemainingMs(s, 2000)).toBe(4000)
    expect(examRemainingMs(s, 99999)).toBe(0)
  })
  it('grades an exam, treating unanswered as wrong', () => {
    const qs = [single('a', 1), single('b', 2)]
    const session = { questionIds: ['a', 'b'], answers: { a: ['B'] }, flagged: [], startedAt: 0, durationMs: 1 }
    const r = gradeExam(session, new Map(qs.map((q) => [q.id, q])))
    expect(r).toMatchObject({ correct: 1, total: 2, passed: false })
    expect(r.byDomain).toEqual({ 1: { total: 1, correct: 1 }, 2: { total: 1, correct: 0 } })
    expect(r.scaled).toBe(scaledScore(1, 2))
  })
})

describe('finishExam', () => {
  it('records the attempt, clears the session and only marks answered questions as seen', async () => {
    const { finishExam } = await import('./quiz')
    const qs = [single('a', 1), single('b', 2), single('c', 3)]
    const p = { ...emptyProgress(), exam: { questionIds: ['a', 'b', 'c'], answers: { a: ['B'], b: ['A'] }, flagged: [], startedAt: 0, durationMs: 1 } }
    const next = finishExam(p, new Map(qs.map((q) => [q.id, q])), 'att-1', 99)
    expect(next.exam).toBeNull()
    expect(Object.keys(next.questions).sort()).toEqual(['a', 'b'])
    expect(next.questions.b.lastCorrect).toBe(false)
    expect(next.attempts[0]).toMatchObject({ id: 'att-1', kind: 'exam', total: 3, correct: 1, questionIds: ['a', 'b', 'c'] })
  })
})

describe('examAttemptId', () => {
  it('is stable for a session so repeated submits point at one result', async () => {
    const { examAttemptId } = await import('./quiz')
    const s = { questionIds: [], answers: {}, flagged: [], startedAt: 1234, durationMs: 1 }
    expect(examAttemptId(s)).toBe(examAttemptId({ ...s }))
    expect(examAttemptId(s)).toBe('exam-1234')
  })
})
