import { describe, it, expect } from 'vitest'
import { initTheme } from './theme'

describe('initTheme', () => {
  it('applies the saved theme on startup', () => {
    localStorage.setItem('aifc01.theme', 'dark')
    initTheme()
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })
  it('leaves the attribute off for system', () => {
    localStorage.setItem('aifc01.theme', 'system')
    initTheme()
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false)
  })
})
