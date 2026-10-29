import { Link, useParams } from 'react-router-dom'
import { byId } from '../content/questions'
import { DOMAINS } from '../content/roadmap'
import { isCorrect, scaledScore } from '../lib/quiz'
import { useProgress } from '../lib/useProgress'
import QuestionView from '../components/QuestionView'
import ProgressBar from '../components/ProgressBar'

export default function ExamResultPage() {
  const { attemptId } = useParams()
  const [progress] = useProgress()
  const a = progress.attempts.find((x) => x.id === attemptId && x.kind === 'exam')
  if (!a) return <div className="empty">Exam result not found. <Link to="/exam">Go to the exam</Link></div>

  const scaled = scaledScore(a.correct, a.total)
  const passed = scaled >= 700
  const qs = (a.questionIds ?? []).map((id) => byId.get(id)).filter((q) => q !== undefined)
  const answers = a.answers ?? {}
  const wrong = qs.filter((q) => !isCorrect(q, answers[q.id] ?? []))

  return (
    <div className="exam-result">
      <h1>Exam result</h1>
      <div className={`score-big ${passed ? 'pass' : 'fail'}`}>{scaled}</div>
      <p><strong>{passed ? 'PASS' : 'Not yet'}</strong> · {a.correct}/{a.total} correct ({Math.round((a.correct / a.total) * 100)}%)</p>
      <p className="muted small">Approximation: the scaled score is piecewise linear, with 0% → 100, 70% → 700 (pass) and 100% → 1000. The real exam scales differently and includes 15 unscored questions.</p>

      <div className="card">
        <h2>By domain</h2>
        {DOMAINS.map((d) => {
          const r = a.byDomain[d.id] ?? { total: 0, correct: 0 }
          const pct = r.total ? Math.round((r.correct / r.total) * 100) : 0
          return (
            <div key={d.id} className="domain-row">
              <div className="domain-row-label"><span>D{d.id} {d.title}</span><span className="muted small">{r.correct}/{r.total} · {pct}% · weight {d.weight}%</span></div>
              <ProgressBar done={r.correct} total={r.total} />
            </div>
          )
        })}
      </div>

      <div className="actions">
        <Link className="btn primary" to="/exam">Take another exam</Link>
        <Link className="btn" to="/review">Review weak spots</Link>
      </div>

      <h2>Review ({wrong.length} wrong first)</h2>
      {[...wrong, ...qs.filter((q) => !wrong.includes(q))].map((q, n) => (
        <QuestionView key={q.id} q={q} number={n + 1} answer={answers[q.id] ?? []} onChange={() => {}} reveal />
      ))}
    </div>
  )
}
