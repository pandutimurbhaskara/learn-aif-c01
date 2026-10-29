import { describe, it, expect } from 'vitest'
import { ALL_STEPS } from './roadmap'
import { CATEGORIES, SERVICES, stepsForService } from './services'

describe('services catalog', () => {
  it('has unique names and known categories', () => {
    const names = SERVICES.map((s) => s.name)
    expect(new Set(names).size).toBe(names.length)
    for (const s of SERVICES) expect(CATEGORIES).toContain(s.category)
  })
  it('gives every service a description, an example and an exam cue', () => {
    for (const s of SERVICES) {
      expect(s.does.length, s.name).toBeGreaterThan(10)
      expect(s.example.length, s.name).toBeGreaterThan(10)
      expect(s.cue.length, s.name).toBeGreaterThan(5)
    }
  })
  it('covers every service named in the roadmap', () => {
    const catalog = new Set(SERVICES.map((s) => s.name))
    const missing = [...new Set(ALL_STEPS.flatMap((st) => st.services))].filter((n) => !catalog.has(n))
    expect(missing).toEqual([])
  })
  it('links every service to at least one real step', () => {
    const ids = new Set(ALL_STEPS.map((s) => s.id))
    for (const s of SERVICES) {
      const steps = stepsForService(s)
      expect(steps.length, s.name).toBeGreaterThan(0)
      for (const id of steps) expect(ids.has(id), `${s.name} -> ${id}`).toBe(true)
    }
  })
})
