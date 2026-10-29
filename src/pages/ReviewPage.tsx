import { Link } from 'react-router-dom'
import { QUESTIONS } from '../content/questions'
import { ALL_STEPS, DOMAINS } from '../content/roadmap'
import { useProgress } from '../lib/useProgress'

const KIND: Record<string, string> = { step: 'Step check', domain: 'Domain quiz', practice: 'Practice', mistakes: 'Mistakes', exam: 'Exam simulation' }

export default function ReviewPage() {
  const [progress] = useProgress()
  const missed = QUESTIONS.filter((q) => progress.questions[q.id]?.lastCorrect === false)
  const seen = QUESTIONS.filter((q) => q.id in progress.questions).length
  const attempts = [...progress.attempts].reverse()

  return (
    <div className="review">
      <h1>Review</h1>
      <p className="muted">{seen} of {QUESTIONS.length} questions answered at least once · {missed.length} currently wrong. A question leaves this list once you answer it correctly.</p>
      <div className="actions">
        <Link className={`btn primary${missed.length ? '' : ' disabled'}`} to="/quiz/mistakes">Retry my mistakes ({Math.min(missed.length, 20)})</Link>
      </div>

      <h2>Weak spots by step</h2>
      {missed.length === 0 && <p className="empty">Nothing here yet. Missed questions will show up here.</p>}
      {ALL_STEPS.map((s) => {
        const qs = missed.filter((q) => q.step === s.id)
        if (!qs.length) return null
        return (
          <details key={s.id} className="card weak-step">
            <summary><strong>{s.id} {s.title}</strong> <span className="badge warn">{qs.length}</span></summary>
            <p><Link to={`/step/${s.id}`}>Open the lesson →</Link></p>
            <ul>
              {qs.map((q) => (
                <li key={q.id}>
                  <p>{q.stem}</p>
                  <p className="small"><strong>Answer:</strong>{' '}
                    {q.type === 'match' ? q.pairs!.map((p) => `${p.prompt} → ${p.answer}`).join('; ') : q.correct!.map((k) => `${k}. ${q.options!.find((o) => o.key === k)?.text}`).join(' · ')}
                  </p>
                </li>
              ))}
            </ul>
          </details>
        )
      })}

      <h2>History</h2>
      {attempts.length === 0 ? <p className="empty">No attempts yet.</p> : (
        <div className="table-wrap">
          <table className="history">
            <thead><tr><th>Date</th><th>Type</th><th>Scope</th><th>Score</th></tr></thead>
            <tbody>
              {attempts.map((a) => (
                <tr key={a.id}>
                  <td>{new Date(a.date).toLocaleString()}</td>
                  <td>{KIND[a.kind]}</td>
                  <td>{a.kind === 'domain' ? `Domain ${a.scope}: ${DOMAINS[Number(a.scope) - 1]?.title}` : a.kind === 'step' ? `Step ${a.scope}` : '-'}</td>
                  <td>{a.kind === 'exam' ? <Link to={`/exam/result/${a.id}`}>{a.correct}/{a.total}</Link> : `${a.correct}/${a.total}`} ({Math.round((a.correct / a.total) * 100)}%)</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
