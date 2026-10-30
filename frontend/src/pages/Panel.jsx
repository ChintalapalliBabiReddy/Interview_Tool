
import AnswerPanel from "../components/Answer";
import QuestionInputPanel from "../components/QuestionInputPanel";
import QuestionList from "../components/QuestionList";
import SpeechToText from "../components/SpeechToText";
import InterviewSetupModal from "../components/InterviewSetupModal";
import ScreenShare from "../components/ScreenShare";
import Download from "../components/Download";

import { FaFileAlt, FaPlay } from "react-icons/fa";

import "../styles/Panel.css";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";

import { useNavigate } from "react-router-dom";
import { AUTH_API } from "../constants/apiConstants";

function createRequestId() {
  return (
    globalThis.crypto?.randomUUID?.() ||
    `${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
}

function Panel() {
  const navigate = useNavigate();

  const questionInputRef = useRef(null);
  const speechToTextRef = useRef(null);

  const submittingQuestionRef = useRef(false);
  const answerHistoryRef = useRef([]);

  const [interviewStarted, setInterviewStarted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [candidateDetails, setCandidateDetails] = useState(null);

  const [interviewSessionId, setInterviewSessionId] = useState(null);

  const [isStartingInterview, setIsStartingInterview] = useState(false);
  const [startError, setStartError] = useState("");

  const [resumeFile, setResumeFile] = useState(null);
  const [resumeId, setResumeId] = useState(null);

  const [timeLeft, setTimeLeft] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [isGeneratingAnswer, setIsGeneratingAnswer] = useState(false);

  const [transcript, setTranscript] = useState("");
  const [questions, setQuestions] = useState([]);
  const [audioStream, setAudioStream] = useState(null);

  const [answerHistory, setAnswerHistory] = useState([]);
  const [currentAnswerIndex, setCurrentAnswerIndex] = useState(0);

  // Interview countdown timer.
  useEffect(() => {
    if (!interviewStarted || timeLeft <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((previousValue) =>
        Math.max(0, previousValue - 1),
      );
    }, 1000);

    return () => window.clearInterval(timer);
  }, [interviewStarted, timeLeft]);

  // Receive transcript updates from Azure Speech.
  const handleTranscript = useCallback((text) => {
    setTranscript(text);
  }, []);

  // Initialize interview session.
  const handleStartInterview = async (interviewDetails) => {
    if (isStartingInterview) return;

    if (!resumeId) {
      window.alert(
        "Please upload and process your resume before starting.",
      );
      return;
    }

    setIsStartingInterview(true);
    setStartError("");

    try {
      const response = await fetch(
        AUTH_API.INTERVIEW_SESSION_API,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: interviewDetails.name.trim(),
            email: interviewDetails.email.trim(),
            company: interviewDetails.company.trim(),
            round: interviewDetails.round,
            durationMinutes: Number(
              interviewDetails.duration,
            ),
            resumeId,
          }),
        },
      );

      const result = await response.json();

      if (
        !response.ok ||
        !result.success ||
        !result.interviewSessionId
      ) {
        throw new Error(
          result.message ||
            "Failed to initialize interview session",
        );
      }

      setInterviewSessionId(result.interviewSessionId);
      setCandidateDetails(interviewDetails);

      setTimeLeft(
        Number(interviewDetails.duration) * 60,
      );

      setInterviewStarted(true);
      setShowModal(false);

      console.log(
        "Interview session initialized with resume context.",
      );
    } catch (error) {
      console.error(
        "Interview initialization failed:",
        error,
      );

      setStartError(
        error.message || "Failed to start interview",
      );
    } finally {
      setIsStartingInterview(false);
    }
  };

  // Submit a captured audio question.
  const handleAudioQuestionAnswer = useCallback(() => {
    if (
      submittingQuestionRef.current ||
      isGeneratingAnswer ||
      questionInputRef.current?.isBusy()
    ) {
      return;
    }

    if (!interviewSessionId) {
      window.alert(
        "Please start the interview before creating an answer.",
      );
      return;
    }

    const questionText =
      speechToTextRef.current
        ?.getCurrentTranscript()
        ?.trim() ||
      transcript.trim();

    if (!questionText) return;

    const requestId = createRequestId();

    submittingQuestionRef.current = true;

    const question = {
      id: requestId,
      text: questionText,
    };

    // Keep a permanent record of the captured question.
    setQuestions((previousQuestions) => [
      ...previousQuestions,
      {
        ...question,
        number: previousQuestions.length + 1,
      },
    ]);

    // Start the request before clearing the transcript.
    const generationPromise =
      questionInputRef.current?.generateAnswer(
        questionText,
        requestId,
      );

    if (!generationPromise) {
      submittingQuestionRef.current = false;
      return;
    }

    // The AI request has started.
    // New audio can now accumulate in the fresh transcript buffer.
    speechToTextRef.current?.clearCurrentTranscript();
    setTranscript("");

    generationPromise.then(
      () => {
        submittingQuestionRef.current = false;
      },
      (error) => {
        console.error(
          "Question generation promise failed:",
          error,
        );

        submittingQuestionRef.current = false;
      },
    );
  }, [
    transcript,
    interviewSessionId,
    isGeneratingAnswer,
  ]);

  // Logout.
  const handleLogout = () => {
    if (window.confirm("Are you sure to logout?")) {
      setAudioStream(null);
      navigate("/");
    }
  };

  // Format remaining interview time.
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);

    const minutes = Math.floor(
      (totalSeconds % 3600) / 60,
    );

    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${String(hours).padStart(2, "0")}:${String(
        minutes,
      ).padStart(2, "0")}:${String(seconds).padStart(
        2,
        "0",
      )}`;
    }

    return `${String(minutes).padStart(2, "0")}:${String(
      seconds,
    ).padStart(2, "0")}`;
  };

  // Resume upload.
  const handleResumeUpload = async (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    const extension = selectedFile.name
      .split(".")
      .pop()
      .toLowerCase();

    if (!["pdf", "docx"].includes(extension)) {
      window.alert(
        "Please upload a PDF or DOCX resume.",
      );

      event.target.value = "";
      return;
    }

    const formData = new FormData();

    formData.append("resume", selectedFile);

    setIsUploading(true);
    setStartError("");

    try {
      const response = await fetch(
        AUTH_API.RESUME_UPLOAD_API,
        {
          method: "POST",
          body: formData,
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Resume upload failed",
        );
      }

      if (!result.resumeId) {
        throw new Error(
          "The server did not return a resume ID. Please try uploading again.",
        );
      }

      setResumeFile(selectedFile);
      setResumeId(result.resumeId);

      console.log(
        "Resume uploaded and processed successfully.",
        {
          fileName: result.fileName,
          resumeId: result.resumeId,
        },
      );

      window.alert(
        "Resume uploaded and processed successfully!",
      );
    } catch (error) {
      console.error("Resume upload failed:", error);

      setResumeFile(null);
      setResumeId(null);

      window.alert(
        error.message || "Failed to upload resume",
      );
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  // Update an answer by its unique request ID.
  // Repeated question text will never overwrite another answer.
  const handleAnswerGenerated = useCallback((item) => {
    if (!item.requestId) {
      console.error(
        "Answer received without requestId:",
        item,
      );
      return;
    }

    const previousHistory = answerHistoryRef.current;

    const existingIndex = previousHistory.findIndex(
      (entry) => entry.requestId === item.requestId,
    );

    let updatedHistory;

    if (existingIndex !== -1) {
      updatedHistory = [...previousHistory];

      updatedHistory[existingIndex] = {
        ...updatedHistory[existingIndex],
        ...item,
      };
    } else {
      updatedHistory = [
        ...previousHistory,
        item,
      ];
    }

    answerHistoryRef.current = updatedHistory;

    setAnswerHistory(updatedHistory);

    // Navigate to the new answer only when it is first created.
    if (existingIndex === -1) {
      setCurrentAnswerIndex(
        updatedHistory.length - 1,
      );
    }
  }, []);

  // Navigate to previous answer.
  const handlePreviousAnswer = () => {
    setCurrentAnswerIndex((index) =>
      Math.max(0, index - 1),
    );
  };

  // Navigate to next answer.
  const handleNextAnswer = () => {
    setCurrentAnswerIndex((index) =>
      Math.min(
        answerHistory.length - 1,
        index + 1,
      ),
    );
  };

  return (
    <>
      {showModal && (
        <InterviewSetupModal
          onClose={() => {
            if (!isStartingInterview) {
              setShowModal(false);
              setStartError("");
            }
          }}
          onSubmit={handleStartInterview}
          isSubmitting={isStartingInterview}
        />
      )}

      {startError && (
        <div
          className="error-message"
          role="alert"
        >
          {startError}
        </div>
      )}

      <div className="panel-container">
        <div className="panel-content">
          <div className="left-panel">
            <div className="panel-header">
              {!interviewStarted ? (
                <button
                  className="start-btn"
                  onClick={() => {
                    setStartError("");
                    setShowModal(true);
                  }}
                  disabled={isStartingInterview}
                >
                  <FaPlay />
                  Start
                </button>
              ) : (
                <button className="timer-btn">
                  ⏱ {formatTime(timeLeft)}
                </button>
              )}

              <ScreenShare
                onStreamChange={setAudioStream}
              />

              <label
                className={`resume-icon-btn ${
                  resumeFile
                    ? "resume-uploaded"
                    : "resume-not-uploaded"
                }`}
                title={
                  isUploading
                    ? "Uploading resume..."
                    : resumeFile
                      ? `Resume uploaded: ${resumeFile.name}`
                      : "Upload resume"
                }
                aria-label={
                  resumeFile
                    ? "Resume uploaded"
                    : "Upload resume"
                }
              >
                {isUploading ? (
                  <span className="resume-spinner" />
                ) : (
                  <FaFileAlt />
                )}

                <span>Resume</span>

                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleResumeUpload}
                  disabled={
                    isUploading ||
                    Boolean(resumeFile) ||
                    interviewStarted
                  }
                  hidden
                />
              </label>

              {interviewStarted && (
                <select
                  className="speed-dropdown"
                  defaultValue="Balanced"
                >
                  <option value="Fastest">Fastest</option>
                  <option value="Balanced">Balanced</option>
                  <option value="Accurate">Accurate</option>
                </select>
              )}

              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>

            <div className="question-section">
              <SpeechToText
                ref={speechToTextRef}
                audioStream={audioStream}
                onTranscript={handleTranscript}
              />

              <QuestionList
                questions={questions}
                transcript={transcript}
                onGenerateAnswer={handleAudioQuestionAnswer}
                isGeneratingAnswer={isGeneratingAnswer}
              />
            </div>

            <div className="action-section">
              <button
                className="action-btn"
                onClick={handleNextAnswer}
                disabled={
                  answerHistory.length === 0 ||
                  currentAnswerIndex >=
                    answerHistory.length - 1
                }
              >
                Next
              </button>

              <Download history={answerHistory} />
            </div>

            <div className="input-section">
              <QuestionInputPanel
                ref={questionInputRef}
                onAnswerGenerated={handleAnswerGenerated}
                onLoadingChange={setIsGeneratingAnswer}
                interviewSessionId={interviewSessionId}
              />
            </div>
          </div>

          <AnswerPanel
            history={answerHistory}
            currentIndex={currentAnswerIndex}
            onPrevious={handlePreviousAnswer}
            onNext={handleNextAnswer}
          />
        </div>
      </div>
    </>
  );
}

export default Panel;
