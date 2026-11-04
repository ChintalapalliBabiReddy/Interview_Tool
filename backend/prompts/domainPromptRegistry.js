
const path = require("path");

function loadPrompt(basePath, file) {
  const promptPath = path.resolve(__dirname, basePath, `${file}.js`);

  try {
    const prompt = require(promptPath);

    if (typeof prompt !== "string" || !prompt.trim()) {
      throw new Error(`Invalid or empty domain prompt: ${promptPath}`);
    }

    return prompt;
  } catch (error) {
    throw new Error(
      `Failed to load prompt "${file}" from "${basePath}": ${error.message}`
    );
  }
}

function loadPrompts(basePath, files) {
  return Object.fromEntries(
    Object.entries(files).map(([domain, file]) => [
      domain,
      loadPrompt(basePath, file),
    ])
  );
}

// ======================================================
// IT - Programming & Software Development (20)
// ======================================================

const PROGRAMMING_PROMPTS = loadPrompts(
  "./domains/IT/Programming & Software Development",
  {
    java: "java",
    advancedJava: "advancedJava",
    springBoot: "springBoot",
    microservices: "microservices",
    python: "python",
    javascript: "javascript",
    typescript: "typescript",
    c: "c",
    cpp: "cpp",
    csharp: "csharp",
    dart: "dart",
    dataStructuresAlgorithms: "dataStructuresAlgorithms",
    go: "go",
    kotlin: "kotlin",
    php: "php",
    ruby: "ruby",
    rust: "rust",
    scala: "scala",
    swift: "swift",
    systemDesign: "systemDesign",
  }
);

// ======================================================
// IT - Frontend Development (10)
// JavaScript is registered under Programming above.
// ======================================================

const FRONTEND_PROMPTS = loadPrompts(
  "./domains/IT/Frontend Development",
  {
    html: "html",
    css: "css",
    react: "react",
    angular: "angular",
    vue: "vue",
    nextjs: "nextjs",
    redux: "redux",
    bootstrap: "bootstrap",
    tailwindCss: "tailwindCss",
    frontendPerformance: "frontendPerformance",
  }
);

// ======================================================
// IT - Backend & API Development (10)
// ======================================================

const BACKEND_PROMPTS = loadPrompts(
  "./domains/IT/Backend & API Development",
  {
    nodejs: "nodejs",
    express: "express",
    aspnetCore: "aspnetCore",
    django: "django",
    flask: "flask",
    fastapi: "fastapi",
    nestjs: "nestjs",
    graphql: "graphql",
    restApis: "restApis",
    apiSecurity: "apiSecurity",
  }
);

// ======================================================
// IT - Databases (11)
// ======================================================

const DATABASE_PROMPTS = loadPrompts(
  "./domains/IT/Databases",
  {
    sql: "sql",
    mysql: "mysql",
    postgresql: "postgresql",
    oracleDatabase: "oracleDatabase",
    sqlServer: "sqlServer",
    mongodb: "mongodb",
    cassandra: "cassandra",
    redis: "redis",
    plsql: "plsql",
    databaseAdministration: "databaseAdministration",
    databasePerformanceTuning: "databasePerformanceTuning",
  }
);

// ======================================================
// IT - Cloud Computing (10)
// ======================================================

const CLOUD_PROMPTS = loadPrompts(
  "./domains/IT/Cloud Computing",
  {
    aws: "aws",
    azure: "azure",
    azureAiFoundry: "azureAiFoundry",
    azureOpenAI: "azureOpenAI",
    cloudArchitecture: "cloudArchitecture",
    cloudMigration: "cloudMigration",
    cloudNetworking: "cloudNetworking",
    cloudSecurity: "cloudSecurity",
    googleCloud: "googleCloud",
    serverlessComputing: "serverlessComputing",
  }
);

// ======================================================
// IT - DevOps & Infrastructure (16)
// ======================================================

const DEVOPS_PROMPTS = loadPrompts(
  "./domains/IT/DevOps & Infrastructure",
  {
    devops: "devops",
    docker: "docker",
    kubernetes: "kubernetes",
    jenkins: "jenkins",
    cicd: "cicd",
    terraform: "terraform",
    ansible: "ansible",
    linux: "linux",
    shellScripting: "shellScripting",
    githubActions: "githubActions",
    azureDevOps: "azureDevOps",
    helm: "helm",
    argoCd: "argoCd",
    monitoringObservability: "monitoringObservability",
    sre: "sre",
    platformEngineering: "platformEngineering",
  }
);

// ======================================================
// IT - Data Analytics & Engineering (16)
// ======================================================

