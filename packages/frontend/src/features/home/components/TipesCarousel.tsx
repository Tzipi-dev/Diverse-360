
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllTipesCarouselQuery } from "../TipesCarouselApi";
import { Card, CardContent, CardMedia, Typography, Button, Stack, Box, Fade, useTheme } from "@mui/material";
import { TipesItem } from "../homeTypes";

// ייבוא הסטיילים כ-object אחד
import styles from "../../../styles/carousel/home/carousel.style";

interface HomeCarouselProps {
  onSelectTipesCarousel: (Tipes: TipesItem) => void;
  userAcademicCycleId: string;
}

const HomeCarousel: React.FC<HomeCarouselProps> = ({
  onSelectTipesCarousel,
  userAcademicCycleId,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const { data: TipesItems = [], isLoading, error } = useGetAllTipesCarouselQuery();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (TipesItems.length === 0) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % TipesItems.length);
    }, 5000); // כל 5 שניות התמונה תשתנה
    return () => clearInterval(interval);
  }, [TipesItems]);

  if (isLoading) return <Typography align="center">טוען קרוסלת טיפים...</Typography>;
  if (error || TipesItems.length === 0)
    return <Typography align="center" color="error">שגיאה בטעינת קרוסלה</Typography>;

  const currentItem = TipesItems[index];
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


            {currentItem.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontFamily: "var(--font-family)",
                  fontSize: "0.9rem",
                  mt: 0.5,
                  lineHeight: 1.3,
                  maxHeight: 48,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {currentItem.description}
              </Typography>
            )}

           <Typography variant="body2" color="text.secondary" sx={styles.description}>
            {currentItem.description}
          </Typography>

          </CardContent>

          <Stack sx={styles.buttonContainer}>
            <Button
              variant="contained"
              onClick={() => navigate(`/Tipes/${currentItem.id}`)}
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
