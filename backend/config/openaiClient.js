
const { AIProjectClient } = require("@azure/ai-projects");
const { DefaultAzureCredential } = require("@azure/identity");

const projectClient = new AIProjectClient(
  process.env.AZURE_AI_PROJECT_ENDPOINT,
  new DefaultAzureCredential()
);

module.exports = projectClient;
