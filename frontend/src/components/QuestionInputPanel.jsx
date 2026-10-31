
import {
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback,
  useRef,
} from "react";

import "../styles/QuestionInputPanel.css";
import { FaSearch } from "react-icons/fa";
import { AUTH_API } from "../constants/apiConstants";

const createRequestId = () =>
  globalThis.crypto?.randomUUID?.() ||
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const QuestionInputPanel = forwardRef(function QuestionInputPanel(
  {
    onAnswerGenerated,
    onLoadingChange,
    interviewSessionId,
  },
  ref,
) {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const loadingRef = useRef(false);

  // Clear the manually entered question.
  const clearQuestion = useCallback(() => {
    if (loadingRef.current) return;

    setQuestion("");
    setError("");
  }, []);

  const handleGenerateAnswer = useCallback(
    async (questionText, suppliedRequestId) => {
      const isAudioQuestion = typeof questionText === "string";

      const questionToSend = (
        isAudioQuestion ? questionText : question
      ).trim();

      if (!questionToSend || loadingRef.current) {
        return false;
      }

      if (!interviewSessionId) {
        window.alert(
          "Please add your profile details and start the interview before asking questions.",
        );

        return false;
      }

      const requestId = suppliedRequestId || createRequestId();

      loadingRef.current = true;

      setIsLoading(true);
      onLoadingChange?.(true);
      setError("");

      let accumulatedAnswer = "";
      let uiFirstTextAt = null;
      let backendMetrics = {};
      let aiDiagnostics = {};
      let completed = false;
      let reader = null;

      const uiRequestStart = performance.now();
      const uiRequestStartAt = new Date().toISOString();

      onAnswerGenerated({
        requestId,
        question: questionToSend,
        answer: "",
        streaming: true,
      });

      try {
        const response = await fetch(
          AUTH_API.AI_API_GENERATE_ANSWER,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Accept: "text/event-stream",
            },
            body: JSON.stringify({
              question: questionToSend,
              interviewSessionId,
            }),
          },
        );

        const uiResponseHeadersAt = performance.now();

        if (!response.ok) {
          const result = await response.json().catch(() => ({}));

          throw new Error(
            result.message || "Failed to generate answer",
          );
        }

        if (!response.body) {
          throw new Error(
            "Streaming is not supported by this response",
          );
        }

        reader = response.body.getReader();

        const decoder = new TextDecoder();
        let buffer = "";

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

            const {
              aiRoute,
              aiTarget,
              agentUsed,
              resumeContextUsed,
              sessionReused,
            } = payload.metrics || {};

            aiDiagnostics = {
              ...aiDiagnostics,
              ...(aiRoute !== undefined ? { aiRoute } : {}),
              ...(aiTarget !== undefined ? { aiTarget } : {}),
              ...(agentUsed !== undefined ? { agentUsed } : {}),
              ...(resumeContextUsed !== undefined
                ? { resumeContextUsed }
                : {}),
              ...(sessionReused !== undefined
                ? { sessionReused }
                : {}),
            };
          } else if (
            payload.type === "delta" &&
            payload.text
          ) {
            accumulatedAnswer += payload.text;

            if (
              uiFirstTextAt === null &&
              payload.text.trim().length > 0
            ) {
              uiFirstTextAt = performance.now();
            }

            onAnswerGenerated({
              requestId,
              question: questionToSend,
              answer: accumulatedAnswer,
              streaming: true,
              diagnostics: aiDiagnostics,
              metrics: backendMetrics,
            });
          } else if (payload.type === "done") {
            completed = true;

            if (payload.diagnostics) {
              aiDiagnostics = {
                ...aiDiagnostics,
                ...payload.diagnostics,
              };
            }
          } else if (payload.type === "error") {
            throw new Error(
              payload.message || "Failed to generate answer",
            );
          }
        };

        while (true) {
          const { value, done } = await reader.read();

          if (done) break;

          buffer += decoder.decode(value, {
            stream: true,
          });

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
          throw new Error(
            "The answer stream ended unexpectedly",
          );
        }

        if (!accumulatedAnswer.trim()) {
          throw new Error("The AI returned an empty answer");
        }

        const uiCompletedAt = performance.now();

        const metrics = {
          uiRequestStartAt,

          uiResponseHeadersMs: Math.round(
            uiResponseHeadersAt - uiRequestStart,
          ),

          uiFirstTextMs:
            uiFirstTextAt === null
              ? null
              : Math.round(
                  uiFirstTextAt - uiRequestStart,
                ),

          uiAnswerStreamingMs:
            uiFirstTextAt === null
              ? null
              : Math.round(
                  uiCompletedAt - uiFirstTextAt,
                ),

          uiTotalDurationMs: Math.round(
            uiCompletedAt - uiRequestStart,
          ),

          ...backendMetrics,
        };

        console.table({
          ...metrics,
          ...aiDiagnostics,
        });

        onAnswerGenerated({
          requestId,
          question: questionToSend,
          answer: accumulatedAnswer,
          streaming: false,
          metrics,
          diagnostics: aiDiagnostics,
        });

        if (!isAudioQuestion) {
          setQuestion("");
        }

        return true;
      } catch (err) {
        console.error(
          "AI answer streaming failed:",
          err,
        );

        setError(
          err.message || "Unable to generate answer",
        );

        onAnswerGenerated({
          requestId,
          question: questionToSend,
          answer: accumulatedAnswer,
          streaming: false,
          metrics: backendMetrics,
          diagnostics: aiDiagnostics,
          failed: true,
        });

        return false;
      } finally {
        try {
          await reader?.cancel();
        } catch {
          // Stream may already be closed.
        }

        loadingRef.current = false;

        setIsLoading(false);
        onLoadingChange?.(false);
      }
    },
    [
      question,
      interviewSessionId,
      onAnswerGenerated,
      onLoadingChange,
    ],
  );

  useImperativeHandle(
    ref,
    () => ({
      generateAnswer: handleGenerateAnswer,
      isBusy: () => loadingRef.current,
      clearQuestion,
    }),
    [handleGenerateAnswer, clearQuestion],
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
          <span
            className="error-message"
            role="alert"
          >
            {error}
          </span>
        )}

        <button
          type="button"
          className="generate-btn"
          onClick={() => handleGenerateAnswer()}
          disabled={!question.trim() || isLoading}
          aria-label="Generate answer for manually typed question"
        >
          <FaSearch />
        </button>
      </div>
    </div>
  );
});

export default QuestionInputPanel;
