
import "../styles/Answer.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const formatDuration = (value) =>
  value == null ? "Not available" : `${(value / 1000).toFixed(2)} s`;

function Answer({ history, currentIndex, onPrevious, onNext }) {
  const currentItem = history[currentIndex];
  const metrics = currentItem?.metrics;
  const diagnostics = currentItem?.diagnostics || {};

  const aiRoute = diagnostics.aiRoute ?? metrics?.aiRoute;
  const aiTarget = diagnostics.aiTarget ?? metrics?.aiTarget;

  const aiCallType =
    aiRoute === "agent"
      ? `Agent — ${aiTarget || "my-first-agent"}`
      : aiRoute === "direct_model"
        ? `Direct model — ${aiTarget || "gpt-4.1-mini"}`
        : "Not available";

  return (
    <div className="answer-panel">
      <div className="answer-header">
        <h3>AI Answer Panel</h3>

        <div className="page-navigation">
          <button
            onClick={onPrevious}
            disabled={currentIndex <= 0}
            aria-label="Previous question"
          >
            <FaChevronLeft />
          </button>

          <span>
            {history.length ? currentIndex + 1 : 0} / {history.length}
          </span>

          <button
            onClick={onNext}
            disabled={currentIndex >= history.length - 1}
            aria-label="Next question"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {currentItem ? (
        <div className="answer-content">
          <h4>Question {currentIndex + 1}</h4>
          <p className="answer-question">{currentItem.question}</p>

          <h4>AI Answer</h4>
          <div className="answer-text">{currentItem.answer}</div>

          {!currentItem.streaming && (
            <section className="performance-diagnostics">
              <h4>Performance Diagnostics</h4>

              <div className="diagnostic-row">
                <span>AI call type</span>
                <span>{aiCallType}</span>
              </div>

              <div className="diagnostic-row">
                <span>First response time</span>
                <span>{formatDuration(metrics?.uiFirstTextMs)}</span>
              </div>

              <div className="diagnostic-row">
                <span>Total completion time</span>
                <span>{formatDuration(metrics?.uiTotalDurationMs)}</span>
              </div>
            </section>
          )}
        </div>
      ) : (
        <div className="answer-placeholder">
          <h3>No answers yet</h3>
          <p>Enter an interview question and click Generate.</p>
        </div>
      )}
    </div>
  );
}

export default Answer;
