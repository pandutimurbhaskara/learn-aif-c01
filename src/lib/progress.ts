import type { Step } from '../content/types'
import { ALL_STEPS } from '../content/roadmap'

export interface QStat { seen: number; lastCorrect: boolean; lastSeen: number }

export interface Attempt {
  id: string
  kind: 'step' | 'domain' | 'practice' | 'mistakes' | 'exam'
  scope: string
  date: number
  total: number
  correct: number
  byDomain: Record<number, { total: number; correct: number }>
  /** Exam attempts keep their questions and answers so the result page can review them. */
  questionIds?: string[]
  answers?: Record<string, string[]>
}

export interface ExamSession {
  questionIds: string[]
  answers: Record<string, string[]>
  flagged: string[]
  startedAt: number
  durationMs: number
}

export interface ProgressState {
  version: 1
  items: Record<string, boolean>
  questions: Record<string, QStat>
  attempts: Attempt[]
  exam: ExamSession | null
  lastStep: string | null
}

export const STORAGE_KEY = 'aifc01.progress.v1'

export const emptyProgress = (): ProgressState => ({
  version: 1, items: {}, questions: {}, attempts: [], exam: null, lastStep: null,
})

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)

const isAttempt = (a: unknown): a is Attempt =>
  isObj(a) && typeof a.id === 'string' && typeof a.kind === 'string' && typeof a.total === 'number' && typeof a.correct === 'number' && isObj(a.byDomain)

const isExam = (e: unknown): e is ExamSession =>
  isObj(e) && Array.isArray(e.questionIds) && isObj(e.answers) && Array.isArray(e.flagged) && typeof e.startedAt === 'number' && typeof e.durationMs === 'number'

/** Accepts only a well-formed v1 state; fills missing fields and drops malformed parts that would crash pages. */
function coerce(raw: unknown): ProgressState | null {
  if (!isObj(raw) || raw.version !== 1 || !isObj(raw.items) || !isObj(raw.questions) || !Array.isArray(raw.attempts)) return null
  const s = { ...emptyProgress(), ...(raw as Partial<ProgressState>) } as ProgressState
  return { ...s, attempts: s.attempts.filter(isAttempt), exam: isExam(s.exam) ? s.exam : null }
}

const defaultStorage = (): Storage | undefined => {
  try { return globalThis.localStorage } catch { return undefined }
}

export function loadProgress(storage: Storage | undefined = defaultStorage()): ProgressState {
  try {
    const text = storage?.getItem(STORAGE_KEY)
    return (text && coerce(JSON.parse(text))) || emptyProgress()
  } catch {
    return emptyProgress()
  }
}

export function saveProgress(s: ProgressState, storage: Storage | undefined = defaultStorage()): void {
  try { storage?.setItem(STORAGE_KEY, JSON.stringify(s)) } catch { /* private mode or quota: keep in memory only */ }
}

export const toggleItem = (s: ProgressState, itemId: string): ProgressState =>
  ({ ...s, items: { ...s.items, [itemId]: !s.items[itemId] } })

export function recordAnswer(s: ProgressState, qid: string, correct: boolean, now: number): ProgressState {
  const prev = s.questions[qid]
  return { ...s, questions: { ...s.questions, [qid]: { seen: (prev?.seen ?? 0) + 1, lastCorrect: correct, lastSeen: now } } }
}

export const addAttempt = (s: ProgressState, a: Attempt): ProgressState => ({ ...s, attempts: [...s.attempts, a] })

export const stepProgress = (s: ProgressState, step: Step) =>
  ({ done: step.items.filter((it) => s.items[it.id]).length, total: step.items.length })

export const nextStep = (s: ProgressState): Step | null =>
  ALL_STEPS.find((st) => st.items.some((it) => !s.items[it.id])) ?? null

export const exportProgress = (s: ProgressState): string => JSON.stringify(s, null, 1)

export function importProgress(json: string): ProgressState {
  let parsed: unknown
  try { parsed = JSON.parse(json) } catch { throw new Error('Invalid progress file') }
  const s = coerce(parsed)
  if (!s) throw new Error('Invalid progress file')
  return s
}
