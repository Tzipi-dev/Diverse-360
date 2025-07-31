import { SxProps, Theme } from "@mui/material";

export const pink = "#e91e63";

export const styles: Record<string, SxProps<Theme>> = {
  videosListContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    mt: 2,
  },
  videoCard: {
    border: "1px solid #ddd",
    borderRadius: 2,
    padding: 2,
    position: "relative",
    backgroundColor: "#fff",
  },
  deleteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    color: pink,
    "&:hover": {
      color: "#ad1457",
    },
  },
  videoTitle: {
    fontWeight: "bold",
    mb: 1,
  },
  videoDescription: {
    color: "#555",
    mb: 1,
  },
  videoElement: {
    width: "100%",
    borderRadius: 4,
  },
};
