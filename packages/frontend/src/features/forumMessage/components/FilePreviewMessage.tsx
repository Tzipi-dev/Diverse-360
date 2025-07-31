import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArticleIcon from "@mui/icons-material/Article";
import DescriptionIcon from "@mui/icons-material/Description";
import ArchiveIcon from "@mui/icons-material/Archive";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { Play, Pause } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stopCurrentAudio, setCurrentAudio } from "../audioManager";

interface FilePreviewMessageProps {
  fileUrl: string;
  fileName: string;
}

const getFileIconComponent = (extension: string) => {
  switch (extension) {
    case "pdf":
      return <PictureAsPdfIcon style={{ fontSize: 48, color: "#d32f2f" }} />;
    case "doc":
    case "docx":
      return <ArticleIcon style={{ fontSize: 48, color: "#2b579a" }} />;
    case "xls":
    case "xlsx":
      return <DescriptionIcon style={{ fontSize: 48, color: "#217346" }} />;
    case "zip":
    case "rar":
      return <ArchiveIcon style={{ fontSize: 48, color: "#757575" }} />;
    default:
      return <InsertDriveFileIcon style={{ fontSize: 48, color: "#4285f4" }} />;
  }
};

const FilePreviewMessage = ({ fileUrl, fileName }: FilePreviewMessageProps) => {
  const extension = fileName.split(".").pop()?.toLowerCase() || "";
  const isImage = /\.(jpg|jpeg|png|gif)$/i.test(fileUrl);
  const isVideo = /\.(mp4|webm|ogg)$/i.test(fileUrl);
  const isAudio = /\.(mp3|wav|ogg|m4a)$/i.test(fileUrl);
  const isMedia = isImage || isVideo;

  const googlePreviewUrl = `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`;
  const finalUrl = (extension === "doc" || extension === "docx") ? googlePreviewUrl : fileUrl;

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

  if (isAudio) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          backgroundColor: "#ffffff",
          padding: "0.75rem 1rem",
          borderRadius: "16px",
          maxWidth: "340px",
          marginTop: "0.5rem",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <button
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
                background: "#007bff",
                height: "10px",
                borderRadius: "2px",
                transition: "height 0.15s ease-in-out",
              }}
            />
          ))}
        </div>

        <div style={{ minWidth: "40px", fontSize: "0.75rem", color: "#777" }}>
          {formatTime(progress)}
        </div>

        <audio ref={audioRef} src={fileUrl} />
      </div>
    );
  }

  // תצוגה לקבצים אחרים
  return (
    <a
      href={finalUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        style={{
          position: "relative",
          width: "200px",
          borderRadius: "8px",
          overflow: "hidden",
          border: "1px solid #ddd",
          background: "#f5f5f5",
          textAlign: "center",
          fontFamily: "Arial",
          marginTop: "0.5rem",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            position: "relative",
            background: isMedia ? "#000" : "#e0e0e0",
            padding: isMedia ? "0" : "2rem 0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "150px",
          }}
        >
          {isImage && <img src={fileUrl} alt="preview" style={{ width: "100%", objectFit: "cover" }} />}
          {isVideo && (
            <video
              src={fileUrl}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              muted
              playsInline
              controls
            />
          )}
          {!isMedia && getFileIconComponent(extension)}
        </div>

        {!isMedia && (
          <div
            style={{
              padding: "0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.25rem",
              fontSize: "14px",
              direction: "rtl",
              flexWrap: "wrap",
            }}
          >
            {decodeURIComponent(fileName)}
            <span
              style={{
                background: extension === "pdf" ? "#ffdddd" : "#4285f4",
                color: extension === "pdf" ? "#d00" : "white",
                borderRadius: "4px",
                padding: "0 6px",
                fontSize: "12px",
              }}
            >
              {extension.toUpperCase()}
            </span>
          </div>
        )}
      </div>
    </a>
  );
};

export default FilePreviewMessage;
