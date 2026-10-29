# AIF-C01 Study Site — Design

Date: 2026-10-29
Project folder: `/Users/pandu/coolyeah/aif-c01`

## Intent

A personal web app for learning and practicing for the **AWS Certified AI Practitioner (AIF-C01)** exam. The learner wants one place that says *what to learn, in what order*, lets them tick off what they've learned, teaches each item, and then tests them on exactly what they just studied, domain by domain, ending with a full exam simulation.

The core idea: **a step-by-step roadmap where every step builds on the previous one**, and the practice questions for each domain line up with what that domain taught.

## Goals

1. **Roadmap is the home screen.** It shows the 5 official domains in exam-guide order. Each domain breaks into steps, one per official task statement (14 steps in total: 1.1–1.3, 2.1–2.3, 3.1–3.4, 4.1–4.2, 5.1–5.2).
2. **Each step has a checklist of things to learn.** Items are concrete and small, like "Supervised vs unsupervised vs reinforcement learning" or "Amazon Transcribe = speech-to-text". The learner ticks each one learned or not learned. Progress shows per step, per domain and overall.
3. **Each step has a lesson.** Short original study notes for every checklist item, plus Mermaid diagrams wherever a picture helps (ML pipeline, AI ⊃ ML ⊃ DL ⊃ GenAI nesting, RAG flow, FM lifecycle, customization cost ladder, agent/MCP architecture, shared responsibility, the security service map, and so on).
4. **Practice questions per step and per domain.**
   - Every step ends with a short "step check" quiz drawn from questions tagged to that step.
   - Every domain ends with a "domain quiz" drawn from all of its steps.
   - Each question shows an explanation after it is answered.
5. **Full exam simulation** after Domain 5: 65 questions drawn in proportion to the domain weights (20/24/28/14/14), a 90-minute timer, no feedback until the end, then a full review with a per-domain breakdown.
6. **Progressive ordering, "match the previous one".** Within and across domains, a concept is taught before it is used. Each checklist item has a defined place in the order. When a lesson relies on an earlier concept it says so and links back to it (for example, the RAG lesson in 3.1 links to embeddings and chunking in 2.1). Quizzes for step N only use questions whose required concepts were taught in step N or earlier. Questions that need later concepts are tagged to that later step instead.

## Non-goals

- No accounts, backend, or sync. Progress lives in the browser (`localStorage`).
- No Bahasa Indonesia or other languages. **English only**, to match the real exam.
- Not hands-on AWS labs. The exam is conceptual.
- Not a general AWS course. Out-of-scope services (per the exam guide appendix) are not taught.

## Anti-goals (would be a failure even if it works)

- Teaching outdated exam content. The site must follow **exam guide v1.1** (the current one, which adds agentic AI, MCP, Kiro, Strands Agents, Amazon Bedrock AgentCore, Amazon Quick, prompt caching, context engineering, LLM-as-a-judge, and so on). Questions referencing renamed services (e.g. "SageMaker" vs "SageMaker AI", "QuickSight" vs "Quick") are kept but the explanation notes the current name where relevant.
- A question that tests something the roadmap never taught. Every question must map to a step, and the concept it tests must appear in that step's or an earlier step's checklist.
- Duplicate questions across sources showing up as separate questions.

## Sources (already gathered in `sources/`)

| Source | What it gives | License / use |
|---|---|---|
| Official exam guide v1.1 PDF (`sources/ai-practitioner-01.pdf`, text in `sources/exam-guide.txt`) | The authoritative outline: domains, weights, task statements, objectives, in/out-of-scope services | Used as the backbone of the roadmap |
| pintardengan.ai/pelatihanAI (`sources/pintardengan/questions.json`, `page.html`) | **393 practice questions** with explanations (367 single, 13 multi, 13 match/ordering), tagged by domain only; also cheat sheets and 28 "practice check" questions | No stated license. Used for **personal study only**; the site must not be deployed publicly with this content |
| kananinirav/aws-certified-ai-practitioner-study-notes | Study notes by topic + **7 practice tests × 50 = 350 questions** (markdown, answer + explanation, no domain tags) | MIT |
| jwalsh/aif-c01 | **40 AIF-C01 practice questions** (org-mode, tagged by domain) + AWS services overview | MIT |
| vicsz/aif-c01-study-notes | Concise outline of concepts and terms | No license file; used as a reference for coverage, not copied |
| CloudCityPress/aws-aif-c01 | Full study book organized by task statement (English) | CC BY-NC-ND 4.0 (no derivatives) → **link to it** as "further reading" per step; do not copy or adapt its text |

Lesson text is written fresh, using these as references, not pasted from them.

## Question bank processing

