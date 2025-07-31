
import { Play, Pause } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { stopCurrentAudio, setCurrentAudio } from "../audioManager";

export default function AudioMessagePreview({
  fileUrl,
  onCancel,
}: {
  fileUrl: string;
  onCancel?: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const animationRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => setProgress(audio.currentTime);
    const setMeta = () => setDuration(audio.duration);
    const onEnd = () => {
      setIsPlaying(false);
      stopAnimation();
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", setMeta);
    audio.addEventListener("ended", onEnd);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", setMeta);
      audio.removeEventListener("ended", onEnd);
      stopAnimation();
      URL.revokeObjectURL(fileUrl);
    };
  }, [fileUrl]);

  const stopAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (containerRef.current) {
      containerRef.current.querySelectorAll(".bar").forEach((bar) => {
        (bar as HTMLElement).style.height = "10px";
      });
    }
  };

  const animateBars = () => {
    if (!containerRef.current) return;
    const bars = containerRef.current.querySelectorAll(".bar");
    bars.forEach((bar) => {
      (bar as HTMLElement).style.height = `${Math.random() * 25 + 5}px`;
    });
    animationRef.current = requestAnimationFrame(animateBars);
  };

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    stopAnimation();
  };

  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      stopPlayback();
    } else {
      setCurrentAudio(audioRef.current, stopPlayback);

      try {
        await audioRef.current.play();
        setIsPlaying(true);
        animateBars();
      } catch (err) {
        console.error("Failed to play audio:", err);
      }
    }
  };

  const formatTime = (time: number) => {
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        backgroundColor: "#e3f2fd",
        padding: "0.75rem 1rem",
        borderRadius: "16px",
        maxWidth: "340px",
        marginTop: "0.5rem",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
       {onCancel && (
        <button
          onClick={onCancel}
          style={{
            position: "absolute",
            top: "6px",
            left: "6px",
            background: "none",
            border: "none",
            fontSize: "1rem",
            cursor: "pointer",
            color: "#888",
          }}
          aria-label="סגור"
        >
          ×
        </button>
      )}

      <button
        type="button"
        onClick={togglePlay}
        style={{
          
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
        }}
      >
        {isPlaying ? <Pause size={22} style={{ color: "black" }}
 /> : <Play size={22} style={{ color: "black" }}
/>}
      </button>

      <div
        ref={containerRef}
        style={{
          display: "flex",
          gap: "4px",
          alignItems: "flex-end",
          height: "28px",
          flex: 1,
        }}
      >
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="bar"
            style={{
              width: "3px",
              background: "#1976d2",
              height: "10px",
              borderRadius: "2px",
              transition: "height 0.15s ease-in-out",
            }}
          />
        ))}
      </div>

      <div style={{ minWidth: "40px", fontSize: "0.75rem", color: "#555" }}>
        {formatTime(progress)}
      </div>

      <audio ref={audioRef} src={fileUrl} preload="metadata" />
    </div>
  );
}
