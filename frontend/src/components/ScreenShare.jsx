
import { useEffect, useRef, useState } from "react";
import { FaDesktop } from "react-icons/fa";
import "../styles/ScreenShare.css";

function ScreenShare({ onStreamChange }) {
  const [isSharing, setIsSharing] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);

  const streamRef = useRef(null);
  const onStreamChangeRef = useRef(onStreamChange);

  useEffect(() => {
    onStreamChangeRef.current = onStreamChange;
  }, [onStreamChange]);

  const stopSharing = () => {
    const stream = streamRef.current;

    if (stream) {
      stream.getTracks().forEach((track) => {
        track.onended = null;
        track.onmute = null;
        track.onunmute = null;
        track.stop();
      });

      streamRef.current = null;
    }

    onStreamChangeRef.current?.(null);

    setIsSharing(false);
    setIsAudioActive(false);

    console.log("[Screen Share] Sharing stopped.");
  };

  const startScreenShare = async () => {
    if (streamRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;

      const videoTrack = stream.getVideoTracks()[0];
      const audioTrack = stream.getAudioTracks()[0];

      setIsSharing(videoTrack?.readyState === "live");

      if (audioTrack) {
        const updateAudioStatus = () => {
          const active =
            audioTrack.readyState === "live" &&
            audioTrack.enabled &&
            !audioTrack.muted;

          setIsAudioActive(active);

          console.log("[Screen Share Audio]", {
            readyState: audioTrack.readyState,
            enabled: audioTrack.enabled,
            muted: audioTrack.muted,
          });
        };

        audioTrack.addEventListener("ended", updateAudioStatus);
        audioTrack.addEventListener("mute", updateAudioStatus);
        audioTrack.addEventListener("unmute", updateAudioStatus);

        updateAudioStatus();

        onStreamChangeRef.current?.(stream);
      } else {
        setIsAudioActive(false);
        onStreamChangeRef.current?.(null);

        console.warn(
          "[Screen Share] No audio track. Select the browser tab and enable Share tab audio.",
        );
      }

      if (videoTrack) {
        videoTrack.onended = stopSharing;
      }

      console.log("[Screen Share] Stream started.", {
        videoTracks: stream.getVideoTracks().length,
        audioTracks: stream.getAudioTracks().length,
      });
    } catch (error) {
      console.error("Screen sharing failed:", error);

      setIsSharing(false);
      setIsAudioActive(false);
    }
  };

  useEffect(() => {
    return () => {
      const stream = streamRef.current;

      if (stream) {
        stream.getTracks().forEach((track) => {
          track.onended = null;
          track.onmute = null;
          track.onunmute = null;
          track.stop();
        });

        streamRef.current = null;
      }
    };
  }, []);

  return (
    <div className="screen-share-control">
      <button
        type="button"
        className={`screen-share-btn ${
          isSharing ? "sharing-active" : "sharing-inactive"
        }`}
        onClick={isSharing ? stopSharing : startScreenShare}
        title={
          isSharing
            ? isAudioActive
              ? "Screen sharing active — audio available"
              : "Screen sharing active — audio unavailable"
            : "Share screen"
        }
        aria-label={
          isSharing
            ? "Stop screen sharing"
            : "Share screen"
        }
      >
        <FaDesktop /> Screen
      </button>
    </div>
  );
}

export default ScreenShare;
