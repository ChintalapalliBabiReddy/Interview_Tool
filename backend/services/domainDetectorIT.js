// backend/services/domainDetectorIT.js

// Keyword rules and priority for IT interview specializations.



const DOMAIN_RULES = {

  // IT - Programming & Software Development

  springBoot: [/\bspring boot\b/i, /\bspring initializr\b/i, /\bspring actuator\b/i, /\bspring data jpa\b/i, /\bspring security\b/i, /\bspring mvc\b/i, /\bauto[- ]configuration\b/i],

  microservices: [/\bmicroservices?\b/i, /\bservice discovery\b/i, /\bapi gateway\b/i, /\bcircuit breaker\b/i, /\bsaga pattern\b/i, /\bservice mesh\b/i, /\bdistributed tracing\b/i],

  advancedJava: [/\badvanced java\b/i, /\bjdk\b/i, /\bjre\b/i, /\bservlets?\b/i, /\bjsp\b/i, /\bjdbc\b/i, /\bjstl\b/i, /\bweb containers?\b/i, /\bservlet filters?\b/i, /\brequestdispatcher\b/i],

  cpp: [/\bc\+\+/i, /\bcpp\b/i, /\bstandard template library\b/i, /\bstl\b/i, /\btemplates in c\+\+/i, /\boperator overloading\b/i, /\bvirtual functions?\b/i],

  csharp: [/\bc#\b/i, /\bcsharp\b/i, /\.net\b/i, /\basp\.net core\b/i, /\blinq\b/i, /\bdelegates?\b/i, /\basync await in c#\b/i],

  typescript: [/\btypescript\b/i, /\btsconfig\b/i, /\btype annotations?\b/i, /\btypescript interfaces?\b/i, /\bgenerics in typescript\b/i, /\butility types\b/i],

  javascript: [/\bjavascript\b/i, /\becmascript\b/i, /\bclosures?\b/i, /\bhoisting\b/i, /\bcall stack\b/i, /\bpromises?\b/i, /\basync\s*\/\s*await\b/i, /\bprototypes?\b/i, /\btemporal dead zone\b/i],

  python: [/\bpython\b/i, /\bpython programming\b/i, /\bpython lists?\b/i, /\bpython dictionaries\b/i, /\bpython decorators?\b/i, /\bpython generators?\b/i, /\bpandas\b/i, /\bnumpy\b/i, /\bscikit[-.]learn\b/i, /\bpep\s*8\b/i],

  java: [/\bjava\b/i, /\bjvm\b/i, /\bcollections framework\b/i, /\bjava collections\b/i, /\bmultithreading\b/i, /\bgarbage collection\b/i, /\blambda expressions?\b/i, /\bjava streams?\b/i, /\bhibernate\b/i, /\bmaven\b/i],

  c: [/\bc programming\b/i, /\blanguage c\b/i, /\bpointers? in c\b/i, /\bmalloc\b/i, /\bcalloc\b/i, /\bpreprocessor directives?\b/i, /\bheader files?\b/i],

  dataStructuresAlgorithms: [/\bdata structures?\b/i, /\balgorithms?\b/i, /\bbig[- ]o\b/i, /\bbinary search\b/i, /\blinked lists?\b/i, /\bstacks?\b/i, /\bqueues?\b/i, /\btrees?\b/i, /\bgraphs?\b/i, /\bdynamic programming\b/i, /\bsorting algorithms?\b/i],

  dart: [/\bdart language\b/i, /\bdart programming\b/i, /\bdart null safety\b/i, /\bdart\s+(?:async|isolates|collections|generics)\b/i],

  go: [/\bgolang\b/i, /\bgo language\b/i, /\bgoroutines?\b/i, /\bchannels in go\b/i, /\bgo routines?\b/i, /\bgo modules?\b/i],

  kotlin: [/\bkotlin\b/i, /\bcoroutines?\b/i, /\bnull safety in kotlin\b/i, /\bdata classes?\b/i, /\bsealed classes?\b/i],

  php: [/\bphp\b/i, /\bphp programming\b/i, /\bcomposer\b/i, /\blaravel\b/i, /\bsymfony\b/i, /\bphp namespaces?\b/i],

  ruby: [/\bruby\b/i, /\bruby on rails\b/i, /\brails\b/i, /\bruby gems?\b/i, /\bblocks and procs\b/i],

  rust: [/\brust language\b/i, /\brust programming\b/i, /\brust ownership and borrowing\b/i, /\bownership in rust\b/i, /\bborrow checker\b/i, /\blifetimes in rust\b/i, /\bcargo\b/i],

  scala: [/\bscala\b/i, /\bscala programming\b/i, /\bakka\b/i, /\bfunctional programming in scala\b/i],

  swift: [/\bswift language\b/i, /\bswift programming\b/i, /\bswift optionals\b/i, /\bswiftui\b/i, /\boptionals in swift\b/i, /\bcombine framework\b/i],

  systemDesign: [/\bsystem design\b/i, /\bhigh[- ]level design\b/i, /\blow[- ]level design\b/i, /\bscalability\b/i, /\bload balancing\b/i, /\bsharding\b/i, /\bcaching strategy\b/i, /\bdesign a\b/i],



  // IT - Frontend Development

  frontendPerformance: [/\bfrontend performance\b/i, /\bweb performance\b/i, /\bcore web vitals\b/i, /\blargest contentful paint\b/i, /\bcumulative layout shift\b/i, /\bfirst input delay\b/i, /\blazy loading\b/i, /\bcode splitting\b/i],

  nextjs: [/\bnext\.?js\b/i, /\bnextjs\b/i, /\bapp router\b/i, /\bpages router\b/i, /\bserver components?\b/i, /\bgetserversideprops\b/i, /\bgetstaticprops\b/i],

  tailwindCss: [/\btailwind(?:\s\*css)?\b/i, /\butility[- ]first css\b/i, /\btailwind config\b/i],

  angular: [/\bangular\b/i, /\bangular cli\b/i, /\bangular services?\b/i, /\bangular directives?\b/i, /\brxjs\b/i, /\bngmodules?\b/i],

  react: [/\breact(?:\.js)?\b/i, /\breact hooks?\b/i, /\bjsx\b/i, /\buseState\b/i, /\buseEffect\b/i, /\bvirtual dom\b/i, /\breact context\b/i],

  redux: [/\bredux\b/i, /\bredux toolkit\b/i, /\bcreateSlice\b/i, /\buseSelector\b/i, /\buseDispatch\b/i, /\b redux saga\b/i],

  vue: [/\bvue(?:\.js)?\b/i, /\bvuex\b/i, /\bpinia\b/i, /\bcomposition api\b/i, /\bvue directives?\b/i],

  css: [/\bcss\b/i, /\bcascading style sheets\b/i, /\bflexbox\b/i, /\bcss grid\b/i, /\bmedia queries\b/i, /\bpseudo[- ]classes\b/i, /\bspecificity\b/i],

  html: [/\bhtml\b/i, /\bhtml5\b/i, /\bsemantic html\b/i, /\bdom\b/i, /\bhtml forms?\b/i, /\baccessibility attributes\b/i],

  bootstrap: [/\bbootstrap\b/i, /\bbootstrap grid\b/i, /\bbootstrap components?\b/i, /\bbootstrap utilities\b/i],



  // IT - Backend & API Development

  aspnetCore: [/\basp\.net core\b/i, /\baspnet core\b/i, /\bentity framework core\b/i, /\bmiddleware in .net\b/i, /\bminimal apis?\b/i],

  nestjs: [/\bnestjs\b/i, /\bnest\.js\b/i, /\bmodules in nest\b/i, /\bproviders in nest\b/i, /\bguards in nest\b/i],

  fastapi: [/\bfastapi\b/i, /\bpydantic\b/i, /\bfastapi dependencies\b/i, /\buvicorn\b/i],

  django: [/\bdjango\b/i, /\bdjango rest framework\b/i, /\bdrf\b/i, /\bdjango models?\b/i, /\bdjango middleware\b/i],

  flask: [/\bflask\b/i, /\bflask blueprints?\b/i, /\bflask extensions?\b/i, /\bwerkzeug\b/i],

  express: [/\bexpress(?:\.js)?\b/i, /\bexpress middleware\b/i, /\bexpress router\b/i, /\bapp\.use\b/i],

  nodejs: [/\bnode\.?js\b/i, /\bnodejs\b/i, /\bnpm\b/i, /\bcommonjs\b/i, /\bevent[- ]driven architecture\b/i, /\bnode(?:\.js)? event loop\b/i],

  graphql: [/\bgraphql\b/i, /\bgraphql schema\b/i, /\bqueries and mutations\b/i, /\bresolvers?\b/i, /\bsubscriptions in graphql\b/i],

  restApis: [/\brest(?:ful)? apis?\b/i, /\brest architecture\b/i, /\bhttp methods\b/i, /\bstatus codes\b/i, /\bapi versioning\b/i, /\bidempotency\b/i],

  apiSecurity: [/\bapi security\b/i, /\boauth\s*2\.?0\b/i, /\bopenid connect\b/i, /\bapi authentication\b/i, /\bapi authorization\b/i, /\brate limiting\b/i, /\bjwt\b/i],



  // IT - Databases

  databasePerformanceTuning: [/\bdatabase performance\b/i, /\bquery optimization\b/i, /\bexecution plan\b/i, /\bindex tuning\b/i, /\bslow queries\b/i, /\bdatabase indexing\b/i, /\bquery plan\b/i],

  databaseAdministration: [/\bdatabase administration\b/i, /\bdba\b/i, /\bdatabase backup\b/i, /\bdatabase recovery\b/i, /\bdatabase replication\b/i, /\buser privileges\b/i],

  postgresql: [/\bpostgres(?:ql)?\b/i, /\bplpgsql\b/i, /\bpostgres extensions\b/i, /\bjsonb\b/i],

  sqlServer: [/\bsql server\b/i, /\bmicrosoft sql server\b/i, /\btsql\b/i, /\bsql server agent\b/i, /\bssms\b/i],

  oracleDatabase: [/\boracle database\b/i, /\boracle sql\b/i, /\bdataguard\b/i, /\brman\b/i, /\basm in oracle\b/i],

  mongodb: [/\bmongodb\b/i, /\bmongo db\b/i, /\bmongoose\b/i, /\baggregation pipeline\b/i, /\bbson\b/i],

  cassandra: [/\bcassandra\b/i, /\bapache cassandra\b/i, /\bcql\b/i, /\bcassandra partition key\b/i],

  mysql: [/\bmysql\b/i, /\binno db\b/i, /\bmysql workbench\b/i, /\bmysql replication\b/i],

  redis: [/\bredis\b/i, /\bredis cache\b/i, /\bredis streams\b/i, /\bredisson\b/i, /\bredis pub\/sub\b/i],

  plsql: [/\bpl\s*\/?\s*sql\b/i, /\bplsql\b/i, /\bstored procedures?\b/i, /\bpackages in oracle\b/i, /\btriggers in oracle\b/i],

  sql: [/\bsql\b/i, /\bjoins?\b/i, /\bgroup by\b/i, /\bhaving clause\b/i, /\bsubqueries\b/i, /\bnormalization\b/i, /\bsql transactions?\b/i],



  // IT - Cloud Computing

  azureAiFoundry: [/\bazure ai foundry\b/i, /\bai foundry\b/i, /\bazure ai studio\b/i, /\bmodel catalog\b/i, /\bprompt flow\b/i],

  azureOpenAI: [/\bazure openai\b/i, /\bazure ai openai\b/i, /\bopenai service on azure\b/i, /\bazure deployments?\b/i],

  cloudArchitecture: [/\bcloud architecture\b/i, /\bwell[- ]architected\b/i, /\bcloud design patterns?\b/i, /\bmulti[- ]cloud architecture\b/i],

  cloudMigration: [/\bcloud migration\b/i, /\blift and shift\b/i, /\bapplication migration\b/i, /\bmigration assessment\b/i, /\bcloud adoption framework\b/i],

  cloudNetworking: [/\bcloud networking\b/i, /\bvirtual network\b/i, /\bvpc\b/i, /\bsubnets?\b/i, /\bprivate link\b/i, /\btransit gateway\b/i],

  cloudSecurity: [/\bcloud security\b/i, /\bcloud iam\b/i, /\bcloud posture\b/i, /\bshared responsibility model\b/i, /\bcloud encryption\b/i],

  serverlessComputing: [/\bserverless\b/i, /\bserverless computing\b/i, /\baws lambda\b/i, /\bazure functions\b/i, /\bcloud functions\b/i],

  googleCloud: [/\bgoogle cloud\b/i, /\bgcp\b/i, /\bcloud run\b/i, /\bcloud storage\b/i, /\bbigquery\b/i, /\bgke\b/i],

  azure: [/\bmicrosoft azure\b/i, /\bazure\b/i, /\bazure app service\b/i, /\bazure storage\b/i, /\bazure functions\b/i, /\baks\b/i],

  aws: [/\baws\b/i, /\bamazon web services\b/i, /\bec2\b/i, /\bs3 bucket\b/i, /\biam role\b/i, /\bcloudformation\b/i],



  // IT - DevOps & Infrastructure

  monitoringObservability: [/\bobservability\b/i, /\bprometheus\b/i, /\bgrafana\b/i, /\belk stack\b/i, /\bopentelemetry\b/i, /\bdistributed tracing\b/i],

  platformEngineering: [/\bplatform engineering\b/i, /\binternal developer platform\b/i, /\bidp\b/i, /\bdeveloper self[- ]service\b/i, /\bbackstage\b/i],

  githubActions: [/\bgithub actions\b/i, /\bworkflow yml\b/i, /\bgithub workflows\b/i, /\bactions runners?\b/i],

  azureDevOps: [/\bazure devops\b/i, /\bazure pipelines\b/i, /\bazure repos\b/i, /\bazure boards\b/i, /\bazure artifacts\b/i],

  kubernetes: [/\bkubernetes\b/i, /\bk8s\b/i, /\bpods?\b/i, /\bdeployments in kubernetes\b/i, /\bingress controller\b/i, /\bstatefulsets?\b/i],

  terraform: [/\bterraform\b/i, /\binfrastructure as code\b/i, /\btfstate\b/i, /\bterraform modules?\b/i, /\bterraform providers?\b/i],

  ansible: [/\bansible\b/i, /\bansible playbooks?\b/i, /\bansible roles?\b/i, /\binventory files\b/i],

  argoCd: [/\bargo ?cd\b/i, /\bargocd\b/i, /\bgitops\b/i, /\bargo applications?\b/i],

  cicd: [/\bci\s*\/?\s*cd\b/i, /\bcontinuous integration\b/i, /\bcontinuous delivery\b/i, /\bcontinuous deployment\b/i, /\bdeployment pipeline\b/i],

  devops: [/\bdevops\b/i, /\bdevsecops\b/i, /\bdeployment strategies\b/i, /\bblue[- ]green deployment\b/i],

  docker: [/\bdocker\b/i, /\bcontainers?\b/i, /\bdockerfile\b/i, /\bdocker compose\b/i, /\bcontainer images?\b/i],

  helm: [/\bhelm charts?\b/i, /\bkubernetes helm\b/i, /\bhelm releases?\b/i],

  jenkins: [/\bjenkins\b/i, /\bjenkins pipeline\b/i, /\bjenkinsfile\b/i, /\bjenkins agents?\b/i],

  linux: [/\blinux\b/i, /\bbash shell\b/i, /\blinux commands?\b/i, /\bfile permissions\b/i, /\bsystemd\b/i],

  shellScripting: [/\bshell scripting\b/i, /\bbash scripting\b/i, /\bshell scripts?\b/i, /\bawk\b/i, /\bsed command\b/i],

  sre: [/\bsite reliability engineering\b/i, /\bsre\b/i, /\berror budgets?\b/i, /\bservice level objectives?\b/i, /\btoil\b/i],



  // IT - Data Analytics & Engineering

  apacheAirflow: [/\bapache airflow\b/i, /\bairflow\b/i, /\bdags?\b/i, /\bairflow operators?\b/i, /\bairflow scheduler\b/i],

  apacheKafka: [/\bapache kafka\b/i, /\bkafka\b/i, /\bkafka consumer\b/i, /\bkafka producer\b/i, /\bconsumer groups?\b/i, /\bkafka topics?\b/i],

  apacheSpark: [/\bapache spark\b/i, /\bspark sql\b/i, /\bspark streaming\b/i, /\brdd\b/i],

  pyspark: [/\bpyspark\b/i, /\bspark dataframe\b/i, /\bpyspark transformations\b/i],

  databricks: [/\bdatabricks\b/i, /\bdelta lake\b/i, /\bdatabricks notebooks?\b/i, /\bunity catalog\b/i],

  snowflake: [/\bsnowflake\b/i, /\bsnowflake warehouse\b/i, /\bsnowpipe\b/i, /\bstreams and tasks\b/i],

  powerBi: [/\bpower bi\b/i, /\bdax\b/i, /\bpower query\b/i, /\bpowerbi\b/i, /\bpower bi service\b/i],

  tableau: [/\btableau\b/i, /\btableau desktop\b/i, /\btableau server\b/i, /\btableau prep\b/i],

  dataEngineering: [/\bdata engineering\b/i, /\bdata pipelines?\b/i, /\bbatch processing\b/i, /\bstream processing\b/i, /\bdata ingestion\b/i],

  dataWarehousing: [/\bdata warehousing\b/i, /\bdata warehouse\b/i, /\bdimensional modeling\b/i, /\bstar schema\b/i, /\bsnowflake schema\b/i],

  dataModeling: [/\bdata modeling\b/i, /\bentity relationship\b/i, /\ber diagram\b/i, /\bnormal forms?\b/i, /\blogical data model\b/i],

  dataGovernance: [/\bdata governance\b/i, /\bdata quality\b/i, /\bdata lineage\b/i, /\bdata catalog\b/i, /\bdata stewardship\b/i],

  etlElt: [/\betl\b/i, /\belt\b/i, /\bextract transform load\b/i, /\bextract load transform\b/i, /\bdata transformation\b/i],

  businessIntelligence: [/\bbusiness intelligence\b/i, /\bbi reporting\b/i, /\bmanagement dashboards?\b/i, /\bkpi dashboards?\b/i],

  dataAnalyst: [/\bdata analyst\b/i, /\bdata analysis\b/i, /\bexploratory data analysis\b/i, /\bstatistical analysis\b/i],

  advancedExcel: [/\badvanced excel\b/i, /\bpivot tables?\b/i, /\bxlookup\b/i, /\bvlookup\b/i, /\bpower pivot\b/i, /\bexcel macros?\b/i],



  // IT - AI, ML & Generative AI

  aiModelEvaluation: [/\bmodel evaluation\b/i, /\bllm evaluation\b/i, /\bevaluation metrics\b/i, /\bprecision and recall\b/i, /\brouge\b/i, /\bbleu score\b/i, /\bfaithfulness\b/i],

  aiAgents: [/\bai agents?\b/i, /\bagentic ai\b/i, /\bautonomous agents?\b/i, /\btool calling\b/i, /\bfunction calling\b/i, /\bmulti[- ]agent\b/i],

  artificialIntelligence: [/\bartificial intelligence\b/i, /\bai fundamentals\b/i, /\bknowledge representation\b/i, /\bsearch algorithms in ai\b/i],

  computerVision: [/\bcomputer vision\b/i, /\bimage classification\b/i, /\bobject detection\b/i, /\bimage segmentation\b/i, /\bopencv\b/i, /\bconvolutional neural networks?\b/i],

  deepLearning: [/\bdeep learning\b/i, /\bneural networks?\b/i, /\bbackpropagation\b/i, /\bcnn\b/i, /\brnn\b/i, /\blstm\b/i],

  generativeAi: [/\bgenerative ai\b/i, /\bgenai\b/i, /\btext generation\b/i, /\bimage generation\b/i, /\bdiffusion models?\b/i],

  langchain: [/\blangchain\b/i, /\blanggraph\b/i, /\blangchain chains?\b/i, /\blangchain agents?\b/i],

  largeLanguageModels: [/\blarge language models?\b/i, /\bllms?\b/i, /\btransformers?\b/i, /\btokenization\b/i, /\battention mechanism\b/i],

  machineLearning: [/\bmachine learning\b/i, /\bsupervised learning\b/i, /\bunsupervised learning\b/i, /\breinforcement learning\b/i, /\bfeature engineering\b/i],

  mlops: [/\bmlops\b/i, /\bmodel deployment\b/i, /\bmodel monitoring\b/i, /\bmodel registry\b/i, /\bml pipelines?\b/i],

  modelFineTuning: [/\bfine[- ]tuning\b/i, /\bmodel fine tuning\b/i, /\bloRA\b/i, /\bqlora\b/i, /\bparameter[- ]efficient fine[- ]tuning\b/i],

  nlp: [/\bnatural language processing\b/i, /\bnlp\b/i, /\bnamed entity recognition\b/i, /\btext classification\b/i, /\bsentiment analysis\b/i, /\bstemming\b/i],

  promptEngineering: [/\bprompt engineering\b/i, /\bsystem prompt\b/i, /\bfew[- ]shot prompting\b/i, /\bchain of thought\b/i, /\bprompt injection\b/i],

  rag: [/\bretrieval augmented generation\b/i, /\brag\b/i, /\bchunking\b/i, /\bretrieval pipeline\b/i, /\bhybrid search\b/i],

  vectorDatabases: [/\bvector databases?\b/i, /\bvector store\b/i, /\bembeddings?\b/i, /\bpinecone\b/i, /\bweaviate\b/i, /\bchroma(?:db)?\b/i, /\bmilvus\b/i],



  // IT - Enterprise Applications

  oracleFusionFinancials: [/\boracle fusion financials\b/i, /\boracle financials cloud\b/i, /\boracle fusion general ledger\b/i],

  oracleFusionHcm: [/\boracle fusion hcm\b/i, /\boracle hcm cloud\b/i, /\bworkforce structures in oracle\b/i],

  oracleFusionScm: [/\boracle fusion scm\b/i, /\boracle scm cloud\b/i, /\bsupply chain management cloud\b/i],

  salesforceDeveloper: [/\bsalesforce developer\b/i, /\bapex\b/i, /\blightning web components?\b/i, /\bvisualforce\b/i, /\bsoql\b/i, /\bsosl\b/i],

  salesforceAdmin: [/\bsalesforce admin\b/i, /\bsalesforce administration\b/i, /\bflows in salesforce\b/i, /\bprofiles and permission sets\b/i, /\bobjects and fields\b/i],

  servicenowDevelopment: [/\bservicenow application development\b/i, /\bservicenow development\b/i, /\bservicenow scripting\b/i, /\bscript includes?\b/i, /\bservicenow business rules?\b/i, /\bservicenow client scripts?\b/i],

  servicenowItsm: [/\bservicenow itsm\b/i, /\bit service management\b/i, /\bincident management in servicenow\b/i, /\bproblem management in servicenow\b/i, /\bchange management in servicenow\b/i],

  sapSuccessFactors: [/\bsap successfactors\b/i, /\bsuccess factors\b/i, /\bemployees central\b/i, /\bsap ec\b/i],

  microsoftDynamics365: [/\bmicrosoft dynamics\b/i, /\bdynamics 365\b/i, /\bd365\b/i, /\bpower platform\b/i],

  oracleEbs: [/\boracle e[- ]business suite\b/i, /\boracle ebs\b/i, /\boracle apps\b/i, /\boracle forms\b/i],

  sapAbap: [/\bsap abap\b/i, /\babap\b/i, /\bsmartforms?\b/i, /\buser exits?\b/i, /\bbadis\b/i, /\bcds views?\b/i],

  sapBasis: [/\bsap basis\b/i, /\bsap system administration\b/i, /\btransport management system\b/i, /\bstms\b/i, /\bsap kernel\b/i],

  sapFico: [/\bsap fico\b/i, /\bsap fi\b/i, /\bsap co\b/i, /\bfinancial accounting in sap\b/i],

  sapHana: [/\bsap hana\b/i, /\bsap s\/4hana\b/i, /\bs4hana\b/i, /\bhana studio\b/i],

  sapMm: [/\bsap mm\b/i, /\bmaterials management\b/i, /\bpurchasing in sap\b/i, /\binventory management in sap\b/i],

  sapSd: [/\bsap sd\b/i, /\bsales and distribution in sap\b/i, /\bpricing in sap sd\b/i, /\bshipping in sap\b/i],

  uipathRpa: [/\buipath\b/i, /\brpa\b/i, /\brobotic process automation\b/i, /\buipath orchestrator\b/i],

  workday: [/\bworkday\b/i, /\bworkday hcm\b/i, /\bworkday integrations?\b/i, /\beib\b/i],



  // IT - Software Testing & QA

  automationTesting: [/\bautomation testing\b/i, /\btest automation\b/i, /\bautomation framework\b/i, /\bpage object model\b/i],

  performanceTesting: [/\bperformance testing\b/i, /\bload testing\b/i, /\bstress testing\b/i, /\bsoak testing\b/i, /\bthroughput\b/i, /\blatency testing\b/i],

  securityTesting: [/\bsecurity testing\b/i, /\bvulnerability testing\b/i, /\bpenetration testing\b/i, /\bstatic application security testing\b/i, /\bsast\b/i, /\bdast\b/i],

  databaseTesting: [/\bdatabase testing\b/i, /\bdata validation testing\b/i, /\bsql testing\b/i, /\bbackend data testing\b/i],

  mobileTesting: [/\bmobile application testing\b/i, /\bmobile testing\b/i, /\bandroid testing\b/i, /\bios testing\b/i, /\bappium\b/i, /\bmobile automation\b/i],

  apiTesting: [/\bapi testing\b/i, /\bapi test cases?\b/i, /\bapi validation\b/i, /\brequest response validation\b/i],

  testManagement: [/\btest management\b/i, /\btest plan\b/i, /\btest strategy\b/i, /\btest cases? management\b/i, /\bdefect lifecycle\b/i],

  playwright: [/\bplaywright\b/i, /\bplaywright fixtures?\b/i, /\bplaywright locators?\b/i, /\bplaywright tests?\b/i],

  cypress: [/\bcypress\b/i, /\bcypress commands?\b/i, /\bcypress fixtures?\b/i, /\bcypress intercept\b/i],

  selenium: [/\bselenium\b/i, /\bwebdriver\b/i, /\bselenium grid\b/i, /\bselenium webdriver\b/i],

  postman: [/\bpostman\b/i, /\bpostman collections?\b/i, /\bnewman\b/i, /\bpostman environments?\b/i],

  jmeter: [/\bjmeter\b/i, /\bapache jmeter\b/i, /\btest plans in jmeter\b/i, /\bthread groups?\b/i],

  manualTesting: [/\bmanual testing\b/i, /\btest scenarios?\b/i, /\btest execution\b/i, /\bsmoke testing\b/i, /\bsanity testing\b/i, /\bregression testing\b/i],



  // IT - Cybersecurity & Networking

  applicationSecurity: [/\bapplication security\b/i, /\bsecure coding\b/i, /\bowasp\b/i, /\bsql injection\b/i, /\bcross[- ]site scripting\b/i, /\bxss\b/i],

  cloudSecurityCybersecurity: [/\bcloud posture management\b/i, /\bcloud security posture\b/i, /\bcloud workload protection\b/i],

  penetrationTesting: [/\bpenetration testing\b/i, /\bpentest\b/i, /\bmetasploit\b/i, /\bburp suite\b/i],

  incidentResponse: [/\bincident response\b/i, /\bsecurity incident\b/i, /\bincident handling\b/i, /\bcontainment and eradication\b/i, /\bforensic investigation\b/i],

  firewallAdministration: [/\bfirewall administration\b/i, /\bfirewall rules?\b/i, /\bnext[- ]generation firewall\b/i, /\bpalo alto\b/i, /\bfortigate\b/i],

  networkSecurity: [/\bnetwork security\b/i, /\bids\/ips\b/i, /\bintrusion detection\b/i, /\bnetwork segmentation\b/i, /\bvpn security\b/i],

  computerNetworking: [/\bcomputer networking\b/i, /\bosi model\b/i, /\btcp\/ip\b/i, /\bdns\b/i, /\bdhcp\b/i, /\bsubnetting\b/i, /\brouting protocols?\b/i],

  networkAdministration: [/\bnetwork administration\b/i, /\bnetwork administrator\b/i, /\brouter configuration\b/i, /\bswitch configuration\b/i, /\bvlan\b/i],

  ethicalHacking: [/\bethical hacking\b/i, /\bhacking methodologies\b/i, /\breconnaissance\b/i, /\bvulnerability assessment\b/i],

  cybersecurity: [/\bcybersecurity\b/i, /\binformation security\b/i, /\binfosec\b/i, /\bsecurity controls\b/i, /\bsecurity policies\b/i],

  iam: [/\bidentity and access management\b/i, /\biam\b/i, /\bidentity management\b/i, /\baccess management\b/i, /\brbac\b/i, /\bsso\b/i, /\bkeycloak\b/i, /\bforgerock\b/i],

  siem: [/\bsiem\b/i, /\bsplunk\b/i, /\bqradar\b/i, /\blog correlation\b/i, /\bsecurity event monitoring\b/i],

  socAnalyst: [/\bsoc analyst\b/i, /\bsecurity operations center\b/i, /\bsoc operations\b/i, /\balert triage\b/i],



  // IT - Other IT

  itProjectManagement: [/\bit project management\b/i, /\btechnical project manager\b/i, /\bagile project management\b/i, /\bscrum master\b/i, /\bsprint planning\b/i],

  itAssetManagement: [/\bit asset management\b/i, /\basset lifecycle\b/i, /\bcmdb\b/i, /\bsoftware asset management\b/i, /\blicense management\b/i],

  desktopSupport: [/\bdesktop support\b/i, /\bdesktop troubleshooting\b/i, /\bwindows support\b/i, /\bcomputer hardware support\b/i],

  technicalSupport: [/\btechnical support troubleshooting process\b/i, /\btechnical issue resolution\b/i, /\broot cause analysis\b/i],

  itHelpDesk: [/\bit help ?desk\b/i, /\bhelp ?desk\b/i, /\bservice desk\b/i, /\buser support tickets?\b/i],

  androidDevelopment: [/\bandroid activity lifecycle\b/i, /\bandroid development\b/i, /\bandroid sdk\b/i, /\bandroid studio\b/i, /\bjetpack compose\b/i],

  iosDevelopment: [/\bios application development\b/i, /\bios development\b/i, /\bswiftui\b/i, /\bxcode\b/i, /\buikit\b/i, /\bapp store connect\b/i],

  flutter: [/\bflutter\b/i, /\bdart and flutter\b/i, /\bflutter widgets?\b/i, /\bflutter bloc\b/i],

  reactNative: [/\breact native\b/i, /\bexpo\b/i, /\bmetro bundler\b/i, /\breact native bridge\b/i],

  embeddedSystems: [/\bembedded systems?\b/i, /\bmicrocontrollers?\b/i, /\bfirmware\b/i, /\brtos\b/i, /\bembedded c\b/i],

  iot: [/\binternet of things\b/i, /\biot\b/i, /\bmqtt\b/i, /\bedge devices?\b/i, /\biot protocols?\b/i],

  blockchainDevelopment: [/\bblockchain\b/i, /\bsmart contracts?\b/i, /\bsolidity\b/i, /\bethereum\b/i, /\bweb3\b/i],

  uiUxDesign: [/\bui\/ux\b/i, /\bux design\b/i, /\buser experience\b/i, /\buser interface design\b/i, /\busability testing\b/i, /\bwireframes?\b/i],

  figma: [/\bfigma\b/i, /\bfigma components?\b/i, /\bfigma auto layout\b/i, /\bdesign systems?\b/i],

};



const DOMAIN_PRIORITY = [

  // IT - Programming

  "springBoot", "microservices", "advancedJava", "aspnetCore", "cpp", "csharp", "typescript",

  "nodejs", "javascript", "python", "java", "c", "machineLearning", "dataStructuresAlgorithms", "dart",

  "go", "kotlin", "php", "ruby", "rust", "scala", "swift", "systemDesign",



  // IT - Frontend

  "frontendPerformance", "nextjs", "tailwindCss", "angular", "redux", "reactNative", "react",

  "vue", "css", "html", "bootstrap",



  // IT - Backend

  "nestjs", "fastapi", "django", "flask", "express",

  "graphql", "apiSecurity", "restApis",



  // IT - Databases

  "databasePerformanceTuning", "databaseAdministration", "postgresql", "sqlServer",

  "oracleDatabase", "mongodb", "cassandra", "mysql", "redis", "plsql", "sql",



  // IT - Cloud

  "azureAiFoundry", "azureOpenAI", "azureDevOps", "cloudArchitecture", "cloudMigration",

  "cloudNetworking", "cloudSecurityCybersecurity", "cloudSecurity", "serverlessComputing", "googleCloud", "azure", "aws",



  // IT - DevOps

  "mlops", "monitoringObservability", "platformEngineering", "githubActions",

  "kubernetes", "terraform", "ansible", "argoCd", "cicd", "devops", "docker", "shellScripting",

  "helm", "jenkins", "linux", "sre",



  // IT - Data

  "apacheAirflow", "apacheKafka", "apacheSpark", "pyspark", "databricks",

  "snowflake", "powerBi", "tableau", "dataEngineering", "dataWarehousing",

  "dataModeling", "dataGovernance", "etlElt", "businessIntelligence", "dataAnalyst",

  "advancedExcel",



  // IT - AI/ML

  "aiModelEvaluation", "aiAgents", "artificialIntelligence", "computerVision",

  "deepLearning", "rag", "generativeAi", "langchain", "nlp", "largeLanguageModels",

  "modelFineTuning",

  "promptEngineering", "vectorDatabases",



  // IT - Enterprise Applications

  "oracleFusionFinancials", "oracleFusionHcm", "oracleFusionScm",

  "salesforceDeveloper", "salesforceAdmin", "servicenowDevelopment",

  "servicenowItsm", "sapSuccessFactors", "microsoftDynamics365", "oracleEbs",

  "sapAbap", "sapBasis", "sapFico", "sapHana", "sapMm", "sapSd", "uipathRpa", "workday",



  // IT - Testing & QA

  "automationTesting", "jmeter", "performanceTesting", "penetrationTesting", "securityTesting", "databaseTesting",

  "mobileTesting", "apiTesting", "testManagement", "playwright", "cypress",

  "selenium", "postman", "manualTesting",



  // IT - Cybersecurity & Networking

  "applicationSecurity", "ethicalHacking",

  "incidentResponse", "firewallAdministration", "networkSecurity",

  "networkAdministration", "computerNetworking", "cybersecurity", "iam", "siem", "socAnalyst",



  // IT - Other

  "itProjectManagement", "itAssetManagement", "desktopSupport",

  "technicalSupport", "itHelpDesk", "androidDevelopment", "iosDevelopment", "flutter", "reactNative",

  "embeddedSystems", "iot", "blockchainDevelopment", "uiUxDesign", "figma",

];



function detectITDomain(question) {

  const text = String(question || "").trim();



  if (!text) return null;



  for (const domain of DOMAIN_PRIORITY) {

    const rules = DOMAIN_RULES[domain] || [];



    if (rules.some((rule) => rule.test(text))) {

      return domain;

    }

  }



  return null;

}



module.exports = {

  DOMAIN_RULES,

  DOMAIN_PRIORITY,

  detectITDomain,

};