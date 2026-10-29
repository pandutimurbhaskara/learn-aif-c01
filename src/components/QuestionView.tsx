import type { Question } from '../content/types'
import { isCorrect } from '../lib/quiz'
import { findItem, stepOfItem } from '../content/roadmap'
import { Link } from 'react-router-dom'

interface Props {
  q: Question
  answer: string[]
  onChange: (a: string[]) => void
  reveal: boolean
  number?: number
}

const SOURCE: Record<Question['source'], string> = {
  pintardengan: 'pintardengan.ai', kananinirav: 'kananinirav notes', jwalsh: 'jwalsh/aif-c01', original: 'original',
}

export default function QuestionView({ q, answer, onChange, reveal, number }: Props) {
  const correct = reveal && isCorrect(q, answer)
  const need = q.correct?.length ?? 1

  return (
    <div className={`question${reveal ? (correct ? ' is-right' : ' is-wrong') : ''}`}>
      <div className="q-meta">
        {number !== undefined && <span>Question {number}</span>}
        <span className="chip small">Step {q.step}</span>
        {q.type === 'multi' && <span className="chip small">Select {need}</span>}
        {q.type === 'match' && <span className="chip small">Matching</span>}
      </div>
      <p className="stem">{q.stem}</p>

      {q.type !== 'match' && (
        <div className="options" role={q.type === 'single' ? 'radiogroup' : 'group'}>
          {q.options!.map((o) => {
            const chosen = answer.includes(o.key)
            const isKey = q.correct!.includes(o.key)
            const cls = ['option', chosen && 'chosen', reveal && isKey && 'key', reveal && chosen && !isKey && 'wrong'].filter(Boolean).join(' ')
            const pick = () => {
              if (reveal) return
              if (q.type === 'single') onChange([o.key])
              else onChange(chosen ? answer.filter((k) => k !== o.key) : [...answer, o.key])
            }
            return (
              <label key={o.key} className={cls}>
                <input type={q.type === 'single' ? 'radio' : 'checkbox'} name={q.id} checked={chosen} onChange={pick} disabled={reveal} />
                <span className="opt-key">{o.key}</span>
                <span>{o.text}</span>
              </label>
            )
          })}
        </div>
      )}

      {q.type === 'match' && (
        <div className="match">
          {q.pairs!.map((p, i) => {
            const val = answer[i] ?? ''
            const ok = reveal && val === p.answer
            return (
              <div key={i} className={`match-row${reveal ? (ok ? ' key' : ' wrong') : ''}`}>
                <span className="match-prompt">{p.prompt}</span>
                <select value={val} disabled={reveal} onChange={(e) => {
                  const next = q.pairs!.map((_, j) => answer[j] ?? '')
                  next[i] = e.target.value
                  onChange(next)
                }}>
                  <option value="">Choose…</option>
                  {q.termBank!.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                {reveal && !ok && <span className="match-answer">→ {p.answer}</span>}
              </div>
            )
          })}
        </div>
      )}

      {reveal && (
        <div className="explanation">
          <strong>{correct ? 'Correct.' : `Not quite. Answer: ${q.type === 'match' ? 'see the matches above' : q.correct!.join(', ')}`}</strong>
          <p>{q.explanation}</p>
          <div className="small muted">
            Review: {q.concepts.map((c) => (
              <Link key={c} className="concept-link" to={`/step/${stepOfItem(c)}?item=${c}`}>{c} {findItem(c)?.title}</Link>
            ))}
            <span className="source"> · Source: {SOURCE[q.source]}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export const answered = (q: Question, a: string[] | undefined) =>
  !!a && (q.type === 'match' ? q.pairs!.every((_, i) => !!a[i]) : q.type === 'multi' ? a.length === (q.correct?.length ?? 0) : a.length === 1)
