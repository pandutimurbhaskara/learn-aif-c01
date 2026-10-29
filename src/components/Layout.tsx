import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { applyTheme, getThemeChoice, type ThemeChoice } from '../lib/theme'
import { FONT_SIZES, applyFontSize, getFontSize, stepFontSize } from '../lib/fontSize'

const NEXT: Record<ThemeChoice, ThemeChoice> = { system: 'light', light: 'dark', dark: 'system' }
const ICON: Record<ThemeChoice, string> = { system: '◐', light: '☀', dark: '☾' }

export default function Layout() {
  const [theme, setTheme] = useState<ThemeChoice>(getThemeChoice)
  const cycle = () => { const t = NEXT[theme]; applyTheme(t); setTheme(t) }
  const [fontSize, setFontSize] = useState(getFontSize)
  const resize = (dir: 1 | -1) => { const s = stepFontSize(fontSize, dir); applyFontSize(s); setFontSize(s) }
  return (
    <div className="app">
      <header className="topbar">
        <NavLink to="/" className="brand">AIF-C01 <span>Roadmap</span></NavLink>
        <nav>
          <NavLink to="/" end>Roadmap</NavLink>
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/practice">Practice</NavLink>
          <NavLink to="/review">Review</NavLink>
          <NavLink to="/exam">Exam</NavLink>
          <NavLink to="/info">Info</NavLink>
        </nav>
        <div className="size-ctl" role="group" aria-label={`Text size ${fontSize}%`}>
          <button className="theme-btn" onClick={() => resize(-1)} disabled={fontSize === FONT_SIZES[0]} title="Smaller text" aria-label="Smaller text"><span className="size-a sm">A</span></button>
          <button className="theme-btn" onClick={() => resize(1)} disabled={fontSize === FONT_SIZES[FONT_SIZES.length - 1]} title="Larger text" aria-label="Larger text"><span className="size-a lg">A</span></button>
        </div>
        <button className="theme-btn" onClick={cycle} title={`Theme: ${theme}`} aria-label={`Theme: ${theme}`}>{ICON[theme]}</button>
      </header>
      <main className="container">
        <Outlet />
      </main>
      <footer className="footer"><NavLink to="/about">About, sources &amp; backup</NavLink></footer>
    </div>
  )
}
