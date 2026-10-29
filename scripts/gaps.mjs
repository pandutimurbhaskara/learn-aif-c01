// Writes data/gaps.md: per domain, how many original questions each thin item needs.
import { readFileSync, writeFileSync } from 'node:fs'
import { DOMAINS } from '../src/content/roadmap.ts'

const V11 = new Set(['2.1.10', '2.1.11', '2.1.12', '2.3.4', '2.3.5', '2.3.6', '3.1.2', '3.4.6', '3.4.7', '5.1.6', '5.2.9'])
const qs = JSON.parse(readFileSync(new URL('../src/content/questions.json', import.meta.url)))
const count = {}
for (const q of qs) for (const c of q.concepts) count[c] = (count[c] ?? 0) + 1
let md = '# Original question gaps\n'
for (const d of DOMAINS) {
  md += `\n## Domain ${d.id}\n`
  for (const s of d.steps) for (const it of s.items) {
    const need = Math.max(0, (V11.has(it.id) ? 4 : 3) - (count[it.id] ?? 0))
    if (need) md += `- ${it.id} ${it.title}: write ${need} (has ${count[it.id] ?? 0})\n`
  }
}
writeFileSync(new URL('../data/gaps.md', import.meta.url), md)
console.log(md)
