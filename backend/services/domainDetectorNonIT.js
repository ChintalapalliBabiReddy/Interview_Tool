// backend/services/domainDetectorNonIT.js
// Keyword rules and priority for Non-IT interview specializations.

const DOMAIN_RULES = {
  // Non-IT - Finance & Accounting
  recordToReport: [/\brecord to report\b/i, /\br2r\b/i, /\bmonth[- ]end closing\b/i, /\byear[- ]end closing\b/i, /\bfinancial close process\b/i, /\bintercompany accounting\b/i],
  procureToPay: [/\bprocure to pay\b/i, /\bp2p\b/i, /\bpurchase requisition\b/i, /\bpurchase order\b/i, /\bthree[- ]way match(?:ing)?\b/i, /\bvendor invoice processing\b/i, /\bgoods receipt\b/i],
  orderToCash: [/\border to cash\b/i, /\bo2c\b/i, /\bcash application\b/i, /\bcustomer order fulfillment\b/i, /\bcustomer billing process\b/i],
  accountsPayable: [/\baccounts payable\b/i, /\bvendor reconciliation\b/i, /\bduplicate invoice\b/i, /\bvendor payment\b/i, /\bap aging\b/i, /\bap reconciliation\b/i],
  accountsReceivable: [/\baccounts receivable\b/i, /\bar aging\b/i, /\bcustomer aging report\b/i, /\bcustomer deductions\b/i, /\bbad debt\b/i, /\bar reconciliation\b/i],
  financialPlanningAnalysis: [/\bfinancial planning and analysis\b/i, /\bfp&a\b/i, /\bfinancial forecasting\b/i, /\bfinancial budgeting\b/i, /\bvariance analysis\b/i, /\bscenario planning\b/i],
  financialReconciliation: [/\bfinancial reconciliation\b/i, /\bbank reconciliation\b/i, /\baccount reconciliation\b/i, /\breconciliation breaks?\b/i, /\bsuspense account\b/i, /\bunmatched transactions?\b/i],
  financialReporting: [/\bfinancial reporting\b/i, /\bfinancial statements?\b/i, /\bbalance sheet\b/i, /\bincome statement\b/i, /\bprofit and loss\b/i, /\bcash flow statement\b/i, /\bfinancial consolidation\b/i],
  internalAudit: [/\binternal audit\b/i, /\binternal controls?\b/i, /\baudit observations?\b/i, /\binternal audit planning\b/i, /\bcontrol deficiencies\b/i],
  externalAudit: [/\bexternal audit\b/i, /\bstatutory audit\b/i, /\bauditor independence\b/i, /\baudit opinion\b/i, /\bsubstantive testing\b/i, /\bfinancial statement assertions?\b/i],
  payrollAccounting: [/\bpayroll accounting\b/i, /\bpayroll journal entries\b/i, /\bsalary accounting entries\b/i, /\bpayroll provisions\b/i],
  generalLedger: [/\bgeneral ledger\b/i, /\bchart of accounts\b/i, /\btrial balance\b/i, /\bledger posting\b/i, /\bjournal entries\b/i, /\badjusting entries\b/i],
  gst: [/\bgst\b/i, /\bgoods and services tax\b/i, /\bcgst\b/i, /\bsgst\b/i, /\bigst\b/i, /\butgst\b/i, /\bgstr[- ]?[13]b\b/i, /\binput tax credit\b/i, /\be[- ]?way bill\b/i, /\breverse charge mechanism\b/i],
  taxation: [/\btaxation\b/i, /\btax planning\b/i, /\btax return\b/i, /\btaxable income\b/i, /\bdirect taxation\b/i, /\bindirect taxation\b/i, /\btax provisions?\b/i],
  accounting: [/\baccounting principles\b/i, /\baccounting basics\b/i, /\bdouble entry bookkeeping\b/i, /\bdebit and credit\b/i, /\bbookkeeping\b/i, /\baccounting standards\b/i, /\bdepreciation\b/i, /\bprepaid expenses?\b/i, /\baccrual accounting\b/i],

  // Non-IT - Banking & Insurance
  insuranceUnderwriting: [/\binsurance underwriting\b/i, /\bunderwriting guidelines\b/i, /\bunderwriting risk\b/i, /\bpremium calculation\b/i, /\bpolicy exclusions?\b/i, /\brisk classification\b/i],
  insuranceClaims: [/\binsurance claims?\b/i, /\bclaim settlement\b/i, /\bclaim repudiation\b/i, /\bclaim registration\b/i, /\bclaim assessment\b/i, /\bpolicy claim\b/i],
  investmentOperations: [/\binvestment operations\b/i, /\btrade lifecycle\b/i, /\btrade settlement\b/i, /\btrade confirmation\b/i, /\bportfolio reconciliation\b/i, /\bnet asset value\b/i, /\bcorporate actions\b/i],
  creditAnalysis: [/\bcredit analysis\b/i, /\bcredit risk assessment\b/i, /\bcredit scoring\b/i, /\bcreditworthiness\b/i, /\bdebt[- ]to[- ]income\b/i, /\bdebt ratios?\b/i, /\bcash flow analysis\b/i, /\bcollateral evaluation\b/i],
  loanProcessing: [/\bloan processing\b/i, /\bloan origination\b/i, /\bloan disbursement\b/i, /\bloan sanctioning\b/i, /\bloan eligibility\b/i, /\bloan repayment schedule\b/i],
  fraudDetection: [/\bfraud detection\b/i, /\btransaction fraud\b/i, /\baccount takeover\b/i, /\bidentity theft\b/i, /\bcard fraud\b/i, /\bfraud investigation\b/i, /\bfraud monitoring\b/i],
  aml: [/\banti[- ]money laundering\b/i, /\baml\b/i, /\bmoney laundering\b/i, /\bsuspicious transaction report\b/i, /\bstr filing\b/i, /\bsanctions screening\b/i, /\btransaction monitoring alerts?\b/i],
  kyc: [/\bknow your customer\b/i, /\bkyc\b/i, /\bcustomer due diligence\b/i, /\benhanced due diligence\b/i, /\bbeneficial ownership\b/i, /\bkyc verification\b/i],
  cardOperations: [/\bcard operations\b/i, /\bdebit card\b/i, /\bcredit card\b/i, /\bchargeback\b/i, /\bcard authorization\b/i, /\bcard issuance\b/i, /\bcard settlement\b/i],
  paymentOperations: [/\bpayment operations\b/i, /\bpayment processing\b/i, /\bneft\b/i, /\brtgs\b/i, /\bimps\b/i, /\bupi\b/i, /\bswift payments?\b/i, /\bpayment settlement\b/i],
  riskManagement: [/\brisk management\b/i, /\boperational risk\b/i, /\bmarket risk\b/i, /\bliquidity risk\b/i, /\brisk appetite\b/i, /\bkey risk indicators?\b/i, /\bstress testing\b/i],
  corporateBanking: [/\bcorporate banking\b/i, /\btrade finance\b/i, /\bworking capital finance\b/i, /\bcorporate lending\b/i, /\bcash management services\b/i],
  retailBanking: [/\bretail banking\b/i, /\bsavings account\b/i, /\bcurrent account\b/i, /\bfixed deposit\b/i, /\bpersonal banking\b/i, /\bbranch banking\b/i],
  bankingOperations: [/\bbanking operations\b/i, /\bcore banking\b/i, /\bbank operations\b/i, /\bclearing and settlement\b/i, /\bbank transaction processing\b/i],

  // Non-IT - Human Resources
  itRecruitment: [/\bit recruitment\b/i, /\btechnical recruitment\b/i, /\bit recruiter\b/i, /\btechnical recruiter\b/i, /\btechnology hiring\b/i],
  nonItRecruitment: [/\bnon[- ]it recruitment\b/i, /\bnon[- ]technical recruitment\b/i, /\bnon[- ]it recruiter\b/i],
  talentAcquisition: [/\btalent acquisition\b/i, /\bemployer branding\b/i, /\btalent pipeline\b/i, /\bworkforce planning\b/i, /\bcandidate experience\b/i],
  recruitment: [/\brecruitment\b/i, /\brecruiter\b/i, /\bcandidate sourcing\b/i, /\bresume screening\b/i, /\binterview scheduling\b/i, /\bhiring process\b/i],
  payrollProcessing: [/\bpayroll processing\b/i, /\bpayroll administration\b/i, /\bgross[- ]to[- ]net\b/i, /\bpayslip\b/i, /\bsalary processing\b/i, /\bpayroll inputs\b/i],
  learningAndDevelopment: [/\blearning and development\b/i, /\bl&d\b/i, /\btraining needs analysis\b/i, /\blearning management system\b/i, /\btraining effectiveness\b/i],
  performanceManagement: [/\bperformance management\b/i, /\bperformance appraisal\b/i, /\bperformance review\b/i, /\bperformance improvement plan\b/i, /\bokr\b/i, /\bgoal setting\b/i],
  employeeRelations: [/\bemployee relations\b/i, /\bgrievance handling\b/i, /\bworkplace conflict\b/i, /\bdisciplinary procedures?\b/i, /\bemployee engagement\b/i],
  hrCompliance: [/\bhr compliance\b/i, /\blabou?r law\b/i, /\bstatutory registers\b/i, /\bemployment compliance\b/i, /\bhr policies\b/i],
  hrOperations: [/\bhr operations\b/i, /\bhris\b/i, /\bonboarding process\b/i, /\boffboarding\b/i, /\bleave management\b/i, /\battendance management\b/i],
  hrGeneralist: [/\bhr generalist\b/i, /\bhuman resources generalist\b/i, /\bhr functions\b/i, /\bhuman resources\b/i],

  // Non-IT - BPO & Customer Support
  qualityAnalystBpo: [/\bquality analyst\b/i, /\bbpo quality\b/i, /\bcall quality monitoring\b/i, /\bquality scorecard\b/i, /\bquality calibration\b/i, /\bquality assurance in bpo\b/i],
  contactCenterOperations: [/\bcontact center operations\b/i, /\bcall center operations\b/i, /\bworkforce management\b/i, /\bcall routing\b/i, /\bivr\b/i, /\bqueue management\b/i, /\bcall abandonment\b/i, /\baverage handling time\b/i],
  technicalSupportProcess: [/\btechnical support process\b/i, /\btechnical support\b/i, /\btroubleshooting support\b/i, /\bhelp desk support\b/i],
  bpoNonVoiceProcess: [/\bbpo non[- ]voice\b/i, /\bnon[- ]voice process\b/i, /\bback[- ]office process\b/i, /\bdata entry process\b/i, /\bback[- ]office operations\b/i],
  bpoVoiceProcess: [/\bbpo voice\b/i, /\bvoice process\b/i, /\binbound calling\b/i, /\boutbound calling\b/i, /\bvoice process interview\b/i],
  internationalProcess: [/\binternational process\b/i, /\binternational bpo\b/i, /\binternational customer support\b/i, /\boverseas process\b/i],
  domesticProcess: [/\bdomestic process\b/i, /\bdomestic bpo\b/i, /\bdomestic customer support\b/i],
  emailSupport: [/\bemail support\b/i, /\bemail process\b/i, /\bcustomer support emails?\b/i],
  chatSupport: [/\bchat support\b/i, /\blive chat\b/i, /\bchat process\b/i, /\bchat handling\b/i],
  telecalling: [/\btelecalling\b/i, /\btele caller\b/i, /\btelemarketing\b/i, /\bcalling process\b/i],
  collections: [/\bcollections process\b/i, /\bdebt collections?\b/i, /\bcollections agent\b/i, /\bcollections calls?\b/i, /\boverdue payment collection\b/i],
  customerService: [/\bcustomer service\b/i, /\bcustomer satisfaction\b/i, /\bservice recovery\b/i, /\bcustomer retention\b/i],
  customerSupport: [/\bcustomer support\b/i, /\bsupport tickets?\b/i, /\bticket resolution\b/i, /\bsupport lifecycle\b/i, /\bsla management\b/i],
};

