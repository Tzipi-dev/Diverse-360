import { SxProps, Theme } from "@mui/material";

export const coursesTableStyles: Record<string, SxProps<Theme>> = {
  coursesGrid: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "1fr 1fr",
      md: "1fr 1fr 1fr",
    },
    gap: 4,
    width: "100%",
    maxWidth: 1600,
    mx: "auto",
    mt: 2,
  },

  courseBoxWrapper: {
    width: "100%",
    mb: 4,
    display: "flex",
    justifyContent: "center",
    alignItems: "stretch",
  },
};
