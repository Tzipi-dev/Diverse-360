import React, { useEffect, useState } from "react";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArticleIcon from "@mui/icons-material/Article";
import DescriptionIcon from "@mui/icons-material/Description";
import ArchiveIcon from "@mui/icons-material/Archive";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
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

export default function FilePreview({ file, onRemove }: FilePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const extension = file.name.split(".").pop()?.toLowerCase() || "";
  console.log("סיומת:", extension);

  useEffect(() => {
    if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");
  const isMedia = isImage || isVideo;

  return (
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
      }}
    >
      {/* כפתור הסרה */}
      <button
        type="button"
        onClick={onRemove}
        style={{
          position: "absolute",
          top: "8px",
          left: "8px",
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          border: "none",
          background: "rgba(0,0,0,0.4)",
          color: "#fff",
          fontSize: "16px",
          padding: "0",
          margin: "0",
          lineHeight: "1",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        ×
      </button>


      {/* תצוגת מדיה */}
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
        {isImage && previewUrl && (
          <img
            src={previewUrl}
            alt="תמונה שנבחרה"
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "150px",
              objectFit: "cover",
            }}
          />
        )}

        {isVideo && previewUrl && (
          <>
            <video
              src={previewUrl}
              muted
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "150px",
                objectFit: "cover",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "rgba(0,0,0,0.5)",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 0,
                  height: 0,
                  borderTop: "10px solid transparent",
                  borderBottom: "10px solid transparent",
                  borderLeft: "15px solid white",
                  marginLeft: "5px",
                }}
              />
            </div>
          </>
        )}

        {!isMedia && getFileIconComponent(extension)}
      </div>

      {/* שם וסיומת – רק למסמכים */}
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
          {file.name}
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
  );

}
