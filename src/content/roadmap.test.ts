import { describe, it, expect } from 'vitest'
import { DOMAINS, ALL_STEPS, ALL_ITEMS, itemOrder, stepOrder, findStep, stepOfItem } from './roadmap'

describe('roadmap', () => {
  it('has the 5 official domains with exam-guide weights', () => {
    expect(DOMAINS.map((d) => d.weight)).toEqual([20, 24, 28, 14, 14])
    expect(DOMAINS.reduce((s, d) => s + d.weight, 0)).toBe(100)
  })

  it('has one step per task statement, in order', () => {
    expect(ALL_STEPS.map((s) => s.id)).toEqual([
      '1.1', '1.2', '1.3', '2.1', '2.2', '2.3', '3.1', '3.2', '3.3', '3.4', '4.1', '4.2', '5.1', '5.2',
    ])
  })

  it('gives every item a unique id prefixed by its step', () => {
    const ids = new Set<string>()
    for (const step of ALL_STEPS) {
      for (const item of step.items) {
        expect(item.id.startsWith(step.id + '.')).toBe(true)
        expect(ids.has(item.id)).toBe(false)
        ids.add(item.id)
      }
    }
  })

  it('keeps every step between 5 and 12 items', () => {
    for (const step of ALL_STEPS) {
      expect(step.items.length, step.id).toBeGreaterThanOrEqual(5)
      expect(step.items.length, step.id).toBeLessThanOrEqual(12)
    }
  })

  it('orders items strictly in teaching order', () => {
    for (let i = 1; i < ALL_ITEMS.length; i++) {
      expect(itemOrder(ALL_ITEMS[i].id)).toBeGreaterThan(itemOrder(ALL_ITEMS[i - 1].id))
    }
    expect(stepOrder('1.1')).toBeLessThan(stepOrder('5.2'))
    expect(itemOrder('9.9.9')).toBe(-1)
  })

  it('looks up steps by id and by item', () => {
    expect(findStep('3.2')?.title).toMatch(/prompt engineering/i)
    expect(findStep('9.9')).toBeUndefined()
    expect(stepOfItem('2.1.3')).toBe('2.1')
  })
})
