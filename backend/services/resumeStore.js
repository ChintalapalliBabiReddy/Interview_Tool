
const { randomUUID } = require("node:crypto");
const redisClient = require("../config/redisClient");

const RESUME_TTL_SECONDS = Number(
  process.env.RESUME_TTL_SECONDS || 3600
);

function resumeKey(resumeId) {
  return `resume:${resumeId}`;
}

async function saveResume({ blobName, fileName, text }) {
  if (!blobName || !fileName || typeof text !== "string" || !text.trim()) {
    throw new Error("Blob name, file name, and resume text are required");
  }

  const resumeId = randomUUID();

  const resume = {
    resumeId,
    blobName,
    fileName,
    text: text.trim(),
    createdAt: new Date().toISOString(),
  };

  await redisClient.set(
    resumeKey(resumeId),
    JSON.stringify(resume),
    { EX: RESUME_TTL_SECONDS }
  );

  return { resumeId };
}

async function getResume(resumeId) {
  if (typeof resumeId !== "string" || !resumeId.trim()) {
    return null;
  }

  const value = await redisClient.get(resumeKey(resumeId));

  if (!value) {
    return null;
  }

  return JSON.parse(value);
}

async function deleteResume(resumeId) {
  if (typeof resumeId !== "string" || !resumeId.trim()) {
    return false;
  }

  const deleted = await redisClient.del(resumeKey(resumeId));

  return deleted > 0;
}

module.exports = {
  saveResume,
  getResume,
  deleteResume,
};
