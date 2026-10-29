import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { QUESTIONS, byId } from '../content/questions'
import { DOMAINS } from '../content/roadmap'
import { drawExam, examAttemptId, examRemainingMs, finishExam, EXAM_DURATION_MS, EXAM_PLAN } from '../lib/quiz'
import type { ExamSession } from '../lib/progress'
import { useProgress, updateProgress } from '../lib/useProgress'
import QuestionView, { answered } from '../components/QuestionView'

const fmt = (ms: number) => {
  const t = Math.ceil(ms / 1000)
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`
}

/** Grades and records the exam (a no-op if it was already submitted); returns its attempt id. */
function submitExam(session: ExamSession): string {
  const attemptId = examAttemptId(session)
  updateProgress((s) => (s.exam?.startedAt === session.startedAt ? finishExam(s, byId, attemptId, Date.now()) : s))
  return attemptId
}

export default function ExamPage() {
  const [progress, update] = useProgress()
  const navigate = useNavigate()
  const session = progress.exam

  if (!session) return <ExamStart onStart={() => update((s) => ({ ...s, exam: newSession() }))} />
  return <ExamRunner session={session} onSubmit={() => navigate(`/exam/result/${submitExam(session)}`, { replace: true })} onAbandon={() => update((s) => ({ ...s, exam: null }))} />
}

const newSession = (): ExamSession => ({
  questionIds: drawExam(QUESTIONS, Math.random).map((q) => q.id), answers: {}, flagged: [], startedAt: Date.now(), durationMs: EXAM_DURATION_MS,
})

function ExamStart({ onStart }: { onStart: () => void }) {
  return (
    <div className="exam-start">
      <h1>Exam simulation</h1>
      <div className="card">
        <ul className="rules">
          <li><strong>65 questions</strong>, drawn by the official weights: {DOMAINS.map((d) => `D${d.id} ${EXAM_PLAN[d.id]}`).join(' · ')}</li>
          <li><strong>90 minutes</strong>. The timer keeps running if you close or reload the page, and the exam submits itself when time is up.</li>
          <li><strong>No feedback</strong> until you submit. Flag questions to revisit them from the navigator.</li>
          <li>Pass mark: <strong>700 / 1000</strong> (approximated as 70% correct).</li>
        </ul>
      </div>
      <button className="btn primary big" onClick={onStart}>Start the exam</button>
    </div>
  )
}

function ExamRunner({ session, onSubmit, onAbandon }: { session: ExamSession; onSubmit: () => void; onAbandon: () => void }) {
  const [, update] = useProgress()
  const [i, setI] = useState(0)
  const [now, setNow] = useState(Date.now())
  const [confirming, setConfirming] = useState<'submit' | 'abandon' | null>(null)
  const remaining = examRemainingMs(session, now)

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  useEffect(() => { if (remaining === 0) onSubmit() }, [remaining]) // eslint-disable-line react-hooks/exhaustive-deps

  const qs = session.questionIds.map((id) => byId.get(id)).filter((q) => q !== undefined)
  const q = qs[i]
  if (!q) return null
  const flagged = session.flagged.includes(q.id)
  const answeredCount = qs.filter((x) => answered(x, session.answers[x.id])).length
  const setAnswer = (a: string[]) => update((s) => (s.exam ? { ...s, exam: { ...s.exam, answers: { ...s.exam.answers, [q.id]: a } } } : s))
  const toggleFlag = () => update((s) => (s.exam ? { ...s, exam: { ...s.exam, flagged: flagged ? s.exam.flagged.filter((x) => x !== q.id) : [...s.exam.flagged, q.id] } } : s))
  const go = (j: number) => { setI(j); window.scrollTo(0, 0) }

  return (
    <div className="exam">
      <div className="exam-bar">
        <span>Question {i + 1} / {qs.length}</span>
        <span className={`timer${remaining < 5 * 60 * 1000 ? ' low' : ''}`}>⏱ {fmt(remaining)}</span>
        <span className="muted small">{answeredCount} answered · {session.flagged.length} flagged</span>
      </div>

      <QuestionView q={q} answer={session.answers[q.id] ?? []} onChange={setAnswer} reveal={false} />

      <div className="actions">
        <button className="btn" disabled={i === 0} onClick={() => go(i - 1)}>← Previous</button>
        <button className={`btn${flagged ? ' flag-on' : ''}`} onClick={toggleFlag}>{flagged ? '⚑ Flagged' : '⚐ Flag for review'}</button>
        {i < qs.length - 1 ? <button className="btn primary" onClick={() => go(i + 1)}>Next →</button>
          : <button className="btn primary" onClick={() => setConfirming('submit')}>Review &amp; submit</button>}
      </div>

      <div className="navigator">
        {qs.map((x, j) => (
          <button key={x.id} onClick={() => go(j)}
            className={['nav-cell', j === i && 'current', answered(x, session.answers[x.id]) && 'answered', session.flagged.includes(x.id) && 'flagged'].filter(Boolean).join(' ')}>
            {j + 1}
          </button>
        ))}
      </div>

      {confirming === 'submit' ? (
        <div className="card confirm">
          <p><strong>Submit the exam?</strong> {qs.length - answeredCount} unanswered (counted as wrong) · {session.flagged.length} flagged.</p>
          <div className="actions">
            <button className="btn primary" onClick={onSubmit}>Submit now</button>
            <button className="btn" onClick={() => setConfirming(null)}>Keep going</button>
          </div>
        </div>
      ) : confirming === 'abandon' ? (
        <div className="card confirm">
          <p><strong>Abandon this exam?</strong> Your answers will be discarded and nothing is recorded.</p>
          <div className="actions">
            <button className="btn danger" onClick={onAbandon}>Abandon</button>
            <button className="btn" onClick={() => setConfirming(null)}>Keep going</button>
          </div>
        </div>
      ) : (
        <div className="actions end">
          <button className="btn ghost" onClick={() => setConfirming('abandon')}>Abandon exam</button>
          <button className="btn" onClick={() => setConfirming('submit')}>Submit exam</button>
        </div>
      )}
    </div>
  )
}
