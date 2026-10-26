const sendMail = require("../utils/sendMail");
const redisClient = require("../config/redisClient");
const crypto = require("node:crypto");

// Generate OTP, store it in Azure Redis, and send email
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
        message: "Valid email is required"
      });
    }

    // Normalize email for Redis key
    const emailKey = email.trim().toLowerCase();

    // Generate secure 6-digit OTP
    const otp = String(crypto.randomInt(100000, 1000000));

    // Store OTP in Redis for 5 minutes
    await redisClient.set(emailKey, otp, {
      EX: 300
    });

    // Send OTP to email
    await sendMail(emailKey, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully"
    });

  } catch (error) {
    console.error("OTP sending error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send OTP"
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
        message: "Valid email and OTP are required"
      });
    }

    // Normalize email
    const emailKey = email.trim().toLowerCase();
    const enteredOtp = String(otp).trim();

    // Validate OTP format
    if (!/^\d{6}$/.test(enteredOtp)) {
      return res.status(400).json({
        success: false,
        message: "OTP must contain 6 digits"
      });
    }

    // Retrieve stored OTP from Redis
    const storedOtp = await redisClient.get(emailKey);

    if (storedOtp === null) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or not found"
      });
    }

    // Compare OTP
    if (storedOtp !== enteredOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    // Delete OTP after successful verification
    await redisClient.del(emailKey);

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully"
    });

  } catch (error) {
    console.error("OTP verification error:", error);

    return res.status(500).json({
      success: false,
      message: "OTP verification failed"
    });
  }
};

module.exports = {
  sendOtp,
  verifyOtp
};
