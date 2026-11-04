const { detectITDomain, DOMAIN_PRIORITY: IT_DOMAIN_PRIORITY } = require("./domainDetectorIT");
const { detectNonITDomain, DOMAIN_PRIORITY: NON_IT_DOMAIN_PRIORITY } = require("./domainDetectorNonIT");
const ALL_DOMAIN_PRIORITY = [...IT_DOMAIN_PRIORITY, ...NON_IT_DOMAIN_PRIORITY];
function detectDomain(question, previousDomain = "general") {
  const text = String(question || "").trim();
  if (!text) return "general";
  const itDomain = detectITDomain(text);
  if (itDomain) return itDomain;
  const nonItDomain = detectNonITDomain(text);
  if (nonItDomain) return nonItDomain;
  const isShortFollowUp = text.split(/\s+/).length <= 8 &&
    /^(how|why|what about|explain more|give an example|can you explain)\b/i.test(text);
  if (isShortFollowUp && ALL_DOMAIN_PRIORITY.includes(previousDomain)) return previousDomain;
  return "general";
}
module.exports = { detectDomain };
