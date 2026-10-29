import { DOMAINS } from '../content/roadmap'
import { EXAM_PLAN } from '../lib/quiz'

const QUALIFIERS: [string, string][] = [
  ['MOST cost-effective', 'The cheapest option that still meets every requirement, not the most powerful one.'],
  ['LEAST operational overhead', 'Prefer a fully managed or serverless service over anything you run yourself.'],
  ['MOST appropriate / BEST fits', 'The option that satisfies every stated constraint, not just the most obvious one.'],
  ['Without retraining / no model changes', 'Points to prompt engineering, RAG or inference parameters rather than fine-tuning.'],
  ['Ensure / must', 'A hard requirement. Eliminate any option that only reduces the risk.'],
  ['Minimize', 'Reduce. It doesn’t have to reach zero.'],
]

export default function InfoPage() {
  return (
    <div className="info">
      <h1>About the exam</h1>
      <p className="muted">AWS Certified AI Practitioner (AIF-C01), exam guide version 1.2 (October 29, 2026, with the same objectives as v1.1). A foundational exam that tests whether you know <em>what</em> to use and <em>why</em>, not how to code it.</p>

      <div className="card">
        <h2>Format</h2>
        <div className="table-wrap">
          <table>
            <tbody>
              <tr><th>Questions</th><td>65 total: 50 scored and 15 unscored (you can't tell which). No penalty for guessing.</td></tr>
              <tr><th>Question types</th><td>Multiple choice, multiple response, ordering, matching</td></tr>
              <tr><th>Time</th><td>90 minutes (about 83 seconds per question)</td></tr>
              <tr><th>Passing score</th><td>700 on a 100–1000 scaled score. It's compensatory: you pass on the overall score, not per domain.</td></tr>
              <tr><th>Cost</th><td>USD 100, at a Pearson VUE test center or online proctored</td></tr>
              <tr><th>Out of scope</th><td>Coding, building models, hyperparameter tuning, designing ML pipelines</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2>Domain weights</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Domain</th><th>Weight</th><th>In this site's exam sim</th></tr></thead>
            <tbody>
              {DOMAINS.map((d) => <tr key={d.id}><td>{d.id}. {d.title}</td><td>{d.weight}%</td><td>{EXAM_PLAN[d.id]} questions</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2>Reading the question</h2>
        <ol>
          <li><strong>Read the last sentence first.</strong> That's the actual question.</li>
          <li>Skim the options to see what kind of answer they want (a service, a technique, a metric).</li>
          <li>Read the scenario looking for the <strong>deciding constraint</strong>.</li>
          <li>Eliminate options that break a constraint, then pick from what's left.</li>
        </ol>
        <h3>Qualifier words</h3>
        <div className="table-wrap">
          <table>
            <tbody>{QUALIFIERS.map(([k, v]) => <tr key={k}><th>{k}</th><td>{v}</td></tr>)}</tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2>Pacing</h2>
        <p>Aim for about 75 seconds per question so you finish with roughly 8 minutes to revisit flagged questions. Rough checkpoints: question 16 at about 20 minutes, 33 at about 42 minutes, and 49 at about 63 minutes. If a question stalls you, flag it and move on.</p>
      </div>
    </div>
  )
}
