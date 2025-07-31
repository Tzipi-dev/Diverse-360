import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllInfoCarouselQuery } from "../infoCarouselApi";
import { Card, CardContent, CardMedia, Typography, Button, Stack, Box, Fade, useTheme } from "@mui/material";
import { InfoItem } from "../homeTypes";

// ייבוא הסטיילים כ-object אחד
import styles from "../../../styles/carousel/home/carousel.style";

interface HomeCarouselProps {
  onSelectinfoCarousel: (info: InfoItem) => void;
  userAcademicCycleId: string;
}

const HomeCarousel: React.FC<HomeCarouselProps> = ({
  onSelectinfoCarousel,
  userAcademicCycleId,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const { data: infoItems = [], isLoading, error } = useGetAllInfoCarouselQuery();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (infoItems.length === 0) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % infoItems.length);
    }, 5000); // כל 5 שניות התמונה תשתנה
    return () => clearInterval(interval);
  }, [infoItems]);

  if (isLoading) return <Typography align="center">טוען קרוסלת מידע...</Typography>;
  if (error || infoItems.length === 0)
    return <Typography align="center" color="error">שגיאה בטעינת קרוסלה</Typography>;

  const currentItem = infoItems[index];
  if (!currentItem) return null;

  return (
    <Fade in timeout={700}>
      <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
        <Card sx={styles.card}>
          <CardMedia
            component="img"
            height="200"
            image={currentItem.imageURL || styles.fallbackImage}
            alt={currentItem.title}
            sx={styles.image}
          />
          <CardContent sx={styles.content}>
            <Typography variant="h6" sx={styles.title}>
              {currentItem.title}
            </Typography>

           <Typography variant="body2" color="text.secondary" sx={styles.description}>
            {currentItem.description}
          </Typography>

          </CardContent>

          <Stack sx={styles.buttonContainer}>
            <Button
              variant="contained"
              onClick={() => navigate(`/info/${currentItem.id}`)}
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

export default HomeCarousel;
