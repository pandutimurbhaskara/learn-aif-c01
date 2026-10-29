// Validates src/content/questions.json and reports per-item coverage.
import { readFileSync } from 'node:fs'
import { validateQuestions } from './lib/validate.mjs'
import { ALL_ITEMS, itemOrder, stepOrder } from '../src/content/roadmap.ts'

const MIN_PER_ITEM = 3
const qs = JSON.parse(readFileSync(new URL('../src/content/questions.json', import.meta.url)))
const errors = validateQuestions(qs, { itemOrder, stepOrder })
for (const e of errors) console.log('ERROR', e)

const count = new Map(ALL_ITEMS.map((it) => [it.id, 0]))
for (const q of qs) for (const c of q.concepts) count.set(c, (count.get(c) ?? 0) + 1)
const thin = ALL_ITEMS.filter((it) => count.get(it.id) < MIN_PER_ITEM)
const perStep = {}
for (const q of qs) perStep[q.step] = (perStep[q.step] ?? 0) + 1
console.log('questions per step:', JSON.stringify(perStep))
console.log(`items with < ${MIN_PER_ITEM} questions: ${thin.length}`)
for (const it of thin) console.log(`  ${it.id} (${count.get(it.id)}) ${it.title}`)
console.log(`${qs.length} questions, ${errors.length} errors`)
process.exit(errors.length ? 1 : 0)
