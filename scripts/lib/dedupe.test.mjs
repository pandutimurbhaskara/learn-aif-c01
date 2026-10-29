import { describe, it, expect } from 'vitest'
import { dedupe } from './dedupe.mjs'

const q = (id, stem, explanation = 'x', options = ['Alpha', 'Beta']) => ({
  id, stem, explanation, options: options.map((text, i) => ({ key: 'ABCD'[i], text })),
})

describe('dedupe', () => {
  it('drops a near-identical question, keeping the longer explanation', () => {
    const a = q('a', 'Which AWS service converts speech to text?', 'short')
    const b = q('b', 'which aws service converts speech-to-text', 'a much longer explanation')
    const { kept, dropped } = dedupe([a, b])
    expect(kept.map((x) => x.id)).toEqual(['b'])
    expect(dropped).toEqual([{ id: 'a', duplicateOf: 'b' }])
  })
  it('keeps unrelated questions', () => {
    const a = q('a', 'Which AWS service converts speech to text?')
    const b = q('b', 'What does temperature control in an LLM?', 'x', ['Randomness', 'Size'])
    expect(dedupe([a, b]).kept).toHaveLength(2)
  })
})
