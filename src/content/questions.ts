import type { Question } from './types'
import data from './questions.json'

export const QUESTIONS = data as Question[]
export const byId = new Map(QUESTIONS.map((q) => [q.id, q]))
export const questionsForStep = (stepId: string) => QUESTIONS.filter((q) => q.step === stepId)
export const questionsForDomain = (domainId: number) => QUESTIONS.filter((q) => q.domain === domainId)
