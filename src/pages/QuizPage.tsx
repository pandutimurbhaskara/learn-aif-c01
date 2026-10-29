import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { findItem, stepOfItem } from '../content/roadmap'
import { isCorrect } from '../lib/quiz'
import { addAttempt, recordAnswer, type Attempt } from '../lib/progress'
import { buildQuiz, retryQuiz, type PracticeState, type Quiz, type QuizKind } from './quizBuild'
import { useProgress } from '../lib/useProgress'
import QuestionView, { answered } from '../components/QuestionView'

export default function QuizPage({ kind }: { kind: QuizKind }) {
  const params = useParams()
  const location = useLocation()
  const scope = params.stepId ?? params.domainId ?? kind
  const [progress, update] = useProgress()
  const [quiz, setQuiz] = useState(() => buildQuiz(kind, scope, progress, location.state as PracticeState | undefined))
  const [i, setI] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [revealed, setRevealed] = useState<Set<string>>(new Set())
  const [finished, setFinished] = useState(false)

  const restart = (next: Quiz) => {
    setQuiz(next); setI(0); setAnswers({}); setRevealed(new Set()); setFinished(false)
  }

  if (quiz.qs.length === 0) {
    return (
      <div className="empty">
        <h1>{quiz.title}</h1>
        <p>{kind === 'mistakes' ? 'No mistakes to retry. Nice work!' : 'No questions here yet.'}</p>
        <Link className="btn" to="/">Back to roadmap</Link>
      </div>
    )
  }

  const q = quiz.qs[i]
  const a = answers[q.id] ?? []
  const isRevealed = revealed.has(q.id)

  const check = () => {
    setRevealed((s) => new Set(s).add(q.id))
    update((s) => recordAnswer(s, q.id, isCorrect(q, a), Date.now()))
  }

  const finish = () => {
    const byDomain: Attempt['byDomain'] = {}
    let correct = 0
    for (const x of quiz.qs) {
      const ok = isCorrect(x, answers[x.id] ?? [])
      const d = (byDomain[x.domain] ??= { total: 0, correct: 0 })
      d.total++
      if (ok) { d.correct++; correct++ }
    }
    update((s) => addAttempt(s, { id: crypto.randomUUID(), kind: quiz.kind, scope: quiz.kind === kind ? scope : 'retry', date: Date.now(), total: quiz.qs.length, correct, byDomain }))
    setFinished(true)
    window.scrollTo(0, 0)
  }

  if (finished) {
    const misses = quiz.qs.filter((x) => !isCorrect(x, answers[x.id] ?? []))
    const correct = quiz.qs.length - misses.length
    const pct = Math.round((correct / quiz.qs.length) * 100)
    const weakItems = [...new Set(misses.flatMap((m) => m.concepts))]
    return (
      <div className="quiz-result">
        <h1>{quiz.title}</h1>
        <div className={`score-big ${pct >= 70 ? 'pass' : 'fail'}`}>{pct}%</div>
        <p className="muted">{correct} of {quiz.qs.length} correct{pct >= 70 ? ' · above the ~70% pass line' : ' · aim for 70%+ before moving on'}</p>
        {weakItems.length > 0 && (
          <div className="card">
            <h2>Review these items</h2>
            <ul className="weak-list">
              {weakItems.map((c) => <li key={c}><Link to={`/step/${stepOfItem(c)}?item=${c}`}>{c} {findItem(c)?.title}</Link></li>)}
            </ul>
          </div>
        )}
        <div className="actions">
          {misses.length > 0 && <button className="btn primary" onClick={() => restart(retryQuiz(quiz, misses))}>Retry {misses.length} missed</button>}
          <button className="btn" onClick={() => restart(buildQuiz(kind, scope, progress, location.state as PracticeState | undefined))}>New set</button>
          <Link className="btn" to="/">Back to roadmap</Link>
        </div>
        {misses.length > 0 && (
          <div className="review-list">
            <h2>Missed questions</h2>
            {misses.map((m) => <QuestionView key={m.id} q={m} answer={answers[m.id] ?? []} onChange={() => {}} reveal />)}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="quiz">
      <div className="quiz-head">
        <h1>{quiz.title}</h1>
        <div className="muted small">
          {i + 1} / {quiz.qs.length}
          {quiz.qs.length < quiz.requested && ` · showing ${quiz.qs.length} of the requested ${quiz.requested} (that's all there is)`}
        </div>
        <div className="dots">
          {quiz.qs.map((x, j) => {
            const r = revealed.has(x.id)
            const cls = r ? (isCorrect(x, answers[x.id] ?? []) ? 'right' : 'wrong') : j === i ? 'current' : ''
            return <span key={x.id} className={`dot ${cls}`} />
          })}
        </div>
      </div>
      <QuestionView q={q} answer={a} onChange={(v) => setAnswers((s) => ({ ...s, [q.id]: v }))} reveal={isRevealed} />
      <div className="actions sticky-actions">
        {!isRevealed && <button className="btn primary" disabled={!answered(q, a)} onClick={check}>Check answer</button>}
        {isRevealed && i < quiz.qs.length - 1 && <button className="btn primary" onClick={() => { setI(i + 1); window.scrollTo(0, 0) }}>Next question →</button>}
        {isRevealed && i === quiz.qs.length - 1 && <button className="btn primary" onClick={finish}>See results</button>}
        {!isRevealed && <button className="btn ghost" onClick={check}>Show answer</button>}
      </div>
    </div>
  )
}
