import { Bold, Italic, Underline, Palette } from "lucide-react";
import { useState } from "react";

interface TextFormattingToolbarProps {
  onCommand: (command: string) => void;
  onColorSelect: (color: string) => void;
  formattingState: {
    isBold: boolean;
    isItalic: boolean;
    isUnderline: boolean;
  };
}

export default function TextFormattingToolbar({
  onCommand,
  onColorSelect,
  formattingState,
}: TextFormattingToolbarProps) {
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const colors = ["#ff0000", "#007bff", "#28a745", "#f0ad4e", "#800080", "#000000"];


  
  return (
    <div
      style={{
        position: "absolute",
        bottom:"2vh",
        right: "-90vh",
        marginBottom: "0.5rem",
        display: "flex",
        gap: "0.5rem",
        background: "#f0f0f0",
        padding: "0.25rem 0.5rem",
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        userSelect: "none",
        zIndex: 10,
      }}
    >
      <Bold
        size={18}
        onClick={() => onCommand("bold")}
        style={{
          cursor: "pointer",
          color: formattingState.isBold ? "#007bff" : "black",
          fontWeight: formattingState.isBold ? "bold" : "normal",
        }}
      />
      <Italic
        size={18}
        onClick={() => onCommand("italic")}
        style={{
          cursor: "pointer",
          color: formattingState.isItalic ? "#007bff" : "black",
          fontStyle: formattingState.isItalic ? "italic" : "normal",
        }}
      />
      <Underline
        size={18}
        onClick={() => onCommand("underline")}
        style={{
          cursor: "pointer",
          color: formattingState.isUnderline ? "#007bff" : "black",
          textDecoration: formattingState.isUnderline ? "underline" : "none",
        }}
      />
      <div style={{ position: "relative" }}>
        <Palette
          size={18}
          onClick={() => setColorPickerVisible((v) => !v)}
          style={{
            cursor: "pointer",
            color: colorPickerVisible ? "#007bff" : "black",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: "-10vh",
            background: "#fff",
            padding: "0.25rem 0.5rem",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            display: colorPickerVisible ? "flex" : "none",
            gap: "0.25rem",
            zIndex: 20,
            transition: "opacity 0.2s ease, transform 0.2s ease",
            opacity: colorPickerVisible ? 1 : 0,
            transform: colorPickerVisible ? "scaleY(1)" : "scaleY(0)",
            transformOrigin: "top",
          }}
        >
          {colors.map((color) => (
            <div
              key={color}
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: color,
                borderRadius: "50%",
                border: "1px solid #ccc",
                cursor: "pointer",
              }}
              onClick={() => {
                onColorSelect(color);
                setColorPickerVisible(false);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
