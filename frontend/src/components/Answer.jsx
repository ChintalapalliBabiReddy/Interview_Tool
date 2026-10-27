
import "../styles/Answer.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const formatDuration = (value) =>
  value == null ? "Not available" : `${value} ms`;

function Answer({ history, currentIndex, onPrevious, onNext }) {
  const currentItem = history[currentIndex];
  const metrics = currentItem?.metrics;

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

          {!currentItem.streaming && metrics && (
            <section className="performance-diagnostics">
              <h4>Performance Diagnostics</h4>

              <div className="diagnostic-row">
                <span>UI request started</span>
                <span>{metrics.uiRequestStartAt}</span>
              </div>
              <div className="diagnostic-row">
                <span>UI received response headers</span>
                <span>{formatDuration(metrics.uiResponseHeadersMs)}</span>
              </div>
              <div className="diagnostic-row">
                <span>Conversation creation</span>
                <span>{formatDuration(metrics.conversationCreationMs)}</span>
              </div>
              <div className="diagnostic-row">
                <span>AI request setup</span>
                <span>{formatDuration(metrics.aiRequestSetupMs)}</span>
              </div>
              <div className="diagnostic-row">
                <span>Backend first text</span>
                <span>{formatDuration(metrics.backendFirstTextMs)}</span>
              </div>
              <div className="diagnostic-row">
                <span>UI first text received</span>
                <span>{formatDuration(metrics.uiFirstTextMs)}</span>
              </div>
              <div className="diagnostic-row">
                <span>First text to full answer</span>
                <span>{formatDuration(metrics.uiAnswerStreamingMs)}</span>
              </div>
              <div className="diagnostic-row">
                <span>Backend total duration</span>
                <span>{formatDuration(metrics.totalBackendDurationMs)}</span>
              </div>
              <div className="diagnostic-row">
                <span>Total UI duration</span>
                <span>{formatDuration(metrics.uiTotalDurationMs)}</span>
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
