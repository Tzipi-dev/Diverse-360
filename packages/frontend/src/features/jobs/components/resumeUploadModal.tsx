import React, { useState } from "react";

interface Props {
  onClose: () => void;
  onJobsSuggested: (jobs: any[]) => void;
}

const ResumeUploadModal: React.FC<Props> = ({ onClose, onJobsSuggested }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [wantsEmail, setWantsEmail] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("wantsEmail", wantsEmail ? "true" : "false");

      const response = await fetch("/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        alert("אירעה שגיאה: " + (err.message || "לא ידוע"));
        setLoading(false);
        return;
      }

      const result = await response.json();
      onJobsSuggested(result.jobs || []);
    } catch (error) {
      console.error(error);
      alert("אירעה שגיאה בתהליך ההעלאה");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(68, 32, 99, 0.4)",
        backdropFilter: "blur(6px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          width: "90%",
          maxWidth: "480px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #5b2d7a, #ec4899)",
            padding: "20px",
            textAlign: "center",
            position: "relative",
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "15px",
              right: "15px",
              background: "rgba(255,255,255,0.2)",
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              fontSize: "18px",
              color: "white",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
          <h2 style={{ color: "white", margin: 0, fontWeight: 600 }}>התאמת משרות לפי קו״ח</h2>
        </div>

        {/* Body */}
        <div style={{ padding: "24px" }}>
          <h3
            style={{
              textAlign: "center",
              color: "#7e22ce",
              fontSize: "18px",
              marginBottom: "20px",
              fontWeight: "600",
            }}
          >
            העלאת קובץ קורות חיים
          </h3>

          {/* אזור העלאה */}
          <div
            onClick={() => document.getElementById("fileInput")?.click()}
            style={{
              border: "2px dashed #ec4899",
              borderRadius: "16px",
              padding: "36px 20px",
              textAlign: "center",
              marginBottom: "20px",
              background: "#fdf4ff",
              color: "#5b2d7a",
              cursor: "pointer",
              transition: "0.2s",
              fontWeight: 500,
            }}
          >
            {file ? file.name : "לחצי או גררי לכאן קובץ קו״ח (.pdf, .doc, .docx)"}
          </div>

          <input
            id="fileInput"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          {/* צ'קבוקס */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
            <input
              type="checkbox"
              id="emailCheckbox"
              checked={wantsEmail}
              onChange={(e) => setWantsEmail(e.target.checked)}
              style={{
                width: "18px",
                height: "18px",
                accentColor: "#7c3aed",
              }}
            />
            <label htmlFor="emailCheckbox" style={{ fontSize: "14px", color: "#444" }}>
              אני רוצה לקבל הצעות למייל פעם בשבוע
            </label>
          </div>

          {/* כפתור שליחה */}
          <div style={{ textAlign: "center" }}>
            <button
              onClick={handleUpload}
              disabled={loading || !file}
              style={{
                padding: "12px 24px",
                background: loading || !file ? "#e5e7eb" : "#7c3aed",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontWeight: 600,
                fontSize: "16px",
                cursor: loading || !file ? "not-allowed" : "pointer",
                transition: "background 0.3s",
              }}
            >
              {loading ? "מעלה..." : "מצא לי משרות מתאימות"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeUploadModal;
