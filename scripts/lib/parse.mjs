// Parsers that turn each raw question source into the app's Question shape
// (untagged: step = '', concepts = []; domain = 0 when the source has none).

const base = (fields) => ({ step: '', concepts: [], ...fields })

const typeFor = (correct) => (correct.length > 1 ? 'multi' : 'single')

export function parsePintardengan(json) {
  return json.map((q) => {
    const common = { id: `pd-${q.id}`, source: 'pintardengan', domain: q.domain, stem: q.question.trim(), explanation: q.explanation.trim() }
    if (q.type === 'match') {
      return base({ ...common, type: 'match', pairs: q.pairs, termBank: q.termBank })
    }
    return base({ ...common, type: q.type, options: q.options, correct: q.correct })
  })
}

/** "A, C" | "AC" | "B" -> ['A','C'] | ['B']; null when the answer is not letters. */
function parseAnswerLetters(raw) {
  const s = raw.trim()
  if (!/^[A-F](\s*,?\s*[A-F])*$/.test(s)) return null
  return s.replace(/[\s,]/g, '').split('').sort()
}

export function parseKananinirav(markdown, fileName) {
  const test = fileName.match(/(\d+)/)[1]
  const blocks = markdown.split(/\n(?=\d+\. )/).filter((b) => /^\d+\. /.test(b))
  const out = []
  for (const block of blocks) {
    const num = block.match(/^(\d+)\. /)[1]
    const [head, details = ''] = block.split('<details')
    const lines = head.split('\n')
    const stem = lines[0].replace(/^\d+\. /, '').trim()
    const options = []
    for (const line of lines.slice(1)) {
      const m = line.match(/^\s+- ([A-F])\. (.*)$/)
      if (m) options.push({ key: m[1], text: m[2].trim() })
    }
    const answer = details.match(/Correct answer:\s*(.+)/)
    const correct = answer && parseAnswerLetters(answer[1])
    if (options.length < 2 || !correct) continue
    const expl = details.split(/Explanation:\s*/)[1] ?? ''
    const explanation = expl.split('</details>')[0].split('\n').map((l) => l.trim()).filter(Boolean).join(' ')
    out.push(base({ id: `kn-${test}-${num}`, source: 'kananinirav', type: typeFor(correct), domain: 0, stem, options, correct, explanation }))
  }
  return out
}

export function parseJwalsh(org, fileName) {
  const file = fileName.match(/(\d+)\.org$/)[1]
  const out = []
  let domain = 0
  const sections = org.split(/\n(?=\*{1,2} )/)
  for (const sec of sections) {
    const dm = sec.match(/^\* Domain (\d)/)
    if (dm) { domain = Number(dm[1]); continue }
    if (/^\* /.test(sec)) { domain = 0; continue }
    const qm = sec.match(/^\*\* Question (\d+):\s*(.+)/)
    if (!qm) continue
    const answer = (sec.match(/:ANSWER:\s*(.+)/) || [])[1]?.trim()
    const explanation = (sec.match(/:EXPLANATION:\s*(.+)/) || [])[1]?.trim() ?? ''
    const options = []
    let ticked = null
    for (const m of sec.matchAll(/^\s+- \[( |X)\] (.+)$/gm)) {
      const key = 'ABCDEF'[options.length]
      options.push({ key, text: m[2].trim() })
      if (m[1] === 'X') ticked = key
    }
    const byAnswer = options.find((o) => o.text === answer)?.key
    const key = ticked ?? byAnswer
    if (!key || options.length < 2) continue
    out.push(base({ id: `jw-${file}-${qm[1]}`, source: 'jwalsh', type: 'single', domain, stem: qm[2].trim(), options, correct: [key], explanation }))
  }
  return out
}
