import { describe, it, expect } from 'vitest'
import { getLesson, parseLesson, conceptLinks } from './lessons'
import { ALL_STEPS, itemOrder } from './roadmap'

describe('parseLesson', () => {
  it('splits sections by ## heading and recognizes item ids', () => {
    const l = parseLesson('## 1.1.1 AI layers\nBody one\n\n## Exam traps\n- a\n')
    expect(l.sections).toEqual([
      { itemId: '1.1.1', heading: 'AI layers', body: 'Body one' },
      { itemId: null, heading: 'Exam traps', body: '- a' },
    ])
  })
  it('extracts concept links', () => {
    expect(conceptLinks('see [x](concept:2.1.4) and [y](concept:1.1.1)')).toEqual(['2.1.4', '1.1.1'])
  })
})

describe('lesson content', () => {
  for (const step of ALL_STEPS) {
    describe(step.id, () => {
      const lesson = getLesson(step.id)
      it('exists with one section per checklist item, in order', () => {
        expect(lesson, `missing lessons/${step.id}.md`).toBeTruthy()
        expect(lesson!.sections.filter((s) => s.itemId).map((s) => s.itemId)).toEqual(step.items.map((i) => i.id))
      })
      it('ends with Exam traps and Further reading', () => {
        expect(lesson!.sections.filter((s) => !s.itemId).map((s) => s.heading)).toEqual(['Exam traps', 'Further reading'])
      })
      it('only links to concepts taught at or before this step', () => {
        const last = itemOrder(step.items[step.items.length - 1].id)
        for (const s of lesson!.sections) {
          for (const c of conceptLinks(s.body)) {
            expect(itemOrder(c), `${step.id} links ${c}`).toBeGreaterThanOrEqual(0)
            expect(itemOrder(c), `${step.id} links ${c}`).toBeLessThanOrEqual(last)
          }
        }
      })
      if (step.id !== '2.2' && step.id !== '3.2') {
        it('has at least one mermaid diagram', () => {
          expect(lesson!.sections.some((s) => s.body.includes('```mermaid'))).toBe(true)
        })
      }
    })
  }
})
