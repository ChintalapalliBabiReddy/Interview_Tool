import {
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from "react";
import "../styles/QuestionInputPanel.css";
import { FaSearch } from "react-icons/fa";
import { AUTH_API } from "../constants/apiConstants";

const QuestionInputPanel = forwardRef(function QuestionInputPanel(
  { onAnswerGenerated, onLoadingChange, interviewSessionId },
  ref
) {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateAnswer = useCallback(
    async (questionText) => {
      const isAudioQuestion = typeof questionText === "string";
      const questionToSend = (
        isAudioQuestion ? questionText : question
      ).trim();

      if (!questionToSend || isLoading) return;

      // A session must be initialized before questions can be submitted.
      if (!interviewSessionId) {
        setError("Please start the interview before generating answers.");
        return;
      }

      setIsLoading(true);
      onLoadingChange?.(true);
      setError("");

      let accumulatedAnswer = "";
      const uiRequestStart = performance.now();
      let uiFirstTextAt = null;
      let uiCompletedAt = null;
      let backendMetrics = {};

      try {
        const response = await fetch(AUTH_API.AI_API_GENERATE_ANSWER, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
          },
          body: JSON.stringify({
            question: questionToSend,
            interviewSessionId,
          }),
        });

        const uiResponseHeadersAt = performance.now();

        if (!response.ok) {
          const result = await response.json().catch(() => ({}));
          throw new Error(
            result.message || "Failed to generate answer"
          );
        }

        if (!response.body) {
          throw new Error(
            "Streaming is not supported by this response"
          );
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let completed = false;

        const processEvent = (eventText) => {
          const dataLines = eventText
            .split(/\r?\n/)
            .filter((line) => line.startsWith("data:"))
            .map((line) => line.slice(5).trimStart());

          if (!dataLines.length) return;

          const payload = JSON.parse(dataLines.join("\n"));

          if (
            payload.type === "timing" ||
            payload.type === "metrics"
          ) {
            backendMetrics = {
              ...backendMetrics,
              ...(payload.metrics || {}),
            };
          } else if (payload.type === "delta" && payload.text) {
            accumulatedAnswer += payload.text;

            if (
              uiFirstTextAt === null &&
              payload.text.trim().length > 0
            ) {
              uiFirstTextAt = performance.now();
            }

            // Update the existing answer while the AI streams.
            onAnswerGenerated({
              question: questionToSend,
              answer: accumulatedAnswer,
              streaming: true,
            });
          } else if (payload.type === "done") {
            completed = true;
          } else if (payload.type === "error") {
            throw new Error(
              payload.message || "Failed to generate answer"
            );
          }
        };

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          const events = buffer.split(/\r?\n\r?\n/);
          buffer = events.pop() || "";

          for (const eventText of events) {
            processEvent(eventText);
          }
        }

        buffer += decoder.decode();

        if (buffer.trim()) {
          processEvent(buffer);
        }

        if (!completed) {
          throw new Error("The answer stream ended unexpectedly");
        }

        if (!accumulatedAnswer.trim()) {
          throw new Error("The AI returned an empty answer");
        }

        uiCompletedAt = performance.now();

        const metrics = {
          uiRequestStartAt: new Date().toISOString(),
          uiResponseHeadersMs: Math.round(
            uiResponseHeadersAt - uiRequestStart
          ),
          uiFirstTextMs:
            uiFirstTextAt === null
              ? null
              : Math.round(uiFirstTextAt - uiRequestStart),
          uiAnswerStreamingMs:
            uiFirstTextAt === null
              ? null
              : Math.round(uiCompletedAt - uiFirstTextAt),
          uiTotalDurationMs: Math.round(
            uiCompletedAt - uiRequestStart
          ),
          ...backendMetrics,
        };

        console.table(metrics);

        onAnswerGenerated({
          question: questionToSend,
          answer: accumulatedAnswer,
          streaming: false,
          metrics,
        });

        if (!isAudioQuestion) {
          setQuestion("");
        }
      } catch (error) {
        console.error("AI answer streaming failed:", error);
        setError(error.message || "Unable to generate answer");
      } finally {
        setIsLoading(false);
        onLoadingChange?.(false);
      }
    },
    [
      question,
      isLoading,
      interviewSessionId,
      onAnswerGenerated,
      onLoadingChange,
    ]
  );

  useImperativeHandle(
    ref,
    () => ({
      generateAnswer: handleGenerateAnswer,
    }),
    [handleGenerateAnswer]
  );

  return (
    <div className="question-input-container">
      <textarea
        className="question-input"
        placeholder="Type interview question here..."
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        disabled={isLoading}
      />

      <div className="input-footer">
        {error && (
          <span className="error-message" role="alert">
            {error}
          </span>
        )}

        <button
          type="button"
          className="generate-btn"
          onClick={() => handleGenerateAnswer()}
          disabled={
            !question.trim() ||
            isLoading ||
            !interviewSessionId
          }
          aria-label="Generate answer for manually typed question"
        >
          <FaSearch />
        </button>
      </div>
    </div>
  );
});

export default QuestionInputPanel;