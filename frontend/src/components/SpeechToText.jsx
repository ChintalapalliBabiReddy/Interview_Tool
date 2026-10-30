
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
import { AUTH_API } from "../constants/apiConstants";

const TARGET_SAMPLE_RATE = 16000;
const TOKEN_REFRESH_MS = 8 * 60 * 1000;
const WORKLET_BUFFER_SIZE = 2048;

function convertToPCM(floatData, inputSampleRate) {
  let samples = floatData;

  if (inputSampleRate !== TARGET_SAMPLE_RATE) {
    const ratio = inputSampleRate / TARGET_SAMPLE_RATE;
    const newLength = Math.floor(floatData.length / ratio);
    const resampled = new Float32Array(newLength);

    for (let i = 0; i < newLength; i++) {
      const position = i * ratio;
      const index = Math.floor(position);
      const fraction = position - index;

      const first = floatData[index] || 0;
      const second = floatData[index + 1] ?? first;

      resampled[i] = first + fraction * (second - first);
    }

    samples = resampled;
  }

  const pcm = new Int16Array(samples.length);

  for (let i = 0; i < samples.length; i++) {
    const sample = Math.max(-1, Math.min(1, samples[i]));

    pcm[i] =
      sample < 0
        ? sample * 32768
        : sample * 32767;
  }

  return pcm;
}

function getLexicalTranscript(result) {
  try {
    const jsonResult = result.properties.getProperty(
      SpeechSDK.PropertyId.SpeechServiceResponse_JsonResult,
    );

    if (jsonResult) {
      const parsed = JSON.parse(jsonResult);
      const lexicalText = parsed.NBest?.[0]?.Lexical;

      if (
        typeof lexicalText === "string" &&
        lexicalText.trim()
      ) {
        return lexicalText;
      }
    }
  } catch (error) {
    console.warn(
      "Could not extract lexical transcription:",
      error,
    );
  }

  return result.text || "";
}

