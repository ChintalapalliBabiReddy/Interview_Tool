const { AIProjectClient } = require("@azure/ai-projects");
const { DefaultAzureCredential } = require("@azure/identity");

const endpoint = process.env.AZURE_AI_PROJECT_ENDPOINT;

if (!endpoint || !endpoint.trim()) {
  throw new Error(
    "Missing AZURE_AI_PROJECT_ENDPOINT in Azure App Service environment variables"
  );
}

const projectClient = new AIProjectClient(
  endpoint.trim(),
  new DefaultAzureCredential()
);

module.exports = projectClient;
