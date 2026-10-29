import { describe, it, expect, beforeEach } from 'vitest'
import { applyFontSize, getFontSize, initFontSize, stepFontSize } from './fontSize'

describe('font size', () => {
  beforeEach(() => { localStorage.clear(); document.documentElement.style.fontSize = '' })

  it('defaults to 100% and leaves the root size untouched', () => {
    initFontSize()
    expect(getFontSize()).toBe(100)
    expect(document.documentElement.style.fontSize).toBe('')
  })
  it('applies and remembers a size', () => {
    applyFontSize(125)
    expect(document.documentElement.style.fontSize).toBe('125%')
    expect(getFontSize()).toBe(125)
    document.documentElement.style.fontSize = ''
    initFontSize()
    expect(document.documentElement.style.fontSize).toBe('125%')
  })
  it('ignores a stored value that is not on the ladder', () => {
    localStorage.setItem('aifc01.fontsize', '333')
    expect(getFontSize()).toBe(100)
  })
  it('steps within the ends of the ladder', () => {
    expect(stepFontSize(100, 1)).toBe(112)
    expect(stepFontSize(100, -1)).toBe(90)
    expect(stepFontSize(90, -1)).toBe(90)
    expect(stepFontSize(150, 1)).toBe(150)
  })
})
