
import "../styles/Answer.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const formatDuration = (value) =>
  value == null ? "Not available" : `${(value / 1000).toFixed(2)} s`;

// Recognize headings in all interview answer formats.
const headingPattern =
  /^(What it is|Purpose|Where we use it|Project example|Additional notes|Implementation Steps|Expected result|Types|Issue|Root cause|How to fix|Validation|Answer|Approach|Situation|Task|Action|Result|Definition|Example|Steps):\s*(.*)$/i;

// Remove optional Markdown bold markers from headings.
const cleanHeading = (value) =>
  value.replace(/^\*\*/, "").replace(/\*\*$/, "").trim();

// Render headings and their explanations on the same line.
const renderFormattedAnswer = (answer) => {
  if (!answer) return null;

  const lines = answer.split(/\r?\n/);
  const elements = [];

  for (let index = 0; index < lines.length; index++) {
    const trimmedLine = lines[index].trim();

    if (!trimmedLine) {
      elements.push(
        <div key={`gap-${index}`} className="answer-line-gap" />
      );
      continue;
    }

    const normalizedLine = trimmedLine.replace(
      /^\*\*(.*?)\*\*$/,
      "$1"
    );

    const headingMatch = normalizedLine.match(headingPattern);

    if (headingMatch) {
      const heading = cleanHeading(headingMatch[1]) + ":";
      let content = headingMatch[2].trim();

      // If the heading is on its own line, attach the next
      // non-empty line to it.
      if (!content) {
        let nextIndex = index + 1;

        while (
          nextIndex < lines.length &&
          !lines[nextIndex].trim()
        ) {
          nextIndex++;
        }

        if (nextIndex < lines.length) {
          const nextLine = lines[nextIndex].trim();
          const nextHeading = nextLine.match(headingPattern);

          // Do not consume another heading.
          if (!nextHeading) {
            content = nextLine;
            index = nextIndex;
          }
        }
      }

      elements.push(
        <div key={`section-${index}`} className="answer-paragraph">
          <span className="answer-section-heading">
            {heading}
          </span>
          {content && <> {content}</>}
        </div>
      );

      continue;
    }

    elements.push(
      <div key={`paragraph-${index}`} className="answer-paragraph">
        {trimmedLine}
      </div>
    );
  }

  return elements;
};

function Answer({ history, currentIndex, onPrevious, onNext }) {
  const currentItem = history[currentIndex];
  const metrics = currentItem?.metrics;
  const diagnostics = currentItem?.diagnostics || {};

  const aiRoute = diagnostics.aiRoute ?? metrics?.aiRoute;
  const aiTarget = diagnostics.aiTarget ?? metrics?.aiTarget;

  const aiCallType =
    aiRoute === "agent"
      ? "Agent - AI call"
      : aiRoute === "direct_model"
        ? "Model - AI call"
        : "AI call unknown";

  return (
    <div className="answer-panel">
      <div className="answer-header">
        <h3>Answer</h3>

        <div className="page-navigation">
          <button
            type="button"
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
            type="button"
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
          <div className="answer-question">
            <strong>Question {currentIndex + 1}:</strong>
            <span>{currentItem.question}</span>
          </div>

          <div className="answer-text">
            {renderFormattedAnswer(currentItem.answer)}
          </div>

          {!currentItem.streaming && (
            <div className="performance-summary">
              <span className="summary-time">
                {formatDuration(metrics?.uiFirstTextMs)} First response
              </span>

              <span className="summary-separator">|</span>

              <span className="summary-time">
                {formatDuration(metrics?.uiTotalDurationMs)} Total completion
              </span>

              <span className="summary-separator">|</span>

              <span
                className={
                  aiRoute === "agent"
                    ? "ai-route-label agent-route"
                    : aiRoute === "direct_model"
                      ? "ai-route-label model-route"
                      : "ai-route-label"
                }
                title={aiTarget || "AI route unavailable"}
              >
                {aiCallType}
              </span>
            </div>
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
