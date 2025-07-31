import { SxProps, Theme } from "@mui/material";
import { techBlue, lightBlue, accentGreen, backgroundLight, darkText } from "./coursesAdmin.styles";

export const styles = {
  formContainer: {
    maxWidth: 600,
    mx: "auto",
    my: 6,
    p: 4,
    background: "#fff",           // לבן נקי כמו באתר Udemy
    borderRadius: 8,
    border: `1.5px solid ${lightBlue}`,
    boxShadow: `0 2px 8px ${lightBlue}33`,
    display: "flex",
    flexDirection: "column",
    gap: 3,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    overflowY: "auto",  // חשוב כדי להציג גלילה אנכית במידת הצורך
    // סגנונות גלגלת דקה וכחולה:
    "&::-webkit-scrollbar": {
      width: 6,           // גלגלת דקה
      height: 6,
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: backgroundLight,
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: techBlue,
      borderRadius: 10,
    },
    "&::-webkit-scrollbar-thumb:hover": {
      backgroundColor: lightBlue,
    },
    // Firefox
    scrollbarWidth: "thin",
    scrollbarColor: `${techBlue} ${backgroundLight}`,
  } as SxProps<Theme>,

  title: {
    color: techBlue,
    fontWeight: 700,
    fontSize: 28,
    mb: 3,
    textAlign: "center",
  } as SxProps<Theme>,

  textField: {
    input: {
      color: darkText,
      fontWeight: 500,
    },
    label: {
      color: techBlue,
      fontWeight: 600,
    },
    "& .MuiOutlinedInput-root": {
      background: backgroundLight,
      borderRadius: 6,
      "& fieldset": {
        borderColor: lightBlue,
      },
      "&:hover fieldset": {
        borderColor: techBlue,
      },
      "&.Mui-focused fieldset": {
        borderColor: techBlue,
        borderWidth: 2,
      },
    },
    "& .MuiFormHelperText-root": {
      color: accentGreen,
      fontWeight: 500,
    },
  } as SxProps<Theme>,

  checkbox: {
    color: techBlue,
    "&.Mui-checked": {
      color: techBlue,
    },
  } as SxProps<Theme>,

  checkboxLabel: {
    color: darkText,
    fontWeight: 600,
    cursor: "pointer",
  } as SxProps<Theme>,

  videoBox: {
    border: `1px solid ${lightBlue}`,
    borderRadius: 8,
    p: 2,
    mb: 3,
    background: backgroundLight,
  } as SxProps<Theme>,

  videoTitle: {
    fontWeight: 700,
    mb: 1,
    color: techBlue,
    fontSize: 18,
  } as SxProps<Theme>,

  videoDesc: {
    mb: 2,
    color: darkText,
    fontSize: 14,
    opacity: 0.8,
  } as SxProps<Theme>,

  buttonsBox: {
    display: "flex",
    justifyContent: "space-between",
    mt: 3,
  } as SxProps<Theme>,

  submitBtn: {
    backgroundColor: techBlue,
    color: "#fff",
    fontWeight: 700,
    borderRadius: 6,
    px: 5,
    py: 1.5,
    fontSize: 16,
    transition: "background-color 0.3s ease",
    "&:hover": {
      backgroundColor: lightBlue,
    },
  } as SxProps<Theme>,

  cancelBtn: {
    borderColor: techBlue,
    color: techBlue,
    fontWeight: 600,
    px: 5,
    py: 1.5,
    fontSize: 16,
    borderRadius: 6,
    background: "transparent",
    transition: "background-color 0.3s ease, color 0.3s ease",
    "&:hover": {
      backgroundColor: techBlue,
      color: "#fff",
    },
  } as SxProps<Theme>,
};
