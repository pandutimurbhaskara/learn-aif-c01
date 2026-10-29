import { useRef, useState } from 'react'
import { QUESTIONS } from '../content/questions'
import { emptyProgress, exportProgress, importProgress } from '../lib/progress'
import { useProgress } from '../lib/useProgress'

const SOURCES = [
  { name: 'AWS Certified AI Practitioner exam guide (v1.2, objectives unchanged from v1.1)', url: 'https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01.html', note: 'The backbone of the roadmap: domains, task statements and objectives.' },
  { name: 'pintardengan.ai: AIF-C01 exam prep', url: 'https://pintardengan.ai/pelatihanAI/', note: 'Practice question bank. No license stated, so it is used here for personal study only and this site stays local.' },
  { name: 'kananinirav/aws-certified-ai-practitioner-study-notes', url: 'https://github.com/kananinirav/aws-certified-ai-practitioner-study-notes', note: 'Practice tests and study notes. MIT License, Copyright (c) 2026 kananinirav.' },
  { name: 'jwalsh/aif-c01', url: 'https://github.com/jwalsh/aif-c01', note: 'Practice questions. MIT License, Copyright (c) 2024 Jason Walsh.' },
  { name: 'vicsz/aif-c01-study-notes', url: 'https://github.com/vicsz/aif-c01-study-notes', note: 'Concept outline, used as a coverage reference.' },
  { name: 'CloudCityPress/aws-aif-c01', url: 'https://github.com/CloudCityPress/aws-aif-c01', note: 'Free study book (CC BY-NC-ND 4.0). Linked from each lesson under "Further reading" and never copied.' },
]

export default function AboutPage() {
  const [progress, update] = useProgress()
  const [msg, setMsg] = useState('')
  const [confirmReset, setConfirmReset] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const counts = QUESTIONS.reduce<Record<string, number>>((m, q) => ({ ...m, [q.source]: (m[q.source] ?? 0) + 1 }), {})

  const doExport = () => {
    const blob = new Blob([exportProgress(progress)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `aifc01-progress-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(a.href)
    setMsg('Progress exported.')
  }

  const doImport = async (file: File) => {
    try {
      const s = importProgress(await file.text())
      update(() => s)
      setMsg('Progress imported.')
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Import failed')
    }
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="about">
      <h1>About &amp; sources</h1>
      <div className="card">
        <h2>Your progress</h2>
        <p className="muted">Progress is saved in this browser only. Export it now and then so clearing browser data doesn't wipe it.</p>
        <div className="actions">
          <button className="btn primary" onClick={doExport}>Export progress</button>
          <label className="btn">Import progress<input ref={fileRef} type="file" accept="application/json" hidden onChange={(e) => e.target.files?.[0] && doImport(e.target.files[0])} /></label>
          {!confirmReset ? <button className="btn ghost" onClick={() => setConfirmReset(true)}>Reset progress…</button> : (
            <span className="confirm-inline">Erase all progress? <button className="btn danger" onClick={() => { update(() => emptyProgress()); setConfirmReset(false); setMsg('Progress reset.') }}>Yes, erase</button> <button className="btn" onClick={() => setConfirmReset(false)}>Cancel</button></span>
          )}
        </div>
        {msg && <p className="notice" role="status">{msg}</p>}
      </div>

      <div className="card">
        <h2>Question bank</h2>
        <p>{QUESTIONS.length} questions after removing duplicates and questions with wrong or ambiguous answers. Each one is tagged to the step and checklist items it tests.</p>
        <ul>{Object.entries(counts).map(([k, v]) => <li key={k}>{k}: {v}</li>)}</ul>
        <p className="muted small">Questions marked "original" were written for this site to cover topics the sources don't reach (mostly the v1.1 additions). Explanations note when a service has since been renamed.</p>
      </div>

      <div className="card">
        <h2>Sources &amp; licenses</h2>
        <ul className="sources">
          {SOURCES.map((s) => <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.name}</a><div className="muted small">{s.note}</div></li>)}
        </ul>
        <p className="muted small">The MIT-licensed material above is used under the MIT License: "Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files…, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software." The full license texts are in the cloned repositories under <code>sources/</code>.</p>
      </div>
    </div>
  )
}
