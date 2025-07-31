
import React, { useState, useEffect } from "react";
import {
  Card, CardContent, Typography, CardMedia, Button,
  Stack, Box, Fade, useTheme,
} from "@mui/material";
import { ProjectItem } from "../homeTypes";
import { useNavigate } from "react-router-dom";
import { useGetAllProjectCarouselQuery } from "../projectCarouselApi";

// ייבוא הסטיילים המותאמים עם האנימציה
import styles from "../../../styles/carousel/home/carousel.style";

interface DisplayAllProjectCarousel {
  onSelectProjectCarousel: (project: ProjectItem) => void;
  userAcademicCycleId: string;
}

const ProjectCarousel: React.FC<DisplayAllProjectCarousel> = ({
  onSelectProjectCarousel,
  userAcademicCycleId,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { data: projectItems = [], isLoading, error } = useGetAllProjectCarouselQuery();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (projectItems.length === 0) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % projectItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [projectItems]);

  if (isLoading) return <Typography align="center">טוען קרוסלת פרויקטים...</Typography>;
  if (error || projectItems.length === 0)
    return <Typography align="center" color="error">שגיאה בטעינת הקרוסלה</Typography>;

  const currentProject = projectItems[index];
  if (!currentProject) return null;

  return (
    <Fade in timeout={700}>
      <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
        <Card sx={styles.card}>
          <CardMedia
            component="img"
            image={currentProject.imageURL || styles.fallbackImage}
            alt={currentProject.projectName}
            sx={styles.image}
          />
          <CardContent sx={styles.content}>
            <Typography variant="h6" sx={styles.title}>
              {currentProject.projectName}
            </Typography>

            {currentProject.description?.trim() ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={styles.description}
                component="div"
              >
                {currentProject.description}
              </Typography>
            ) : (

              <Typography variant="body2" color="text.secondary" sx={{ ...styles.description, opacity: 0 }}>
                &nbsp;
              </Typography>
            )}
          </CardContent>

          <Stack sx={styles.buttonContainer}>
            <Button
              variant="contained"
              onClick={() => {
                onSelectProjectCarousel(currentProject);
                navigate(currentProject.referenceLinkURL);
              }}
              sx={styles.button}
            >
              קראי עוד
            </Button>
          </Stack>
        </Card>
      </Box>
    </Fade>
  );
};

export default ProjectCarousel;
