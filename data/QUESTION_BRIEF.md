# Original practice question brief

Write ORIGINAL exam-style AIF-C01 (exam guide v1.1) practice questions for the thin checklist items of your domain(s). They're listed in `/Users/pandu/coolyeah/aif-c01/data/gaps.md` with the number to write for each.

Output: `/Users/pandu/coolyeah/aif-c01/data/original/d<N>.json` (one file per domain, N = domain number), as a JSON array of:

```json
{
  "id": "og-<itemId>-<n>",            // e.g. "og-2.1.12-1"
  "source": "original",
  "type": "single" | "multi" | "match",
  "stem": "Scenario … Which solution meets these requirements with the LEAST operational overhead?",
  "options": [{"key":"A","text":"…"}, {"key":"B","text":"…"}, {"key":"C","text":"…"}, {"key":"D","text":"…"}],
  "correct": ["B"],
  "explanation": "Why B is right. Why A is wrong … Why C … Why D …",
  "domain": 2,
  "step": "2.1",
  "concepts": ["2.1.12"]
}
```

Rules:
- Exam style: a short business scenario plus a deciding constraint ("MOST cost-effective", "LEAST operational overhead", "without retraining"), with 4 plausible options. Avoid trivia and "which is NOT" phrasing.
- `single` has exactly 1 correct. `multi` has 5 options, 2 correct, and the stem ends with "(Select TWO.)".
- At least ONE `match` question per domain:
  - no `options`/`correct`;
  - `"pairs": [{"prompt":"…","answer":"<term>"}…]` (3–4 pairs) and `"termBank": ["…"]`, where each answer is a termBank entry;
  - for an ordering question, the termBank is `["1st","2nd","3rd","4th"]` and the stem says "Put these steps in order."
- `concepts`: the target item first, plus optional extra items. Every concept must be in `step` or an EARLIER step of the roadmap (`data/roadmap-items.md`). `domain` = the first digit of `step`.
- The explanation covers why the right answer is right AND why each wrong option is wrong (2–5 sentences total). Plain text, no markdown.
- Facts must be correct for AWS as of 2026, with current names (SageMaker AI, Amazon Quick, Kiro, Strands Agents, Bedrock AgentCore …). Keep every question consistent with the lesson you wrote.
- Each question must be answerable from the lesson text for its step and earlier steps.

When done, validate from `/Users/pandu/coolyeah/aif-c01`: run `node scripts/merge-tags.mjs && node --experimental-strip-types --no-warnings scripts/validate-questions.mjs`. Fix any ERROR lines that mention your ids (other agents may be writing other domains at the same time; ignore errors for their ids).
