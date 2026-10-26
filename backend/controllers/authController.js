const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body || {};

    if (
      typeof email !== "string" ||
      !email.trim() ||
      (typeof otp !== "string" && typeof otp !== "number")
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid email and OTP are required"
      });
    }

    const emailKey = email.trim().toLowerCase();
    const enteredOtp = String(otp).trim();

    if (!/^\d{6}$/.test(enteredOtp)) {
      return res.status(400).json({
        success: false,
        message: "OTP must contain 6 digits"
      });
    }

    const storedOtp = await redisClient.get(emailKey);

    if (storedOtp === null) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or not found"
      });
    }

    if (storedOtp !== enteredOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

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
