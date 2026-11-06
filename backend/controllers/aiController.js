const projectClient = require("../config/openaiClient");
const sessionStore = require("../services/interviewSessionStore");
const { performance } = require("node:perf_hooks");
const { detectDomain } = require("../services/domainDetector");
const { getDomainPrompt } = require("../prompts/domainPromptRegistry");
const { SYSTEM_INSTRUCTIONS } = require("../prompts/systemInstructions");

const AGENT_NAME = process.env.AZURE_AI_AGENT_NAME || "my-first-agent";

const MODEL_NAME = process.env.AZURE_AI_MODEL_NAME || "gpt-4.1-mini";

const FIRST_REQUEST_USE_AGENT =
  (process.env.AI_FIRST_REQUEST_USE_AGENT || "true").toLowerCase() === "true";

const getOpenAIClient = () =>
  projectClient.getOpenAIClient({
    azureConfig: {
      allowPreview: true,
      agentName: AGENT_NAME,
    },
  });

const buildInterviewPrompt = ({ question, session, domain = "general" }) => {
  const { name, company, round, resumeText } = session.details;

  const domainPrompt = getDomainPrompt(domain);

  return `
CANDIDATE CONTEXT
Candidate name: ${name}
Company being interviewed with: ${company}
Interview round: ${round}

CANDIDATE'S RESUME
<resume>
${resumeText}
</resume>

CURRENT INTERVIEW QUESTION
<question>
${question}
</question>

DOMAIN-SPECIFIC TECHNICAL GUIDANCE
Detected domain: ${domain}

${domainPrompt}
`.trim();
};

const generateAnswer = async (req, res) => {
  const requestReceivedAt = performance.now();

  let aiRequestDurationMs = null;
  let firstTextAt = null;
  let streamCompletedAt = null;

  try {
    const { question, interviewSessionId } = req.body || {};

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

    // Retrieve the active interview session from Redis.
    const session = await sessionStore.getSession(interviewSessionId);

    if (!session || session.status !== "active") {
      return res.status(401).json({
        success: false,
        message: "Interview session is invalid or has ended",
      });
    }

    const resumeText = session.details?.resumeText;

    if (typeof resumeText !== "string" || !resumeText.trim()) {
      return res.status(422).json({
        success: false,
        message:
          "Resume context is unavailable for this interview. Please upload your resume and start a new interview.",
      });
    }

    const currentQuestion = question.trim();

    // Identify the technical domain of the current question.
    const detectedDomain = detectDomain(currentQuestion);

    // Build the interview prompt with domain-specific instructions.
    const interviewPrompt = buildInterviewPrompt({
      question: currentQuestion,
      session,
      domain: detectedDomain,
    });

    console.log("[AI Domain Detected]", {
      interviewSessionId,
      domain: detectedDomain,
    });

    const openAIClient = getOpenAIClient();

    // Use the agent until its first successful response is saved.
    const useAgent =
      FIRST_REQUEST_USE_AGENT && session.agentRequestCompleted !== true;

    const routeDiagnostics = {
      aiRoute: useAgent ? "agent" : "direct_model",
      aiTarget: useAgent ? AGENT_NAME : MODEL_NAME,
      agentUsed: useAgent,
      resumeContextUsed: true,
      sessionReused: true,
    };

    console.log("[AI Request]", {
      interviewSessionId,
      ...routeDiagnostics,
    });

    res.status(200);
    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders?.();

    let stream;

    if (useAgent) {
      // First request: call the Foundry agent.
      // Configure SYSTEM_INSTRUCTIONS in this Agent's Instructions setting
      // in Azure AI Foundry; the request sends only dynamic interview input.
      stream = await openAIClient.responses.create(
        {
          conversation: session.conversationId,
          input: interviewPrompt,
          stream: true,
        },
        {
          body: {
            agent_reference: {
              name: AGENT_NAME,
              type: "agent_reference",
            },
          },
        },
      );
    } else {
      // Subsequent requests: call the model directly.
      // Supply the previous exchanges explicitly.
      const history = (session.aiHistory || []).map((item) => ({
        role: item.role,
        content: item.content,
      }));

      stream = await openAIClient.responses.create({
        model: MODEL_NAME,
        instructions: SYSTEM_INSTRUCTIONS,
        input: [
          ...history,
          {
            role: "user",
            content: interviewPrompt,
          },
        ],
        stream: true,
      });
    }

    aiRequestDurationMs = performance.now() - requestReceivedAt;

    res.write(
      `data: ${JSON.stringify({
        type: "timing",
        metrics: {
          conversationCreationMs: null,
          aiRequestSetupMs: Math.round(aiRequestDurationMs),
          ...routeDiagnostics,
        },
      })}\n\n`,
    );

    let completed = false;
    let answerText = "";

    for await (const event of stream) {
      if (res.destroyed || res.writableEnded) {
        return;
      }

      if (event.type === "response.output_text.delta" && event.delta) {
        if (firstTextAt === null && event.delta.trim().length > 0) {
          firstTextAt = performance.now();

          res.write(
            `data: ${JSON.stringify({
              type: "timing",
              metrics: {
                backendFirstTextMs: Math.round(firstTextAt - requestReceivedAt),
                ...routeDiagnostics,
              },
            })}\n\n`,
          );
        }

        answerText += event.delta;

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

    // Save the exchange and mark agent completion only after success.
    const exchangeSaved = await sessionStore.appendExchange(
      interviewSessionId,
      currentQuestion,
      answerText,
      {
        markAgentRequestCompleted: useAgent,
      },
    );

    if (!exchangeSaved) {
      throw new Error(
        "Interview session expired before the exchange could be saved",
      );
    }

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
      ...routeDiagnostics,
    };

    res.write(
      `data: ${JSON.stringify({
        type: "metrics",
        metrics,
      })}\n\n`,
    );

    res.write(
      `data: ${JSON.stringify({
        type: "done",
        diagnostics: routeDiagnostics,
      })}\n\n`,
    );

    res.end();

    console.log("[AI Request Completed]", {
      interviewSessionId,
      ...metrics,
      answerCharacters: answerText.length,
    });
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
