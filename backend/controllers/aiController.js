
const projectClient = require("../config/openaiClient");

const generateAnswer = async (req, res) => {
  try {
    const { question } = req.body;

    if (typeof question !== "string" || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    // Connect to the existing Microsoft Foundry agent
    const openAIClient = projectClient.getOpenAIClient({
      azureConfig: {
        allowPreview: true,
        agentName: "my-first-agent",
      },
    });

    // Create a conversation with the user's question
    const conversation = await openAIClient.conversations.create({
      items: [
        {
          type: "message",
          role: "user",
          content: question.trim(),
        },
      ],
    });

    // Generate an answer using the Foundry agent
    const response = await openAIClient.responses.create({
      conversation: conversation.id,
    });

    return res.status(200).json({
      success: true,
      question: question.trim(),
      answer: response.output_text,
    });

  } catch (error) {
    console.error("AI answer generation failed:", {
      status: error.status,
      code: error.code,
      message: error.message,
      details: error.error,
    });

    return res.status(500).json({
      success: false,
      message: "Failed to generate an answer",
    });
  }
};

module.exports = { generateAnswer };
