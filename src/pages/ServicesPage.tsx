import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, SERVICES, stepsForService, type ServiceCategory } from '../content/services'

export default function ServicesPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<ServiceCategory | 'All'>('All')

  const q = query.trim().toLowerCase()
  const shown = SERVICES.filter((s) =>
    (category === 'All' || s.category === category) &&
    (!q || [s.name, s.does, s.example, s.cue].some((t) => t.toLowerCase().includes(q))))

  return (
    <div className="services-page">
      <h1>AWS services to learn</h1>
      <p className="muted">{SERVICES.length} services the exam expects you to recognise. Each has what it does, a concrete example, and the wording in a question that points to it.</p>

      <div className="svc-filters">
        <input className="svc-search" type="search" placeholder="Search services, e.g. “speech”, “vector”, “bias”" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search services" />
        <div className="seg" role="group" aria-label="Category">
          {(['All', ...CATEGORIES] as const).map((c) => (
            <button key={c} className={category === c ? 'on' : ''} aria-pressed={category === c} onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>
      </div>

      {shown.length === 0 && <p className="empty">No service matches “{query}”.</p>}
      {CATEGORIES.map((c) => {
        const list = shown.filter((s) => s.category === c)
        if (!list.length) return null
        return (
          <section key={c}>
            <h2 className="svc-cat">{c} <span className="muted small">({list.length})</span></h2>
            <div className="svc-grid">
              {list.map((s) => (
                <article key={s.name} className="card svc">
                  <h3>{s.name}</h3>
                  <p>{s.does}</p>
                  <p className="svc-example"><strong>Example:</strong> {s.example}</p>
                  <p className="svc-cue small"><strong>Exam cue:</strong> {s.cue}</p>
                  <p className="small svc-steps">
                    {stepsForService(s).map((id) => <Link key={id} className="chip service small" to={`/step/${id}`}>Step {id}</Link>)}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
