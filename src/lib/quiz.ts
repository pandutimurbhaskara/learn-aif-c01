import type { DomainId, Question } from '../content/types'
import { addAttempt, recordAnswer, type Attempt, type ExamSession, type ProgressState } from './progress'

export type Rng = () => number

export function isCorrect(q: Question, answer: string[]): boolean {
  if (q.type === 'match') return (q.pairs ?? []).every((p, i) => answer[i] === p.answer)
  const want = new Set(q.correct ?? [])
  return answer.length === want.size && answer.every((a) => want.has(a))
}

export function shuffle<T>(xs: T[], rng: Rng): T[] {
  const out = [...xs]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export function pickQuestions(
  pool: Question[],
  n: number,
  opts: { filter: 'all' | 'unseen' | 'missed'; progress: ProgressState; rng: Rng },
): Question[] {
  const stats = opts.progress.questions
  const seen = (q: Question) => q.id in stats
  if (opts.filter === 'missed') return shuffle(pool.filter((q) => stats[q.id]?.lastCorrect === false), opts.rng).slice(0, n)
  if (opts.filter === 'unseen') return shuffle(pool.filter((q) => !seen(q)), opts.rng).slice(0, n)
  // 'all': unseen first, then seen ones; shuffled within each group, then shuffled again for display
  const chosen = [...shuffle(pool.filter((q) => !seen(q)), opts.rng), ...shuffle(pool.filter(seen), opts.rng)].slice(0, n)
  return shuffle(chosen, opts.rng)
}

/** Questions per domain on the 65-question exam, from the 20/24/28/14/14 weights. */
export const EXAM_PLAN: Record<DomainId, number> = { 1: 13, 2: 16, 3: 18, 4: 9, 5: 9 }
export const EXAM_SIZE = 65
export const EXAM_DURATION_MS = 90 * 60 * 1000

export function drawExam(all: Question[], rng: Rng): Question[] {
  const domains = [1, 2, 3, 4, 5] as DomainId[]
  const byDomain = new Map(domains.map((d) => [d, shuffle(all.filter((q) => q.domain === d), rng)]))
  const picked: Question[] = []
  for (const d of domains) picked.push(...byDomain.get(d)!.splice(0, EXAM_PLAN[d]))
  // Fill any shortfall from the remaining questions, largest-weight domain first.
  for (const d of [...domains].sort((a, b) => EXAM_PLAN[b] - EXAM_PLAN[a])) {
    if (picked.length >= EXAM_SIZE) break
    picked.push(...byDomain.get(d)!.splice(0, EXAM_SIZE - picked.length))
  }
  return shuffle(picked, rng)
}

/** Approximate scaled score: piecewise linear so that 0% → 100, 70% → 700, 100% → 1000. */
export function scaledScore(correct: number, total: number): number {
  const f = total ? correct / total : 0
  return Math.round(f <= 0.7 ? 100 + (f / 0.7) * 600 : 700 + ((f - 0.7) / 0.3) * 300)
}

/** Derived from the session so repeated submits (e.g. React StrictMode effects) all point at one result. */
export const examAttemptId = (s: ExamSession) => `exam-${s.startedAt}`

export const examRemainingMs = (s: ExamSession, now: number) => Math.max(0, s.startedAt + s.durationMs - now)

export function gradeExam(s: ExamSession, byId: Map<string, Question>) {
  const byDomain: Attempt['byDomain'] = {}
  let correct = 0
  let total = 0
  for (const id of s.questionIds) {
    const q = byId.get(id)
    if (!q) continue
    const ok = isCorrect(q, s.answers[id] ?? [])
    const d = (byDomain[q.domain] ??= { total: 0, correct: 0 })
    d.total++
    total++
    if (ok) { d.correct++; correct++ }
  }
  const scaled = scaledScore(correct, total)
  return { correct, total, scaled, passed: scaled >= 700, byDomain }
}

/**
 * Grades the in-progress exam, records answers for the questions actually answered
 * (unanswered ones are not counted as "missed"), stores the attempt and clears the session.
 */
export function finishExam(s: ProgressState, byId: Map<string, Question>, attemptId: string, now: number): ProgressState {
  const session = s.exam
  if (!session) return s
  const r = gradeExam(session, byId)
  let next = s
  for (const id of session.questionIds) {
    const q = byId.get(id)
    const a = session.answers[id]
    if (q && a?.some(Boolean)) next = recordAnswer(next, id, isCorrect(q, a), now)
  }
  next = addAttempt(next, {
    id: attemptId, kind: 'exam', scope: 'exam', date: now, total: r.total, correct: r.correct, byDomain: r.byDomain,
    questionIds: session.questionIds, answers: session.answers,
  })
  return { ...next, exam: null }
}
