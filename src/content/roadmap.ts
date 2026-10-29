import type { ChecklistItem, Domain, Step } from './types'

// Teaching order matters: an item may only rely on items that come before it.
// Step titles are the official AIF-C01 exam guide v1.1 task statements.

const items = (stepId: string, titles: string[]): ChecklistItem[] =>
  titles.map((title, i) => ({ id: `${stepId}.${i + 1}`, title }))

export const DOMAINS: Domain[] = [
  {
    id: 1,
    title: 'Fundamentals of AI and ML',
    weight: 20,
    steps: [
      {
        id: '1.1',
        title: 'Explain basic AI concepts and terminologies',
        summary: 'The vocabulary the whole exam is built on: what AI, ML, deep learning, GenAI and agentic AI are, how models learn, and how they are used.',
        services: [],
        items: items('1.1', [
          'AI, ML, deep learning, GenAI and agentic AI as nested layers',
          'Neural networks, computer vision and natural language processing (NLP)',
          'Model vs algorithm, and training vs inference',
          'Inference types: batch, real-time, asynchronous, serverless',
          'Types of data: labeled/unlabeled, structured/unstructured, tabular, time-series, image, text',
          'Supervised learning (classification and regression)',
          'Unsupervised learning (clustering, dimensionality reduction, anomaly detection)',
          'Reinforcement learning (agent, environment, reward)',
          'Model fit: overfitting, underfitting, bias and variance',
          'Bias and fairness in AI',
        ]),
      },
      {
        id: '1.2',
        title: 'Identify practical use cases for AI',
        summary: 'When ML is (and is not) the right tool, which technique fits which problem, and which AWS managed AI service solves it without building a model.',
        services: ['Amazon SageMaker AI', 'Amazon Transcribe', 'Amazon Translate', 'Amazon Comprehend', 'Amazon Lex', 'Amazon Polly', 'Amazon Rekognition', 'Amazon Textract', 'Amazon Personalize'],
        items: items('1.2', [
          'Where AI/ML adds value: decision support, scalability, automation',
          'When AI/ML is not appropriate: cost-benefit, need for a specific outcome',
          'Picking a technique: regression vs classification vs clustering',
          'Real-world AI applications: vision, NLP, speech, recommendations, fraud, forecasting, knowledge bases, agents',
          'Amazon SageMaker AI: build, train and deploy your own models',
          'Text services: Amazon Comprehend and Amazon Translate',
          'Speech and conversation: Amazon Transcribe, Amazon Polly, Amazon Lex',
          'Vision, documents and personalization: Rekognition, Textract, Personalize, Kendra',
          'Traditional ML vs foundation models: regulation, explainability, operational constraints',
        ]),
      },
      {
        id: '1.3',
        title: 'Describe the AI/ML development lifecycle',
        summary: 'How a model goes from a business problem to a monitored production system, which AWS tools cover each stage, and how to measure success.',
        services: ['Amazon SageMaker AI', 'Amazon Bedrock', 'Amazon Quick', 'Kiro'],
        items: items('1.3', [
          'ML pipeline stages from business goal to monitoring',
          'Data collection, labeling, pre-processing and feature engineering',
          'Training, hyperparameters, and train/validation/test splits',
          'Sources of models: open-source pre-trained vs training a custom model',
          'Using a model in production: managed API service vs self-hosted endpoint',
          'AWS services for each pipeline stage (SageMaker AI features, Bedrock, Amazon Quick, Kiro)',
          'MLOps: experimentation, repeatable processes, scalability, technical debt, production readiness',
          'Model monitoring, drift and re-training',
          'Classification metrics: confusion matrix, accuracy, precision, recall, F1, AUC',
          'Regression metrics: MAE, RMSE, R-squared',
          'Business metrics: cost per user, development cost, customer feedback, ROI',
        ]),
      },
    ],
  },
  {
    id: 2,
    title: 'Fundamentals of Generative AI',
    weight: 24,
    steps: [
      {
        id: '2.1',
        title: 'Explain the basic concepts of generative AI (GenAI)',
        summary: 'The building blocks of GenAI: foundation models, transformers, tokens, embeddings, the FM lifecycle, pricing, context engineering and agents.',
        services: [],
        items: items('2.1', [
          'Foundation models and large language models (LLMs)',
          'Transformers and attention: how LLMs generate text',
          'Tokens and the context window',
          'Embeddings and vectors: meaning as numbers',
          'Chunking long documents',
          'Multi-modal models and diffusion models',
          'GenAI use cases: generation, summarization, assistants, translation, code, search, recommendations',
          'The FM lifecycle: data selection to feedback',
          'Token-based pricing: input vs output tokens, cost and latency',
          'Prompt engineering and context engineering',
          'AI agents: tool use, memory and workflow orchestration',
          'Multi-agent patterns and the Model Context Protocol (MCP)',
        ]),
      },
      {
        id: '2.2',
        title: 'Understand the capabilities and limitations of GenAI for solving business problems',
        summary: 'What GenAI is great at, where it fails (hallucinations, nondeterminism), how to pick a model, and how to prove business value.',
        services: [],
        items: items('2.2', [
          'Advantages: adaptability, responsiveness, conversation, content generation',
          'Hallucinations',
          'Nondeterminism, interpretability and inaccuracy',
          'Factors for selecting a GenAI model',
          'Business value metrics: ROI, efficiency, conversion rate, ARPU, CLV, accuracy',
        ]),
      },
      {
        id: '2.3',
        title: 'Describe AWS infrastructure and technologies for building GenAI applications',
        summary: 'The AWS GenAI stack (Bedrock, SageMaker AI, Quick, Kiro, Strands Agents, AgentCore), why to use it, and its cost tradeoffs.',
        services: ['Amazon Bedrock', 'Amazon SageMaker AI', 'SageMaker JumpStart', 'Amazon Quick', 'Kiro', 'Strands Agents', 'Amazon Bedrock AgentCore', 'Amazon Nova'],
        items: items('2.3', [
          'Amazon Bedrock: many foundation models behind one serverless API',
          'Bedrock building blocks: Knowledge Bases, Agents, Guardrails, Prompt Management, Evaluations',
          'SageMaker AI and SageMaker JumpStart for GenAI',
          'Amazon Quick and Amazon Q Developer: ready-made AI assistants',
          'Kiro: the AI-powered IDE',
          'Strands Agents and Amazon Bedrock AgentCore: building and running agents',
          'Advantages of AWS GenAI services: accessibility, lower barrier, speed to market',
          'AWS infrastructure benefits: security, compliance, responsibility, safety',
          'Compute for GenAI: GPUs, AWS Trainium and AWS Inferentia',
          'Cost tradeoffs: on-demand tokens, batch, provisioned throughput, custom models, regions',
        ]),
      },
    ],
  },
  {
    id: 3,
    title: 'Applications of Foundation Models',
    weight: 28,
    steps: [
      {
        id: '3.1',
        title: 'Describe design considerations for applications that use foundation models (FMs)',
        summary: 'Choosing an FM, tuning its inference parameters, grounding it with RAG and vector stores, picking a customization approach, and using agents.',
        services: ['Amazon Bedrock Knowledge Bases', 'Amazon OpenSearch Service', 'Amazon Aurora', 'Amazon Neptune', 'Amazon RDS for PostgreSQL', 'Amazon Bedrock Agents'],
        items: items('3.1', [
          'FM selection criteria: cost, modality, latency, languages, size, complexity, customization, input/output length',
          'Prompt caching',
          'Inference parameters: temperature, top-p, top-k, maximum length, stop sequences',
          'Retrieval Augmented Generation (RAG): how it works',
          'Amazon Bedrock Knowledge Bases',
          'Vector databases on AWS: OpenSearch Service, Aurora, Neptune, RDS for PostgreSQL',
          'Customization cost ladder: in-context learning, RAG, fine-tuning, pre-training, distillation',
          'AI agents in applications and their business uses',
        ]),
      },
      {
        id: '3.2',
        title: 'Choose effective prompt engineering techniques',
        summary: 'How to structure prompts, which technique fits which task, best practices, the attacks prompts face, and managing prompts as versioned assets.',
        services: ['Amazon Bedrock Prompt Management'],
        items: items('3.2', [
          'Prompt anatomy: instruction, context, input data, output format, negative prompts',
          'Zero-shot, single-shot and few-shot prompting',
          'Chain-of-thought prompting',
          'Prompt templates',
          'Prompt engineering best practices',
          'Prompt risks: exposure, poisoning, hijacking, jailbreaking',
          'Amazon Bedrock Prompt Management: versioning prompts',
        ]),
      },
      {
        id: '3.3',
        title: 'Describe the training and fine-tuning process for FMs',
        summary: 'How foundation models are pre-trained, how they are adapted (fine-tuning, continued pre-training, distillation), and how to prepare the data.',
        services: ['Amazon Bedrock', 'Amazon SageMaker AI'],
        items: items('3.3', [
          'Pre-training: self-supervised learning on massive unlabeled data',
          'Fine-tuning and instruction tuning',
          'Domain adaptation, transfer learning and continued pre-training',
          'Model distillation',
          'Preparing fine-tuning data: curation, governance, size, labeling, representativeness',
          'Reinforcement learning from human feedback (RLHF)',
          'Customizing models on AWS: Bedrock custom models and SageMaker AI',
        ]),
      },
      {
        id: '3.4',
        title: 'Describe methods to evaluate FM performance',
        summary: 'How to measure whether an FM and the application built on it are good enough, technically and for the business.',
        services: ['Amazon Bedrock Model Evaluation'],
        items: items('3.4', [
          'Evaluation approaches: human evaluation, benchmark datasets, automatic metrics',
          'Amazon Bedrock Model Evaluation',
          'ROUGE for summarization',
          'BLEU for translation',
          'BERTScore for semantic similarity',
          'LLM-as-a-judge',
          'Evaluating RAG, agents and workflows',
          'Business alignment: productivity, engagement, task completion, satisfaction, cost per interaction',
        ]),
      },
    ],
  },
  {
    id: 4,
    title: 'Guidelines for Responsible AI',
    weight: 14,
    steps: [
      {
        id: '4.1',
        title: 'Explain the development of AI systems that are responsible',
        summary: 'The dimensions of responsible AI, how bias shows up and gets detected, the AWS tools that enforce safety, and the legal risks of GenAI.',
        services: ['Amazon Bedrock Guardrails', 'Amazon SageMaker Clarify', 'Amazon Augmented AI (A2I)', 'SageMaker Model Monitor'],
        items: items('4.1', [
          'Dimensions of responsible AI: fairness, inclusivity, robustness, safety, veracity, privacy, governance',
          'How bias affects demographic groups',
          'Bias vs variance: effects of overfitting and underfitting',
          'Dataset characteristics: inclusive, diverse, curated, balanced',
          'Amazon Bedrock Guardrails',
          'Detecting bias: SageMaker Clarify, label quality, subgroup analysis, human audits',
          'Human review with Amazon Augmented AI (A2I) and monitoring with Model Monitor',
          'Legal risks of GenAI: IP infringement, biased outputs, lost trust, end-user risk, hallucinations',
          'Responsible model selection: environmental impact and sustainability',
        ]),
      },
      {
        id: '4.2',
        title: 'Recognize the importance of transparent and explainable models',
        summary: 'What makes a model transparent or explainable, the tools that document and explain models, and the tradeoffs involved.',
        services: ['Amazon SageMaker Model Cards', 'Amazon SageMaker Clarify', 'Amazon Bedrock Model Evaluation'],
        items: items('4.2', [
          'Transparent vs explainable vs black-box models',
          'Explainability techniques: feature importance, SHAP, partial dependence plots',
          'Amazon SageMaker Model Cards',
          'Open-source models, data, licensing and AWS AI Service Cards',
          'Tradeoffs: interpretability vs performance, safety vs transparency',
          'Human-centered design for explainable AI',
        ]),
      },
    ],
  },
  {
    id: 5,
    title: 'Security, Compliance, and Governance for AI Solutions',
    weight: 14,
    steps: [
      {
        id: '5.1',
        title: 'Explain methods to secure AI systems',
        summary: 'Who secures what, the AWS controls for identity, encryption and networking, protecting data and agents, and keeping outputs safe and grounded.',
        services: ['AWS IAM', 'AWS KMS', 'AWS PrivateLink', 'Amazon Macie', 'Amazon Bedrock AgentCore Identity', 'Amazon Bedrock Guardrails', 'AWS Glue Data Catalog'],
        items: items('5.1', [
          'The AWS shared responsibility model for AI',
          'IAM roles, policies and least privilege',
          'Encryption at rest and in transit with AWS KMS',
          'Network isolation: Amazon VPC and AWS PrivateLink',
          'Finding sensitive data with Amazon Macie',
          'Securing agents: AgentCore Identity and Policy in AgentCore',
          'Data lineage, data cataloging and source citation',
          'Secure data engineering: quality, privacy-enhancing technologies, access control, integrity',
          'AI threats: prompt injection, data leakage, poisoning, toxicity, and output filtering',
          'Threat detection, vulnerability management, logging and audit trails',
          'Hallucination detection and grounding: RAG grounding, output validation, confidence scoring',
        ]),
      },
      {
        id: '5.2',
        title: 'Recognize governance and compliance regulations for AI systems',
        summary: 'The AWS services that prove and monitor compliance, how to govern data, and the processes and frameworks that keep AI under control.',
        services: ['AWS Artifact', 'AWS Config', 'Amazon Inspector', 'AWS CloudTrail', 'Amazon CloudWatch', 'AWS Trusted Advisor'],
        items: items('5.2', [
          'Compliance standards and AI regulations',
          'AWS Artifact: compliance reports and agreements',
          'AWS Config: resource configuration compliance',
          'Amazon Inspector: vulnerability scanning',
          'AWS CloudTrail and Amazon CloudWatch: audit logs and monitoring',
          'AWS Trusted Advisor and the Well-Architected Tool',
          'Data governance: lifecycle, logging, residency, monitoring, retention',
          'Governance processes: policies, review cadence, transparency standards, training',
          'The Generative AI Security Scoping Matrix',
        ]),
      },
    ],
  },
]

export const ALL_STEPS: Step[] = DOMAINS.flatMap((d) => d.steps)
export const ALL_ITEMS: ChecklistItem[] = ALL_STEPS.flatMap((s) => s.items)

const itemIndex = new Map(ALL_ITEMS.map((it, i) => [it.id, i]))
const stepIndex = new Map(ALL_STEPS.map((s, i) => [s.id, i]))

/** Position of an item in teaching order, or -1 if unknown. */
export const itemOrder = (id: string): number => itemIndex.get(id) ?? -1
/** Position of a step in teaching order, or -1 if unknown. */
export const stepOrder = (id: string): number => stepIndex.get(id) ?? -1
export const findStep = (id: string): Step | undefined => ALL_STEPS.find((s) => s.id === id)
export const stepOfItem = (itemId: string): string => itemId.split('.').slice(0, 2).join('.')
export const domainOfStep = (stepId: string): Domain => DOMAINS[Number(stepId.split('.')[0]) - 1]
export const findItem = (id: string): ChecklistItem | undefined => ALL_ITEMS.find((it) => it.id === id)
