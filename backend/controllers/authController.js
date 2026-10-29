
const sendMail = require("../utils/sendMail");
const redisClient = require("../config/redisClient");
const crypto = require("node:crypto");
const isAdmin = require("../utils/isAdmin");

// Generate OTP, store it in Redis, and send email
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body || {};

    // Validate email
    if (
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid email is required",
      });
    }

    // Normalize email
    const emailKey = email.trim().toLowerCase();

    // Check admin authorization BEFORE generating an OTP
    if (!isAdmin(emailKey)) {
      return res.status(403).json({
        success: false,
        message:
          "You don't have access to this tool. Please contact the administrator.",
      });
    }

    // Generate secure 6-digit OTP
    const otp = String(crypto.randomInt(100000, 1000000));

    // Store OTP in Redis for 5 minutes
    await redisClient.set(emailKey, otp, {
      EX: 300,
    });

    // Send OTP to authorized admin
    await sendMail(emailKey, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("OTP sending error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};

// Verify OTP entered by the user
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body || {};

    // Validate inputs
    if (
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      (typeof otp !== "string" && typeof otp !== "number")
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid email and OTP are required",
      });
    }

    // Normalize email and OTP
    const emailKey = email.trim().toLowerCase();
    const enteredOtp = String(otp).trim();

    // Validate OTP format
    if (!/^\d{6}$/.test(enteredOtp)) {
      return res.status(400).json({
        success: false,
        message: "OTP must contain 6 digits",
      });
    }

    // Check admin authorization BEFORE retrieving the OTP
    if (!isAdmin(emailKey)) {
      return res.status(403).json({
        success: false,
        message:
          "You don't have access to this tool. Please contact the administrator.",
      });
    }

    // Retrieve OTP from Redis
    const storedOtp = await redisClient.get(emailKey);

    if (storedOtp === null) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or not found",
      });
    }

    // Compare OTP
    if (storedOtp !== enteredOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Delete OTP after successful verification
    await redisClient.del(emailKey);

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("OTP verification error:", error);

    return res.status(500).json({
      success: false,
      message: "OTP verification failed",
    });
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
};
