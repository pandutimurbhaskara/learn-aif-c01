import { useEffect } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ALL_STEPS, domainOfStep, findStep, stepOfItem, stepOrder } from '../content/roadmap'
import { conceptLinks, getLesson } from '../content/lessons'
import { questionsForStep } from '../content/questions'
import { stepProgress, toggleItem } from '../lib/progress'
import { useProgress } from '../lib/useProgress'
import Markdown from '../components/Markdown'
import ProgressBar from '../components/ProgressBar'

export default function StepPage() {
  const { stepId = '' } = useParams()
  const [params] = useSearchParams()
  const focus = params.get('item')
  const step = findStep(stepId)
  const lesson = getLesson(stepId)
  const [progress, update] = useProgress()

  useEffect(() => {
    if (step && progress.lastStep !== step.id) update((s) => ({ ...s, lastStep: step.id }))
  }, [step?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const el = focus ? document.getElementById(`item-${focus}`) : null
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    else window.scrollTo(0, 0)
  }, [focus, stepId])

  if (!step) return <div className="empty">Step not found. <Link to="/">Back to roadmap</Link></div>

  const domain = domainOfStep(step.id)
  const sp = stepProgress(progress, step)
  const idx = stepOrder(step.id)
  const nextS = ALL_STEPS[idx + 1]
  const prevS = ALL_STEPS[idx - 1]
  const buildsOn = [...new Set((lesson?.sections ?? []).flatMap((s) => conceptLinks(s.body)).map(stepOfItem))]
    .filter((id) => id !== step.id).sort((a, b) => stepOrder(a) - stepOrder(b))
  const titleOf = (itemId: string | null) => step.items.find((i) => i.id === itemId)?.title

  return (
    <article className="lesson">
      <div className="crumbs"><Link to="/">Roadmap</Link> / Domain {domain.id}: {domain.title}</div>
      <header className="lesson-head">
        <div className="eyebrow">Step {step.id} · Task statement</div>
        <h1>{step.title}</h1>
        <p className="muted">{step.summary}</p>
        {buildsOn.length > 0 && (
          <p className="builds-on">Builds on: {buildsOn.map((id) => <Link key={id} to={`/step/${id}`} className="chip">{id} {findStep(id)?.title}</Link>)}</p>
        )}
        {step.services.length > 0 && <div className="services">{step.services.map((s) => <span key={s} className="chip service">{s}</span>)}</div>}
        <div className="hero-progress">
          <ProgressBar done={sp.done} total={sp.total} />
          <span className="muted small">{sp.done}/{sp.total} learned</span>
        </div>
        <nav className="toc">
          {step.items.map((it) => (
            <a key={it.id} href={`#item-${it.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(`item-${it.id}`)?.scrollIntoView({ behavior: 'smooth' }) }}
              className={progress.items[it.id] ? 'done' : ''}>{progress.items[it.id] ? '✓' : '○'} {it.title}</a>
          ))}
        </nav>
      </header>

      {!lesson && <div className="empty">The lesson for this step hasn't been written yet.</div>}
      {lesson?.sections.map((s) => s.itemId ? (
        <section key={s.itemId} id={`item-${s.itemId}`} className={`lesson-section${focus === s.itemId ? ' focused' : ''}`}>
          <div className="section-head">
            <h2><span className="item-id">{s.itemId}</span> {titleOf(s.itemId) ?? s.heading}</h2>
            <label className="learned">
              <input type="checkbox" checked={!!progress.items[s.itemId]} onChange={() => update((p) => toggleItem(p, s.itemId!))} /> Learned
            </label>
          </div>
          <Markdown>{s.body}</Markdown>
        </section>
      ) : (
        <section key={s.heading} className={`lesson-section extra ${s.heading === 'Exam traps' ? 'traps' : ''}`}>
          <h2>{s.heading}</h2>
          <Markdown>{s.body}</Markdown>
        </section>
      ))}

      <footer className="lesson-foot">
        <Link className="btn primary" to={`/quiz/step/${step.id}`}>Take the step check ({questionsForStep(step.id).length} questions)</Link>
        <div className="prev-next">
          {prevS ? <Link to={`/step/${prevS.id}`}>← {prevS.id} {prevS.title}</Link> : <span />}
          {nextS ? <Link to={`/step/${nextS.id}`}>{nextS.id} {nextS.title} →</Link> : <Link to="/exam">Exam simulation →</Link>}
        </div>
      </footer>
    </article>
  )
}
