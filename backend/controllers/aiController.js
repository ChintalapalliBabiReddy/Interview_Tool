const projectClient = require("../config/openaiClient");
const sessionStore = require("../services/interviewSessionStore");
const { performance } = require("node:perf_hooks");

const generateAnswer = async (req, res) => {
  const requestReceivedAt = performance.now();

  let aiRequestDurationMs = null;
  let firstTextAt = null;
  let streamCompletedAt = null;

  try {
    const { question, interviewSessionId } = req.body;

    if (typeof question !== "string" || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    if (typeof interviewSessionId !== "string" || !interviewSessionId.trim()) {
      return res.status(400).json({
        success: false,
        message: "Interview session ID is required",
      });
    }

    const session = sessionStore.getSession(interviewSessionId);

    if (!session || session.status !== "active") {
      return res.status(401).json({
        success: false,
        message: "Interview session is invalid or has ended",
      });
    }

    const openAIClient = projectClient.getOpenAIClient({
      azureConfig: {
        allowPreview: true,
        agentName: "my-first-agent",
      },
    });

    res.status(200);
    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders?.();

    // Reuse the conversation created during interview initialization.

    const stream = await openAIClient.responses.create(
      {
        conversation: session.conversationId,
        input: question.trim(),
        stream: true,
      },
      {
        body: {
          agent_reference: {
            name: "my-first-agent",
            type: "agent_reference",
          },
        },
      },
    );

    aiRequestDurationMs = performance.now() - requestReceivedAt;

    res.write(
      `data: ${JSON.stringify({
        type: "timing",
        metrics: {
          conversationCreationMs: null,
          aiRequestSetupMs: Math.round(aiRequestDurationMs),
          sessionReused: true,
        },
      })}\n\n`,
    );

    let completed = false;

    for await (const event of stream) {
      if (res.destroyed || res.writableEnded) {
        break;
      }

      if (event.type === "response.output_text.delta" && event.delta) {
        if (firstTextAt === null && event.delta.trim().length > 0) {
          firstTextAt = performance.now();

          res.write(
            `data: ${JSON.stringify({
              type: "timing",
              metrics: {
                backendFirstTextMs: Math.round(firstTextAt - requestReceivedAt),
              },
            })}\n\n`,
          );
        }

        res.write(
          `data: ${JSON.stringify({
            type: "delta",
            text: event.delta,
          })}\n\n`,
        );
      }

      if (event.type === "response.completed") {
        completed = true;
        streamCompletedAt = performance.now();
      }

      if (event.type === "response.failed") {
        throw new Error("The AI response failed");
      }
    }

    if (res.destroyed || res.writableEnded) {
      return;
    }

    if (!completed) {
      throw new Error("The AI stream ended without successful completion");
    }

    streamCompletedAt ??= performance.now();

    const totalBackendDurationMs = streamCompletedAt - requestReceivedAt;

    const aiStreamingDurationMs =
      firstTextAt === null ? null : streamCompletedAt - firstTextAt;

    const metrics = {
      conversationCreationMs: null,
      aiRequestSetupMs: Math.round(aiRequestDurationMs),
      backendFirstTextMs:
        firstTextAt === null
          ? null
          : Math.round(firstTextAt - requestReceivedAt),
      aiStreamingDurationMs:
        aiStreamingDurationMs === null
          ? null
          : Math.round(aiStreamingDurationMs),
      totalBackendDurationMs: Math.round(totalBackendDurationMs),
      sessionReused: true,
    };

    res.write(
      `data: ${JSON.stringify({
        type: "metrics",
        metrics,
      })}\n\n`,
    );

    res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
    res.end();

    console.log("AI performance metrics:", metrics);
  } catch (error) {
    console.error("AI answer generation failed:", {
      status: error.status,
      code: error.code,
      message: error.message,
      details: error.error,
    });

    if (res.headersSent) {
      if (!res.destroyed && !res.writableEnded) {
        res.write(
          `data: ${JSON.stringify({
            type: "error",
            message: "Failed to generate an answer",
          })}\n\n`,
        );
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
