import { describe, it, expect } from 'vitest'
import {
  emptyProgress, loadProgress, saveProgress, toggleItem, recordAnswer, addAttempt,
  stepProgress, nextStep, exportProgress, importProgress, STORAGE_KEY,
} from './progress'
import { findStep, ALL_STEPS } from '../content/roadmap'

const memStorage = (init: Record<string, string> = {}): Storage => {
  const m = new Map(Object.entries(init))
  return {
    getItem: (k) => m.get(k) ?? null,
    setItem: (k, v) => void m.set(k, v),
    removeItem: (k) => void m.delete(k),
    clear: () => m.clear(),
    key: () => null,
    get length() { return m.size },
  }
}
const throwing: Storage = { ...memStorage(), getItem: () => { throw new Error('denied') }, setItem: () => { throw new Error('quota') } }

describe('progress', () => {
  it('toggles an item on and off', () => {
    const s1 = toggleItem(emptyProgress(), '1.1.1')
    expect(s1.items['1.1.1']).toBe(true)
    expect(toggleItem(s1, '1.1.1').items['1.1.1']).toBe(false)
  })

  it('records answers', () => {
    let s = recordAnswer(emptyProgress(), 'q1', false, 10)
    s = recordAnswer(s, 'q1', true, 20)
    expect(s.questions.q1).toEqual({ seen: 2, lastCorrect: true, lastSeen: 20 })
  })

  it('counts step progress and ignores unknown ids', () => {
    const step = findStep('1.1')!
    let s = toggleItem(emptyProgress(), '9.9.9')
    s = toggleItem(s, '1.1.1')
    expect(stepProgress(s, step)).toEqual({ done: 1, total: step.items.length })
  })

  it('suggests the first step with unticked items', () => {
    expect(nextStep(emptyProgress())?.id).toBe('1.1')
    let s = emptyProgress()
    for (const it of findStep('1.1')!.items) s = toggleItem(s, it.id)
    expect(nextStep(s)?.id).toBe('1.2')
    for (const st of ALL_STEPS) for (const it of st.items) if (!s.items[it.id]) s = toggleItem(s, it.id)
    expect(nextStep(s)).toBeNull()
  })

  it('adds attempts newest last', () => {
    const a = { id: 'a', kind: 'step' as const, scope: '1.1', date: 1, total: 10, correct: 7, byDomain: {} }
    expect(addAttempt(emptyProgress(), a).attempts).toEqual([a])
  })

  it('loads empty progress for missing, invalid, wrong-version or throwing storage', () => {
    expect(loadProgress(memStorage())).toEqual(emptyProgress())
    expect(loadProgress(memStorage({ [STORAGE_KEY]: '{not json' }))).toEqual(emptyProgress())
    expect(loadProgress(memStorage({ [STORAGE_KEY]: '{"version":99}' }))).toEqual(emptyProgress())
    expect(loadProgress(throwing)).toEqual(emptyProgress())
  })

  it('saves and loads back, and never throws on save', () => {
    const st = memStorage()
    const s = toggleItem(emptyProgress(), '2.1.1')
    saveProgress(s, st)
    expect(loadProgress(st)).toEqual(s)
    expect(() => saveProgress(s, throwing)).not.toThrow()
  })

  it('round-trips export and import, and rejects bad files', () => {
    const s = recordAnswer(toggleItem(emptyProgress(), '1.2.3'), 'pd-1', true, 5)
    expect(importProgress(exportProgress(s))).toEqual(s)
    expect(() => importProgress('{}')).toThrow('Invalid progress file')
    expect(() => importProgress('nope')).toThrow('Invalid progress file')
  })
})

describe('progress sanitizing', () => {
  it('drops a malformed exam session and malformed attempts', () => {
    const good = { id: 'a', kind: 'step', scope: '1.1', date: 1, total: 10, correct: 7, byDomain: {} }
    const raw = { ...emptyProgress(), exam: {}, attempts: [null, { id: 'x' }, good] }
    const s = importProgress(JSON.stringify(raw))
    expect(s.exam).toBeNull()
    expect(s.attempts).toEqual([good])
  })
  it('keeps a well-formed exam session', () => {
    const exam = { questionIds: ['a'], answers: {}, flagged: [], startedAt: 5, durationMs: 10 }
    expect(importProgress(JSON.stringify({ ...emptyProgress(), exam })).exam).toEqual(exam)
  })
})
