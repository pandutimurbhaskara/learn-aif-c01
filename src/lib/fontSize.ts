/** Text size as a percentage of the browser default; every size in the stylesheet is rem-based, so this scales the whole site. */
export const FONT_SIZES = [90, 100, 112, 125, 150] as const
export const DEFAULT_FONT_SIZE = 100
const KEY = 'aifc01.fontsize'

export function getFontSize(): number {
  try {
    const v = Number(localStorage.getItem(KEY))
    return (FONT_SIZES as readonly number[]).includes(v) ? v : DEFAULT_FONT_SIZE
  } catch {
    return DEFAULT_FONT_SIZE
  }
}

function setRootSize(pct: number) {
  document.documentElement.style.fontSize = pct === DEFAULT_FONT_SIZE ? '' : `${pct}%`
}

/** Applies the saved text size before the first render. */
export function initFontSize() {
  setRootSize(getFontSize())
}

export function applyFontSize(pct: number) {
  try { localStorage.setItem(KEY, String(pct)) } catch { /* ignore */ }
  setRootSize(pct)
  window.dispatchEvent(new Event('fontsizechange'))
}

/** Moves one step up (+1) or down (-1) the size ladder, staying within its ends. */
export function stepFontSize(current: number, dir: 1 | -1): number {
  const i = (FONT_SIZES as readonly number[]).indexOf(current)
  const next = Math.min(FONT_SIZES.length - 1, Math.max(0, (i === -1 ? FONT_SIZES.indexOf(DEFAULT_FONT_SIZE) : i) + dir))
  return FONT_SIZES[next]
}
