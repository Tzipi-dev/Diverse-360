import { SxProps, Theme } from "@mui/material";
import { techBlue, lightBlue, accentGreen, darkText } from "./coursesAdmin.styles";

export const createCourseFormStyles: Record<string, SxProps<Theme>> = {
  formWrapper: {
    maxWidth: 560,
    mx: "auto",
    my: 6,
    p: { xs: 3, sm: 5 },
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    border: `1px solid ${techBlue}`,
    boxShadow: `0 10px 40px ${lightBlue}33`,
    display: "flex",
    flexDirection: "column",
    gap: 3,
    alignItems: "center",
    transition: "box-shadow 0.4s ease, transform 0.4s ease",
  },

  title: {
    color: techBlue,
    fontWeight: 900,
    letterSpacing: 1.5,
    fontSize: { xs: 24, sm: 30 },
    textAlign: "center",
    textShadow: `0 0 10px ${lightBlue}22`,
    mb: 3,
  },

  textField: {
    width: "100%",
    "& .MuiInputBase-input": {
      color: darkText,
      fontWeight: 500,
      backgroundColor: "#f4faff",
      borderRadius: 4,
      px: 1.5,
      transition: "background-color 0.3s ease",
    },
    "& .MuiInputLabel-root": {
      color: techBlue,
      fontWeight: 600,
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: 4,
      "& fieldset": {
        borderColor: `${lightBlue}55`,
      },
      "&:hover fieldset": {
        borderColor: accentGreen,
      },
      "&.Mui-focused fieldset": {
        borderColor: accentGreen,
        borderWidth: 2,
      },
    },
    "& .MuiFormHelperText-root": {
      color: accentGreen,
      fontWeight: 500,
    },
    mb: 2,
  },

  checkbox: {
    color: accentGreen,
    transition: "all 0.25s ease-in-out",
    "&.Mui-checked": {
      color: accentGreen,
    },
    "&:hover": {
      backgroundColor: "transparent",
      color: accentGreen,
    },
    "&.Mui-focusVisible": {
      color: accentGreen,
    },
    "&.Mui-active": {
      color: accentGreen,
    },
  },

  checkboxLabel: {
    color: darkText,
    fontWeight: 600,
    fontSize: 14,
    ml: 1,
  },

  generateImageButton: {
    px: 4,
    py: 1.4,
    fontWeight: 800,
    fontSize: 16,
    borderRadius: "50px",
    color: "#ffffff",
    background: `linear-gradient(145deg, ${techBlue}, ${accentGreen})`,
    boxShadow: `0 4px 20px ${techBlue}55`,
    textTransform: "none",
    transition: "all 0.4s ease-in-out",
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    backdropFilter: "blur(2px)",
    "&:hover": {
      background: `linear-gradient(145deg, ${accentGreen}, ${techBlue})`,
      transform: "scale(1.04)",
      boxShadow: `0 0 28px ${accentGreen}88`,
    },
    "&:disabled": {
      background: "#e0e0e0",
      color: "#999",
      cursor: "not-allowed",
    },
  },

  submitButton: {
    background: `linear-gradient(135deg, ${techBlue}, ${accentGreen})`,
    color: "#ffffff",
    fontWeight: 800,
    borderRadius: "50px",
    px: 5,
    py: 1.5,
    fontSize: 18,
    mt: 2,
    textTransform: "none",
    boxShadow: `0 6px 20px ${techBlue}55`,
    transition: "all 0.4s ease-in-out",
    "&:hover": {
      background: `linear-gradient(135deg, ${accentGreen}, ${techBlue})`,
      transform: "scale(1.04)",
      boxShadow: `0 0 26px ${accentGreen}88`,
    },
  },

  // שים לב: סלקטורים של גלילה לא עובדים בתוך sx, הם צריכים להיות ב-CSS גלובלי או styled component נפרד
  // לדוגמה אפשר להוסיף את זה בקובץ CSS או ב-global styles:
  /*
  ::-webkit-scrollbar {
    width: 10px;
    background-color: #f4faff;
  }
  ::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #007acc, #00b86b);
    border-radius: 8px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #00b86b, #007acc);
  }
  */
};
