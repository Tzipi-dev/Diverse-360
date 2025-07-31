import { SxProps, Theme } from "@mui/material";
import { blue, grey } from "@mui/material/colors";

export const courseRowStyles: { [key: string]: SxProps<Theme> } = {
  card: {
    width: 300,
    borderRadius: 3,
    background: "#ffffff",
    boxShadow: `0 4px 20px rgba(0,0,0,0.06)`,
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    display: "flex",
    flexDirection: "column",
    position: "relative", // 💡 הפתרון החשוב!
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: `0 8px 28px rgba(0,0,0,0.08)`,
    },
  },

  image: {
    width: "100%",
    height: 140,
    objectFit: "cover",
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    display: "block",
  },

  chipBox: {
    position: "absolute",
    top: 12,
    left: 12,
    zIndex: 2,
  },

  chip: {
    fontWeight: 600,
    px: 1,
    py: 0,
    fontSize: 12,
    backgroundColor: blue[50],
    color: blue[800],
  },

  cardContent: {
    px: 2,
    pt: 4,
    pb: 2,
    flex: 1,
  },

  title: {
    fontWeight: 700,
    fontSize: 18,
    color: "#1a1a1a",
    mb: 1,
    textAlign: "right",
  },

  description: {
    fontSize: 14,
    color: grey[700],
    mb: 1,
    textAlign: "right",
    minHeight: 48,
  },

  stackRow: {
    justifyContent: "space-between",
    mb: 1,
  },

  dateText: {
    color: grey[500],
    fontSize: 12,
    fontWeight: 500,
  },

  subjectLecturer: {
    fontSize: 14,
    color: grey[800],
    mb: 0.5,
    textAlign: "right",
  },

  cardActions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    px: 2,
    pb: 2,
    mt: "auto",
    flexWrap: "wrap",
    gap: 1,
  },

  iconButton: {
    color: blue[800],
    backgroundColor: blue[50],
    "&:hover": {
      backgroundColor: blue[700],
      color: "#fff",
    },
  },

  deleteButton: {
    backgroundColor: grey[100],
    color: "#d32f2f",
    "&:hover": {
      backgroundColor: "#d32f2f",
      color: "#fff",
    },
  },

  manageVideosButton: {
    mt: 1,
    backgroundColor: blue[600],
    color: "#fff",
    fontWeight: 600,
    px: 2,
    fontSize: 13,
    borderRadius: 2,
    "&:hover": {
      backgroundColor: blue[800],
    },
  },
};
