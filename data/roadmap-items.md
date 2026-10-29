
# Domain 1: Fundamentals of AI and ML

## Step 1.1: Explain basic AI concepts and terminologies
- 1.1.1 AI, ML, deep learning, GenAI and agentic AI as nested layers
- 1.1.2 Neural networks, computer vision and natural language processing (NLP)
- 1.1.3 Model vs algorithm, and training vs inference
- 1.1.4 Inference types: batch, real-time, asynchronous, serverless
- 1.1.5 Types of data: labeled/unlabeled, structured/unstructured, tabular, time-series, image, text
- 1.1.6 Supervised learning (classification and regression)
- 1.1.7 Unsupervised learning (clustering, dimensionality reduction, anomaly detection)
- 1.1.8 Reinforcement learning (agent, environment, reward)
- 1.1.9 Model fit: overfitting, underfitting, bias and variance
- 1.1.10 Bias and fairness in AI

## Step 1.2: Identify practical use cases for AI
- 1.2.1 Where AI/ML adds value: decision support, scalability, automation
- 1.2.2 When AI/ML is not appropriate: cost-benefit, need for a specific outcome
- 1.2.3 Picking a technique: regression vs classification vs clustering
- 1.2.4 Real-world AI applications: vision, NLP, speech, recommendations, fraud, forecasting, knowledge bases, agents
- 1.2.5 Amazon SageMaker AI: build, train and deploy your own models
- 1.2.6 Text services: Amazon Comprehend and Amazon Translate
- 1.2.7 Speech and conversation: Amazon Transcribe, Amazon Polly, Amazon Lex
- 1.2.8 Vision, documents and personalization: Rekognition, Textract, Personalize, Kendra
- 1.2.9 Traditional ML vs foundation models: regulation, explainability, operational constraints

## Step 1.3: Describe the AI/ML development lifecycle
- 1.3.1 ML pipeline stages from business goal to monitoring
- 1.3.2 Data collection, labeling, pre-processing and feature engineering
- 1.3.3 Training, hyperparameters, and train/validation/test splits
- 1.3.4 Sources of models: open-source pre-trained vs training a custom model
- 1.3.5 Using a model in production: managed API service vs self-hosted endpoint
- 1.3.6 AWS services for each pipeline stage (SageMaker AI features, Bedrock, Amazon Q, Amazon Quick, Kiro)
- 1.3.7 MLOps: experimentation, repeatable processes, scalability, technical debt, production readiness
- 1.3.8 Model monitoring, drift and re-training
- 1.3.9 Classification metrics: confusion matrix, accuracy, precision, recall, F1, AUC
- 1.3.10 Regression metrics: MAE, RMSE, R-squared
- 1.3.11 Business metrics: cost per user, development cost, customer feedback, ROI

# Domain 2: Fundamentals of Generative AI

## Step 2.1: Explain the basic concepts of generative AI (GenAI)
- 2.1.1 Foundation models and large language models (LLMs)
- 2.1.2 Transformers and attention: how LLMs generate text
- 2.1.3 Tokens and the context window
- 2.1.4 Embeddings and vectors: meaning as numbers
- 2.1.5 Chunking long documents
- 2.1.6 Multi-modal models and diffusion models
- 2.1.7 GenAI use cases: generation, summarization, assistants, translation, code, search, recommendations
- 2.1.8 The FM lifecycle: data selection to feedback
- 2.1.9 Token-based pricing: input vs output tokens, cost and latency
- 2.1.10 Prompt engineering and context engineering
- 2.1.11 AI agents: tool use, memory and workflow orchestration
- 2.1.12 Multi-agent patterns and the Model Context Protocol (MCP)

## Step 2.2: Understand the capabilities and limitations of GenAI for solving business problems
- 2.2.1 Advantages: adaptability, responsiveness, conversation, content generation
- 2.2.2 Hallucinations
- 2.2.3 Nondeterminism, interpretability and inaccuracy
- 2.2.4 Factors for selecting a GenAI model
- 2.2.5 Business value metrics: ROI, efficiency, conversion rate, ARPU, CLV, accuracy

## Step 2.3: Describe AWS infrastructure and technologies for building GenAI applications
- 2.3.1 Amazon Bedrock: many foundation models behind one serverless API
- 2.3.2 Bedrock building blocks: Knowledge Bases, Agents, Guardrails, Prompt Management, Evaluations
- 2.3.3 SageMaker AI and SageMaker JumpStart for GenAI
- 2.3.4 Amazon Q and Amazon Quick: ready-made AI assistants
- 2.3.5 Kiro: the AI-powered IDE
- 2.3.6 Strands Agents and Amazon Bedrock AgentCore: building and running agents
- 2.3.7 Advantages of AWS GenAI services: accessibility, lower barrier, speed to market
- 2.3.8 AWS infrastructure benefits: security, compliance, responsibility, safety
- 2.3.9 Compute for GenAI: GPUs, AWS Trainium and AWS Inferentia
- 2.3.10 Cost tradeoffs: on-demand tokens, batch, provisioned throughput, custom models, regions

# Domain 3: Applications of Foundation Models