const SpeechToText = forwardRef(function SpeechToText(
  { audioStream, onTranscript },
  ref,
) {
  const [error, setError] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [audioStatus, setAudioStatus] = useState("No audio");

  const onTranscriptRef = useRef(onTranscript);

  const finalTextRef = useRef("");
  const interimTextRef = useRef("");

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  const publishTranscript = () => {
    const combinedText = [
      finalTextRef.current,
      interimTextRef.current,
    ]
      .filter(Boolean)
      .join(" ");

    onTranscriptRef.current?.(combinedText);
  };

  useImperativeHandle(ref, () => ({
    getCurrentTranscript() {
      return [
        finalTextRef.current,
        interimTextRef.current,
      ]
        .filter(Boolean)
        .join(" ");
    },

    clearCurrentTranscript() {
      finalTextRef.current = "";
      interimTextRef.current = "";
      publishTranscript();
    },
  }));

  useEffect(() => {
    if (!audioStream) {
      setIsListening(false);
      setError("");
      setAudioStatus("No audio");

      finalTextRef.current = "";
      interimTextRef.current = "";

      onTranscriptRef.current?.("");
      return;
    }

    let active = true;

    let recognizer = null;
    let pushStream = null;
    let audioContext = null;
    let audioSource = null;
    let processor = null;
    let silentGain = null;

    let tokenRefreshTimer = null;
    let workletUrl = null;

    let frameCount = 0;
    let lastFrameLog = Date.now();

    const audioTrack = audioStream.getAudioTracks()[0];

    if (!audioTrack || audioTrack.readyState !== "live") {
      setError("No active shared audio track.");
      setAudioStatus("Audio track unavailable");
      setIsListening(false);
      return;
    }

    const updateAudioStatus = () => {
      if (!active) return;

      if (audioTrack.readyState !== "live") {
        setAudioStatus("Audio track ended");
      } else if (audioTrack.muted) {
        setAudioStatus("Audio track muted");
      } else if (!audioTrack.enabled) {
        setAudioStatus("Audio track disabled");
      } else if (audioContext?.state === "suspended") {
        setAudioStatus("AudioContext suspended");
      } else if (audioContext?.state === "closed") {
        setAudioStatus("AudioContext closed");
      } else {
        setAudioStatus("Audio track available");
      }
    };

    const writeAudioFrame = (floatData) => {
      if (!active || !pushStream || !audioContext) {
        return;
      }

      try {
        const pcm = convertToPCM(
          floatData,
          audioContext.sampleRate,
        );

        if (pcm.length > 0) {
          pushStream.write(pcm.buffer);
          frameCount++;

          const now = Date.now();

          if (now - lastFrameLog >= 5000) {
            console.log("[Audio Capture]", {
              framesReceived: frameCount,
              audioContextState: audioContext.state,
              sampleRate: audioContext.sampleRate,
              trackState: audioTrack.readyState,
              trackMuted: audioTrack.muted,
              trackEnabled: audioTrack.enabled,
            });

            frameCount = 0;
            lastFrameLog = now;
          }
        }
      } catch (err) {
        console.error("Audio frame processing failed:", err);
      }
    };

    const stopRecognition = () => {
      if (!recognizer) return;

      const currentRecognizer = recognizer;
      recognizer = null;

      try {
        currentRecognizer.stopContinuousRecognitionAsync(
          () => {
            try {
              currentRecognizer.close();
            } catch (err) {
              console.warn("Recognizer close failed:", err);
            }
          },
          (err) => {
            console.error("Recognition stop failed:", err);

            try {
              currentRecognizer.close();
            } catch {
              // Recognizer may already be closed.
            }
          },
        );
      } catch (err) {
        console.error("Recognition stop error:", err);

        try {
          currentRecognizer.close();
        } catch {
          // Recognizer may already be closed.
        }
      }
    };

    const initializeAzureSpeech = async () => {
      try {
        setError("");
        setAudioStatus("Connecting to Azure Speech...");

        const tokenResponse = await fetch(AUTH_API.SPEECH_TOKEN);

        if (!tokenResponse.ok) {
          throw new Error("Could not obtain Azure Speech token.");
        }

        const tokenData = await tokenResponse.json();

        if (
          !tokenData.success ||
          !tokenData.token ||
          !tokenData.region
        ) {
          throw new Error("Invalid Azure Speech token response.");
        }

        if (!active) return;

        const speechConfig =
          SpeechSDK.SpeechConfig.fromAuthorizationToken(
            tokenData.token,
            tokenData.region,
          );

        speechConfig.speechRecognitionLanguage = "en-US";
        speechConfig.outputFormat = SpeechSDK.OutputFormat.Detailed;

        const streamFormat =
          SpeechSDK.AudioStreamFormat.getWaveFormatPCM(
            TARGET_SAMPLE_RATE,
            16,
            1,
          );

        pushStream =
          SpeechSDK.AudioInputStream.createPushStream(streamFormat);

        const audioConfig =
          SpeechSDK.AudioConfig.fromStreamInput(pushStream);

        recognizer = new SpeechSDK.SpeechRecognizer(
          speechConfig,
          audioConfig,
        );

        recognizer.recognized = (_sender, event) => {
          if (!active) return;

          if (
            event.result.reason ===
            SpeechSDK.ResultReason.RecognizedSpeech
          ) {
            const recognizedText = getLexicalTranscript(
              event.result,
            );

            if (recognizedText.trim()) {
              finalTextRef.current = [
                finalTextRef.current,
                recognizedText,
              ]
                .filter(Boolean)
                .join(" ");

              interimTextRef.current = "";

              publishTranscript();

              console.log(
                "[Azure Final Transcript]",
                recognizedText,
              );
            }
          }
        };

        recognizer.recognizing = (_sender, event) => {
          if (!active) return;

          if (event.result.text) {
            interimTextRef.current = event.result.text;
            publishTranscript();
          }
        };

        recognizer.canceled = (_sender, event) => {
          if (!active) return;

          console.error("[Azure Speech Canceled]", {
            reason: event.reason,
            details: event.errorDetails,
          });

          if (
            event.reason === SpeechSDK.CancellationReason.Error
          ) {
            setError(
              event.errorDetails ||
                "Azure Speech recognition failed.",
            );

            setIsListening(false);
          }
        };

        recognizer.sessionStopped = () => {
          if (active) {
            console.warn(
              "[Azure Speech] Recognition session stopped.",
            );

            setIsListening(false);
          }
        };

        tokenRefreshTimer = window.setInterval(async () => {
          try {
            const response = await fetch(AUTH_API.SPEECH_TOKEN);

            if (!response.ok) {
              throw new Error("Speech token refresh failed.");
            }

            const data = await response.json();

            if (active && data.success && data.token && recognizer) {
              recognizer.authorizationToken = data.token;
            }
          } catch (err) {
            console.error("Speech token refresh error:", err);
          }
        }, TOKEN_REFRESH_MS);

        const AudioContextClass =
          window.AudioContext || window.webkitAudioContext;

        audioContext = new AudioContextClass({
          sampleRate: TARGET_SAMPLE_RATE,
        });

        await audioContext.resume();

        if (!active) return;

        const audioOnlyStream = new MediaStream([audioTrack]);

        audioSource =
          audioContext.createMediaStreamSource(audioOnlyStream);

        silentGain = audioContext.createGain();
        silentGain.gain.value = 0;

        // Prefer AudioWorklet to process audio away from the UI thread.
        if (
          audioContext.audioWorklet &&
          typeof window.AudioWorkletNode !== "undefined"
        ) {
          try {
            const workletCode = `
              class InterviewAudioProcessor extends AudioWorkletProcessor {
                constructor() {
                  super();

                  this.buffer = new Float32Array(${WORKLET_BUFFER_SIZE});
                  this.offset = 0;
                }

                process(inputs, outputs) {
                  const input = inputs[0]?.[0];
                  const output = outputs[0]?.[0];

                  if (output) {
                    output.fill(0);
                  }

                  if (input) {
                    for (let i = 0; i < input.length; i++) {
                      this.buffer[this.offset++] = input[i];

                      if (this.offset === this.buffer.length) {
                        const chunk = this.buffer;

                        this.port.postMessage(
                          chunk,
                          [chunk.buffer]
                        );

                        this.buffer = new Float32Array(
                          ${WORKLET_BUFFER_SIZE}
                        );

                        this.offset = 0;
                      }
                    }
                  }

                  return true;
                }
              }

              registerProcessor(
                "interview-audio-processor",
                InterviewAudioProcessor
              );
            `;

            const blob = new Blob([workletCode], {
              type: "application/javascript",
            });

            workletUrl = URL.createObjectURL(blob);

            await audioContext.audioWorklet.addModule(workletUrl);

            if (!active) return;

            processor = new AudioWorkletNode(
              audioContext,
              "interview-audio-processor",
              {
                numberOfInputs: 1,
                numberOfOutputs: 1,
                channelCount: 1,
                outputChannelCount: [1],
              },
            );

            processor.port.onmessage = (event) => {
              writeAudioFrame(event.data);
            };

            console.log("[Audio Capture] AudioWorklet active.");
          } catch (workletError) {
            console.warn(
              "[Audio Capture] AudioWorklet unavailable. Using fallback.",
              workletError,
            );

            if (workletUrl) {
              URL.revokeObjectURL(workletUrl);
              workletUrl = null;
            }

            processor = audioContext.createScriptProcessor(
              4096,
              1,
              1,
            );

            processor.onaudioprocess = (event) => {
              writeAudioFrame(
                event.inputBuffer.getChannelData(0),
              );

              event.outputBuffer.getChannelData(0).fill(0);
            };
          }
        } else {
          processor = audioContext.createScriptProcessor(
            4096,
            1,
            1,
          );

          processor.onaudioprocess = (event) => {
            writeAudioFrame(
              event.inputBuffer.getChannelData(0),
            );

            event.outputBuffer.getChannelData(0).fill(0);
          };

          console.warn(
            "[Audio Capture] ScriptProcessor fallback active.",
          );
        }

        audioSource.connect(processor);
        processor.connect(silentGain);
        silentGain.connect(audioContext.destination);

        audioContext.addEventListener(
          "statechange",
          updateAudioStatus,
        );

        audioTrack.addEventListener("mute", updateAudioStatus);
        audioTrack.addEventListener("unmute", updateAudioStatus);
        audioTrack.addEventListener("ended", updateAudioStatus);

        recognizer.startContinuousRecognitionAsync(
          () => {
            if (active) {
              setIsListening(true);
              setError("");
              updateAudioStatus();

              console.log(
                "[Azure Speech] Recognition started.",
              );
            }
          },
          (err) => {
            if (active) {
              console.error(
                "Azure recognition start failed:",
                err,
              );

              setError(
                "Could not start Azure Speech recognition.",
              );

              setIsListening(false);
            }
          },
        );
      } catch (err) {
        console.error(
          "Azure Speech initialization failed:",
          err,
        );

        if (active) {
          setError(
            err.message || "Could not initialize Azure Speech.",
          );

          setIsListening(false);
        }
      }
    };

    initializeAzureSpeech();

    return () => {
      active = false;

      audioTrack.removeEventListener("mute", updateAudioStatus);
      audioTrack.removeEventListener("unmute", updateAudioStatus);
      audioTrack.removeEventListener("ended", updateAudioStatus);

      audioContext?.removeEventListener(
        "statechange",
        updateAudioStatus,
      );

      if (tokenRefreshTimer) {
        clearInterval(tokenRefreshTimer);
      }

      if (processor) {
        if (processor.port) {
          processor.port.onmessage = null;
          processor.port.close();
        }

        if ("onaudioprocess" in processor) {
          processor.onaudioprocess = null;
        }

        processor.disconnect();
      }

      try {
        audioSource?.disconnect();
        silentGain?.disconnect();
      } catch {
        // Audio nodes may already be disconnected.
      }

      stopRecognition();

      try {
        pushStream?.close();
      } catch {
        // Push stream may already be closed.
      }

      if (audioContext && audioContext.state !== "closed") {
        audioContext.close();
      }

      if (workletUrl) {
        URL.revokeObjectURL(workletUrl);
      }
    };
  }, [audioStream]);

  return (
    <div className="speech-to-text">
      {error && <p role="status">{error}</p>}

      {audioStream && (
        <div className="speech-status">
          <span
            className={`audio-indicator ${
              isListening ? "audio-active" : "audio-inactive"
            }`}
            title={
              isListening
                ? "Azure Speech recognition active"
                : "Azure Speech recognition inactive"
            }
            role="status"
          />

          <small>{audioStatus}</small>
        </div>
      )}
    </div>
  );
});

export default SpeechToText;