const DATA_PROMPTS = loadPrompts(
  "./domains/IT/Data Analytics & Engineering",
  {
    advancedExcel: "advancedExcel",
    apacheAirflow: "apacheAirflow",
    apacheKafka: "apacheKafka",
    apacheSpark: "apacheSpark",
    businessIntelligence: "businessIntelligence",
    dataAnalyst: "dataAnalyst",
    databricks: "databricks",
    dataEngineering: "dataEngineering",
    dataGovernance: "dataGovernance",
    dataModeling: "dataModeling",
    dataWarehousing: "dataWarehousing",
    etlElt: "etlElt",
    powerBi: "powerBi",
    pyspark: "pyspark",
    snowflake: "snowflake",
    tableau: "tableau",
  }
);

// ======================================================
// IT - AI, ML & Generative AI (15)
// ======================================================

const AI_PROMPTS = loadPrompts(
  "./domains/IT/AI, ML & Generative AI",
  {
    aiAgents: "aiAgents",
    aiModelEvaluation: "aiModelEvaluation",
    artificialIntelligence: "artificialIntelligence",
    computerVision: "computerVision",
    deepLearning: "deepLearning",
    generativeAi: "generativeAi",
    langchain: "langchain",
    largeLanguageModels: "largeLanguageModels",
    machineLearning: "machineLearning",
    mlops: "mlops",
    modelFineTuning: "modelFineTuning",
    nlp: "nlp",
    promptEngineering: "promptEngineering",
    rag: "rag",
    vectorDatabases: "vectorDatabases",
  }
);

// ======================================================
// IT - Enterprise Applications (18)
// ======================================================

const ENTERPRISE_PROMPTS = loadPrompts(
  "./domains/IT/Enterprise Applications",
  {
    microsoftDynamics365: "microsoftDynamics365",
    oracleEbs: "oracleEbs",
    oracleFusionFinancials: "oracleFusionFinancials",
    oracleFusionHcm: "oracleFusionHcm",
    oracleFusionScm: "oracleFusionScm",
    salesforceAdmin: "salesforceAdmin",
    salesforceDeveloper: "salesforceDeveloper",
    sapAbap: "sapAbap",
    sapBasis: "sapBasis",
    sapFico: "sapFico",
    sapHana: "sapHana",
    sapMm: "sapMm",
    sapSd: "sapSd",
    sapSuccessFactors: "sapSuccessFactors",
    servicenowDevelopment: "servicenowDevelopment",
    servicenowItsm: "servicenowItsm",
    uipathRpa: "uipathRpa",
    workday: "workday",
  }
);

// ======================================================
// IT - Software Testing & QA (13)
// ======================================================

const TESTING_PROMPTS = loadPrompts(
  "./domains/IT/Software Testing & QA",
  {
    apiTesting: "apiTesting",
    automationTesting: "automationTesting",
    cypress: "cypress",
    databaseTesting: "databaseTesting",
    jmeter: "jmeter",
    manualTesting: "manualTesting",
    mobileTesting: "mobileTesting",
    performanceTesting: "performanceTesting",
    playwright: "playwright",
    postman: "postman",
    securityTesting: "securityTesting",
    selenium: "selenium",
    testManagement: "testManagement",
  }
);

// ======================================================
// IT - Cybersecurity & Networking (13)
// ======================================================

const CYBERSECURITY_PROMPTS = loadPrompts(
  "./domains/IT/Cybersecurity & Networking",
  {
    applicationSecurity: "applicationSecurity",
    cloudSecurityCybersecurity: "cloudSecurity",
    computerNetworking: "computerNetworking",
    cybersecurity: "cybersecurity",
    ethicalHacking: "ethicalHacking",
    firewallAdministration: "firewallAdministration",
    iam: "iam",
    incidentResponse: "incidentResponse",
    networkAdministration: "networkAdministration",
    networkSecurity: "networkSecurity",
    penetrationTesting: "penetrationTesting",
    siem: "siem",
    socAnalyst: "socAnalyst",
  }
);

// ======================================================
// IT - Other IT (14)
// ======================================================

const OTHER_IT_PROMPTS = loadPrompts(
  "./domains/IT/Other IT",
  {
    androidDevelopment: "androidDevelopment",
    blockchainDevelopment: "blockchainDevelopment",
    desktopSupport: "desktopSupport",
    embeddedSystems: "embeddedSystems",
    figma: "figma",
    flutter: "flutter",
    iosDevelopment: "iosDevelopment",
    iot: "iot",
    itAssetManagement: "itAssetManagement",
    itHelpDesk: "itHelpDesk",
    itProjectManagement: "itProjectManagement",
    reactNative: "reactNative",
    technicalSupport: "technicalSupport",
    uiUxDesign: "uiUxDesign",
  }
);

// ======================================================
// NON-IT - Finance & Accounting (15)
// ======================================================

