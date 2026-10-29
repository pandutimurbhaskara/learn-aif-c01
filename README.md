# AIF-C01 Study Roadmap

A local study site for the **AWS Certified AI Practitioner (AIF-C01)** exam. It has a step-by-step roadmap, lessons with Mermaid diagrams, per-step and per-domain quizzes, free practice, mistake review and a timed 65-question exam simulation.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit + content tests
npm run build      # static build in dist/ (open with `npm run preview`)
```

Progress is stored in your browser's localStorage. Use **About → Export progress** to back it up.

## Deploy (Cloudflare, free tier)

Cloudflare dashboard → **Workers & Pages → Create → Import a repository**, pick this repo, then:

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Root directory | `/` |

`wrangler.jsonc` points at `dist/` and `.node-version` pins Node 22. Every push to `main` redeploys. To deploy from your machine instead: `npx wrangler login`, then `npm run deploy`.

> Keep this site local. The pintardengan.ai questions have no stated license and are included for personal study only.

## Content layout

| Path | What |
|---|---|
| `src/content/roadmap.ts` | Domains → steps (official task statements) → checklist items, in teaching order |
| `src/content/lessons/<step>.md` | One lesson per step: a `## <itemId> <title>` section per item, then `## Exam traps` and `## Further reading`. Link earlier concepts with `[text](concept:<itemId>)` and add diagrams with ```` ```mermaid ```` blocks. |
| `src/content/questions.json` | Generated question bank (do not edit by hand) |
| `data/raw-questions.json` | Parsed and de-duplicated source questions |
| `data/tags/*.json` | Step and concept tags per question (plus `drop` and `noteRename`) |
| `data/original/*.json` | Original questions written for gaps |
| `sources/` | Cloned repos, the exam guide PDF and text, and the pintardengan extract |

## Rebuilding the question bank

```bash
node scripts/ingest.mjs                                                             # sources/ → data/raw-questions.json
node scripts/merge-tags.mjs                                                         # + tags + originals → src/content/questions.json
node --experimental-strip-types --no-warnings scripts/validate-questions.mjs        # errors + per-item coverage
```

Rules the validator enforces:
- every question has a step;
- every question has one or more concepts, each taught at or before that step;
- answer keys are well-formed;
- ids are unique.
