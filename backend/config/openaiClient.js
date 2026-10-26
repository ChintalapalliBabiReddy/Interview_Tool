const { AIProjectClient } = require("@azure/ai-projects");
const { DefaultAzureCredential } = require("@azure/identity");

const endpoint = process.env.AZURE_AI_PROJECT_ENDPOINT;

console.log("AI Project endpoint configured:", Boolean(endpoint));

if (!endpoint || !endpoint.trim()) {
  throw new Error(
    "AZURE_AI_PROJECT_ENDPOINT is missing in Azure App Service"
  );
}

const projectClient = new AIProjectClient(
  endpoint.trim(),
  new DefaultAzureCredential()
);

module.exports = projectClient;
