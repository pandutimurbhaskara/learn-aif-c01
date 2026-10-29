// Writes data/roadmap-items.md and data/batches/batch-N.json for the tagging agents.
import { readFileSync, writeFileSync } from 'node:fs'

const N = Number(process.argv[2] ?? 6)
const raw = JSON.parse(readFileSync(new URL('../data/raw-questions.json', import.meta.url)))
const { DOMAINS } = await import('../src/content/roadmap.ts')

let md = ''
for (const d of DOMAINS) {
  md += `\n# Domain ${d.id}: ${d.title}\n`
  for (const s of d.steps) {
    md += `\n## Step ${s.id}: ${s.title}\n`
    for (const it of s.items) md += `- ${it.id} ${it.title}\n`
  }
}
writeFileSync(new URL('../data/roadmap-items.md', import.meta.url), md)

const compact = raw.map(({ id, domain, type, stem, options, correct, pairs, termBank }) => ({ id, domain, type, stem, options, correct, pairs, termBank }))
const size = Math.ceil(compact.length / N)
for (let i = 0; i < N; i++) {
  writeFileSync(new URL(`../data/batches/batch-${i + 1}.json`, import.meta.url), JSON.stringify(compact.slice(i * size, (i + 1) * size), null, 1))
}
console.log(`${compact.length} questions -> ${N} batches of <= ${size}`)
