import { useSyncExternalStore } from 'react'
import { loadProgress, saveProgress, STORAGE_KEY, type ProgressState } from './progress'

let state: ProgressState = loadProgress()
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((l) => l())

/** Applies fn to the latest saved progress (another tab may have written since we loaded). */
export function updateProgress(fn: (s: ProgressState) => ProgressState) {
  state = fn(loadProgress())
  saveProgress(state)
  notify()
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) { state = loadProgress(); notify() }
  })
}

const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

export function useProgress(): [ProgressState, typeof updateProgress] {
  return [useSyncExternalStore(subscribe, () => state), updateProgress]
}
