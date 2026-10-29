# AIF-C01 Study Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A local Vite + React study site for AWS AIF-C01. Its home screen is a roadmap of 5 domains → 14 steps → checklist items. Each step has a lesson with Mermaid diagrams and a step-check quiz, and there are domain quizzes, free practice, mistake review and a 65-question timed exam simulation.

**Architecture:** Static SPA with no backend. All content ships as files:
- `src/content/roadmap.ts`: domains, steps and checklist items, in teaching order.
- `src/content/lessons/<step>.md`: one markdown file per step.
- `src/content/questions.json`: the tagged question bank.

Node scripts in `scripts/` turn the raw sources into normalized questions once. Progress lives in `localStorage` behind a small store with a React hook. Pure logic (grading, selection, exam draw, scoring, progress) sits in `src/lib/` and is unit tested with Vitest.

**Tech Stack:** Vite, React 18, TypeScript, react-router-dom (HashRouter), mermaid, react-markdown + remark-gfm, Vitest + jsdom. Plain CSS with CSS variables for light/dark.

**Spec:** `docs/superpowers/specs/2026-10-29-aif-c01-study-site-design.md`

## Global Constraints

- English only. Follows exam guide **v1.1** (`sources/exam-guide.txt`). The steps are exactly task statements 1.1–1.3, 2.1–2.3, 3.1–3.4, 4.1–4.2, 5.1–5.2.
- Domain weights: D1 20, D2 24, D3 28, D4 14, D5 14.
- Exam sim: 65 questions drawn per domain as 13/16/18/9/9, 90-minute timer, no feedback until submit, scaled score 100–1000 with a pass mark of 700.
- Every question has exactly one `step` and ≥1 `concepts`. Every concept's step is ≤ the question's step in roadmap order.
- Original questions have `source: "original"`.
- CloudCityPress content is link-only (CC BY-NC-ND). Lesson text is written fresh. MIT notices for kananinirav and jwalsh go on the About page.
- Local-only app. The project folder is not a git repo, so the plan has **no commit steps** (the user hasn't asked for git).
- Nothing is locked. "Next step" = the first step in order with an unticked item.

## Review Focus

1. **localStorage unavailable or corrupted** (private mode, bad JSON, an old shape): the app must still render with empty progress and must not crash. Tested in Task 5.
2. **Progress refers to item or question ids that no longer exist** after content edits: they're ignored in counts and never crash. Tested in Task 5.
3. **Requested quiz size is bigger than the pool** (a thin step, or "only missed" with none missed): return what exists, and the UI says "no questions" when the pool is empty. Tested in Task 6.
4. **Reload or close mid-exam**: the exam resumes with the same questions, answers and remaining time, and auto-submits when time is up. Tested in Task 6 (session logic) and checked by hand in Task 12.
5. **Broken Mermaid syntax in a lesson**: show an inline error box and keep the rest of the lesson. Content validation in Task 4 catches it at build time.

---

### Task 1: Scaffold + roadmap data

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/App.tsx` (placeholder), `src/styles.css`
- Create: `src/content/types.ts`, `src/content/roadmap.ts`
- Test: `src/content/roadmap.test.ts`

**Interfaces:**
- Produces (`src/content/types.ts`):
  ```ts
  export interface ChecklistItem { id: string; title: string }          // id "1.1.3"
  export interface Step { id: string; title: string; summary: string; services: string[]; items: ChecklistItem[] } // id "1.1"
  export interface Domain { id: 1|2|3|4|5; title: string; weight: number; steps: Step[] }
  export type QuestionType = 'single' | 'multi' | 'match'
  export interface Question {
    id: string; source: 'pintardengan'|'kananinirav'|'jwalsh'|'original'; type: QuestionType
    stem: string; options?: { key: string; text: string }[]; correct?: string[]
    pairs?: { prompt: string; answer: string }[]; termBank?: string[]
    explanation: string; domain: 1|2|3|4|5; step: string; concepts: string[]
  }
  ```
  (Ordering questions are `match` with `termBank` like `["1st","2nd",…]`.)
- Produces (`src/content/roadmap.ts`): `DOMAINS: Domain[]`, `ALL_STEPS: Step[]`, `ALL_ITEMS: ChecklistItem[]` (teaching order), `itemOrder(id): number`, `stepOrder(id): number`, `findStep(id): Step | undefined`, `stepOfItem(itemId): string`.

- [ ] **Step 1:** Run `npm create vite@latest . -- --template react-ts` in the project root (keep `sources/` and `docs/`). Add the deps `react-router-dom mermaid react-markdown remark-gfm` and the dev deps `vitest jsdom @testing-library/react`. Add the script `"test": "vitest run"` and set Vitest `environment: 'jsdom'` in `vite.config.ts`.
- [ ] **Step 2: Write the failing test** `roadmap.test.ts`:
  - exactly 5 domains, weights `[20,24,28,14,14]`, sum 100;
  - step ids equal `['1.1','1.2','1.3','2.1','2.2','2.3','3.1','3.2','3.3','3.4','4.1','4.2','5.1','5.2']`;
  - every item id starts with its step id + '.' and is unique;
  - every step has 5–12 items;
  - `itemOrder` is strictly increasing across `ALL_ITEMS`.
- [ ] **Step 3:** Run `npm test` and expect it to FAIL (module missing).
- [ ] **Step 4:** Write `roadmap.ts`. Titles come verbatim from the exam guide task statements. The items break each step's objectives into concrete, single-concept checklist entries ordered so prerequisites come first (e.g. 2.1 teaches tokens → chunking → embeddings → vectors before 3.1 uses RAG). Every objective bullet in `sources/exam-guide.txt` must be covered by at least one item. `services` lists the in-scope services the guide names for that task statement.
- [ ] **Step 5:** Run `npm test` and expect PASS.

### Task 2: Question ingestion + dedupe

**Files:**
- Create: `scripts/lib/parse.mjs`, `scripts/lib/dedupe.mjs`, `scripts/ingest.mjs`
- Test: `scripts/lib/parse.test.mjs`, `scripts/lib/dedupe.test.mjs`
- Output: `data/raw-questions.json` (normalized, untagged except `domain` where the source has it; `step: ""`, `concepts: []`)

**Interfaces:**
- Produces:
  - `parsePintardengan(json): Question[]`. `type: 'match'` stays match. `stem` comes from `question`.
  - `parseKananinirav(markdown, fileName): Question[]`. "Correct answer: A, C", "AC" and "BC" become `['A','C']` (multi when there's more than one). A non-letter answer like "Chain-of-thought reasoning" maps to the option whose text matches.
  - `parseJwalsh(org, fileName): Question[]`. The correct option is `[X]`, falling back to the option whose text equals `:ANSWER:`. Domain comes from the `* Domain N` heading; the "Comprehensive Review" file gets `domain: 0` (tagged later).
  - `dedupe(qs): { kept: Question[]; dropped: {id; duplicateOf}[] }`. Normalize the stem plus sorted option texts (lowercase, strip non-alphanumerics), then take token-set Jaccard. ≥ 0.8 counts as a duplicate. Keep the one with the longer explanation.
  - Ids: `pd-<n>`, `kn-<test>-<n>`, `jw-<file>-<n>`.

- [ ] **Step 1: Write failing tests** with inline fixture strings copied from one real question of each source (single plus kananinirav multi "A, C" and "AC"). Assert the parsed `type`, `correct`, option count and `explanation` non-empty. For dedupe, two stems differing only in punctuation/case → one dropped; two unrelated → both kept.
- [ ] **Step 2:** Run `npx vitest run scripts` and expect FAIL.
- [ ] **Step 3:** Implement the parsers and dedupe. `ingest.mjs` reads the `sources/` paths, writes `data/raw-questions.json`, and prints the counts per source and the dropped-duplicate count.
- [ ] **Step 4:** Run the tests (PASS), then `node scripts/ingest.mjs`. Expect ~780 parsed, and print the kept count. Spot-check 5 random kept questions by eye against the source.

### Task 3: Tag questions to steps + concepts

**Files:**
- Create: `scripts/validate-questions.mjs`, `scripts/merge-tags.mjs`
- Create (agent output): `data/tags/batch-<n>.json` as `{ id, domain, step, concepts[], drop?: string }[]`
- Output: `src/content/questions.json`
- Test: `scripts/validate.test.mjs`

**Interfaces:**
- Consumes: `ALL_ITEMS`, `itemOrder`, `stepOrder` (Task 1); `data/raw-questions.json` (Task 2).
- Produces: `validateQuestions(qs, roadmap): string[]` (error messages; empty means valid). It checks:
  - the step exists;
  - concepts are non-empty and exist;
  - every concept's step order ≤ the question's step order;
  - the domain matches the step's domain;
  - single has 1 correct, multi ≥ 2 correct, match has pairs + termBank and each answer is in termBank;
  - ids are unique.

- [ ] **Step 1: Write failing tests** for `validateQuestions`, one case per rule above, each producing exactly one error.
- [ ] **Step 2:** Run and expect FAIL. Implement. Run and expect PASS.
- [ ] **Step 3:** Split the raw questions into ~6 batches. Dispatch parallel subagents, each given the full roadmap item list and its batch (stem, options, correct; no explanations). Their rules:
  - pick the single best `step`, with 1–3 `concepts` drawn from that step or earlier steps;
  - set `drop` with a reason for out-of-scope topics (exam-guide appendix) or factually wrong keys;
  - when the explanation or stem uses an old service name, the agent returns `noteRename` (e.g. "SageMaker → SageMaker AI").
- [ ] **Step 4:** `merge-tags.mjs` applies the tags. Questions with `noteRename` get a sentence appended to their explanation, `"Note: this service is now called X."`. The script drops the flagged questions and writes `src/content/questions.json`.
- [ ] **Step 5:** Run `node scripts/validate-questions.mjs` and expect 0 errors. It also prints the per-item question counts and lists the items with fewer than 3 questions (the input for Task 4's gap questions).

### Task 4: Lessons + original gap questions

**Files:**
- Create: `src/content/lessons/{1.1,…,5.2}.md` (14 files)
- Create: `data/original/d<1-5>.json` → merged into `src/content/questions.json` by `merge-tags.mjs` (extend it to append originals)
- Create: `src/content/lessons.ts`, `scripts/validate-lessons.mjs`
- Test: `src/content/lessons.test.ts`

**Interfaces:**
- Lesson markdown format:
  - each checklist item gets a section `## <itemId> <title>` (e.g. `## 2.1.3 Embeddings`), in item order;
  - optional trailing sections `## Exam traps` and `## Further reading`;
  - cross-links use `[text](concept:<itemId>)` and may only point to items at or before this step;
  - diagrams go in fenced ```` ```mermaid ```` blocks.
- Produces (`lessons.ts`): `getLesson(stepId): { sections: { itemId: string|null; heading: string; body: string }[] }`. It loads the files via `import.meta.glob('./lessons/*.md', { query: '?raw', eager: true })`.

- [ ] **Step 1: Write failing test** `lessons.test.ts`. For every step:
  - a lesson exists;
  - section itemIds equal that step's item ids in order;
  - every `concept:` link targets an item with `itemOrder` ≤ the last item of this step;
  - every step has ≥1 mermaid block except 2.2 and 3.2, which may have none.
- [ ] **Step 2:** Run and expect FAIL. Implement `lessons.ts`.
- [ ] **Step 3:** Dispatch 5 parallel subagents, one per domain. Each gets the roadmap, the spec, the exam-guide text for its domain, the relevant source note paths (kananinirav sections, vicsz README, pintardengan cheat sheets in `sources/pintardengan/page.html` as reference only), and the gap list from Task 3 Step 5. Each writes:
  - (a) its lesson files: original wording, concise exam-focused, each section 80–250 words, plus an "Exam traps" section and a "Further reading" section linking the CloudCityPress English chapter for that task statement;
  - (b) `data/original/d<N>.json`, with ≥3 questions per gap item. Exam-style, `source: "original"`, explanations covering why each wrong option is wrong, and at least one match/ordering question per domain.
- [ ] **Step 4:** `scripts/validate-lessons.mjs` runs `mermaid.parse` (with jsdom) on every block and reports failures. Then run `npm test` + `node scripts/validate-questions.mjs`. Expect all PASS, 0 errors, and no item with fewer than 3 questions.

### Task 5: Progress store

**Files:**
- Create: `src/lib/progress.ts`, `src/lib/useProgress.ts`
- Test: `src/lib/progress.test.ts`

**Interfaces:**
- Produces:
  ```ts
  interface QStat { seen: number; lastCorrect: boolean; lastSeen: number }
  interface Attempt { id: string; kind: 'step'|'domain'|'practice'|'mistakes'|'exam'; scope: string; date: number; total: number; correct: number; byDomain: Record<number,{total:number;correct:number}> }
  interface ExamSession { questionIds: string[]; answers: Record<string,string[]>; flagged: string[]; startedAt: number; durationMs: number }
  interface ProgressState { version: 1; items: Record<string, boolean>; questions: Record<string, QStat>; attempts: Attempt[]; exam: ExamSession | null; lastStep: string | null }
  emptyProgress(): ProgressState
  loadProgress(storage?: Storage): ProgressState      // never throws
  saveProgress(s: ProgressState, storage?: Storage): void  // swallows quota/access errors
  toggleItem(s, itemId): ProgressState
  recordAnswer(s, qid, correct: boolean, now: number): ProgressState
  addAttempt(s, a: Attempt): ProgressState
  stepProgress(s, step: Step): { done: number; total: number }   // ignores unknown ids
  nextStep(s): Step | null                                      // first step with an unticked item
  exportProgress(s): string; importProgress(json: string): ProgressState // throws Error('Invalid progress file') on bad shape
  ```
  Storage key: `aifc01.progress.v1`. `useProgress()` returns `[state, update(fn)]` via `useSyncExternalStore` and saves on every update.

- [ ] **Step 1: Write failing tests**:
  - toggle on/off;
  - `recordAnswer` increments `seen` and sets `lastCorrect`;
  - `stepProgress` ignores an unknown id `"9.9.9"`;
  - `nextStep` is `1.1` when empty and `1.2` after all 1.1 items are ticked;
  - `loadProgress` returns `emptyProgress()` for missing key, invalid JSON, `{version: 99}`, and a storage whose `getItem` throws;
  - `saveProgress` doesn't throw when `setItem` throws;
  - export → import round-trips;
  - `importProgress('{}')` throws `'Invalid progress file'`.
- [ ] **Step 2:** Run and expect FAIL. Implement. Run and expect PASS.

### Task 6: Quiz engine + exam session logic

**Files:**
- Create: `src/lib/quiz.ts`
- Test: `src/lib/quiz.test.ts`

**Interfaces:**
- Consumes: `Question`, `ProgressState`.
- Produces:
  ```ts
  type Rng = () => number
  isCorrect(q: Question, answer: string[]): boolean    // single/multi: set equality; match: answer[i] === pairs[i].answer for all i
  shuffle<T>(xs: T[], rng: Rng): T[]                    // returns new array
  pickQuestions(pool: Question[], n: number, opts: { filter: 'all'|'unseen'|'missed'; progress: ProgressState; rng: Rng }): Question[]
  //  'missed' = stats.lastCorrect === false; returns min(n, filtered.length); unseen-first ordering for 'all'
  EXAM_PLAN: Record<1|2|3|4|5, number> = {1:13,2:16,3:18,4:9,5:9}
  drawExam(all: Question[], rng: Rng): Question[]       // 65 total; per-domain shortfall filled from remaining domains largest-weight first
  scaledScore(correct: number, total: number): number   // piecewise linear: 0→100, 0.7→700, 1→1000; rounded
  examRemainingMs(session: ExamSession, now: number): number // max(0, startedAt+durationMs-now)
  gradeExam(session, byId: Map<string,Question>): { correct: number; total: number; scaled: number; passed: boolean; byDomain: Attempt['byDomain'] }
  ```

- [ ] **Step 1: Write failing tests**:
  - `isCorrect` for single right/wrong, multi with the same set in a different order (true) and with a missing one (false), and match with all right or one wrong;
  - `pickQuestions(pool of 3, 10, 'all')` has length 3;
  - `'missed'` with no misses → `[]`;
  - `drawExam` on a pool with enough questions gives counts 13/16/18/9/9 by domain;
  - `drawExam` with D5 having only 4 gives a total of 65 with no duplicates;
  - `scaledScore(0,65)=100`, `(65,65)=1000`, `(45.5,65)=700`;
  - `examRemainingMs` is 0 once past the end;
  - `gradeExam` treats unanswered as wrong, and `passed` is `scaled >= 700`.
- [ ] **Step 2:** Run and expect FAIL. Implement. Run and expect PASS.

### Task 7: App shell + Roadmap (home)

**Files:**
- Create: `src/App.tsx` (routes), `src/components/Layout.tsx`, `src/components/ProgressBar.tsx`, `src/components/Checklist.tsx`, `src/pages/Roadmap.tsx`, `src/lib/theme.ts`
- Modify: `src/styles.css`

**Interfaces:**
- Routes (HashRouter):
  - `/` Roadmap
  - `/step/:stepId` (with `?item=<itemId>` to scroll to it)
  - `/quiz/step/:stepId`, `/quiz/domain/:domainId`, `/quiz/mistakes`
  - `/practice`, `/exam`, `/exam/result/:attemptId`, `/review`, `/info`, `/about`
- `Checklist` props: `{ step: Step; compact?: boolean }`. It reads and writes via `useProgress`.

- [ ] **Step 1:** Build the layout:
  - top nav (Roadmap, Practice, Review, Exam, Info);
  - a theme toggle (light/dark/system via `data-theme`, remembered in localStorage inside try/catch);
  - a 16px gutter on mobile.
- [ ] **Step 2:** Build the Roadmap page:
  - an overall progress bar and a "Continue: <next step>" button (from `nextStep`);
  - a vertical path of domain cards showing weight, done/total and the best domain-quiz score;
  - expanding a card shows its steps, each with a progress bar, an inline compact checklist, "Open lesson", "Step check (N questions available)", and a "Next" badge on the next step;
  - each domain card ends with a "Domain quiz" button;
  - a final "Exam simulation" node.
- [ ] **Step 3:** Run `npm run dev` and open it in the browser. Ticking an item updates the bars and survives a reload.

### Task 8: Step / lesson page with Mermaid

**Files:**
- Create: `src/pages/StepPage.tsx`, `src/components/Markdown.tsx`, `src/components/Mermaid.tsx`

**Interfaces:**
- Consumes: `getLesson`, `findStep`, `useProgress`.
- `Mermaid` props `{ code: string }`. It uses `mermaid.render` with a unique id, re-renders when the theme changes (`theme: 'dark'|'default'`), and shows `<pre class="diagram-error">` on failure.
- `Markdown` maps ```` ```mermaid ```` to `Mermaid`, and `concept:<id>` links to `<Link to="/step/<step>?item=<id>">`.

- [ ] **Step 1:** StepPage has a header (task statement title, domain, "Builds on" = distinct earlier steps referenced by `concept:` links), the key services as chips, then each section with a "Learned" checkbox bound to that item. Exam traps and further reading come last, then the "Step check" and "Next step →" buttons. It sets `lastStep` on mount.
- [ ] **Step 2:** Run it in the browser on `/step/3.1`. Diagrams render in both themes, `?item=3.1.3` scrolls to that section, and a deliberately broken mermaid block (tried temporarily) shows the error box while the rest still renders.

### Task 9: Quiz player, practice, review

**Files:**
- Create: `src/components/QuestionView.tsx`, `src/pages/QuizPage.tsx`, `src/pages/PracticePage.tsx`, `src/pages/ReviewPage.tsx`, `src/content/questions.ts` (exports `QUESTIONS`, `byId`, `questionsForStep`, `questionsForDomain`)

**Interfaces:**
- `QuestionView` props `{ q: Question; answer: string[]; onChange(a: string[]): void; reveal: boolean }`:
  - single uses radio buttons, multi uses checkboxes with "(Select N)", match uses a select per prompt from `termBank`;
  - options are shuffled per question for single/multi, keyed to the original keys;
  - when `reveal` is on, correct and wrong choices are highlighted and the explanation is shown.
- QuizPage modes:
  - step check: 10 questions from `questionsForStep`;
  - domain quiz: 25 questions from `questionsForDomain`;
  - mistakes: up to 20 questions where `lastCorrect === false`.
- Flow per question: Check → reveal → `recordAnswer` → Next. The results screen shows the score, the misses with "Review: <item titles>" links (`/step/:id?item=`), and "Retry misses". It ends with `addAttempt`.
- PracticePage: choose domains/steps (checkbox tree), a count (10/20/40), and a filter (all/unseen/missed), then hand off to the QuizPage flow via router state.
- ReviewPage: the missed questions grouped by step (stem plus the correct answer), a "Retry my mistakes" button, and the attempt history table.

- [ ] **Step 1:** Implement them. When the pool is empty, show "No questions here yet". When it's smaller than the count, show "Showing N of requested M".
- [ ] **Step 2:** In the browser, complete a step check on 1.1 with one deliberate miss. The miss shows in Review, "Retry my mistakes" serves it, and answering it right removes it from Review.

### Task 10: Exam simulation

**Files:**
- Create: `src/pages/ExamPage.tsx`, `src/pages/ExamResultPage.tsx`

**Interfaces:**
- Consumes: `drawExam`, `examRemainingMs`, `gradeExam`, `scaledScore`, `ProgressState.exam`.

- [ ] **Step 1:** Start screen: the exam rules (65 questions, 90 min, 700 to pass, no feedback until the end) and Start. Starting creates `exam` with `durationMs: 90*60*1000`. An existing `exam` shows "Resume" or "Abandon" instead.
- [ ] **Step 2:** The exam screen shows the question, a flag toggle, a navigator grid (answered/flagged/current), and a countdown from `examRemainingMs`, ticking every second. Answers save to `exam.answers` on every change. At 0 it auto-submits. Submit asks for confirmation in the page itself (no `window.confirm`) and lists the unanswered and flagged counts.
- [ ] **Step 3:** On submit:
  - `gradeExam` runs;
  - `recordAnswer` runs for each question;
  - `addAttempt(kind 'exam')` records the attempt;
  - `exam` is cleared;
  - the app navigates to the result page.
  The result page shows the scaled score, pass/fail, the formula text ("Approximation: 70% correct ≈ 700; real exams scale differently and include 15 unscored questions"), and a per-domain bar against its weight. It then lists the review of every question with reveal on.
- [ ] **Step 4:** In the browser, start an exam, answer 3, reload, and check that it resumes with the same questions, the 3 answers and the timer still counting. Submit and check that the result renders.

### Task 11: Info + About + export/import

**Files:**
- Create: `src/pages/InfoPage.tsx`, `src/pages/AboutPage.tsx`

- [ ] **Step 1:** The Info page covers:
  - format: 65 questions (50 scored + 15 unscored), 90 minutes, 700/1000 to pass, $100, question types;
  - a domain weights table;
  - qualifier words ("MOST cost-effective", "LEAST operational overhead", …);
  - pacing.
  All of it comes from the exam guide and is written fresh.
- [ ] **Step 2:** The About page:
  - lists the sources with links and licenses, including the MIT notices for kananinirav and jwalsh;
  - notes that pintardengan content is for personal study and that original questions are marked;
  - offers "Export progress" (downloads `aifc01-progress-YYYY-MM-DD.json`) and "Import progress" (file input → `importProgress`, with an inline error on failure);
  - has "Reset progress" behind an inline confirm.
- [ ] **Step 3:** In the browser, export, reset, then import, and check that the progress is restored.

### Task 12: Final verification

- [ ] **Step 1:** Run `npm test`, `node scripts/validate-questions.mjs`, `node scripts/validate-lessons.mjs` and `npm run build`. Expect all to pass, 0 errors, and the build to succeed.
- [ ] **Step 2:** In the browser at 390px and 1280px wide, check every route. Check that there's no horizontal scroll, that the light and dark themes both read well, and that the console has no errors.
- [ ] **Step 3:** Fact-check pass: a fresh subagent reviews a random sample of 40 questions (with at least 15 original ones) and 3 lessons against the exam guide and current AWS service facts, then reports errors. Fix them.
- [ ] **Step 4:** Write `README.md` covering how to run it (`npm install && npm run dev`), how to re-run ingestion, and the content layout.
