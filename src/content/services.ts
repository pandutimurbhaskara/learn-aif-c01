import { ALL_STEPS } from './roadmap'

export type ServiceCategory =
  | 'Ready-made AI services'
  | 'Generative AI'
  | 'ML platform'
  | 'Data and vector stores'
  | 'Responsible AI'
  | 'Security and governance'

export interface Service {
  name: string // matches the names in roadmap.ts `services` so lessons can be linked
  category: ServiceCategory
  does: string
  example: string
  /** The phrase in an exam question that points at this service. */
  cue: string
  /** Steps that teach it but do not list it in `services` (e.g. only named inside an item). */
  extraSteps?: string[]
}

export const CATEGORIES: ServiceCategory[] = [
  'Ready-made AI services',
  'Generative AI',
  'ML platform',
  'Data and vector stores',
  'Responsible AI',
  'Security and governance',
]

export const SERVICES: Service[] = [
  // Ready-made AI services: call an API, no model to build
  { name: 'Amazon Comprehend', category: 'Ready-made AI services', does: 'Analyzes text: sentiment, entities, key phrases, language, PII and topics.', example: 'Score the sentiment of 50,000 customer reviews and flag the ones that mention a competitor.', cue: 'sentiment, entities, key phrases in text' },
  { name: 'Amazon Translate', category: 'Ready-made AI services', does: 'Neural machine translation between languages, in real time or batch.', example: 'Translate a support knowledge base from English into Spanish and Japanese.', cue: 'translate text between languages' },
  { name: 'Amazon Transcribe', category: 'Ready-made AI services', does: 'Speech to text, including speaker labels, custom vocabulary and PII redaction.', example: 'Turn recorded sales calls into searchable transcripts with each speaker labelled.', cue: 'convert speech or audio to text' },
  { name: 'Amazon Polly', category: 'Ready-made AI services', does: 'Text to lifelike speech in many voices and languages.', example: 'Read news articles aloud in an accessibility feature of a mobile app.', cue: 'convert text to speech' },
  { name: 'Amazon Lex', category: 'Ready-made AI services', does: 'Builds voice and text chatbots with intents and slots (same tech as Alexa).', example: 'A bank chatbot that handles "What is my balance?" and "Reset my card PIN".', cue: 'build a conversational bot, intents and slots' },
  { name: 'Amazon Rekognition', category: 'Ready-made AI services', does: 'Image and video analysis: objects, faces, text in images, unsafe content.', example: 'Moderate user-uploaded photos and reject the ones with unsafe content.', cue: 'detect objects, faces or unsafe content in images/video' },
  { name: 'Amazon Textract', category: 'Ready-made AI services', does: 'Extracts text, forms and tables from scanned documents, beyond plain OCR.', example: 'Pull the totals and line items out of thousands of scanned invoices.', cue: 'extract text, forms or tables from documents' },
  { name: 'Amazon Personalize', category: 'Ready-made AI services', does: 'Real-time personalized recommendations from your interaction data.', example: 'Show "Recommended for you" products on a shop homepage.', cue: 'product or content recommendations' },
  { name: 'Amazon Kendra', category: 'Ready-made AI services', does: 'Intelligent enterprise search that answers natural-language questions across many document sources.', example: 'Employees ask "What is the parental leave policy?" and get the answer from HR documents.', cue: 'natural-language search over internal documents', extraSteps: ['1.2'] },

  // Generative AI
  { name: 'Amazon Bedrock', category: 'Generative AI', does: 'Serverless access to foundation models from Amazon and other providers through one API.', example: 'Call Claude or Nova to summarize support tickets, with no servers to manage.', cue: 'use a foundation model with the least operational overhead' },
  { name: 'Amazon Nova', category: 'Generative AI', does: "Amazon's own family of foundation models in Bedrock, for text, images (Canvas) and video (Reel).", example: 'Generate product images with Nova Canvas for a catalog.', cue: "Amazon's own foundation models" },
  { name: 'Amazon Bedrock Knowledge Bases', category: 'Generative AI', does: 'Managed RAG: ingests your documents, builds embeddings in a vector store and retrieves context for the model.', example: 'A chatbot answers questions from product manuals stored in Amazon S3 and cites the source.', cue: 'ground answers in company data (RAG) without retraining' },
  { name: 'Amazon Bedrock Agents', category: 'Generative AI', does: 'Lets a model plan multi-step tasks and call your APIs and knowledge bases.', example: 'An assistant that checks stock, places an order and sends a confirmation.', cue: 'model must take actions by calling APIs' },
  { name: 'Amazon Bedrock AgentCore', category: 'Generative AI', does: 'Runs agents securely at scale with any framework or model: runtime, memory, identity and observability.', example: 'Host a Strands-built agent in production with per-user permissions.', cue: 'deploy and operate agents in production' },
  { name: 'Amazon Bedrock AgentCore Identity', category: 'Security and governance', does: 'Identity and access for agents: who the agent acts for and which tools it can reach.', example: "An agent reads a user's calendar only with that user's delegated consent.", cue: 'agent authentication and authorization' },
  { name: 'Strands Agents', category: 'Generative AI', does: 'Open-source SDK for building agents in a few lines of code.', example: 'Prototype an agent locally, then deploy it on AgentCore.', cue: 'open-source agent framework' },
  { name: 'Amazon Bedrock Prompt Management', category: 'Generative AI', does: 'Stores, versions and compares prompts so teams can reuse and test them.', example: 'Keep v1 and v2 of a summarization prompt and test them side by side.', cue: 'version and reuse prompts' },
  { name: 'Amazon Bedrock Model Evaluation', category: 'Generative AI', does: 'Compares models or prompts using automatic metrics, human review or an LLM as judge.', example: 'Pick between two models for a legal-summary task using your own test set.', cue: 'evaluate or compare foundation models' },
  { name: 'Amazon Bedrock Guardrails', category: 'Responsible AI', does: 'Filters harmful content, denied topics, words and PII, and checks answers are grounded in the source.', example: 'Stop a banking bot from giving investment advice and mask card numbers.', cue: 'block harmful or off-topic input and output' },
  { name: 'Amazon Quick', category: 'Generative AI', does: 'Ready-made AI assistant and BI workspace for business users (absorbed Amazon Q Business and QuickSight).', example: 'Employees ask questions of company data and get dashboards in plain English.', cue: 'ready-made assistant over company data, no code' },
  { name: 'Kiro', category: 'Generative AI', does: 'AI-powered IDE whose agents turn specs into code.', example: 'Describe a feature as a spec and let the agent draft the code and tests.', cue: 'AI coding assistant for developers' },

  // ML platform
  { name: 'Amazon SageMaker AI', category: 'ML platform', does: 'Managed platform to build, train, tune and deploy your own ML models.', example: 'Train a churn-prediction model on your data and host it behind an endpoint.', cue: 'build, train and deploy a custom model' },
  { name: 'SageMaker JumpStart', category: 'ML platform', does: 'Hub of pre-trained models and solution templates to deploy or fine-tune.', example: 'Deploy an open-source Llama model to your own endpoint in a few clicks.', cue: 'pre-trained open-source model with control over hosting' },
  { name: 'Amazon SageMaker Clarify', category: 'Responsible AI', does: 'Detects bias in data and models and explains predictions.', example: 'Check whether a loan model approves one age group far less often.', cue: 'detect bias or explain a model' },
  { name: 'Amazon Augmented AI (A2I)', category: 'Responsible AI', does: 'Adds human review workflows for low-confidence predictions.', example: 'Send Textract results below 90% confidence to a person to confirm.', cue: 'human review of ML predictions' },
  { name: 'SageMaker Model Monitor', category: 'Responsible AI', does: 'Watches deployed models for data drift and quality drops.', example: 'Alert when live input data no longer looks like the training data.', cue: 'detect drift in production' },
  { name: 'Amazon SageMaker Model Cards', category: 'Responsible AI', does: 'Documents a model: purpose, data, limits and evaluation results.', example: 'Give auditors one page that describes how the fraud model was built and tested.', cue: 'document a model for transparency' },

  // Data and vector stores
  { name: 'Amazon OpenSearch Service', category: 'Data and vector stores', does: 'Search and analytics engine that also works as a vector database.', example: 'Store embeddings of documents and run similarity search for RAG.', cue: 'vector search or full-text search' },
  { name: 'Amazon Aurora', category: 'Data and vector stores', does: 'Managed relational database (MySQL and PostgreSQL compatible); PostgreSQL edition supports vectors with pgvector.', example: 'Keep product rows and their embeddings in the same database.', cue: 'vectors next to relational data' },
  { name: 'Amazon RDS for PostgreSQL', category: 'Data and vector stores', does: 'Managed PostgreSQL; supports vectors with the pgvector extension.', example: 'Add semantic search to an existing PostgreSQL app.', cue: 'pgvector on a managed database' },
  { name: 'Amazon Neptune', category: 'Data and vector stores', does: 'Managed graph database, useful for relationship-aware retrieval (GraphRAG).', example: 'Answer "which suppliers affect this product?" by following links between entities.', cue: 'graph data and relationships' },
  { name: 'AWS Glue Data Catalog', category: 'Data and vector stores', does: 'Central metadata catalog that describes your datasets and where they live.', example: 'Let teams discover which tables hold training data and who owns them.', cue: 'catalog and discover datasets' },

  // Security and governance
  { name: 'AWS IAM', category: 'Security and governance', does: 'Controls who can do what on which resources, with least-privilege policies.', example: 'Allow only the data-science role to invoke a specific Bedrock model.', cue: 'permissions and least privilege' },
  { name: 'AWS KMS', category: 'Security and governance', does: 'Creates and controls encryption keys for data at rest.', example: 'Encrypt training data in Amazon S3 with a customer-managed key.', cue: 'encryption keys' },
  { name: 'AWS PrivateLink', category: 'Security and governance', does: 'Private connectivity to AWS services without crossing the public internet.', example: 'Call Bedrock from a VPC without internet access.', cue: 'keep traffic off the public internet' },
  { name: 'Amazon Macie', category: 'Security and governance', does: 'Discovers sensitive data such as PII in Amazon S3 using ML.', example: 'Scan an S3 bucket before using it as training data and find stored personal data.', cue: 'find sensitive data in S3' },
  { name: 'AWS Artifact', category: 'Security and governance', does: 'Self-service portal for AWS compliance reports and agreements.', example: 'Download a SOC report for an auditor.', cue: 'compliance reports on demand' },
  { name: 'AWS Config', category: 'Security and governance', does: 'Records resource configurations and checks them against rules.', example: 'Flag any S3 bucket that is not encrypted.', cue: 'track configuration changes and compliance' },
  { name: 'Amazon Inspector', category: 'Security and governance', does: 'Scans workloads for software vulnerabilities and unintended exposure.', example: 'Find known vulnerabilities in the compute running your inference code.', cue: 'vulnerability scanning' },
  { name: 'AWS CloudTrail', category: 'Security and governance', does: 'Logs API calls: who did what, when and from where.', example: 'Show who invoked a model or changed a policy last Tuesday.', cue: 'audit API activity' },
  { name: 'Amazon CloudWatch', category: 'Security and governance', does: 'Metrics, logs and alarms for your applications and models.', example: 'Alarm when Bedrock invocation errors or latency spike.', cue: 'monitor metrics, logs and alarms' },
  { name: 'AWS Trusted Advisor', category: 'Security and governance', does: 'Best-practice checks for cost, security, performance and limits.', example: 'Spot idle resources that are costing money.', cue: 'best-practice recommendations for an account' },
]

/** Steps that teach a service: those listing it in roadmap.ts, plus any `extraSteps`. */
export function stepsForService(s: Service): string[] {
  const listed = ALL_STEPS.filter((st) => st.services.includes(s.name)).map((st) => st.id)
  return [...new Set([...listed, ...(s.extraSteps ?? [])])].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
}