## Step 3.1: Describe design considerations for applications that use foundation models (FMs)
- 3.1.1 FM selection criteria: cost, modality, latency, languages, size, complexity, customization, input/output length
- 3.1.2 Prompt caching
- 3.1.3 Inference parameters: temperature, top-p, top-k, maximum length, stop sequences
- 3.1.4 Retrieval Augmented Generation (RAG): how it works
- 3.1.5 Amazon Bedrock Knowledge Bases
- 3.1.6 Vector databases on AWS: OpenSearch Service, Aurora, Neptune, RDS for PostgreSQL
- 3.1.7 Customization cost ladder: in-context learning, RAG, fine-tuning, pre-training, distillation
- 3.1.8 AI agents in applications and their business uses

## Step 3.2: Choose effective prompt engineering techniques
- 3.2.1 Prompt anatomy: instruction, context, input data, output format, negative prompts
- 3.2.2 Zero-shot, single-shot and few-shot prompting
- 3.2.3 Chain-of-thought prompting
- 3.2.4 Prompt templates
- 3.2.5 Prompt engineering best practices
- 3.2.6 Prompt risks: exposure, poisoning, hijacking, jailbreaking
- 3.2.7 Amazon Bedrock Prompt Management: versioning prompts

## Step 3.3: Describe the training and fine-tuning process for FMs
- 3.3.1 Pre-training: self-supervised learning on massive unlabeled data
- 3.3.2 Fine-tuning and instruction tuning
- 3.3.3 Domain adaptation, transfer learning and continued pre-training
- 3.3.4 Model distillation
- 3.3.5 Preparing fine-tuning data: curation, governance, size, labeling, representativeness
- 3.3.6 Reinforcement learning from human feedback (RLHF)
- 3.3.7 Customizing models on AWS: Bedrock custom models and SageMaker AI

## Step 3.4: Describe methods to evaluate FM performance
- 3.4.1 Evaluation approaches: human evaluation, benchmark datasets, automatic metrics
- 3.4.2 Amazon Bedrock Model Evaluation
- 3.4.3 ROUGE for summarization
- 3.4.4 BLEU for translation
- 3.4.5 BERTScore for semantic similarity
- 3.4.6 LLM-as-a-judge
- 3.4.7 Evaluating RAG, agents and workflows
- 3.4.8 Business alignment: productivity, engagement, task completion, satisfaction, cost per interaction

# Domain 4: Guidelines for Responsible AI

## Step 4.1: Explain the development of AI systems that are responsible
- 4.1.1 Dimensions of responsible AI: fairness, inclusivity, robustness, safety, veracity, privacy, governance
- 4.1.2 How bias affects demographic groups
- 4.1.3 Bias vs variance: effects of overfitting and underfitting
- 4.1.4 Dataset characteristics: inclusive, diverse, curated, balanced
- 4.1.5 Amazon Bedrock Guardrails
- 4.1.6 Detecting bias: SageMaker Clarify, label quality, subgroup analysis, human audits
- 4.1.7 Human review with Amazon Augmented AI (A2I) and monitoring with Model Monitor
- 4.1.8 Legal risks of GenAI: IP infringement, biased outputs, lost trust, end-user risk, hallucinations
- 4.1.9 Responsible model selection: environmental impact and sustainability

## Step 4.2: Recognize the importance of transparent and explainable models
- 4.2.1 Transparent vs explainable vs black-box models
- 4.2.2 Explainability techniques: feature importance, SHAP, partial dependence plots
- 4.2.3 Amazon SageMaker Model Cards
- 4.2.4 Open-source models, data, licensing and AWS AI Service Cards
- 4.2.5 Tradeoffs: interpretability vs performance, safety vs transparency
- 4.2.6 Human-centered design for explainable AI

# Domain 5: Security, Compliance, and Governance for AI Solutions

## Step 5.1: Explain methods to secure AI systems
- 5.1.1 The AWS shared responsibility model for AI
- 5.1.2 IAM roles, policies and least privilege
- 5.1.3 Encryption at rest and in transit with AWS KMS
- 5.1.4 Network isolation: Amazon VPC and AWS PrivateLink
- 5.1.5 Finding sensitive data with Amazon Macie
- 5.1.6 Securing agents: AgentCore Identity and Policy in AgentCore
- 5.1.7 Data lineage, data cataloging and source citation
- 5.1.8 Secure data engineering: quality, privacy-enhancing technologies, access control, integrity
- 5.1.9 AI threats: prompt injection, data leakage, poisoning, toxicity, and output filtering
- 5.1.10 Threat detection, vulnerability management, logging and audit trails
- 5.1.11 Hallucination detection and grounding: RAG grounding, output validation, confidence scoring

## Step 5.2: Recognize governance and compliance regulations for AI systems
- 5.2.1 Compliance standards and AI regulations
- 5.2.2 AWS Artifact: compliance reports and agreements
- 5.2.3 AWS Config: resource configuration compliance
- 5.2.4 Amazon Inspector: vulnerability scanning
- 5.2.5 AWS CloudTrail and Amazon CloudWatch: audit logs and monitoring
- 5.2.6 AWS Trusted Advisor and the Well-Architected Tool
- 5.2.7 Data governance: lifecycle, logging, residency, monitoring, retention
- 5.2.8 Governance processes: policies, review cadence, transparency standards, training
- 5.2.9 The Generative AI Security Scoping Matrix
