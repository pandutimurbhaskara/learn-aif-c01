import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DOMAINS } from '../content/roadmap'
import { QUESTIONS } from '../content/questions'
import { useProgress } from '../lib/useProgress'
import type { PracticeState } from './quizBuild'

type Filter = 'all' | 'unseen' | 'missed'
const COUNTS = [10, 20, 40]

export default function PracticePage() {
  const [progress] = useProgress()
  const navigate = useNavigate()
  const [steps, setSteps] = useState<Set<string>>(() => new Set(DOMAINS.flatMap((d) => d.steps.map((s) => s.id))))
  const [count, setCount] = useState(20)
  const [filter, setFilter] = useState<Filter>('all')

  const toggleStep = (id: string) => setSteps((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  const toggleDomain = (ids: string[]) => setSteps((s) => {
    const n = new Set(s)
    const allOn = ids.every((id) => n.has(id))
    ids.forEach((id) => (allOn ? n.delete(id) : n.add(id)))
    return n
  })

  const pool = QUESTIONS.filter((q) => steps.has(q.step))
  const stats = progress.questions
  const available = filter === 'all' ? pool.length : pool.filter((q) => (filter === 'unseen' ? !(q.id in stats) : stats[q.id]?.lastCorrect === false)).length

  const start = () => {
    const state: PracticeState = { stepIds: [...steps], count, filter, title: `Practice: ${count} ${filter === 'all' ? '' : filter + ' '}questions` }
    navigate('/quiz/practice', { state })
  }

  return (
    <div className="practice">
      <h1>Free practice</h1>
      <p className="muted">Pick what to drill. You'll see the answer and explanation after each question.</p>

      <div className="card">
        <h2>Steps</h2>
        <div className="row-actions">
          <button className="btn small" onClick={() => setSteps(new Set(DOMAINS.flatMap((d) => d.steps.map((s) => s.id))))}>All</button>
          <button className="btn small" onClick={() => setSteps(new Set())}>None</button>
        </div>
        {DOMAINS.map((d) => {
          const ids = d.steps.map((s) => s.id)
          return (
            <fieldset key={d.id} className="tree">
              <label className="tree-domain">
                <input type="checkbox" checked={ids.every((id) => steps.has(id))} onChange={() => toggleDomain(ids)} />
                Domain {d.id}: {d.title}
              </label>
              {d.steps.map((s) => (
                <label key={s.id} className="tree-step">
                  <input type="checkbox" checked={steps.has(s.id)} onChange={() => toggleStep(s.id)} />
                  {s.id} {s.title} <span className="muted small">({QUESTIONS.filter((q) => q.step === s.id).length})</span>
                </label>
              ))}
            </fieldset>
          )
        })}
      </div>

      <div className="card options-row">
        <div>
          <h2>How many</h2>
          <div className="seg">{COUNTS.map((c) => <button key={c} className={count === c ? 'on' : ''} onClick={() => setCount(c)}>{c}</button>)}</div>
        </div>
        <div>
          <h2>Which questions</h2>
          <div className="seg">
            {(['all', 'unseen', 'missed'] as Filter[]).map((f) => <button key={f} className={filter === f ? 'on' : ''} onClick={() => setFilter(f)}>{f === 'all' ? 'All (unseen first)' : f === 'unseen' ? 'Only unseen' : 'Only missed'}</button>)}
          </div>
        </div>
      </div>

      <div className="actions">
        <button className="btn primary" disabled={available === 0} onClick={start}>Start ({Math.min(count, available)} questions)</button>
        <span className="muted small">{available} available with these settings</span>
      </div>
    </div>
  )
}
