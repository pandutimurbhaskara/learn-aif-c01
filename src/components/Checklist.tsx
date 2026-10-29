import { Link } from 'react-router-dom'
import type { Step } from '../content/types'
import { toggleItem } from '../lib/progress'
import { useProgress } from '../lib/useProgress'

export default function Checklist({ step, compact }: { step: Step; compact?: boolean }) {
  const [progress, update] = useProgress()
  return (
    <ul className={`checklist${compact ? ' compact' : ''}`}>
      {step.items.map((it) => (
        <li key={it.id} className={progress.items[it.id] ? 'done' : ''}>
          <label>
            <input type="checkbox" checked={!!progress.items[it.id]} onChange={() => update((s) => toggleItem(s, it.id))} />
            <span className="item-id">{it.id}</span>
            <span className="item-title">{it.title}</span>
          </label>
          {compact && <Link className="item-link" to={`/step/${step.id}?item=${it.id}`} aria-label={`Study ${it.title}`}>→</Link>}
        </li>
      ))}
    </ul>
  )
}
