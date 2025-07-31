import React from "react";
type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;
const OutlinedPurpleButton: React.FC<Props> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      style={{
        backgroundColor: "#F5F5F5",
        color: "#442063",
        border: "2px solid #442063",
        padding: "0.6rem 1.2rem",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: 500,
        transition: "all 0.2s",
      }}
      onMouseOver={(e) =>
        (e.currentTarget.style.backgroundColor = "#ECECEC")
      }
      onMouseOut={(e) =>
        (e.currentTarget.style.backgroundColor = "#F5F5F5")
      }
    >
      {children}
    </button>
  );
};
export default OutlinedPurpleButton;