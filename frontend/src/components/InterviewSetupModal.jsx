
import { useState } from "react";
import "../styles/InterviewSetupModal.css";

function InterviewSetupModal({
  onClose,
  onSubmit,
  isSubmitting = false,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [round, setRound] = useState("L1");
  const [duration, setDuration] = useState("60");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    if (
      !name.trim() ||
      !email.trim() ||
      !company.trim()
    ) {
      alert("Please fill all required fields");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      alert("Please enter a valid email address");
      return;
    }

    const interviewDetails = {
      name: name.trim(),
      email: email.trim(),
      company: company.trim(),
      round,
      duration,
    };

    onSubmit(interviewDetails);
  };

  return (
    <div className="modal-overlay">
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="interview-setup-title"
      >
        <h2 id="interview-setup-title">Interview Setup</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="candidate-name">Name *</label>
            <input
              id="candidate-name"
              type="text"
              placeholder="Enter candidate name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              disabled={isSubmitting}
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="candidate-email">Email *</label>
            <input
              id="candidate-email"
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={isSubmitting}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="candidate-company">Company *</label>
            <input
              id="candidate-company"
              type="text"
              placeholder="Enter company name"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="interview-round">Interview Round</label>
            <select
              id="interview-round"
              value={round}
              onChange={(event) => setRound(event.target.value)}
              disabled={isSubmitting}
            >
              <option value="L1">L1</option>
              <option value="L2">L2</option>
              <option value="L3">L3</option>
              <option value="HR">HR</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="interview-duration">Duration</label>
            <select
              id="interview-duration"
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
              disabled={isSubmitting}
            >
              <option value="30">30 Minutes</option>
              <option value="45">45 Minutes</option>
              <option value="60">60 Minutes</option>
              <option value="90">90 Minutes</option>
            </select>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Initializing Interview..."
                : "Start Interview"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InterviewSetupModal;
