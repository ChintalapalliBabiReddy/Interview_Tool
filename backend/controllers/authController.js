
const sendMail = require("../utils/sendMail");
const redisClient = require("../config/redisClient");
const crypto = require("node:crypto");
const isAdmin = require("../utils/isAdmin");

const SESSION_COOKIE_NAME = "session_id";
const SESSION_TTL = Number(process.env.AUTH_SESSION_TTL || 7200);

const isValidEmail = (email) =>
  typeof email === "string" &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge: SESSION_TTL * 1000,
  };
};

// Clear only the authentication cookie.
const clearSessionCookie = (res) => {
  const { maxAge, ...options } = getCookieOptions();
  res.clearCookie(SESSION_COOKIE_NAME, options);
};

// Generate OTP, store it in Redis, and send email.
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body || {};

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Valid email is required",
      });
    }

    const emailKey = email.trim().toLowerCase();

    if (!isAdmin(emailKey)) {
      return res.status(403).json({
        success: false,
        message:
          "You don't have access to this tool. Please contact the administrator.",
      });
    }

    const otp = String(crypto.randomInt(100000, 1000000));

    await redisClient.set(emailKey, otp, {
      EX: 300,
    });

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

// Verify OTP and create authenticated session.
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body || {};

    if (
      !isValidEmail(email) ||
      (typeof otp !== "string" && typeof otp !== "number")
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid email and OTP are required",
      });
    }

    const emailKey = email.trim().toLowerCase();
    const enteredOtp = String(otp).trim();

    if (!/^\d{6}$/.test(enteredOtp)) {
      return res.status(400).json({
        success: false,
        message: "OTP must contain 6 digits",
      });
    }

    if (!isAdmin(emailKey)) {
      return res.status(403).json({
        success: false,
        message:
          "You don't have access to this tool. Please contact the administrator.",
      });
    }

    const storedOtp = await redisClient.get(emailKey);

    if (storedOtp === null) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or not found",
      });
    }

    if (storedOtp !== enteredOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Generate a cryptographically secure session ID.
    const sessionId = crypto.randomBytes(32).toString("hex");

    const sessionData = {
      userId: emailKey,
      authenticated: true,
      createdAt: Date.now(),
    };

    // Store the authenticated session in Redis.
    await redisClient.set(
      `auth:session:${sessionId}`,
      JSON.stringify(sessionData),
      { EX: SESSION_TTL }
    );

    // Consume OTP only after session creation succeeds.
    await redisClient.del(emailKey);

    // Send session ID to browser only through an HttpOnly cookie.
    res.cookie(
      SESSION_COOKIE_NAME,
      sessionId,
      getCookieOptions()
    );

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

// Check whether the browser has a valid authenticated session.
const getCurrentUser = async (req, res) => {
  try {
    const sessionId = req.cookies?.[SESSION_COOKIE_NAME];

    if (!sessionId) {
      return res.status(401).json({
        success: false,
        authenticated: false,
        message: "No active session",
      });
    }

    const sessionKey = `auth:session:${sessionId}`;
    const storedSession = await redisClient.get(sessionKey);

    if (!storedSession) {
      clearSessionCookie(res);

      return res.status(401).json({
        success: false,
        authenticated: false,
        message: "Session expired or invalid",
      });
    }

    const session = JSON.parse(storedSession);

    return res.status(200).json({
      success: true,
      authenticated: true,
      user: {
        email: session.userId,
      },
    });
  } catch (error) {
    console.error("Session validation error:", error);

    return res.status(500).json({
      success: false,
      authenticated: false,
      message: "Failed to validate session",
    });
  }
};

// Logout and invalidate the current authenticated session.
const logout = async (req, res) => {
  try {
    const sessionId = req.cookies?.[SESSION_COOKIE_NAME];

    if (sessionId) {
      await redisClient.del(`auth:session:${sessionId}`);
    }

    clearSessionCookie(res);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
  getCurrentUser,
  logout,
};
