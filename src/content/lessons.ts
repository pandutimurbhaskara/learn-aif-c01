export interface LessonSection { itemId: string | null; heading: string; body: string }
export interface Lesson { sections: LessonSection[] }

const files = import.meta.glob('./lessons/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

const ITEM_HEADING = /^(\d+\.\d+\.\d+)\s+(.*)$/

export function parseLesson(md: string): Lesson {
  const sections: LessonSection[] = []
  for (const chunk of md.split(/^## /m).slice(1)) {
    const nl = chunk.indexOf('\n')
    const title = (nl < 0 ? chunk : chunk.slice(0, nl)).trim()
    const body = nl < 0 ? '' : chunk.slice(nl + 1).trim()
    const m = title.match(ITEM_HEADING)
    sections.push(m ? { itemId: m[1], heading: m[2], body } : { itemId: null, heading: title, body })
  }
  return { sections }
}

export const conceptLinks = (body: string): string[] => [...body.matchAll(/\]\(concept:([\d.]+)\)/g)].map((m) => m[1])

const cache = new Map<string, Lesson>()
export function getLesson(stepId: string): Lesson | undefined {
  const md = files[`./lessons/${stepId}.md`]
  if (md === undefined) return undefined
  if (!cache.has(stepId)) cache.set(stepId, parseLesson(md))
  return cache.get(stepId)
}
