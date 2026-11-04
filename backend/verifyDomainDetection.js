
const { detectDomain } = require("./services/domainDetector");

const testCases = [
  // Programming & Software Development
  { question: "Explain Java inheritance and polymorphism", expected: "java" },
  { question: "What is the difference between JDK and JRE?", expected: "advancedJava" },
  { question: "Explain Spring Boot dependency injection", expected: "springBoot" },
  { question: "How do microservices communicate?", expected: "microservices" },
  { question: "Explain Python decorators", expected: "python" },
  { question: "Explain JavaScript closures and promises", expected: "javascript" },
  { question: "Explain TypeScript interfaces", expected: "typescript" },
  { question: "Explain pointers and malloc in C", expected: "c" },
  { question: "Explain C++ virtual functions", expected: "cpp" },
  { question: "Explain C# delegates", expected: "csharp" },
  { question: "Explain Dart null safety", expected: "dart" },
  { question: "Explain binary search trees and sorting algorithms", expected: "dataStructuresAlgorithms" },
  { question: "Explain goroutines in Go", expected: "go" },
  { question: "Explain Kotlin coroutines", expected: "kotlin" },
  { question: "Explain PHP sessions", expected: "php" },
  { question: "Explain Ruby blocks", expected: "ruby" },
  { question: "Explain Rust ownership and borrowing", expected: "rust" },
  { question: "Explain Scala functional programming", expected: "scala" },
  { question: "Explain Swift optionals", expected: "swift" },
  { question: "Explain high-level system design for a URL shortener", expected: "systemDesign" },

  // Frontend Development
  { question: "Explain HTML semantic elements", expected: "html" },
  { question: "Explain CSS flexbox and grid", expected: "css" },
  { question: "Explain React hooks and useEffect", expected: "react" },
  { question: "Explain Angular dependency injection", expected: "angular" },
  { question: "Explain Vue composition API", expected: "vue" },
  { question: "Explain Next.js server-side rendering", expected: "nextjs" },
  { question: "Explain Redux middleware", expected: "redux" },
  { question: "Explain Bootstrap grid system", expected: "bootstrap" },
  { question: "Explain Tailwind CSS utility classes", expected: "tailwindCss" },
  { question: "How do you improve frontend performance and reduce bundle size?", expected: "frontendPerformance" },

  // Backend & API Development
  { question: "Explain Node.js event loop", expected: "nodejs" },
  { question: "Explain Express middleware", expected: "express" },
  { question: "Explain ASP.NET Core dependency injection", expected: "aspnetCore" },
  { question: "Explain Django ORM", expected: "django" },
  { question: "Explain Flask blueprints", expected: "flask" },
  { question: "Explain FastAPI dependency injection", expected: "fastapi" },
  { question: "Explain NestJS modules and providers", expected: "nestjs" },
  { question: "Explain GraphQL resolvers", expected: "graphql" },
  { question: "Explain REST API status codes", expected: "restApis" },
  { question: "Explain JWT and OAuth API security", expected: "apiSecurity" },

  // Databases
  { question: "Explain SQL joins and subqueries", expected: "sql" },
  { question: "Explain MySQL indexing", expected: "mysql" },
  { question: "Explain PostgreSQL transactions", expected: "postgresql" },
  { question: "Explain Oracle Database architecture", expected: "oracleDatabase" },
  { question: "Explain SQL Server stored procedures", expected: "sqlServer" },
  { question: "Explain MongoDB aggregation pipeline", expected: "mongodb" },
  { question: "Explain Cassandra partition keys", expected: "cassandra" },
  { question: "Explain Redis caching and TTL", expected: "redis" },
  { question: "Explain PL SQL cursors and triggers", expected: "plsql" },
  { question: "Explain database backup and recovery administration", expected: "databaseAdministration" },
  { question: "Explain database query execution plan optimization", expected: "databasePerformanceTuning" },

  // Cloud Computing
  { question: "Explain AWS EC2 and S3", expected: "aws" },
  { question: "Explain Microsoft Azure virtual machines", expected: "azure" },
  { question: "Explain Azure AI Foundry projects and model deployments", expected: "azureAiFoundry" },
  { question: "Explain Azure OpenAI deployments", expected: "azureOpenAI" },
  { question: "Explain cloud architecture design", expected: "cloudArchitecture" },
  { question: "Explain cloud migration strategies", expected: "cloudMigration" },
  { question: "Explain cloud networking and virtual networks", expected: "cloudNetworking" },
  { question: "Explain cloud security and identity protection", expected: "cloudSecurity" },
  { question: "Explain Google Cloud Platform services", expected: "googleCloud" },
  { question: "Explain serverless computing using functions", expected: "serverlessComputing" },

  // DevOps & Infrastructure
  { question: "Explain DevOps lifecycle", expected: "devops" },
  { question: "Explain Docker containers and images", expected: "docker" },
  { question: "Explain Kubernetes pods and deployments", expected: "kubernetes" },
  { question: "Explain Jenkins pipelines", expected: "jenkins" },
  { question: "Explain continuous integration and continuous deployment", expected: "cicd" },
  { question: "Explain Terraform infrastructure as code", expected: "terraform" },
  { question: "Explain Ansible playbooks", expected: "ansible" },
  { question: "Explain Linux process management", expected: "linux" },
  { question: "Explain Bash shell scripting", expected: "shellScripting" },
  { question: "Explain GitHub Actions workflows", expected: "githubActions" },
  { question: "Explain Azure DevOps pipelines", expected: "azureDevOps" },
  { question: "Explain Helm charts", expected: "helm" },
  { question: "Explain Argo CD GitOps deployment", expected: "argoCd" },
  { question: "Explain Prometheus and Grafana monitoring", expected: "monitoringObservability" },
  { question: "Explain site reliability engineering and error budgets", expected: "sre" },
  { question: "Explain platform engineering and internal developer platforms", expected: "platformEngineering" },

  // Data Analytics & Engineering
  { question: "Explain advanced Excel pivot tables and lookup functions", expected: "advancedExcel" },
  { question: "Explain Apache Airflow DAG scheduling", expected: "apacheAirflow" },
  { question: "Explain Apache Kafka consumer groups", expected: "apacheKafka" },
  { question: "Explain Apache Spark architecture", expected: "apacheSpark" },
  { question: "Explain business intelligence dashboards", expected: "businessIntelligence" },
  { question: "Explain the responsibilities of a data analyst", expected: "dataAnalyst" },
  { question: "Explain Databricks and Delta Lake", expected: "databricks" },
  { question: "Explain data engineering pipelines", expected: "dataEngineering" },
  { question: "Explain data governance and data quality", expected: "dataGovernance" },
  { question: "Explain conceptual and dimensional data modeling", expected: "dataModeling" },
  { question: "Explain data warehouse architecture", expected: "dataWarehousing" },
  { question: "Explain ETL and ELT pipelines", expected: "etlElt" },
  { question: "Explain Power BI DAX measures", expected: "powerBi" },
  { question: "Explain PySpark transformations", expected: "pyspark" },
  { question: "Explain Snowflake data warehouse", expected: "snowflake" },
  { question: "Explain Tableau dashboards", expected: "tableau" },

  // AI, ML & Generative AI
  { question: "Explain autonomous AI agents and tool calling", expected: "aiAgents" },
  { question: "Explain AI model evaluation metrics", expected: "aiModelEvaluation" },
  { question: "Explain artificial intelligence applications", expected: "artificialIntelligence" },
  { question: "Explain computer vision object detection", expected: "computerVision" },
  { question: "Explain deep learning neural networks", expected: "deepLearning" },
  { question: "Explain generative AI models", expected: "generativeAi" },
  { question: "Explain LangChain chains and agents", expected: "langchain" },
  { question: "Explain large language model architecture", expected: "largeLanguageModels" },
  { question: "Explain machine learning algorithms", expected: "machineLearning" },
  { question: "Explain MLOps model deployment and monitoring", expected: "mlops" },
  { question: "Explain fine tuning a pretrained model", expected: "modelFineTuning" },
  { question: "Explain natural language processing tokenization", expected: "nlp" },
  { question: "Explain prompt engineering techniques", expected: "promptEngineering" },
  { question: "Explain retrieval augmented generation architecture", expected: "rag" },
  { question: "Explain vector databases and similarity search", expected: "vectorDatabases" },

  // Enterprise Applications
  { question: "Explain Microsoft Dynamics 365 modules", expected: "microsoftDynamics365" },
  { question: "Explain Oracle EBS architecture", expected: "oracleEbs" },
  { question: "Explain Oracle Fusion Financials", expected: "oracleFusionFinancials" },
  { question: "Explain Oracle Fusion HCM", expected: "oracleFusionHcm" },
  { question: "Explain Oracle Fusion SCM", expected: "oracleFusionScm" },
  { question: "Explain Salesforce administration profiles and permission sets", expected: "salesforceAdmin" },
  { question: "Explain Salesforce Apex triggers", expected: "salesforceDeveloper" },
  { question: "Explain SAP ABAP reports and internal tables", expected: "sapAbap" },
  { question: "Explain SAP Basis system administration", expected: "sapBasis" },
  { question: "Explain SAP FICO financial accounting", expected: "sapFico" },
  { question: "Explain SAP HANA database architecture", expected: "sapHana" },
  { question: "Explain SAP MM procurement process", expected: "sapMm" },
  { question: "Explain SAP SD order to cash", expected: "sapSd" },
  { question: "Explain SAP SuccessFactors employee central", expected: "sapSuccessFactors" },
  { question: "Explain ServiceNow application development", expected: "servicenowDevelopment" },
  { question: "Explain ServiceNow ITSM incident management", expected: "servicenowItsm" },
  { question: "Explain UiPath RPA workflows", expected: "uipathRpa" },
  { question: "Explain Workday HCM modules", expected: "workday" },

  // Software Testing & QA
  { question: "Explain API testing using Postman", expected: "apiTesting" },
  { question: "Explain automation testing framework design", expected: "automationTesting" },
  { question: "Explain Cypress test runner", expected: "cypress" },
  { question: "Explain database testing strategies", expected: "databaseTesting" },
  { question: "Explain JMeter load testing", expected: "jmeter" },
  { question: "Explain manual testing test cases", expected: "manualTesting" },
  { question: "Explain mobile application testing", expected: "mobileTesting" },
  { question: "Explain performance testing load and stress tests", expected: "performanceTesting" },
  { question: "Explain Playwright browser automation", expected: "playwright" },
  { question: "Explain Postman collections and environments", expected: "postman" },
  { question: "Explain security testing vulnerabilities", expected: "securityTesting" },
  { question: "Explain Selenium WebDriver", expected: "selenium" },
  { question: "Explain test management and defect lifecycle", expected: "testManagement" },

  // Cybersecurity & Networking
  { question: "Explain application security vulnerabilities", expected: "applicationSecurity" },
  { question: "Explain cloud security posture management", expected: "cloudSecurityCybersecurity" },
  { question: "Explain computer networking OSI layers", expected: "computerNetworking" },
  { question: "Explain cybersecurity threat prevention", expected: "cybersecurity" },
  { question: "Explain ethical hacking methodology", expected: "ethicalHacking" },
  { question: "Explain firewall rules and administration", expected: "firewallAdministration" },
  { question: "Explain identity and access management RBAC", expected: "iam" },
  { question: "Explain cybersecurity incident response lifecycle", expected: "incidentResponse" },
  { question: "Explain network administration and DHCP configuration", expected: "networkAdministration" },
  { question: "Explain network security and intrusion prevention", expected: "networkSecurity" },
  { question: "Explain penetration testing methodology", expected: "penetrationTesting" },
  { question: "Explain SIEM log correlation", expected: "siem" },
  { question: "Explain SOC analyst alert triage", expected: "socAnalyst" },

  // Other IT
  { question: "Explain Android activity lifecycle", expected: "androidDevelopment" },
  { question: "Explain blockchain smart contracts", expected: "blockchainDevelopment" },
  { question: "Explain desktop support troubleshooting", expected: "desktopSupport" },
  { question: "Explain embedded systems microcontrollers", expected: "embeddedSystems" },
  { question: "Explain Figma components and auto layout", expected: "figma" },
  { question: "Explain Flutter widgets and state management", expected: "flutter" },
  { question: "Explain iOS application development", expected: "iosDevelopment" },
  { question: "Explain Internet of Things architecture", expected: "iot" },
  { question: "Explain IT asset lifecycle management", expected: "itAssetManagement" },
  { question: "Explain IT help desk ticket management", expected: "itHelpDesk" },
  { question: "Explain IT project management methodologies", expected: "itProjectManagement" },
  { question: "Explain React Native components and navigation", expected: "reactNative" },
  { question: "Explain technical support troubleshooting process", expected: "technicalSupport" },
  { question: "Explain UI UX design principles", expected: "uiUxDesign" },

  // Finance & Accounting
  { question: "Explain accounting principles and journal entries", expected: "accounting" },
  { question: "Explain record to report cycle", expected: "recordToReport" },
  { question: "Explain procure to pay process", expected: "procureToPay" },
  { question: "Explain order to cash process", expected: "orderToCash" },
  { question: "Explain accounts payable invoice processing", expected: "accountsPayable" },
  { question: "Explain accounts receivable collections", expected: "accountsReceivable" },
  { question: "Explain general ledger reconciliation", expected: "generalLedger" },
  { question: "Explain financial reporting statements", expected: "financialReporting" },
  { question: "Explain financial planning and analysis budgeting", expected: "financialPlanningAnalysis" },
  { question: "Explain direct and indirect taxation", expected: "taxation" },
  { question: "Explain GST input tax credit and GSTR returns", expected: "gst" },
  { question: "Explain internal audit controls", expected: "internalAudit" },
  { question: "Explain external audit procedures", expected: "externalAudit" },
  { question: "Explain payroll accounting entries", expected: "payrollAccounting" },
  { question: "Explain bank and financial reconciliation", expected: "financialReconciliation" },

  // Banking & Insurance
  { question: "Explain banking operations and clearing", expected: "bankingOperations" },
  { question: "Explain retail banking products", expected: "retailBanking" },
  { question: "Explain corporate banking services", expected: "corporateBanking" },
  { question: "Explain loan processing and disbursement", expected: "loanProcessing" },
  { question: "Explain credit analysis and credit scoring", expected: "creditAnalysis" },
  { question: "Explain KYC verification process", expected: "kyc" },
  { question: "Explain anti money laundering transaction monitoring", expected: "aml" },
  { question: "Explain banking fraud detection", expected: "fraudDetection" },
  { question: "Explain payment operations settlement", expected: "paymentOperations" },
  { question: "Explain debit card and credit card operations", expected: "cardOperations" },
  { question: "Explain insurance claims processing", expected: "insuranceClaims" },
  { question: "Explain insurance underwriting risk assessment", expected: "insuranceUnderwriting" },
  { question: "Explain enterprise risk management", expected: "riskManagement" },
  { question: "Explain investment operations and trade settlement", expected: "investmentOperations" },

  // Human Resources
  { question: "Explain HR generalist responsibilities", expected: "hrGeneralist" },
  { question: "Explain HR operations and employee lifecycle", expected: "hrOperations" },
  { question: "Explain recruitment lifecycle", expected: "recruitment" },
  { question: "Explain talent acquisition strategy", expected: "talentAcquisition" },
  { question: "Explain IT recruitment technical screening", expected: "itRecruitment" },
  { question: "Explain non IT recruitment process", expected: "nonItRecruitment" },
  { question: "Explain payroll processing and statutory deductions", expected: "payrollProcessing" },
  { question: "Explain employee relations and grievance handling", expected: "employeeRelations" },
  { question: "Explain learning and development programs", expected: "learningAndDevelopment" },
  { question: "Explain performance management and appraisals", expected: "performanceManagement" },
  { question: "Explain HR compliance and labor laws", expected: "hrCompliance" },

  // BPO, Customer Service & Support
  { question: "Explain BPO voice process handling", expected: "bpoVoiceProcess" },
  { question: "Explain BPO non voice process", expected: "bpoNonVoiceProcess" },
  { question: "Explain domestic BPO process", expected: "domesticProcess" },
  { question: "Explain international BPO process", expected: "internationalProcess" },
  { question: "Explain customer service handling", expected: "customerService" },
  { question: "Explain customer support ticket resolution", expected: "customerSupport" },
  { question: "Explain technical support process troubleshooting", expected: "technicalSupportProcess" },
  { question: "Explain email support handling", expected: "emailSupport" },
  { question: "Explain chat support handling", expected: "chatSupport" },
  { question: "Explain collections calling process", expected: "collections" },
  { question: "Explain telecalling scripts and objection handling", expected: "telecalling" },
  { question: "Explain contact center operations and workforce management", expected: "contactCenterOperations" },
  { question: "Explain BPO quality analyst call audits", expected: "qualityAnalystBpo" },
];

let passed = 0;
let failed = 0;

console.log("\n========================================");
console.log("       DOMAIN DETECTION TEST");
console.log("========================================\n");

for (const test of testCases) {
  const actual = detectDomain(test.question);
  const success = actual === test.expected;

  if (success) {
    passed++;
    console.log(`[PASS] Expected: ${test.expected} | Actual: ${actual}`);
  } else {
    failed++;
    console.log(`[FAIL] Question: ${test.question}`);
    console.log(`       Expected: ${test.expected}`);
    console.log(`       Actual:   ${actual}`);
  }
}

console.log("\n========================================");
console.log("              TEST SUMMARY");
console.log("========================================");
console.log(`Total tests: ${testCases.length}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Pass percentage: ${((passed / testCases.length) * 100).toFixed(2)}%`);

if (failed > 0) {
  process.exitCode = 1;
} else {
  console.log("\nSUCCESS: All domain detection tests passed!");
}
