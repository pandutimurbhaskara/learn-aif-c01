import { describe, it, expect } from 'vitest'
import { validateQuestions } from './lib/validate.mjs'

const items = ['1.1.1', '1.1.2', '2.1.1', '2.1.2']
const steps = ['1.1', '2.1']
const roadmap = { itemOrder: (id) => items.indexOf(id), stepOrder: (id) => steps.indexOf(id) }
const ok = { id: 'q1', type: 'single', domain: 2, step: '2.1', concepts: ['1.1.1', '2.1.2'], options: [{ key: 'A', text: 'a' }, { key: 'B', text: 'b' }], correct: ['A'], explanation: 'why' }
const run = (patch, extra = []) => validateQuestions([{ ...ok, ...patch }, ...extra], roadmap)

describe('validateQuestions', () => {
  it('accepts a valid question', () => expect(run({})).toEqual([]))
  it('rejects an unknown step', () => expect(run({ step: '9.9' })).toHaveLength(1))
  it('rejects empty concepts', () => expect(run({ concepts: [] })).toHaveLength(1))
  it('rejects an unknown concept', () => expect(run({ concepts: ['7.7.7'] })).toHaveLength(1))
  it('rejects a concept taught after the step', () => expect(run({ domain: 1, step: '1.1', concepts: ['2.1.1'] })).toEqual(['q1: concept 2.1.1 is taught after step 1.1']))
  it('rejects a domain that does not match the step', () => expect(run({ domain: 1 })).toHaveLength(1))
  it('rejects single with two answers', () => expect(run({ correct: ['A', 'B'] })).toHaveLength(1))
  it('rejects multi with one answer', () => expect(run({ type: 'multi' })).toHaveLength(1))
  it('rejects a correct key that is not an option', () => expect(run({ correct: ['Z'] })).toHaveLength(1))
  it('rejects match answers outside the term bank', () =>
    expect(run({ type: 'match', options: undefined, correct: undefined, pairs: [{ prompt: 'p', answer: 'X' }], termBank: ['Y'] })).toHaveLength(1))
  it('rejects duplicate ids', () => expect(run({}, [ok])).toEqual(['q1: duplicate id']))
  it('rejects a missing explanation', () => expect(run({ explanation: ' ' })).toHaveLength(1))
})
