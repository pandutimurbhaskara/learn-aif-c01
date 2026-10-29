import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DOMAINS, ALL_ITEMS } from '../content/roadmap'
import { questionsForStep, questionsForDomain } from '../content/questions'
import { nextStep, stepProgress, type ProgressState } from '../lib/progress'
import { useProgress } from '../lib/useProgress'
import ProgressBar from '../components/ProgressBar'
import Checklist from '../components/Checklist'

const best = (p: ProgressState, kind: string, scope: string) => {
  const scores = p.attempts.filter((a) => a.kind === kind && a.scope === scope).map((a) => Math.round((a.correct / a.total) * 100))
  return scores.length ? Math.max(...scores) : null
}

export default function Roadmap() {
  const [progress] = useProgress()
  const next = nextStep(progress)
  const nextDomain = next ? Number(next.id[0]) : null
  const [open, setOpen] = useState<Set<number>>(() => new Set(nextDomain ? [nextDomain] : []))
  const toggle = (id: number) => setOpen((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  const doneAll = ALL_ITEMS.filter((it) => progress.items[it.id]).length
  const examBest = progress.attempts.filter((a) => a.kind === 'exam')

  return (
    <div className="roadmap">
      <section className="hero">
        <h1>AWS Certified AI Practitioner</h1>
        <p className="muted">Work through the 5 domains in order. Tick what you've learned, take each step check, then the domain quiz. Finish with a full exam simulation.</p>
        <div className="hero-progress">
          <ProgressBar done={doneAll} total={ALL_ITEMS.length} label="Overall progress" />
          <span className="muted">{doneAll} / {ALL_ITEMS.length} items learned</span>
        </div>
        {next ? (
          <Link className="btn primary" to={`/step/${next.id}`}>Continue: {next.id} {next.title}</Link>
        ) : (
          <Link className="btn primary" to="/exam">Everything learned. Take the exam simulation</Link>
        )}
      </section>

      <ol className="path">
        {DOMAINS.map((d) => {
          const done = d.steps.reduce((n, s) => n + stepProgress(progress, s).done, 0)
          const total = d.steps.reduce((n, s) => n + s.items.length, 0)
          const quizBest = best(progress, 'domain', String(d.id))
          const isOpen = open.has(d.id)
          return (
            <li key={d.id} className={`domain-node${done === total ? ' complete' : ''}`}>
              <div className="node-dot">{d.id}</div>
              <div className="domain-card">
                <button className="domain-head" onClick={() => toggle(d.id)} aria-expanded={isOpen}>
                  <div>
                    <div className="eyebrow">Domain {d.id} · {d.weight}% of exam</div>
                    <h2>{d.title}</h2>
                  </div>
                  <span className="chev">{isOpen ? '▾' : '▸'}</span>
                </button>
                <div className="domain-meta">
                  <ProgressBar done={done} total={total} label={`Domain ${d.id} progress`} />
                  <span className="muted small">{done}/{total} items{quizBest !== null && ` · best quiz ${quizBest}%`}</span>
                </div>
                {isOpen && (
                  <div className="steps">
                    {d.steps.map((s) => {
                      const sp = stepProgress(progress, s)
                      const n = questionsForStep(s.id).length
                      const sb = best(progress, 'step', s.id)
                      return (
                        <div key={s.id} className={`step-card${next?.id === s.id ? ' is-next' : ''}${sp.done === sp.total ? ' complete' : ''}`}>
                          <div className="step-head">
                            <div>
                              <div className="eyebrow">Step {s.id}{next?.id === s.id && <span className="badge">Next</span>}{sp.done === sp.total && <span className="badge ok">Done</span>}</div>
                              <h3><Link to={`/step/${s.id}`}>{s.title}</Link></h3>
                            </div>
                          </div>
                          <ProgressBar done={sp.done} total={sp.total} />
                          <Checklist step={s} compact />
                          <div className="step-actions">
                            <Link className="btn" to={`/step/${s.id}`}>Open lesson</Link>
                            <Link className="btn" to={`/quiz/step/${s.id}`}>Step check ({n} questions){sb !== null && ` · best ${sb}%`}</Link>
                          </div>
                        </div>
                      )
                    })}
                    <div className="domain-quiz">
                      <div>
                        <strong>Domain {d.id} quiz</strong>
                        <div className="muted small">25 mixed questions from all {d.steps.length} steps · {questionsForDomain(d.id).length} in the pool</div>
                      </div>
                      <Link className="btn primary" to={`/quiz/domain/${d.id}`}>Start domain quiz</Link>
                    </div>
                  </div>
                )}
              </div>
            </li>
          )
        })}
        <li className="domain-node exam-node">
          <div className="node-dot">★</div>
          <div className="domain-card">
            <div className="domain-head static">
              <div>
                <div className="eyebrow">Final step</div>
                <h2>Exam simulation</h2>
                <p className="muted small">65 questions, 90 minutes, weighted like the real exam. {examBest.length > 0 && `Best: ${Math.max(...examBest.map((a) => a.correct / a.total)) * 100 | 0}% correct.`}</p>
              </div>
            </div>
            <Link className="btn primary" to="/exam">Go to exam simulation</Link>
          </div>
        </li>
      </ol>
    </div>
  )
}
