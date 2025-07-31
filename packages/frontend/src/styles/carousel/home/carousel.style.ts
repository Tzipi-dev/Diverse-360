// ../../../styles/carousel.styles.ts
import { SxProps, Theme } from '@mui/material';
import { keyframes } from '@mui/system';

// אנימציה של הצמצום כלפי מטה של ה-description
const slideUp = keyframes`
  0% {
    max-height: 200px;  /* התיאור בהתחלה בגובה מלא */
    padding-top: 10px;
    visibility: visible;
  }
  100% {
    max-height: 0; /* התיאור מצטמצם */
    padding-top: 0;
    visibility: hidden; /* התיאור מוסתר */
  }
`;
const scrollText = keyframes`
  0% { transform: translateY(0); }
  100% { transform: translateY(-50%); }
`;
const styles = {
  card: {
    width: "90%",
    maxWidth: 550,
    mx: "auto",
    borderRadius: 5,
    backgroundColor: "#ffffff",
    backdropFilter: "none",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    overflow: "hidden",
    transition: "transform 0.5s ease",
    height: 320,  // גובה קבוע
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between", // מבטיח שהכפתור תמיד בתחתית
    "&:hover": {
      transform: "scale(1.02)",
    },
  },
  image: {
    objectFit: "cover",
    filter: "brightness(0.95)",
    height: 200,
    width: "100%",
  },
  content: {
    pt: 1.5,
    px: 2,
    pb: 0,
    flexGrow: 1,
    overflow: "hidden",
  },
  title: {
    fontFamily: "var(--font-family)",
    fontSize: "1.2rem",
    fontWeight: 600,
  },


description: {
  fontFamily: "var(--font-family)",
  fontSize: "0.9rem",
  mt: 0.5,
  lineHeight: 1.3,
  maxHeight: 45,
  overflow: "hidden",
  position: "relative",
  '& > div': {
    display: "inline-block",
    animation: `${scrollText} 10s linear infinite`,
  }
},

  buttonContainer: {
    direction: "rtl",
    display: "flex",
    justifyContent: "flex-end",
    px: 2,
    pb: 2,
  },
  button: {
    borderRadius: "10px",
    width: "40%",
    textTransform: "none",
    backgroundColor: "#442063",
    color: "white",
    fontFamily: "var(--font-family)",
    '&:hover': {
      backgroundColor: "#1d0e2b",
    },
  },
  fallbackImage: "/images/placeholder.jpg",
};


export default styles;
