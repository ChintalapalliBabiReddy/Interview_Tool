
import { useState } from "react";
import "../styles/Login.css";
import { MdEmail } from "react-icons/md";
import { FaShieldAlt } from "react-icons/fa";
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
        <div className="login-brand-icon">
          <FaShieldAlt />
        </div>

        <div className="login-heading">
          <h1>Welcome Back</h1>
          <p>
            Sign in to access your AI Interview Assistant.
          </p>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (otpSent) {
              handleVerifyOtp();
            } else {
              handleSendOtp();
            }
          }}
        >
          <div className="login-form-group">
            <label htmlFor="login-email">Email Address</label>

            <input
              id="login-email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={loading || otpSent}
              autoComplete="email"
              required
            />
          </div>

          {otpSent && (
            <div className="login-form-group otp-group">
              <label htmlFor="otp-input">Verification Code</label>

              <input
                id="otp-input"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(event) => {
                  const value = event.target.value;

                  if (/^\d{0,6}$/.test(value)) {
                    setOtp(value);
                  }
                }}
                maxLength={6}
                inputMode="numeric"
                autoComplete="one-time-code"
                disabled={loading}
                required
              />

              <span className="otp-helper">
                Enter the verification code sent to your email.
              </span>
            </div>
          )}

          <button
            type="submit"
            className="login-submit-btn"
            disabled={
              loading ||
              (otpSent
                ? otp.length !== 6
                : !email.trim())
            }
          >
            {!otpSent ? (
              <>
                <MdEmail className="button-icon" />
                <span>
                  {loading ? "Sending OTP..." : "Send OTP"}
                </span>
              </>
            ) : (
              <span>
                {loading ? "Verifying..." : "Verify & Login"}
              </span>
            )}
          </button>
        </form>

        {message && (
          <div
            className={`status-message ${
              message.includes("successfully")
                ? "success"
                : "error"
            }`}
            role="status"
            aria-live="polite"
          >
            {message}
          </div>
        )}

        <div className="login-footer">
          Secure OTP-based authentication
        </div>
      </div>
    </div>
  );
}

export default Login;
