const { randomUUID } = require("node:crypto");

const sessions = new Map();

function createSession({ conversationId, details }) {
  const interviewSessionId = randomUUID();

  const session = {
    interviewSessionId,
    conversationId,
    details,
    status: "active",
    createdAt: new Date().toISOString(),
  };

  sessions.set(interviewSessionId, session);

  return session;
}

function getSession(interviewSessionId) {
  return sessions.get(interviewSessionId);
}

function endSession(interviewSessionId) {
  const session = sessions.get(interviewSessionId);

  if (!session) {
    return null;
  }

  session.status = "completed";
  sessions.delete(interviewSessionId);

  return session;
}

module.exports = {
  createSession,
  getSession,
  endSession,
};