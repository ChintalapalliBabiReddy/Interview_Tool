
import "../styles/QuestionList.css";

function QuestionList({
  questions = [],
  transcript = "",
  onGenerateAnswer,
  isGeneratingAnswer = false,
}) {
  const hasActiveQuestion = Boolean(transcript.trim());

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing &&
      hasActiveQuestion &&
      !isGeneratingAnswer
    ) {
      event.preventDefault();
      onGenerateAnswer?.();
    }
  };

  return (
    <div className="question-list-container">
      <div
        className="question-list"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label="Detected interview questions"
      >
        {questions.map((question, index) => (
          <div
            key={question.id}
            className="detected-question"
          >
            <strong>
              Q{question.number ?? index + 1}:
            </strong>

            <span>{question.text}</span>
          </div>
        ))}

        {hasActiveQuestion && (
          <div
            className="live-transcript"
            aria-live="polite"
          >
            <strong>
              Q{questions.length + 1}:
            </strong>

            <span>{transcript}</span>

            <span
              className="listening-indicator"
              role="status"
              aria-label="Listening"
            >
              <span />
              <span />
              <span />
            </span>
          </div>
        )}

        {!questions.length && !hasActiveQuestion && (
          <p className="empty-questions">
            Waiting for speech...
          </p>
        )}
      </div>

      <button
        type="button"
        className="action-btn"
        onClick={onGenerateAnswer}
        disabled={
          !hasActiveQuestion ||
          isGeneratingAnswer
        }
      >
        {isGeneratingAnswer
          ? "Generating..."
          : "Create Answer"}
      </button>
    </div>
  );
}

export default QuestionList;
