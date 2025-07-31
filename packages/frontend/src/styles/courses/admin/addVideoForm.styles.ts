import { SxProps, Theme } from "@mui/material";
import { techBlue, lightBlue, accentGreen, backgroundLight, darkText } from "./coursesAdmin.styles";

export const styles = {
  formContainer: {
    maxWidth: 600,
    mx: "auto",
    my: 6,
    p: 4,
    background: "#fff",
    borderRadius: 8,
    border: `1.5px solid ${lightBlue}`,
    boxShadow: `0 2px 8px ${lightBlue}33`,
    display: "flex",
    flexDirection: "column",
    gap: 3,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    overflowY: "auto",
    "&::-webkit-scrollbar": {
      width: 6,
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
    scrollbarWidth: "thin",
    scrollbarColor: `${techBlue} ${backgroundLight}`,
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

  fileButton: {
    color: techBlue,
    borderColor: techBlue,
    fontWeight: 700,
    borderRadius: 6,
    width: "100%",
    py: 1.5,
    transition: "background-color 0.3s ease, color 0.3s ease",
    "&:hover": {
      background: `${techBlue}11`,
      borderColor: techBlue,
    },
  } as SxProps<Theme>,

  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    gap: 2,
    width: "100%",
    mt: 2,
  } as SxProps<Theme>,

  submitButton: {
    backgroundColor: techBlue,
    color: "#fff",
    fontWeight: 700,
    borderRadius: 6,
    px: 4,
    py: 1.5,
    fontSize: 16,
    flex: 1,
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: lightBlue,
    },
  } as SxProps<Theme>,

  cancelButton: {
    borderColor: techBlue,
    color: techBlue,
    fontWeight: 600,
    borderRadius: 6,
    flex: 1,
    px: 4,
    py: 1.5,
    fontSize: 16,
    background: "transparent",
    transition: "background-color 0.3s ease, color 0.3s ease",
    "&:hover": {
      backgroundColor: techBlue,
      color: "#fff",
    },
  } as SxProps<Theme>,
};
