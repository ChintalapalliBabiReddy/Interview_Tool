import AnswerPanel from "../components/Answer";
import QuestionInputPanel from "../components/QuestionInputPanel";
import QuestionList from "../components/QuestionList";
import SpeechToText from "../components/SpeechToText";
import InterviewSetupModal from "../components/InterviewSetupModal";
import ScreenShare from "../components/ScreenShare";
import Download from "../components/Download";
import { FaFileAlt, FaPlay } from "react-icons/fa";
import "../styles/Panel.css";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AUTH_API } from "../constants/apiConstants";

function Panel() {
  const navigate = useNavigate();

  const questionInputRef = useRef(null);
  const speechToTextRef = useRef(null);
  const submittingQuestionRef = useRef(false);

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

  useEffect(() => {
    if (!interviewStarted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((previousValue) => Math.max(0, previousValue - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [interviewStarted, timeLeft]);

  const handleTranscript = useCallback((text) => {
    setTranscript(text);
  }, []);

  const handleStartInterview = async (interviewDetails) => {
    if (isStartingInterview) return;

    if (!resumeId) {
      window.alert("Please upload and process your resume before starting.");
      return;
    }

    setIsStartingInterview(true);
    setStartError("");

    try {
      const response = await fetch(AUTH_API.INTERVIEW_SESSION_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: interviewDetails.name.trim(),
          email: interviewDetails.email.trim(),
          company: interviewDetails.company.trim(),
          round: interviewDetails.round,
          durationMinutes: Number(interviewDetails.duration),
          resumeId,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success || !result.interviewSessionId) {
        throw new Error(
          result.message || "Failed to initialize interview session",
        );
      }

      setInterviewSessionId(result.interviewSessionId);
      setCandidateDetails(interviewDetails);
      setTimeLeft(Number(interviewDetails.duration) * 60);
      setInterviewStarted(true);
      setShowModal(false);

      console.log("Interview session initialized with resume context.");
    } catch (error) {
      console.error("Interview initialization failed:", error);
      setStartError(error.message || "Failed to start interview");
    } finally {
      setIsStartingInterview(false);
    }
  };

  const handleAudioQuestionAnswer = useCallback(() => {
    if (submittingQuestionRef.current) return;

    const questionText =
      speechToTextRef.current?.getCurrentTranscript()?.trim() ||
      transcript.trim();

    if (!questionText) return;

    submittingQuestionRef.current = true;

    const question = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      text: questionText,
    };

    setQuestions((previousQuestions) => [
      ...previousQuestions,
      {
        ...question,
        number: previousQuestions.length + 1,
      },
    ]);

    speechToTextRef.current?.clearCurrentTranscript();
    setTranscript("");

    questionInputRef.current?.generateAnswer(questionText);

    window.setTimeout(() => {
      submittingQuestionRef.current = false;
    }, 0);
  }, [transcript]);

  const handleLogout = () => {
    if (window.confirm("Are you sure to logout?")) {
      setAudioStream(null);
      navigate("/");
    }
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0",
      )}:${String(seconds).padStart(2, "0")}`;
    }

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0",
    )}`;
  };

  const handleResumeUpload = async (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    const extension = selectedFile.name.split(".").pop().toLowerCase();

    if (!["pdf", "docx"].includes(extension)) {
      window.alert("Please upload a PDF or DOCX resume.");
      event.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("resume", selectedFile);

    setIsUploading(true);
    setStartError("");

    try {
      const response = await fetch(AUTH_API.RESUME_UPLOAD_API, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Resume upload failed");
      }

      if (!result.resumeId) {
        throw new Error(
          "The server did not return a resume ID. Please try uploading again.",
        );
      }

      setResumeFile(selectedFile);
      setResumeId(result.resumeId);

      console.log("Resume uploaded and processed successfully.", {
        fileName: result.fileName,
        resumeId: result.resumeId,
      });

      window.alert("Resume uploaded and processed successfully!");
    } catch (error) {
      console.error("Resume upload failed:", error);
      setResumeFile(null);
      setResumeId(null);
      window.alert(error.message || "Failed to upload resume");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleAnswerGenerated = useCallback((item) => {
    setAnswerHistory((previousHistory) => {
      const existingIndex = previousHistory.findIndex(
        (entry) => entry.question === item.question,
      );

      if (existingIndex !== -1) {
        const updatedHistory = [...previousHistory];

        updatedHistory[existingIndex] = {
          ...updatedHistory[existingIndex],
          ...item,
        };

        return updatedHistory;
      }

      const updatedHistory = [...previousHistory, item];

      setCurrentAnswerIndex(updatedHistory.length - 1);

      return updatedHistory;
    });
  }, []);

  const handlePreviousAnswer = () => {
    setCurrentAnswerIndex((index) => Math.max(0, index - 1));
  };

  const handleNextAnswer = () => {
    setCurrentAnswerIndex((index) =>
      Math.min(answerHistory.length - 1, index + 1),
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
        <div className="error-message" role="alert">
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
                <button className="timer-btn">⏱ {formatTime(timeLeft)}</button>
              )}

              <ScreenShare onStreamChange={setAudioStream} />

              <label
                className={`resume-icon-btn ${
                  resumeFile ? "resume-uploaded" : "resume-not-uploaded"
                }`}
                title={
                  isUploading
                    ? "Uploading resume..."
                    : resumeFile
                      ? `Resume uploaded: ${resumeFile.name}`
                      : "Upload resume"
                }
                aria-label={resumeFile ? "Resume uploaded" : "Upload resume"}
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
                    isUploading || Boolean(resumeFile) || interviewStarted
                  }
                  hidden
                />
              </label>

              {interviewStarted && (
                <select className="speed-dropdown" defaultValue="Balanced">
                  <option value="Fastest">Fastest</option>
                  <option value="Balanced">Balanced</option>
                  <option value="Accurate">Accurate</option>
                </select>
              )}

              <button className="logout-btn" onClick={handleLogout}>
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
                  currentAnswerIndex >= answerHistory.length - 1
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
            onPrevious={() =>
              setCurrentAnswerIndex((index) => Math.max(0, index - 1))
            }
            onNext={handleNextAnswer}
          />
        </div>
      </div>
    </>
  );
}

export default Panel;
