import { describe, it, expect } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useProgress, updateProgress } from './useProgress'
import { STORAGE_KEY, emptyProgress, loadProgress, toggleItem } from './progress'

describe('useProgress across tabs', () => {
  it('keeps changes another tab saved when this tab updates', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toggleItem(emptyProgress(), '1.1.1'))) // other tab
    updateProgress((s) => toggleItem(s, '1.1.2'))
    const saved = loadProgress()
    expect(saved.items['1.1.1']).toBe(true)
    expect(saved.items['1.1.2']).toBe(true)
  })

  it('refreshes when another tab writes progress', () => {
    const { result } = renderHook(() => useProgress())
    const other = toggleItem(emptyProgress(), '5.2.9')
    localStorage.setItem(STORAGE_KEY, JSON.stringify(other))
    act(() => { window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY })) })
    expect(result.current[0].items['5.2.9']).toBe(true)
  })
})
