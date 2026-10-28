
const { randomUUID } = require("node:crypto");

const sessions = new Map();

function createSession({
  conversationId,
  details,
  resumeText = "",
}) {
  const interviewSessionId = randomUUID();

  const session = {
    interviewSessionId,
    conversationId,
    details,
    resumeText,
    aiHistory: [],
    status: "active",
    createdAt: new Date().toISOString(),
  };

  sessions.set(interviewSessionId, session);

  return session;
}

function getSession(interviewSessionId) {
  return sessions.get(interviewSessionId) || null;
}

function appendExchange(interviewSessionId, question, answer) {
  const session = getSession(interviewSessionId);

  if (!session || session.status !== "active") {
    return false;
  }

  session.aiHistory.push(
    { role: "user", content: question },
    { role: "assistant", content: answer }
  );

  return true;
}

function endSession(interviewSessionId) {
  const session = getSession(interviewSessionId);

  if (!session || session.status !== "active") {
    return null;
  }

  session.status = "completed";
  sessions.delete(interviewSessionId);

  return session;
}

module.exports = {
  createSession,
  getSession,
  appendExchange,
  endSession,
};
