// Near-duplicate detection across sources: token-set Jaccard over stem + option texts.

const THRESHOLD = 0.8

const tokens = (q) => {
  const text = [q.stem, ...(q.options ?? []).map((o) => o.text).sort()].join(' ')
  return new Set(text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(' ').filter(Boolean))
}

const jaccard = (a, b) => {
  let inter = 0
  for (const t of a) if (b.has(t)) inter++
  return inter / (a.size + b.size - inter || 1)
}

export function dedupe(qs) {
  const toks = qs.map(tokens)
  const removed = new Map() // index -> index it duplicates
  for (let i = 0; i < qs.length; i++) {
    if (removed.has(i)) continue
    for (let j = i + 1; j < qs.length; j++) {
      if (removed.has(j) || jaccard(toks[i], toks[j]) < THRESHOLD) continue
      const keepJ = qs[j].explanation.length > qs[i].explanation.length
      if (keepJ) { removed.set(i, j); break }
      removed.set(j, i)
    }
  }
  const resolve = (i) => (removed.has(i) ? resolve(removed.get(i)) : i)
  return {
    kept: qs.filter((_, i) => !removed.has(i)),
    dropped: [...removed.keys()].map((i) => ({ id: qs[i].id, duplicateOf: qs[resolve(i)].id })),
  }
}
