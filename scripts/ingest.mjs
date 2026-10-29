// One-time: parse every question source in sources/ into data/raw-questions.json.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { parsePintardengan, parseKananinirav, parseJwalsh } from './lib/parse.mjs'
import { dedupe } from './lib/dedupe.mjs'

const SRC = new URL('../sources/', import.meta.url).pathname
const knDir = join(SRC, 'kananinirav_aws-certified-ai-practitioner-study-notes/practice-test')
const jwDir = join(SRC, 'jwalsh_aif-c01/practice-tests')

const pd = parsePintardengan(JSON.parse(readFileSync(join(SRC, 'pintardengan/questions.json'), 'utf8')))
const kn = readdirSync(knDir).filter((f) => /^practice-test-\d+\.md$/.test(f))
  .flatMap((f) => parseKananinirav(readFileSync(join(knDir, f), 'utf8'), f))
const jw = readdirSync(jwDir).filter((f) => /^aif-c01-practice-\d+\.org$/.test(f))
  .flatMap((f) => parseJwalsh(readFileSync(join(jwDir, f), 'utf8'), f))

console.log(`parsed: pintardengan ${pd.length}, kananinirav ${kn.length}, jwalsh ${jw.length}`)
const { kept, dropped } = dedupe([...pd, ...kn, ...jw])
console.log(`duplicates dropped: ${dropped.length}; kept: ${kept.length}`)
writeFileSync(new URL('../data/raw-questions.json', import.meta.url), JSON.stringify(kept, null, 1))
writeFileSync(new URL('../data/duplicates.json', import.meta.url), JSON.stringify(dropped, null, 1))
