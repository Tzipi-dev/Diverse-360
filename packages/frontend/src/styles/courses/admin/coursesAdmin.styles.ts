import { SxProps, Theme, createTheme } from "@mui/material/styles";

// 🎨 צבעים
export const techBlue = "#0d47a1"; // כחול כהה טכנולוגי
export const lightBlue = "#42a5f5"; // כחול בהיר
export const accentGreen = "#00c853"; // ירוק משלים
export const backgroundLight = "#f4faff"; // רקע טכנולוגי בהיר
export const darkText = "#1b1e23";

// 🌐 ערכת עיצוב גלובלית
export const adminTheme = createTheme({
  palette: {
    primary: { main: techBlue },
    secondary: { main: accentGreen },
    text: {
      primary: darkText,
      secondary: "#4b4f58",
    },
    background: {
      default: backgroundLight,
      paper: "#ffffff",
    },
  },
  typography: {
    allVariants: {
      fontFamily: "'Roboto', 'Segoe UI', sans-serif",
      color: darkText,
    },
    h1: {
      fontWeight: 900,
      letterSpacing: 1.5,
    },
    h2: {
      fontWeight: 800,
    },
  },
});

// 🎯 סגנונות לקומפוננטות
export const styles: { [key: string]: SxProps<Theme> } = {
  rootContainer: {
    minHeight: "100vh",
    width: "100vw",
    background: backgroundLight,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    overflowX: "hidden",
    m: 0,
    px: 0,
  },

  headerBox: {
    width: "100vw",
    textAlign: "center",
    mb: 6,
    mt: 4,
  },

  headerTitle: {
    color: techBlue,
    fontWeight: 900,
    fontSize: { xs: 36, sm: 48, md: 58 },
    letterSpacing: 2,
    textAlign: "center",
    textTransform: "uppercase",
    textShadow: `0 0 18px ${lightBlue}88`,
    userSelect: "none",
    mb: 2,
  },

  headerSubtitle: {
    color: accentGreen,
    opacity: 0.95,
    fontWeight: 600,
    fontSize: { xs: 18, sm: 22 },
    letterSpacing: 1.2,
    textAlign: "center",
    borderBottom: `2px solid ${accentGreen}`,
    display: "inline-block",
    px: 2,
    pb: 0.5,
    borderRadius: 4,
    boxShadow: `0 4px 12px ${accentGreen}33`,
    backdropFilter: "blur(4px)",
    textTransform: "capitalize",
    mb: 3,
  },

  addCourseButtonWrapper: {
    display: "flex",
    justifyContent: "center",
    mt: 4,
    mb: 3,
  },

  addCourseButton: {
    background: `linear-gradient(135deg, ${techBlue} 0%, ${lightBlue} 60%, ${accentGreen} 100%)`,
    color: "#fff",
    fontWeight: 800,
    borderRadius: 12,
    px: 6,
    py: 2.2,
    fontSize: 20,
    letterSpacing: 1,
    textTransform: "uppercase",
    boxShadow: `0 6px 20px ${lightBlue}66, 0 4px 10px ${techBlue}55`,
    transition: "all 0.3s ease",
    '&:hover': {
      background: `linear-gradient(135deg, ${accentGreen} 0%, ${lightBlue} 50%, ${techBlue} 100%)`,
      transform: "scale(1.07)",
      boxShadow: `0 0 32px ${accentGreen}aa, 0 8px 24px #0002`,
    },
  },

  dialogPaper: {
    borderRadius: "20px",
    background: "#fff",
    color: darkText,
    boxShadow: `0 10px 48px ${techBlue}44, 0 4px 20px ${accentGreen}33`,
    border: `2px solid ${accentGreen}`,
  },

  dialogTitle: {
    background: "#fff",
    color: techBlue,
    fontWeight: 900,
    fontSize: 28,
    letterSpacing: 1,
    textAlign: "center",
    borderTopLeftRadius: "18px",
    borderTopRightRadius: "18px",
    borderBottom: `3px solid ${accentGreen}`,
    position: "relative",
    minHeight: 60,
    px: 4,
    py: 2.5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textShadow: `0 0 10px ${techBlue}88`,
  },

  dialogTitleText: {
    fontWeight: 900,
    color: techBlue,
    flex: 1,
    textAlign: "center",
    fontSize: 26,
    letterSpacing: 1,
  },

  closeButton: {
    position: "absolute",
    right: 12,
    top: 12,
    color: techBlue,
    background: "rgba(255,255,255,0.85)",
    '&:hover': {
      background: techBlue,
      color: "#fff",
      boxShadow: `0 0 12px ${accentGreen}aa`,
    },
  },

  dialogContent: {
    background: "#fff",
    color: darkText,
    borderBottomLeftRadius: "18px",
    borderBottomRightRadius: "18px",
    px: { xs: 2, sm: 4 },
    py: { xs: 3, sm: 5 },
  },

  editDialogPaper: {
    borderRadius: "20px",
    color: darkText,
    background: "#eef6ff",
    boxShadow: `0 6px 24px ${techBlue}22`,
  },

  editDialogTitle: {
    background: "rgba(13,71,161,0.1)",
    backdropFilter: "blur(6px)",
    borderBottom: `2px solid ${accentGreen}55`,
  },

  editDialogTitleText: {
    fontWeight: "bold",
    color: techBlue,
  },

  editCloseButton: {
    position: "absolute",
    right: 12,
    top: 12,
    color: accentGreen,
    '&:hover': {
      background: "rgba(0,200,83,0.15)",
    },
  },

  editDialogContent: {
    background: "#f5faff",
    color: darkText,
  },

  loadingBox: {
    display: "flex",
    justifyContent: "center",
    mt: 4,
  },

  videoCard: {
    background: "rgba(13,71,161,0.08)",
    borderRadius: 14,
    backdropFilter: "blur(6px)",
    boxShadow: `0 8px 24px ${techBlue}33`,
    p: 4,
    minWidth: 320,
    maxWidth: 420,
    flex: "1 1 360px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    mb: 3,
    position: "relative",
    transition: "transform 0.2s ease",
    '&:hover': {
      transform: "translateY(-4px)",
      boxShadow: `0 12px 32px ${lightBlue}55`,
    },
  },

  videoTitle: {
    color: accentGreen,
    fontWeight: 700,
    mb: 1.5,
    textAlign: "center",
    fontSize: 18,
  },

  videoDescription: {
    color: techBlue,
    opacity: 0.9,
    mb: 1.5,
    textAlign: "center",
    fontSize: 15,
  },

  videoElement: {
    width: "100%",
    maxWidth: 360,
    minHeight: 140,
    maxHeight: 190,
    aspectRatio: "16/9",
    borderRadius: 12,
    marginBottom: 6,
    background: "#1a237e",
    boxShadow: `0 0 24px ${techBlue}99`,
  },

  statusBadge: {
    fontSize: 12,
    fontWeight: 600,
    px: 2,
    py: 0.5,
    borderRadius: 999,
    background: `${accentGreen}22`,
    color: accentGreen,
    border: `1px solid ${accentGreen}`,
    textShadow: `0 0 4px ${accentGreen}66`,
    boxShadow: `0 0 6px ${accentGreen}33`,
  },

  // ✅ כפתור מחיקה אדום לסרטון
  deleteVideoButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#d32f2f",
    color: "#fff",
    fontWeight: 700,
    borderRadius: "50%",
    width: 36,
    height: 36,
    minWidth: 0,
    boxShadow: `0 0 12px #d32f2f66`,
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#b71c1c",
      boxShadow: `0 0 16px #ff1744aa`,
      transform: "scale(1.1)",
    },
  },
};
