
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

    const openAIClient = projectClient.getOpenAIClient();

    const response = await openAIClient.responses.create(
      {
        input: question.trim(),
      },
      {
        body: {
          agent_reference: {
            name: "my-first-agent",
            type: "agent_reference",
          },
        },
      }
    );

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
