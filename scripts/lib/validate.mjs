// Validates tagged questions against the roadmap. Returns a list of error strings.

export function validateQuestions(qs, roadmap) {
  const { itemOrder, stepOrder } = roadmap
  const errors = []
  const seen = new Set()
  for (const q of qs) {
    const e = (msg) => errors.push(`${q.id}: ${msg}`)
    if (seen.has(q.id)) e('duplicate id')
    seen.add(q.id)
    if (stepOrder(q.step) < 0) { e(`unknown step "${q.step}"`); continue }
    if (Number(q.step.split('.')[0]) !== q.domain) e(`domain ${q.domain} does not match step ${q.step}`)
    if (!q.concepts?.length) e('no concepts')
    for (const c of q.concepts ?? []) {
      if (itemOrder(c) < 0) e(`unknown concept "${c}"`)
      else if (stepOrder(c.split('.').slice(0, 2).join('.')) > stepOrder(q.step)) e(`concept ${c} is taught after step ${q.step}`)
    }
    if (q.type === 'single' && q.correct?.length !== 1) e('single must have exactly 1 correct')
    if (q.type === 'multi' && !(q.correct?.length >= 2)) e('multi must have at least 2 correct')
    if (q.type === 'single' || q.type === 'multi') {
      const keys = new Set((q.options ?? []).map((o) => o.key))
      if ((q.correct ?? []).some((k) => !keys.has(k))) e('correct key not among options')
    }
    if (q.type === 'match') {
      if (!q.pairs?.length || !q.termBank?.length) e('match needs pairs and termBank')
      else if (q.pairs.some((p) => !q.termBank.includes(p.answer))) e('match answer not in termBank')
    }
    if (!q.explanation?.trim()) e('missing explanation')
  }
  return errors
}
