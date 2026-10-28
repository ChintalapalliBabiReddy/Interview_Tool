
const { randomUUID } = require("node:crypto");
const redisClient = require("../config/redisClient");

const SESSION_TTL_SECONDS = Number(
  process.env.INTERVIEW_SESSION_TTL_SECONDS || 7200
);

function sessionKey(interviewSessionId) {
  return `interview:${interviewSessionId}`;
}

async function createSession({ conversationId, details }) {
  if (!conversationId || !details) {
    throw new Error("Conversation ID and session details are required");
  }

  const interviewSessionId = randomUUID();

  const session = {
    interviewSessionId,
    conversationId,
    details,
    status: "active",
    createdAt: new Date().toISOString(),
  };

  await redisClient.set(
    sessionKey(interviewSessionId),
    JSON.stringify(session),
    { EX: SESSION_TTL_SECONDS }
  );

  return session;
}

async function getSession(interviewSessionId) {
  if (
    typeof interviewSessionId !== "string" ||
    !interviewSessionId.trim()
  ) {
    return null;
  }

  const value = await redisClient.get(
    sessionKey(interviewSessionId)
  );

  if (!value) {
    return null;
  }

  return JSON.parse(value);
}

async function endSession(interviewSessionId) {
  const session = await getSession(interviewSessionId);

  if (!session) {
    return null;
  }

  await redisClient.del(sessionKey(interviewSessionId));

  return session;
}

module.exports = {
  createSession,
  getSession,
  endSession,
};
