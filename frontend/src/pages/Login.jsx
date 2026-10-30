
import { useState } from "react";
import "../styles/Login.css";
import { MdEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { AUTH_API } from "../constants/apiConstants";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const { refreshAuth } = useAuth();

  const handleSendOtp = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      setMessage("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(AUTH_API.SEND_OTP, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to send OTP");
        return;
      }

      setOtpSent(true);
      setMessage("OTP sent successfully! Please check your email.");
    } catch (error) {
      console.error("Send OTP error:", error);
      setMessage("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!/^\d{6}$/.test(otp)) {
      setMessage("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(AUTH_API.VERIFY_OTP, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "OTP verification failed");
        return;
      }

      // Validate the newly created session using the HttpOnly cookie.
      const authenticated = await refreshAuth();

      if (authenticated) {
        navigate("/panel", { replace: true });
      } else {
        setMessage(
          "Login succeeded, but session validation failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Verify OTP error:", error);
      setMessage("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Login</h1>

        <p>Enter your email address to receive an OTP</p>

        <input
          type="email"
          placeholder="Enter Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading || otpSent}
        />

        {!otpSent && (
          <button
            onClick={handleSendOtp}
            disabled={!email.trim() || loading}
          >
            <MdEmail className="button-icon" />
            <span>{loading ? "Sending OTP..." : "Send OTP"}</span>
          </button>
        )}

        {otpSent && (
          <>
            <label htmlFor="otp-input">Enter the 6-digit OTP</label>

            <input
              id="otp-input"
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => {
                const value = e.target.value;

                if (/^\d{0,6}$/.test(value)) {
                  setOtp(value);
                }
              }}
              maxLength={6}
              inputMode="numeric"
            />

            <button
              onClick={handleVerifyOtp}
              disabled={otp.length !== 6 || loading}
            >
              <span>{loading ? "Verifying..." : "Verify OTP"}</span>
            </button>
          </>
        )}

        {message && (
          <p
            className={`status-message ${
              message.includes("successfully") ? "success" : "error"
            }`}
            role="status"
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;
