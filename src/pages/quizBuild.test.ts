import { describe, it, expect } from 'vitest'
import { buildQuiz, retryQuiz } from './quizBuild'
import { emptyProgress, recordAnswer } from '../lib/progress'
import { questionsForStep } from '../content/questions'

describe('buildQuiz (practice)', () => {
  it('draws a fresh set from the saved criteria each time', () => {
    const pool = questionsForStep('1.1')
    let p = emptyProgress()
    for (const q of pool.slice(0, pool.length - 3)) p = recordAnswer(p, q.id, true, 1)
    const quiz = buildQuiz('practice', 'practice', p, { stepIds: ['1.1'], count: 10, filter: 'unseen', title: 't' })
    expect(quiz.qs).toHaveLength(3)
    expect(quiz.qs.every((q) => !(q.id in p.questions))).toBe(true)
  })
})

describe('retryQuiz', () => {
  it('records retries as mistakes so they do not inflate step scores', () => {
    const quiz = buildQuiz('step', '1.1', emptyProgress())
    const r = retryQuiz(quiz, quiz.qs.slice(0, 2))
    expect(r.kind).toBe('mistakes')
    expect(r.qs).toHaveLength(2)
  })
})
