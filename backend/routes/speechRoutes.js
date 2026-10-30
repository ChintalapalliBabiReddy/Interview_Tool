
const express = require("express");
const multer = require("multer");
const router = express.Router();

const {
  transcribeSpeech,
  getSpeechToken,
} = require("../controllers/speechController");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Existing endpoint
router.post("/transcribe", upload.single("audio"), transcribeSpeech);

// New endpoint
router.get("/token", getSpeechToken);

module.exports = router;
