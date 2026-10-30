
const express = require("express");
const router = express.Router();

const {
  sendOtp,
  verifyOtp,
  getCurrentUser,
  logout,
} = require("../controllers/authController");

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

router.get("/me", getCurrentUser);
router.post("/logout", logout);

module.exports = router;
