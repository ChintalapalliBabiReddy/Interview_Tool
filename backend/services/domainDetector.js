
const DOMAIN_RULES = {
  react: [
    /\breact(?:\.js)?\b/i,
    /\bjsx\b/i,
    /\btsx\b/i,
    /\breact hooks?\b/i,
    /\buse(state|effect|context|memo|callback|ref|reducer|layoutEffect)\b/i,
    /\bvirtual dom\b/i,
    /\breact dom\b/i,
    /\breact router\b/i,
    /\bredux\b/i,
    /\bcontext api\b/i,
    /\breact rendering\b/i,
    /\breact component\b/i,
  ],

  javascript: [
    /\bjavascript\b/i,
    /\becmascript\b/i,
    /\bclosure(s)?\b/i,
    /\bhoisting\b/i,
    /\bevent loop\b/i,
    /\bcall stack\b/i,
    /\bpromises?\b/i,
    /\basync\s*\/\s*await\b/i,
    /\bprototypes?\b/i,
    /\bprototype inheritance\b/i,
    /\bthis keyword\b/i,
    /\b(call|apply|bind) methods?\b/i,
    /\b(var|let|const)\s+[a-z_$][\w$]*/i,
    /\bspread operator\b/i,
    /\bdestructuring\b/i,
    /\btemporal dead zone\b/i,
    /\bexecution context\b/i,
    /\bprimitive data types?\b/i,
  ],

  java: [
    /\bjava\b/i,
    /\bcore java\b/i,
    /\badvanced java\b/i,
    /\bjvm\b/i,
    /\bjre\b/i,
    /\bjdk\b/i,
    /\bobject oriented programming\b/i,
    /\bmultithreading\b/i,
    /\bcollections framework\b/i,
    /\bjava collections\b/i,
    /\bexception handling\b/i,
    /\bservlets?\b/i,
    /\bjdbc\b/i,
    /\bspring boot\b/i,
    /\bspring framework\b/i,
    /\bhibernate\b/i,
    /\bmaven\b/i,
  ],

  python: [
    /\bpython\b/i,
    /\bpython programming\b/i,
    /\bpython lists?\b/i,
    /\bpython dictionaries\b/i,
    /\bpython tuples?\b/i,
    /\bpython decorators?\b/i,
    /\bpython generators?\b/i,
    /\bpandas\b/i,
    /\bnumpy\b/i,
    /\bscikit.learn\b/i,
    /\bflask\b/i,
    /\bdjango\b/i,
    /\bpythonic\b/i,
    /\bself parameter\b/i,
    /\bpep\s*8\b/i,
  ],

  aiml: [
    /\bartificial intelligence\b/i,
    /\bmachine learning\b/i,
    /\bai\/ml\b/i,
    /\bdeep learning\b/i,
    /\bsupervised learning\b/i,
    /\bunsupervised learning\b/i,
    /\breinforcement learning\b/i,
    /\bneural networks?\b/i,
    /\bclassification\b/i,
    /\bregression algorithms?\b/i,
    /\bclustering\b/i,
    /\bdecision trees?\b/i,
    /\brandom forests?\b/i,
    /\bmodel training\b/i,
    /\bmodel evaluation\b/i,
    /\bfeature engineering\b/i,
    /\bcomputer vision\b/i,
    /\bnatural language processing\b/i,
    /\bnlp\b/i,
  ],

  genai: [
    /\bgenerative ai\b/i,
    /\bgenai\b/i,
    /\blarge language models?\b/i,
    /\bllms?\b/i,
    /\bprompt engineering\b/i,
    /\bretrieval augmented generation\b/i,
    /\brag\b/i,
    /\bembeddings?\b/i,
    /\bvector databases?\b/i,
    /\bvector search\b/i,
    /\bfine tuning\b/i,
    /\bfine-tuning\b/i,
    /\btokenization\b/i,
    /\btransformers?\b/i,
    /\bopenai\b/i,
    /\bgpt[-\s]?\d/i,
    /\bai agents?\b/i,
    /\bsemantic search\b/i,
  ],

  testing: [
    /\bsoftware testing\b/i,
    /\bunit testing\b/i,
    /\bintegration testing\b/i,
    /\bautomation testing\b/i,
    /\bmanual testing\b/i,
    /\bregression testing\b/i,
    /\bsmoke testing\b/i,
    /\bsanity testing\b/i,
    /\bapi testing\b/i,
    /\bperformance testing\b/i,
    /\bload testing\b/i,
    /\btest cases?\b/i,
    /\btest scenarios?\b/i,
    /\btest automation\b/i,
    /\bselenium\b/i,
    /\bcypress\b/i,
    /\bplaywright\b/i,
    /\bjunit\b/i,
    /\btestng\b/i,
    /\bjest\b/i,
    /\bmocha\b/i,
    /\bpytest\b/i,
    /\bkarate framework\b/i,
    /\bpostman\b/i,
    /\btdd\b/i,
    /\bbdd\b/i,
  ],

  nodejs: [
    /\bnode\.?js\b/i,
    /\bnodejs\b/i,
    /\bnode runtime\b/i,
    /\bexpress\.?js\b/i,
    /\bexpress framework\b/i,
    /\bnpm\b/i,
    /\bnpx\b/i,
    /\bcommonjs\b/i,
    /\bnode modules\b/i,
    /\bnode event loop\b/i,
    /\bfs module\b/i,
    /\bhttp module\b/i,
    /\bmiddleware\b/i,
    /\bnode server\b/i,
  ],

  devops: [
    /\bdevops\b/i,
    /\bci\/cd\b/i,
    /\bcontinuous integration\b/i,
    /\bcontinuous delivery\b/i,
    /\bcontinuous deployment\b/i,
    /\bdocker\b/i,
    /\bkubernetes\b/i,
    /\bk8s\b/i,
    /\bjenkins\b/i,
    /\bgithub actions\b/i,
    /\bazure devops\b/i,
    /\bterraform\b/i,
    /\bansible\b/i,
    /\bhelm\b/i,
    /\bcontainerization\b/i,
    /\bcontainer orchestration\b/i,
    /\bdeployment pipeline\b/i,
    /\binfrastructure as code\b/i,
    /\bmonitoring tools\b/i,
    /\bprometheus\b/i,
    /\bgrafana\b/i,
  ],
};

