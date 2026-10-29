export interface ChecklistItem {
  id: string // "1.1.3"
  title: string
}

export interface Step {
  id: string // "1.1"
  title: string
  summary: string
  services: string[]
  items: ChecklistItem[]
}

export type DomainId = 1 | 2 | 3 | 4 | 5

export interface Domain {
  id: DomainId
  title: string
  weight: number
  steps: Step[]
}

export type QuestionType = 'single' | 'multi' | 'match'

export interface Question {
  id: string
  source: 'pintardengan' | 'kananinirav' | 'jwalsh' | 'original'
  type: QuestionType
  stem: string
  options?: { key: string; text: string }[]
  correct?: string[]
  // match questions (ordering questions are match with termBank like ["1st", "2nd", ...])
  pairs?: { prompt: string; answer: string }[]
  termBank?: string[]
  explanation: string
  domain: DomainId
  step: string
  concepts: string[]
}
