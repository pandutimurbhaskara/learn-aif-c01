import type { Question } from '../content/types'
import { QUESTIONS, questionsForDomain, questionsForStep } from '../content/questions'
import { DOMAINS, findStep } from '../content/roadmap'
import { pickQuestions } from '../lib/quiz'
import type { Attempt, ProgressState } from '../lib/progress'

export type QuizKind = 'step' | 'domain' | 'mistakes' | 'practice'
/** Practice criteria travel in router state so "New set" can draw again. */
export interface PracticeState { stepIds: string[]; count: number; filter: 'all' | 'unseen' | 'missed'; title: string }
export interface Quiz { kind: Attempt['kind']; title: string; requested: number; qs: Question[] }

const STEP_SIZE = 10
const DOMAIN_SIZE = 25
const MISTAKES_SIZE = 20

export function buildQuiz(kind: QuizKind, scope: string, progress: ProgressState, practice?: PracticeState): Quiz {
  const rng = Math.random
  if (kind === 'step') return { kind, title: `Step check ${scope}: ${findStep(scope)?.title ?? ''}`, requested: STEP_SIZE, qs: pickQuestions(questionsForStep(scope), STEP_SIZE, { filter: 'all', progress, rng }) }
  if (kind === 'domain') return { kind, title: `Domain ${scope} quiz: ${DOMAINS[Number(scope) - 1]?.title ?? ''}`, requested: DOMAIN_SIZE, qs: pickQuestions(questionsForDomain(Number(scope)), DOMAIN_SIZE, { filter: 'all', progress, rng }) }
  if (kind === 'mistakes') return { kind, title: 'Retry my mistakes', requested: MISTAKES_SIZE, qs: pickQuestions(QUESTIONS, MISTAKES_SIZE, { filter: 'missed', progress, rng }) }
  const steps = new Set(practice?.stepIds ?? [])
  const count = practice?.count ?? 0
  const qs = pickQuestions(QUESTIONS.filter((q) => steps.has(q.step)), count, { filter: practice?.filter ?? 'all', progress, rng })
  return { kind, title: practice?.title ?? 'Practice', requested: count, qs }
}

/** Retrying misses is recorded as a mistakes drill, so it never inflates step or domain best scores. */
export const retryQuiz = (quiz: Quiz, misses: Question[]): Quiz =>
  ({ kind: 'mistakes', title: `${quiz.title} (retry misses)`, requested: misses.length, qs: misses })