function detectDomain(question, previousDomain = "general") {
  const text = String(question || "").trim().toLowerCase();

  if (!text) return "general";

  // Explicit technology names take priority.
  const explicitChecks = [
    ["genai", /\b(generative ai|genai|llm|llms|gpt)\b/i],
    ["nodejs", /\b(node\.?js|nodejs|express\.?js)\b/i],
    ["react", /\breact(?:\.js)?\b/i],
    ["javascript", /\b(javascript|ecmascript)\b/i],
    ["python", /\bpython\b/i],
    ["java", /\bjava\b/i],
    ["aiml", /\b(ai\/ml|artificial intelligence|machine learning)\b/i],
    ["testing", /\b(software testing|automation testing|unit testing|api testing|selenium|cypress|playwright|junit|testng|pytest|karate framework)\b/i],
    ["devops", /\b(devops|ci\/cd|docker|kubernetes|jenkins|terraform|ansible)\b/i],
  ];

  for (const [domain, pattern] of explicitChecks) {
    if (pattern.test(text)) return domain;
  }

  // Score keyword matches when no explicit technology is named.
  const scores = {};

  for (const [domain, rules] of Object.entries(DOMAIN_RULES)) {
    scores[domain] = rules.reduce(
      (score, rule) => score + (rule.test(text) ? 1 : 0),
      0
    );
  }

  const rankedDomains = Object.entries(scores)
    .sort((a, b) => b[1] - a[1]);

  const [bestDomain, bestScore] = rankedDomains[0];
  const secondScore = rankedDomains[1]?.[1] || 0;

  if (bestScore > 0 && bestScore > secondScore) {
    return bestDomain;
  }

  // Preserve the domain for short follow-up questions.
  const isShortFollowUp =
    text.split(/\s+/).length <= 8 &&
    /^(how|why|what about|explain more|give an example|can you explain)\b/i.test(
      text
    );

  if (
    isShortFollowUp &&
    Object.prototype.hasOwnProperty.call(DOMAIN_RULES, previousDomain)
  ) {
    return previousDomain;
  }

  return "general";
}

module.exports = { detectDomain };
