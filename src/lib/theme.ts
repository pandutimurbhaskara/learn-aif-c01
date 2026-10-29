export type ThemeChoice = 'light' | 'dark' | 'system'
const KEY = 'aifc01.theme'

export function getThemeChoice(): ThemeChoice {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'light' || v === 'dark' ? v : 'system'
  } catch {
    return 'system'
  }
}

/** Applies the saved theme before the first render. */
export function initTheme() {
  const choice = getThemeChoice()
  if (choice === 'system') document.documentElement.removeAttribute('data-theme')
  else document.documentElement.setAttribute('data-theme', choice)
}

export function applyTheme(choice: ThemeChoice) {
  try { localStorage.setItem(KEY, choice) } catch { /* ignore */ }
  if (choice === 'system') document.documentElement.removeAttribute('data-theme')
  else document.documentElement.setAttribute('data-theme', choice)
  window.dispatchEvent(new Event('themechange'))
}

export const isDark = () =>
  document.documentElement.getAttribute('data-theme') === 'dark' ||
  (!document.documentElement.hasAttribute('data-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
