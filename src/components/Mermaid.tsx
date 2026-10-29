import { useEffect, useId, useState } from 'react'
import { isDark } from '../lib/theme'
import { getFontSize } from '../lib/fontSize'

let mermaidPromise: Promise<typeof import('mermaid')['default']> | null = null
const loadMermaid = () => (mermaidPromise ??= import('mermaid').then((m) => m.default))

/**
 * Mermaid scales SVGs down to the container width, which makes wide flowcharts unreadable.
 * Let a diagram shrink to at most 75% of its natural width; beyond that the container scrolls.
 * `scale` follows the reader's text size so diagram labels grow with the page text.
 */
function readableSize(svg: string, scale: number): string {
  const vb = /viewBox="[\d.-]+ [\d.-]+ ([\d.]+) [\d.]+"/.exec(svg)
  if (!vb) return svg
  const natural = Number(vb[1]) * scale
  return svg.replace(/style="max-width: [\d.]+px;?"/, `style="max-width: ${natural}px; width: max(100%, ${Math.round(natural * 0.75)}px);"`)
}

export default function Mermaid({ code }: { code: string }) {
  const id = 'mmd' + useId().replace(/[^a-zA-Z0-9]/g, '')
  const [svg, setSvg] = useState('')
  const [error, setError] = useState('')
  const [themeTick, setThemeTick] = useState(0)

  useEffect(() => {
    const bump = () => setThemeTick((t) => t + 1)
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    window.addEventListener('themechange', bump)
    window.addEventListener('fontsizechange', bump)
    mq.addEventListener('change', bump)
    return () => { window.removeEventListener('themechange', bump); window.removeEventListener('fontsizechange', bump); mq.removeEventListener('change', bump) }
  }, [])

  useEffect(() => {
    let cancelled = false
    loadMermaid().then(async (mermaid) => {
      mermaid.initialize({ startOnLoad: false, theme: isDark() ? 'dark' : 'neutral', securityLevel: 'strict', fontFamily: 'inherit' })
      try {
        const { svg } = await mermaid.render(`${id}-${themeTick}`, code)
        if (!cancelled) { setSvg(readableSize(svg, getFontSize() / 100)); setError('') }
      } catch (e) {
        document.getElementById(`d${id}-${themeTick}`)?.remove() // mermaid leaves an error node behind
        if (!cancelled) setError(e instanceof Error ? e.message : String(e))
      }
    })
    return () => { cancelled = true }
  }, [code, id, themeTick])

  if (error) return <pre className="diagram-error">Diagram failed to render: {error}</pre>
  return <div className="diagram" dangerouslySetInnerHTML={{ __html: svg }} />
}
