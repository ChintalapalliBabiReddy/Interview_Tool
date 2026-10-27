const projectClient = require("../config/openaiClient");
const sessionStore = require("../services/interviewSessionStore");

const getOpenAIClient = () =>
  projectClient.getOpenAIClient({
    azureConfig: {
      allowPreview: true,
      agentName: "my-first-agent",
    },
  });

const createInterviewSession = async (req, res) => {
  try {
    const {
      name,
      email,
      company,
      round,
      durationMinutes,
    } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof company !== "string" ||
      !company.trim() ||
      !["L1", "L2"].includes(round) ||
      ![30, 45, 60, 90].includes(Number(durationMinutes))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid interview details",
      });
    }

    const openAIClient = getOpenAIClient();

    // Create one empty conversation for this interview.
    const conversation = await openAIClient.conversations.create();

    const session = sessionStore.createSession({
      conversationId: conversation.id,
      details: {
        name: name.trim(),
        email: email.trim(),
        company: company.trim(),
        round,
        durationMinutes: Number(durationMinutes),
      },
    });

    return res.status(201).json({
      success: true,
      message: "Interview session initialized",
      interviewSessionId: session.interviewSessionId,
    });
  } catch (error) {
    console.error("Interview session creation failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to initialize interview session",
    });
  }
};

const endInterviewSession = async (req, res) => {
  try {
    const { interviewSessionId } = req.body;

    if (
      typeof interviewSessionId !== "string" ||
      !interviewSessionId.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Interview session ID is required",
      });
    }

    const session = sessionStore.endSession(interviewSessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Interview session not found or already ended",
      });
    }

    // Best-effort cleanup of the Foundry conversation.
    try {
      const openAIClient = getOpenAIClient();

      await openAIClient.conversations.delete(
        session.conversationId
      );
    } catch (error) {
      console.error(
        "Conversation cleanup failed:",
        error.message
      );
    }

    return res.status(200).json({
      success: true,
      message: "Interview session ended",
    });
  } catch (error) {
    console.error("Interview session ending failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to end interview session",
    });
  }
};

module.exports = {
  createInterviewSession,
  endInterviewSession,
};