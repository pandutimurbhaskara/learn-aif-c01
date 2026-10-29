import { describe, it, expect } from 'vitest'
import { parsePintardengan, parseKananinirav, parseJwalsh } from './parse.mjs'

const PD = [
  { id: 1, type: 'single', domain: 1, question: 'Which AI process occurs when the model analyzes a new image?', options: [{ key: 'A', text: 'Training' }, { key: 'B', text: 'Inference' }], correct: ['B'], explanation: 'Inference uses a trained model.' },
  { id: 2, type: 'match', domain: 1, question: 'Match each technique.', pairs: [{ prompt: 'K-means', answer: 'Unsupervised learning' }], termBank: ['Supervised learning', 'Unsupervised learning'], ordering: false, correct: null, explanation: 'Clustering is unsupervised.' },
]

const KN = `# Practice Test 1

1. A company needs to extract key points. Which solution meets these requirements?
    - A. Build NER.
    - B. Create a recommendation engine.
    - C. Develop a summarization chatbot.

    <details markdown=1><summary markdown="span">Answer</summary>
      Correct answer: C

      Explanation: A summarization chatbot
      extracts key points.
    </details>

2. Which services meet these requirements? (Select TWO.)
    - A. Amazon Comprehend
    - B. Amazon Polly
    - C. Amazon Translate

    <details markdown=1><summary markdown="span">Answer</summary>
      Correct answer: A, C

      Explanation: Comprehend and Translate.
    </details>

3. Pick two again. (Select TWO.)
    - A. One
    - B. Two
    - C. Three

    <details markdown=1><summary markdown="span">Answer</summary>
      Correct answer: AC

      Explanation: One and three.
    </details>

4. Match the prompt to the technique.
    - The chatbot needs low latency: (Batch transform or Real-time inference)

    <details markdown=1><summary markdown="span">Answer</summary>
      Correct answer: Chain-of-thought reasoning

      Explanation: Not parseable as options.
    </details>
`

const JW = `#+TITLE: Practice Exam 1

* Domain 1: Fundamentals of AI and ML

** Question 1: Which of the following is an example of unsupervised learning?
   :PROPERTIES:
   :ANSWER: Clustering customer data
   :EXPLANATION: Clustering finds structure without labels.
   :END:
   - [ ] Predicting house prices
   - [X] Clustering customer data
   - [ ] Classifying emails

** Question 2: What is a token?
   :PROPERTIES:
   :ANSWER: A unit of text
   :EXPLANATION: Tokens are units of text.
   :END:
   - [ ] A credential
   - [ ] A unit of text
`

describe('parsePintardengan', () => {
  it('keeps single questions with keys and explanation', () => {
    const [q] = parsePintardengan(PD)
    expect(q).toMatchObject({ id: 'pd-1', source: 'pintardengan', type: 'single', domain: 1, correct: ['B'], step: '', concepts: [] })
    expect(q.stem).toMatch(/new image/)
    expect(q.options).toHaveLength(2)
  })
  it('keeps match questions with pairs and term bank', () => {
    const q = parsePintardengan(PD)[1]
    expect(q.type).toBe('match')
    expect(q.pairs).toEqual([{ prompt: 'K-means', answer: 'Unsupervised learning' }])
    expect(q.termBank).toHaveLength(2)
    expect(q.correct).toBeUndefined()
  })
})

describe('parseKananinirav', () => {
  const qs = parseKananinirav(KN, 'practice-test-1.md')
  it('skips questions without lettered options', () => {
    expect(qs.map((q) => q.id)).toEqual(['kn-1-1', 'kn-1-2', 'kn-1-3'])
  })
  it('parses a single-answer question with a multi-line explanation', () => {
    expect(qs[0]).toMatchObject({ type: 'single', correct: ['C'], domain: 0, source: 'kananinirav' })
    expect(qs[0].options).toHaveLength(3)
    expect(qs[0].options[2]).toEqual({ key: 'C', text: 'Develop a summarization chatbot.' })
    expect(qs[0].explanation).toBe('A summarization chatbot extracts key points.')
  })
  it('parses "A, C" and "AC" as multi', () => {
    expect(qs[1]).toMatchObject({ type: 'multi', correct: ['A', 'C'] })
    expect(qs[2]).toMatchObject({ type: 'multi', correct: ['A', 'C'] })
  })
})

describe('parseJwalsh', () => {
  const qs = parseJwalsh(JW, 'aif-c01-practice-01.org')
  it('reads the [X] option as correct and the domain heading', () => {
    expect(qs[0]).toMatchObject({ id: 'jw-01-1', type: 'single', correct: ['B'], domain: 1, source: 'jwalsh' })
    expect(qs[0].explanation).toMatch(/without labels/)
  })
  it('falls back to :ANSWER: text when no option is ticked', () => {
    expect(qs[1].correct).toEqual(['B'])
  })
})
