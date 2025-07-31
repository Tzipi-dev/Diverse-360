import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { Box, Avatar, Typography, useTheme } from "@mui/material";

import { LogoItem } from "../homeTypes";
import { useNavigate } from "react-router-dom";
import { useGetAllLogoCarouselQuery } from "../logoCarouselApi";
import Fade from '@mui/material/Fade';

interface ProjectCarouselProps {
  onLogoClick: (projectId: string) => void;
  onSelectLogoCarousel: () => void;
  userAcademicCycleId: string;
}

const LogoCarousel: React.FC<ProjectCarouselProps> = ({ onLogoClick }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { data: logoItems = [], isLoading, error } = useGetAllLogoCarouselQuery();

  const [waveTime, setWaveTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // הגדרות רוחב לוגו ומספר לוגואים לסיבוב
  const logoWidthPx = 124; // רוחב כולל לוגו + רווח, תתאימי לפי העיצוב שלך
  const logosCount = 8;    // כמה לוגואים יש בסיבוב

  // חישוב זמן סיבוב מלא במילישניות
  const speedPxPerSec = 30; // צריך להתאים למהירות במרקיז
  const fullCycleTimeMs = (logoWidthPx * logosCount / speedPxPerSec) * 1000;
  const pauseTimeMs = 2000; // עצירה של 2 שניות אחרי כל סיבוב

  // גל קל ללוגואים
  useEffect(() => {
    const interval = setInterval(() => {
      setWaveTime((prev) => prev + 0.007);
    }, 16); // ~60fps
    return () => clearInterval(interval);
  }, []);

  // לולאת תנועה ועצירה מחושבת לפי זמן סיבוב מלא
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    function cycle() {
      setIsPlaying(true);
      timeoutId = setTimeout(() => {
        setIsPlaying(false);
        timeoutId = setTimeout(cycle, pauseTimeMs);
      }, fullCycleTimeMs);
    }

    cycle();

    return () => clearTimeout(timeoutId);
  }, [fullCycleTimeMs, pauseTimeMs]);

  if (isLoading) return <Typography align="center">טוען קרוסלת לוגואים...</Typography>;
  if (error || logoItems.length === 0)
    return <Typography align="center" color="error">שגיאה בטעינת הקרוסלה</Typography>;

  return (
    <Fade in timeout={700}>
      <Box
        sx={{
          maxWidth: 1600,
          margin: "auto",
          position: "relative",
          py: 8,
          minHeight: 180,
          overflowX: "hidden",
          overflowY: "hidden",
          backgroundColor: "transparent",
        }}
      >
        <Marquee
          direction="right"
          speed={speedPxPerSec}
          gradient={false}
          pauseOnHover={false}
          loop={0}
          play={isPlaying}
          style={{
            width: "100%",
            transition: "opacity 0.6s ease-in-out",
            opacity: isPlaying ? 1 : 0.6,
          }}
        >
          {logoItems.map((logo: LogoItem, i: number) => {
            const amplitude = 7;
            const frequency = 0.6;
            const y = Math.sin(waveTime + i * frequency) * amplitude;
            const scale = 1 + 0.07 * Math.sin(waveTime + i * frequency);

            return (
              <Box
                key={logo.id}
                onClick={() => onLogoClick(logo.id)}
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  px: 1.5,
                  py: 1.5,
                  transition: "transform 0.8s cubic-bezier(.4,2,.6,1), filter 0.3s",
                  transform: `translateY(${y}px) scale(${scale})`,
                  willChange: "transform, filter",
                }}
              >
                <Avatar
                  src={logo.imageURL}
                  alt={logo.name}
                  sx={{
                    width: 100,
                    height: 100,
                    transition: "transform 0.8s cubic-bezier(.4,2,.6,1), filter 0.3s",
                    backgroundColor: "#fff",
                    willChange: "transform, filter",
                    "&:hover": {
                      transform: "scale(1.18)",
                      filter: "brightness(1.13)",
                    },
                  }}
                />
              </Box>
            );
          })}
        </Marquee>
      </Box>
    </Fade>
  );
};

export default LogoCarousel;
