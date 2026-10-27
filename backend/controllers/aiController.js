
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

    const openAIClient = projectClient.getOpenAIClient({
      azureConfig: {
        allowPreview: true,
        agentName: "my-first-agent",
      },
    });

    // Create the conversation using the existing agent workflow.
    const conversation = await openAIClient.conversations.create({
      items: [
        {
          type: "message",
          role: "user",
          content: question.trim(),
        },
      ],
    });

    // Tell the browser that the response will arrive as a stream.
    res.status(200);
    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders?.();

    // Request a streamed response from the Foundry agent.
    const stream = await openAIClient.responses.create({
      conversation: conversation.id,
      stream: true,
    });

    for await (const event of stream) {
      if (res.destroyed || res.writableEnded) {
        break;
      }

      // Forward each generated text fragment immediately.
      if (event.type === "response.output_text.delta" && event.delta) {
        res.write(`data: ${JSON.stringify({
          type: "delta",
          text: event.delta,
        })}\n\n`);
      }

      if (event.type === "response.completed") {
        res.write(`data: ${JSON.stringify({
          type: "done",
        })}\n\n`);
      }

      if (event.type === "response.failed") {
        throw new Error("The AI response failed");
      }
    }

    if (!res.writableEnded) {
      res.end();
    }
  } catch (error) {
    console.error("AI answer generation failed:", {
      status: error.status,
      code: error.code,
      message: error.message,
      details: error.error,
    });

    if (res.headersSent) {
      if (!res.destroyed && !res.writableEnded) {
        res.write(`data: ${JSON.stringify({
          type: "error",
          message: "Failed to generate an answer",
        })}\n\n`);
        res.end();
      }
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to generate an answer",
      });
    }
  }
};

module.exports = { generateAnswer };
