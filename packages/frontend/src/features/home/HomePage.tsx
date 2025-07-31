import React, { useRef, useEffect } from "react";
import { Stack, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAddScreenAnalyticsMutation } from "../admin/analyticsApi";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import HomeCarousel from "../home/components/HomeCarousel";
import ProjectCarousel from "./components/ProjectCarousel";
import LogoCarousel from "./components/LogoCarousel";
import TipesCarousel from "./components/TipesCarousel";
import "../../globalComponents/ui/global.css";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const userAcademicCycleId = "12345";

  const handleInfoSelect = () => {};
  const handleProjectSelect = () => {};
  const handleLogoSelect = () => {};
  const handleLogoClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  const [addAnalytics] = useAddScreenAnalyticsMutation();
  const enterTimeRef = useRef(Date.now());
  const user_id = useSelector((state: RootState) => state.auth.user?.id);

  useEffect(() => {
    enterTimeRef.current = Date.now();

    return () => {
      const leaveTime = Date.now();
      const duration = leaveTime - enterTimeRef.current;

      if (user_id && duration > 1000) {
        addAnalytics({
          user_id,
          path: "HomePage",
          duration,
        });
      }
    };
  }, [addAnalytics, user_id]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: "url('/images/home.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        marginTop: "-80px",
      }}
    >
      <Stack sx={{ fontFamily: "Heebo, sans-serif" , mt: "-20px" }}>
        <Typography
          component="h1"
          sx={{
             fontFamily: "Heebo, sans-serif",
            color: "white",
            mt: { xs: 18, md: 18 }, // more space only on small screens, desktop as before
            mb: 0,
            fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
            textAlign: { xs: "center", md: "right" },
            px: { xs: 2, md: "85px" },
          }}
        >
          ברוכים הבאים ל-DiversiTech טכנולוגיה!
        </Typography>

        <Typography
          component="p"
          sx={{
            fontSize: { xs: "1rem", sm: "1.2rem", md: "1.4rem" },
             fontFamily: "Heebo, sans-serif",
            mt: 1,
            mb: 6,
            color: "white",
            textAlign: { xs: "center", md: "right" },
            px: { xs: 2, md: "85px" },
            lineHeight: 1.6,
          }}
        >
          DiversiTech טכנולוגיה היא חברת תוכנה ייחודית הפועלת כבית לפיתוח, <br />
          הדרכה ופרויקטים מתקדמים עבור לקוחות מהשוק העסקי, הציבורי והחברתי.
          <br />
          כאן תמצאו קהילה מקצועית, ידע וכלים שיסייעו לכם להתקדם בעולם הפיתוח
          והטכנולוגיה.
        </Typography>

        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          justifyContent="center"
          alignItems="center"
          flexWrap="wrap"
          gap={4}
          mt={4}
        >
          {/* קרוסלת חדשות */}
          <Box
            flex={1}
            minWidth={{ xs: "90%", sm: 320 }}
            maxWidth={400}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Typography
              variant="h5"
              className="animated-title"
              sx={{
                fontWeight: "bold",
                mb: 1,
                color: "white",
                textAlign: "center",
                width: "100%",
              }}
            >
              מה חדש בדייברסיטק?
            </Typography>
            <Box width="100%" height={350} display="flex" alignItems="stretch">
              <HomeCarousel
                onSelectinfoCarousel={handleInfoSelect}
                userAcademicCycleId={userAcademicCycleId}
              />
            </Box>
          </Box>

          {/* קרוסלת פרויקטים */}
          <Box
            flex={1}
            minWidth={{ xs: "90%", sm: 320 }}
            maxWidth={400}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Typography
              variant="h5"
              className="animated-title"
              sx={{
                fontWeight: "bold",
                mb: 1,
                color: "white",
                textAlign: "center",
                width: "100%",
              }}
            >
              הצצה לפרויקטים שלנו!
            </Typography>
            <Box width="100%" height={350} display="flex" alignItems="stretch">
              <ProjectCarousel
                onSelectProjectCarousel={handleProjectSelect}
                userAcademicCycleId={userAcademicCycleId}
              />
            </Box>
          </Box>

          {/* קרוסלת טיפים */}
          <Box
            flex={1}
            minWidth={{ xs: "90%", sm: 320 }}
            maxWidth={400}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Typography
              variant="h5"
              className="animated-title"
              sx={{
                fontWeight: "bold",
                mb: 1,
                color: "white",
                textAlign: "center",
                width: "100%",
              }}
            >
              טיפים טכנולוגיים לג'וניורים
            </Typography>
            <Box width="100%" height={350} display="flex" alignItems="stretch">
              <TipesCarousel
                onSelectTipesCarousel={handleProjectSelect}
                userAcademicCycleId={userAcademicCycleId}
              />
            </Box>
          </Box>
        </Box>

        {/* קרוסלת לוגואים */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            mt: 6,
            px: { xs: 2, md: 0 },
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 1000,
              overflow: "hidden",
              direction: "ltr",
            }}
          >
            <LogoCarousel
              onLogoClick={handleLogoClick}
              onSelectLogoCarousel={handleLogoSelect}
              userAcademicCycleId={userAcademicCycleId}
            />
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default HomePage;