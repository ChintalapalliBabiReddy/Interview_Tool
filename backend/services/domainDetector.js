// backend/services/domainDetector.js
// Main coordinator for IT and Non-IT domain detection.

const {
  detectITDomain,
  DOMAIN_PRIORITY: IT_DOMAIN_PRIORITY,
} = require("./domainDetectorIT");

const {
  detectNonITDomain,
  DOMAIN_PRIORITY: NON_IT_DOMAIN_PRIORITY,
} = require("./domainDetectorNonIT");

const ALL_DOMAIN_PRIORITY = [
  ...IT_DOMAIN_PRIORITY,
  ...NON_IT_DOMAIN_PRIORITY,
];

function detectDomain(question, previousDomain = "general") {
  const text = String(question || "").trim();

  if (!text) return "general";

  // Check IT specializations first.
  const itDomain = detectITDomain(text);

  if (itDomain) {
    return itDomain;
  }

  // Then check Non-IT specializations.
  const nonItDomain = detectNonITDomain(text);

  if (nonItDomain) {
    return nonItDomain;
  }

  // Preserve context for short follow-up questions.
  const isShortFollowUp =
    text.split(/\s+/).length <= 8 &&
    /^(how|why|what about|explain more|give an example|can you explain)\b/i.test(
      text
    );

  if (
    isShortFollowUp &&
    ALL_DOMAIN_PRIORITY.includes(previousDomain)
  ) {
    return previousDomain;
  }

  return "general";
}

module.exports = {
  detectDomain,
};