- Parse all three question sources into one normalized format:
  `{ id, source, type: single|multi|match|order, stem, options, correct, pairs?, termBank?, explanation, domain, step, concepts[] }`.
- **Dedupe** across sources by normalized stem similarity. Keep the version with the better explanation.
- **Tag each question to a step** (task statement) and to the checklist concept(s) it tests. Questions from kananinirav have no domain and are tagged from scratch. Pintardengan and jwalsh domain tags are kept unless clearly wrong.
- Questions that test out-of-scope or clearly outdated material are dropped.
- The processing is a one-time build step (a script plus manual review of the tags). The site ships the resulting JSON. It does not re-scrape.

Expected size: roughly 600–750 unique questions after dedupe.

### Original questions to fill v1.1 gaps (decided: yes)

The extracted sources barely cover the v1.1 additions. Across ~780 questions there are 0–2 each on Kiro, MCP, context engineering, Strands Agents, prompt caching and AgentCore. To fill the gaps:
- After tagging, count questions per checklist item. Write **original** questions for every item with fewer than ~3 questions, prioritizing v1.1 topics. Expect about 60–100 questions.
- Each one is exam-style (scenario plus a deciding constraint), has an explanation that covers why the wrong options are wrong, and is checked against the exam guide v1.1 wording.
- Mark them `source: "original"`.

### Review of tags and accuracy (builder's call)

The builder does the review, not the learner, because a learner can't fact-check material they haven't learned yet. This is a dedicated checking pass:
- Every question is tagged to a step and concept(s).
- Every concept a question needs is taught at or before that step.
- Lesson facts are checked against the exam guide and AWS docs.

Nothing blocks the site on the learner's review.

## Screens

1. **Roadmap (home).** A vertical path: Domain 1 → … → Domain 5 → Exam simulation. Each domain node shows its weight and progress. Expanding a domain shows its steps, each with the checklist inline (tick boxes) plus "Open lesson" and "Step check". The domain quiz comes at the end of each domain. An overall progress bar sits at the top, plus a "continue where you left off" button.
2. **Step / lesson page.** Title (task statement), "builds on" links, the checklist, and lesson sections in checklist order (each with a "mark learned" toggle). Mermaid diagrams sit inline, then key AWS services for the step, an exam-trap tips box ("deciding constraint" phrases), further reading links, and the step-check quiz button.
3. **Quiz player.** Used for step checks, domain quizzes, free practice and "retry mistakes". One question at a time. Supports single, multi ("select TWO"), and match/order. **Step checks, domain quizzes and free practice all show the answer and explanation right after each question** (they're for learning). Only the exam simulation holds feedback until the end. Results screen lists the misses with links back to the relevant checklist items.
3b. **Free practice.** Pick domains and/or steps, a question count and "only unseen / only missed / all". Same quiz player.
4. **Exam simulation.** 65 weighted questions, 90-minute timer, flag-for-review, question navigator, submit. The results screen shows an approximate scaled score (100–1000, pass at 700), a per-domain breakdown, and a full review.
5. **Review / weak spots.** Every question answered wrong and not yet answered right since, grouped by step. Plus a "retry my mistakes" quiz.
6. **Exam info (small).** Format (65 questions, 50 scored, 90 min, 700/1000, $100), the domain weights, question types, and exam-day tips (qualifier words like "LEAST operational overhead").

## Progress and state (localStorage)

- Checklist item state: learned / not learned.
- Per question: last answer correct or not, times seen, last seen.
- Quiz and exam attempt history (score, date, domain breakdown).
- Simple export/import of progress as a JSON file (so clearing the browser doesn't lose everything).

## How it gets made (decided)

- **Vite + React** (the learner's choice).
- **Mermaid** for all diagrams (the learner's choice).
- English only (the learner's choice).
- Progress saved in the browser and no accounts (the learner agreed to this default).
- **Runs locally only** (`npm run dev` / local build). It is not deployed publicly, which is why it can include the unlicensed pintardengan questions. MIT license notices for kananinirav and jwalsh are included in an "About / sources" page.
- **Open, guided order**: nothing is locked. The roadmap highlights the next recommended step (the first step with unticked items), and "Continue" goes there. A step counts as "done" when all its checklist items are ticked. The step-check score is shown alongside but isn't required.

## Left to the builder

- TypeScript vs JS, router, styling approach, markdown renderer, component structure, and visual design (should be clean and readable, with a light/dark theme).
- Exact checklist wording and granularity (aim for about 5–12 items per step, each one a sentence or less).
- How the "approximate scaled score" is computed (state the formula on the results screen).
- Quiz lengths (suggested: step check 10, domain quiz 20–30, both configurable).
- How the dedupe threshold and tagging are done (script plus human review of edge cases).
