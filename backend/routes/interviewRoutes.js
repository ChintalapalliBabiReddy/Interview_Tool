
const express = require("express");
const router = express.Router();

const {
  createInterviewSession,
  endInterviewSession,
} = require("../controllers/interviewSessionController");

router.post("/session", createInterviewSession);
router.post("/session/end", endInterviewSession);

module.exports = router;
