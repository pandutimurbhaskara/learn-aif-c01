// Applies agent tags (data/tags/*.json) to data/raw-questions.json, appends original
// questions (data/original/*.json) and writes src/content/questions.json.
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs'

const read = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url)))
const listJson = (dir) => {
  const url = new URL(dir, import.meta.url)
  return existsSync(url) ? readdirSync(url).filter((f) => f.endsWith('.json')).map((f) => read(`${dir}${f}`)) : []
}

const raw = read('../data/raw-questions.json')
const overrides = existsSync(new URL('../data/overrides.json', import.meta.url)) ? read('../data/overrides.json') : {}

// Some source stems lost their final question sentence; restore a generic one.
const withQuestion = (q) => {
  if (q.type === 'match' || q.stem.includes('?') || q.stem.includes('(Select')) return q.stem
  const services = q.options.every((o) => /^(Amazon|AWS)\b/.test(o.text))
  return `${q.stem} ${services ? 'Which AWS service will meet these requirements?' : 'Which solution will meet these requirements?'}`
}

const applyOverride = (q) => {
  const o = overrides[q.id]
  if (!o) return q
  let explanation = q.explanation
  for (const [from, to] of o.replace ?? []) {
    if (!explanation.includes(from)) throw new Error(`override for ${q.id}: text not found: ${from.slice(0, 40)}`)
    explanation = explanation.replace(from, to)
  }
  return { ...q, stem: o.stem ?? q.stem, explanation }
}
const tags = new Map(listJson('../data/tags/').flat().map((t) => [t.id, t]))

const out = []
const dropped = []
for (const q of raw) {
  const t = tags.get(q.id)
  if (!t) throw new Error(`untagged question ${q.id}`)
  if (t.drop) { dropped.push(`${q.id}: ${t.drop}`); continue }
  const [from, to] = (t.noteRename ?? '').split('→').map((s) => s.trim())
  const note = t.noteRename ? `\n\nNote: ${from} is now ${to}.` : ''
  const fixed = applyOverride(q)
  out.push({ ...fixed, stem: withQuestion(fixed), domain: t.domain, step: t.step, concepts: t.concepts, explanation: fixed.explanation + note })
}
const originals = listJson('../data/original/').flat().map((q) => ({ ...q, source: 'original' }))
out.push(...originals)

writeFileSync(new URL('../src/content/questions.json', import.meta.url), JSON.stringify(out))
writeFileSync(new URL('../data/dropped.txt', import.meta.url), dropped.join('\n') + '\n')
console.log(`questions: ${out.length} (${originals.length} original), dropped: ${dropped.length}`)