const FINANCE_PROMPTS = loadPrompts(
  "./domains/Non-IT/Finance & Accounting",
  {
    accounting: "accounting",
    recordToReport: "recordToReport",
    procureToPay: "procureToPay",
    orderToCash: "orderToCash",
    accountsPayable: "accountsPayable",
    accountsReceivable: "accountsReceivable",
    generalLedger: "generalLedger",
    financialReporting: "financialReporting",
    financialPlanningAnalysis: "financialPlanningAnalysis",
    taxation: "taxation",
    gst: "gst",
    internalAudit: "internalAudit",
    externalAudit: "externalAudit",
    payrollAccounting: "payrollAccounting",
    financialReconciliation: "financialReconciliation",
  }
);

// ======================================================
// NON-IT - Banking & Insurance (14)
// ======================================================

const BANKING_PROMPTS = loadPrompts(
  "./domains/Non-IT/Banking & Insurance",
  {
    bankingOperations: "bankingOperations",
    retailBanking: "retailBanking",
    corporateBanking: "corporateBanking",
    loanProcessing: "loanProcessing",
    creditAnalysis: "creditAnalysis",
    kyc: "kyc",
    aml: "aml",
    fraudDetection: "fraudDetection",
    paymentOperations: "paymentOperations",
    cardOperations: "cardOperations",
    insuranceClaims: "insuranceClaims",
    insuranceUnderwriting: "insuranceUnderwriting",
    riskManagement: "riskManagement",
    investmentOperations: "investmentOperations",
  }
);

// ======================================================
// NON-IT - Human Resources (11)
// ======================================================

const HR_PROMPTS = loadPrompts(
  "./domains/Non-IT/Human Resources",
  {
    hrGeneralist: "hrGeneralist",
    hrOperations: "hrOperations",
    recruitment: "recruitment",
    talentAcquisition: "talentAcquisition",
    itRecruitment: "itRecruitment",
    nonItRecruitment: "nonItRecruitment",
    payrollProcessing: "payrollProcessing",
    employeeRelations: "employeeRelations",
    learningAndDevelopment: "learningAndDevelopment",
    performanceManagement: "performanceManagement",
    hrCompliance: "hrCompliance",
  }
);

// ======================================================
// NON-IT - BPO, Customer Service & Support (13)
// ======================================================

const BPO_PROMPTS = loadPrompts(
  "./domains/Non-IT/BPO, Customer Service & Support",
  {
    bpoVoiceProcess: "bpoVoiceProcess",
    bpoNonVoiceProcess: "bpoNonVoiceProcess",
    domesticProcess: "domesticProcess",
    internationalProcess: "internationalProcess",
    customerService: "customerService",
    customerSupport: "customerSupport",
    technicalSupportProcess: "technicalSupportProcess",
    emailSupport: "emailSupport",
    chatSupport: "chatSupport",
    collections: "collections",
    telecalling: "telecalling",
    contactCenterOperations: "contactCenterOperations",
    qualityAnalystBpo: "qualityAnalystBpo",
  }
);

// ======================================================
// GENERAL PROMPT
// ======================================================

const GENERAL_PROMPT = `
You are answering an interview question.

- Understand the actual subject and context of the question.
- Explain the concept accurately and clearly.
- Structure the answer according to the question type.
- Include practical examples where useful.
- Do not force the answer into an unrelated domain.
- Never invent candidate qualifications, work experience, or project experience.
- If the question asks about personal experience, use only information provided in the interview context.
`.trim();

// ======================================================
// COMBINE ALL DOMAIN PROMPTS
// ======================================================

const DOMAIN_PROMPTS = {
  ...PROGRAMMING_PROMPTS,
  ...FRONTEND_PROMPTS,
  ...BACKEND_PROMPTS,
  ...DATABASE_PROMPTS,
  ...CLOUD_PROMPTS,
  ...DEVOPS_PROMPTS,
  ...DATA_PROMPTS,
  ...AI_PROMPTS,
  ...ENTERPRISE_PROMPTS,
  ...TESTING_PROMPTS,
  ...CYBERSECURITY_PROMPTS,
  ...OTHER_IT_PROMPTS,

  ...FINANCE_PROMPTS,
  ...BANKING_PROMPTS,
  ...HR_PROMPTS,
  ...BPO_PROMPTS,

  general: GENERAL_PROMPT,
};

// ======================================================
// PUBLIC FUNCTIONS
// ======================================================

function getDomainPrompt(domain) {
  return DOMAIN_PROMPTS[domain] || DOMAIN_PROMPTS.general;
}

function getAvailableDomains() {
  return Object.keys(DOMAIN_PROMPTS);
}

module.exports = {
  getDomainPrompt,
  getAvailableDomains,
};
