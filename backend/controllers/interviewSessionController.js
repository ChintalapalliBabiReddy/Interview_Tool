
const projectClient = require("../config/openaiClient");
const sessionStore = require("../services/interviewSessionStore");
const { getResume } = require("../services/resumeStore");

const getOpenAIClient = () =>
  projectClient.getOpenAIClient({
    azureConfig: {
      allowPreview: true,
      agentName: "my-first-agent",
    },
  });

const createInterviewSession = async (req, res) => {
  let conversationId;

  try {
    const {
      name,
      email,
      company,
      round,
      durationMinutes,
      resumeId,
    } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof company !== "string" ||
      !company.trim() ||
      !["L1", "L2"].includes(round) ||
      ![30, 45, 60, 90].includes(Number(durationMinutes)) ||
      typeof resumeId !== "string" ||
      !resumeId.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Valid interview details and an uploaded resume are required",
      });
    }

    // Retrieve the resume record from Redis.
    const resume = await getResume(resumeId);

    if (!resume) {
      return res.status(400).json({
        success: false,
        message:
          "Resume not found or expired. Please upload your resume again.",
      });
    }

    const openAIClient = getOpenAIClient();

    // Create one conversation for this interview.
    const conversation = await openAIClient.conversations.create();
    conversationId = conversation.id;

    // Persist session details in Redis.
    const session = await sessionStore.createSession({
      conversationId: conversation.id,
      details: {
        name: name.trim(),
        email: email.trim(),
        company: company.trim(),
        round,
        durationMinutes: Number(durationMinutes),
        resumeId: resume.resumeId,
        resumeText: resume.text,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Interview session initialized with resume context",
      interviewSessionId: session.interviewSessionId,
    });
  } catch (error) {
    console.error("Interview session creation failed:", error);

    // If session creation failed after creating the conversation,
    // attempt to clean up the unused conversation.
    if (conversationId) {
      try {
        const openAIClient = getOpenAIClient();
        await openAIClient.conversations.delete(conversationId);
      } catch (cleanupError) {
        console.error(
          "Failed to clean up unused conversation:",
          cleanupError.message
        );
      }
    }

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

    // Retrieve and remove the session from Redis.
    const session = await sessionStore.endSession(interviewSessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Interview session not found or already ended",
      });
    }

    // Best-effort cleanup of the Foundry conversation.
    try {
      const openAIClient = getOpenAIClient();
      await openAIClient.conversations.delete(session.conversationId);
    } catch (error) {
      console.error("Conversation cleanup failed:", error.message);
    }

    return res.status(200).json({
      success: true,
      message: "Interview session ended",
    });
  } catch (error) {
    console.error("Interview session ending failed:", error);

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
