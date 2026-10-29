# Lesson writing brief (AIF-C01 study site)

You write the lesson files for ONE domain of a personal AWS Certified AI Practitioner (AIF-C01) study site. Follow **exam guide v1.1** (2026): `/Users/pandu/coolyeah/aif-c01/sources/exam-guide.txt`.

The roadmap (domains → steps → checklist items, in teaching order) is in `/Users/pandu/coolyeah/aif-c01/data/roadmap-items.md`. The design spec is at `/Users/pandu/coolyeah/aif-c01/docs/superpowers/specs/2026-10-29-aif-c01-study-site-design.md`.

## Reference material (read for facts; DO NOT copy text, write fresh)
- `sources/kananinirav_aws-certified-ai-practitioner-study-notes/section/**` (MIT)
- `sources/vicsz_aif-c01-study-notes/README.md`
- `sources/pintardengan/page.html`: the "Domain Review" cheat sheets (search for the task statement number)
- `sources/CloudCityPress_aws-aif-c01/english/*.md`: reference only (CC BY-NC-ND; never copy or paraphrase closely)
- Your own up-to-date AWS knowledge. Use current service names: Amazon SageMaker AI, Amazon Quick (it absorbed QuickSight/Q in QuickSight), Amazon Q Business/Q Developer, Kiro, Strands Agents, Amazon Bedrock AgentCore (Runtime, Memory, Gateway, Identity, Policy, Observability), Amazon Nova.

## File format: one file per step: `src/content/lessons/<stepId>.md` (e.g. `src/content/lessons/2.1.md`)

- NO top-level `#` heading and no intro before the first section (the page shows the step title and summary itself).
- One section per checklist item, **in exactly roadmap order, with exactly these headings**: `## <itemId> <item title>`. Example: `## 2.1.4 Embeddings and vectors: meaning as numbers`. Copy the item title verbatim from roadmap-items.md.
- After the item sections, add exactly two more sections:
  - `## Exam traps`: 3–6 bullets on confusable pairs and the "deciding constraint" phrases (e.g. "LEAST operational overhead → managed service").
  - `## Further reading`: links to official AWS docs pages, plus the matching CloudCityPress English chapter on GitHub: `https://github.com/CloudCityPress/aws-aif-c01/blob/main/english/<file>.md`.
- Each item section is **80–250 words**: concise, exam-focused, plain English. Use short paragraphs, bullets and small tables where they help. Bold the key term. When it fits, end with a one-line "**On the exam:**" hint.
- **Cross-links**: when a section relies on an earlier concept, link it with `[text](concept:<itemId>)`, e.g. `[embeddings](concept:2.1.4)`. You may ONLY link to items at or before the current step in roadmap order (earlier domains are fine; later steps are NOT). Link generously to earlier steps; that's how the site shows "builds on".
- **Diagrams**: use fenced ```` ```mermaid ```` blocks where a picture helps. Each step file must contain **at least one** mermaid diagram (except steps 2.2 and 3.2, where it's optional). Aim for 2–4 per step in steps with processes or architectures. Keep diagrams small (≤ 12 nodes). Mermaid syntax rules that avoid parse errors:
  - Use `flowchart LR` / `flowchart TD`, `sequenceDiagram`, `graph`, or `mindmap`.
  - ALWAYS wrap node labels in double quotes: `A["Data collection"] --> B["EDA (explore)"]`.
  - No double quotes or `<`/`>` inside labels. Use `<br/>` only for line breaks inside quoted labels.
  - Edge labels as `A -->|"label"| B`.
  - Subgraphs: `subgraph S1["Title"]` … `end`.
  - No `classDef`/`style`/themes; the app themes diagrams.
- No HTML apart from `<br/>` in mermaid labels. No images.

## Quality bar
- Every exam-guide objective bullet for your steps must be covered.
- Facts must be correct as of 2026. When unsure about a detail, leave it out rather than guess.
- Don't teach out-of-scope material (coding, hyperparameter math, out-of-scope services).