const DOMAIN_PRIORITY = [
  // Non-IT - Finance & Accounting
  "recordToReport", "procureToPay", "orderToCash", "accountsPayable",
  "accountsReceivable", "financialPlanningAnalysis", "financialReconciliation",
  "financialReporting", "internalAudit", "externalAudit", "payrollAccounting",
  "generalLedger", "gst", "taxation", "accounting",

  // Non-IT - Banking & Insurance
  "insuranceUnderwriting", "insuranceClaims", "investmentOperations",
  "creditAnalysis", "loanProcessing", "fraudDetection", "aml", "kyc",
  "cardOperations", "paymentOperations", "riskManagement", "corporateBanking",
  "retailBanking", "bankingOperations",

  // Non-IT - HR
  "itRecruitment", "nonItRecruitment", "talentAcquisition", "recruitment",
  "payrollProcessing", "learningAndDevelopment", "performanceManagement",
  "employeeRelations", "hrCompliance", "hrOperations", "hrGeneralist",

  // Non-IT - BPO & Customer Support
  "qualityAnalystBpo", "contactCenterOperations", "technicalSupportProcess",
  "bpoNonVoiceProcess", "bpoVoiceProcess", "internationalProcess",
  "domesticProcess", "emailSupport", "chatSupport", "telecalling",
  "collections", "customerService", "customerSupport",
];

function detectNonITDomain(question) {
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
  detectNonITDomain,
};