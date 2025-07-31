import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PrimaryButton from "../../../globalComponents/ui/PrimaryButton";
import { ResumeAnalysisResult } from "../resumeApi";

type AnalysisModalProps = {
  isOpen: boolean;
  onClose: () => void;
  content: string; 
};

export default function AnalysisModal({ isOpen, onClose, content }: AnalysisModalProps) {
  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          width: "90%",
          maxWidth: "800px",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "2rem",
          position: "relative",
          direction: "rtl",
          fontFamily: "Heebo, sans-serif",
        }}
      >
        {/* כפתור סגירה */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            left: "1rem",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
          aria-label="סגור"
        >
          <CloseIcon style={{ color: "#000", fontSize: 28 }} />
        </button>

        {/* כותרת */}
        <h2 style={{ textAlign: "center", marginBottom: "1rem", fontSize: "1.5rem", color: "#442063" }}>
          תוצאות ניתוח קורות החיים
        </h2>

        {/* תוכן ניתוח */}
        <div
          style={{
            backgroundColor: "#f6f6f6",
            borderRadius: "8px",
            padding: "1rem",
            whiteSpace: "pre-wrap",
            textAlign: "right",
            lineHeight: 1.6,
            color: "#333",
            fontSize: "16px",
            marginBottom: "1.5rem",
          }}
        >
          {content}
        </div>

        {/* כפתור העתקה */}
        <div >
          <PrimaryButton onClick={handleCopy}>
            <ContentCopyIcon style={{ marginLeft: "0.5rem" }} />
            העתקה
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
