// import React, { useEffect, useRef } from "react";
// import { useSelector } from "react-redux";
// import { RootState } from "../../app/store";
// import { useAddScreenAnalyticsMutation } from "../../features/admin/analyticsApi";

// import { Stack, Box, Typography, Divider } from "@mui/material";
// import { EmojiObjects, Code, Work, Groups } from "@mui/icons-material";
// import "../../globalComponents/ui/global.css";
// import { ThemeProvider, createTheme } from "@mui/material/styles";
// import '../../App.css';

// const aboutTheme = createTheme({
//   typography: {
//     fontFamily: "'Heebo', sans-serif",
//   },
//   palette: {
//     text: {
//       primary: "#442063",
//     },
//   },
// });

// const AboutPage: React.FC = () => {
//   const userId = useSelector((state: RootState) => state.auth.user?.id);
//   const [addAnalytics] = useAddScreenAnalyticsMutation();
//   const enterTimeRef = useRef(Date.now());

//   useEffect(() => {
//     enterTimeRef.current = Date.now();
//     return () => {
//       const duration = Date.now() - enterTimeRef.current;
//       if (userId && duration > 1000) {
//         addAnalytics({
//           user_id: userId,
//           path: "AboutPage",
//           duration,
//         });
//       }
//     };
//   }, [userId, addAnalytics]); // <-- התיקון כאן: הוספת התלויות

//   return (
//     <ThemeProvider theme={aboutTheme}>
//       <div
//         style={{
//           minHeight: "100vh",
//           width: "100vw",
//           backgroundImage: "url('/images/about.png')",
//           backgroundSize: "cover",
//           marginTop: "-80px",
//           fontFamily: "'Heebo', sans-serif",
//         }}
//       >
//         <Stack
//           className="about-page"
//           style={{
//             marginTop: "100px",
//             maxWidth: 900,
//             marginRight: 0,
//             alignItems: "flex-end",
//           }}
//         >
//           <Box
//             style={{
//               color: "#442063",
//               padding: "32px 64px 32px 32px",
//               background: "rgba(255,255,255,0.85)",
//               borderRadius: 16,
//               textAlign: "right",
//               width: "100%",
//               maxWidth: 900,
//             }}
//           >
//             <Stack spacing={4}>
//               <Typography variant="h4" className="about-title" align="right">
//                 על DiversiTech טכנולוגיה
//               </Typography>

//               <Typography
//                 variant="body1"
//                 className="about-paragraph"
//                 component="div"
//                 align="right"
//               >
//                 <b style={{ fontFamily: "inherit" }}>
//                   DiversiTech Technology
//                 </b>{" "}
//                 היא חברת טכנולוגיה חברתית פורצת דרך, הפועלת לקידום ג'וניורים
//                 בתעשיית ההייטק בישראל.
//                 <br />
//                 החברה משלבת בין פיתוח מערכות טכנולוגיות מתקדמות לבין הכשרה
//                 מקצועית ואיכותית.
//                 <br />
//                 DiversiTech הוקמה מתוך מטרה אחת ברורה:
//                 <span
//                   style={{
//                     display: "block",
//                     fontSize: "1.1rem",
//                     marginTop: 8,
//                     fontFamily: "inherit",
//                   }}
//                 >
//                   לפתוח שער לעולם ההייטק עבור כל מי שיש לו את היכולת –<br />
//                   <b style={{ fontFamily: "inherit" }}>
//                     באמצעות ניסיון מעשי ושיתופי פעולה פורצי דרך עם האקוסיסטם.
//                   </b>
//                 </span>
//               </Typography>

//               <Divider />

//               <Stack spacing={2}>
//                 <Typography
//                   variant="h5"
//                   className="about-subtitle"
//                   align="right"
//                 >
//                   מה אנחנו עושים?
//                 </Typography>
//                 <Box
//                   className="about-item"
//                   display="flex"
//                   alignItems="flex-start"
//                   gap={1}
//                 >
//                   <Code className="about-icon" />
//                   <Typography
//                     variant="body1"
//                     className="about-paragraph"
//                     align="right"
//                   >
//                     <strong style={{ fontFamily: "inherit" }}>
//                       פיתוח מערכות תוכנה –
//                     </strong>{" "}
//                     בית תוכנה מקצועי המבוסס על קבוצות פיתוח של מתמחים בהובלת
//                     אנשי תעשייה, המספק פתרונות ליזמים, עמותות ועסקים.
//                   </Typography>
//                 </Box>
//                 <Box
//                   className="about-item"
//                   display="flex"
//                   alignItems="flex-start"
//                   gap={1}
//                 >
//                   <EmojiObjects className="about-icon" />
//                   <Typography
//                     variant="body1"
//                     className="about-paragraph"
//                     align="right"
//                   >
//                     <strong style={{ fontFamily: "inherit" }}>
//                       הכשרה מקצועית –
//                     </strong>{" "}
//                     מסלולים מעשיים בשיתוף חברות מובילות כמו AppsFlyer, eToro,
//                     Red Hat, Amdocs ועוד.
//                   </Typography>
//                 </Box>
//                 <Box
//                   className="about-item"
//                   display="flex"
//                   alignItems="flex-start"
//                   gap={1}
//                 >
//                   <Work className="about-icon" />
//                   <Typography
//                     variant="body1"
//                     className="about-paragraph"
//                     align="right"
//                   >
//                     <strong style={{ fontFamily: "inherit" }}>
//                       השמה וקליטה לעבודה –
//                     </strong>{" "}
//                     ליווי לאחר ההכשרה: ראיונות, קורות חיים, ושיבוץ בעבודה
//                     איכותית.
//                   </Typography>
//                 </Box>
//                 <Box
//                   className="about-item"
//                   display="flex"
//                   alignItems="flex-start"
//                   gap={1}
//                 >
//                   <Groups className="about-icon" />
//                   <Typography
//                     variant="body1"
//                     className="about-paragraph"
//                     align="right"
//                   >
//                     <strong style={{ fontFamily: "inherit" }}>
//                       שיתופי פעולה –
//                     </strong>{" "}
//                     מאות בוגרים השתלבו בתעשייה בזכות שותפויות עם הממשלה,
//                     אקדמיה, ותעשייה ביטחונית.
//                   </Typography>
//                 </Box>
//               </Stack>

//               <Divider />

//               <Stack spacing={2}>
//                 <Typography
//                   variant="h5"
//                   className="about-subtitle"
//                   align="right"
//                 >
//                   החזון שלנו
//                 </Typography>
//                 <Typography
//                   variant="body1"
//                   className="about-paragraph"
//                   component="div"
//                   align="right"
//                 >
//                   <span style={{ fontSize: "1.1rem", fontFamily: "inherit" }}>
//                     להוכיח שעם הדרכה נכונה, ליווי מקצועי ושותפים שמאמינים –{" "}
//                     <b style={{ fontFamily: "inherit" }}>השמים הם לא הגבול.</b>
//                     <br />
//                     ב-DiversiTech אנחנו לא רק מכשירים –{" "}
//                     <b style={{ fontFamily: "inherit" }}>
//                       אנחנו מאמינים, מלווים, ומשנים מציאות.
//                     </b>
//                   </span>
//                 </Typography>
//               </Stack>
//             </Stack>
//           </Box>
//         </Stack>
//       </div>
//     </ThemeProvider>
//   );
// };

// export default AboutPage;
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useAddScreenAnalyticsMutation } from "../../features/admin/analyticsApi";

import { Stack, Box, Typography, Divider } from "@mui/material";
import { EmojiObjects, Code, Work, Groups } from "@mui/icons-material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "../../globalComponents/ui/global.css";
import "../../App.css";

const aboutTheme = createTheme({
  typography: {
    fontFamily: "'Heebo', sans-serif",
  },
  palette: {
    text: {
      primary: "#442063",
    },
  },
});

const AboutPage: React.FC = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const [addAnalytics] = useAddScreenAnalyticsMutation();
  const enterTimeRef = useRef(Date.now());

  useEffect(() => {
    enterTimeRef.current = Date.now();
    return () => {
      const duration = Date.now() - enterTimeRef.current;
      if (userId && duration > 1000) {
        addAnalytics({
          user_id: userId,
          path: "AboutPage",
          duration,
        });
      }
    };
  }, [userId, addAnalytics]);

  return (
    <ThemeProvider theme={aboutTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          backgroundImage: "url('/images/about.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          mt: "-80px",
          fontFamily: "'Heebo', sans-serif",
        }}
      >

        {/* רקע נוסף עם תמונת הניווט */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: "65px",
            backgroundImage: "url('/images/nav.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            zIndex: 999,
          }}
        />
        <Stack
          className="about-page"
          sx={{
            mt: { xs: "100px", md: "120px" },
            maxWidth: 900,
            mx: "auto",
            px: { xs: 2, md: 0 },
            alignItems: "flex-end",
          }}
        >
          <Box
            sx={{
              color: "#442063",
              px: { xs: 2, sm: 4, md: 8 },
              py: 4,
              background: {
                xs: "rgba(255,255,255,0.95)",
                md: "rgba(255,255,255,0.85)",
              },
              borderRadius: 2,
              textAlign: "right",
              width: "100%",
              top: "20px"
            }}
          >
            <Stack spacing={4}>
              <Typography variant="h4" className="about-title" align="right">
                על DiversiTech טכנולוגיה
              </Typography>

              <Typography
                variant="body1"
                className="about-paragraph"
                component="div"
                align="right"
              >
                <b>DiversiTech Technology</b> היא חברת טכנולוגיה חברתית פורצת דרך,
                הפועלת לקידום ג'וניורים בתעשיית ההייטק בישראל.
                <br />
                החברה משלבת בין פיתוח מערכות טכנולוגיות מתקדמות לבין הכשרה מקצועית ואיכותית.
                <br />
                DiversiTech הוקמה מתוך מטרה אחת ברורה:
                <span
                  style={{
                    display: "block",
                    fontSize: "1.1rem",
                    marginTop: 8,
                  }}
                >
                  לפתוח שער לעולם ההייטק עבור כל מי שיש לו את היכולת –
                  <br />
                  <b>באמצעות ניסיון מעשי ושיתופי פעולה פורצי דרך עם האקוסיסטם.</b>
                </span>
              </Typography>

              <Divider />

              <Stack spacing={2}>
                <Typography variant="h5" className="about-subtitle" align="right">
                  מה אנחנו עושים?
                </Typography>

                {[
                  {
                    icon: <Code />,
                    text: (
                      <>
                        <strong>פיתוח מערכות תוכנה –</strong> בית תוכנה מקצועי
                        המבוסס על קבוצות פיתוח של מתמחים בהובלת אנשי תעשייה,
                        המספק פתרונות ליזמים, עמותות ועסקים.
                      </>
                    ),
                  },
                  {
                    icon: <EmojiObjects />,
                    text: (
                      <>
                        <strong>הכשרה מקצועית –</strong> מסלולים מעשיים בשיתוף
                        חברות מובילות כמו AppsFlyer, eToro, Red Hat, Amdocs ועוד.
                      </>
                    ),
                  },
                  {
                    icon: <Work />,
                    text: (
                      <>
                        <strong>השמה וקליטה לעבודה –</strong> ליווי לאחר ההכשרה:
                        ראיונות, קורות חיים, ושיבוץ בעבודה איכותית.
                      </>
                    ),
                  },
                  {
                    icon: <Groups />,
                    text: (
                      <>
                        <strong>שיתופי פעולה –</strong> מאות בוגרים השתלבו
                        בתעשייה בזכות שותפויות עם הממשלה, אקדמיה, ותעשייה ביטחונית.
                      </>
                    ),
                  },
                ].map((item, i) => (
                  <Box
                    key={i}
                    className="about-item"
                    display="flex"
                    alignItems="flex-start"
                    gap={1}
                    sx={{
                      flexDirection: { xs: "column", sm: "row" },
                    }}
                  >
                    <Box sx={{ mt: "3px" }}>{item.icon}</Box>
                    <Typography variant="body1" className="about-paragraph" align="right">
                      {item.text}
                    </Typography>
                  </Box>
                ))}
              </Stack>

              <Divider />

              <Stack spacing={2}>
                <Typography variant="h5" className="about-subtitle" align="right">
                  החזון שלנו
                </Typography>
                <Typography
                  variant="body1"
                  className="about-paragraph"
                  component="div"
                  align="right"
                >
                  <span style={{ fontSize: "1.1rem" }}>
                    להוכיח שעם הדרכה נכונה, ליווי מקצועי ושותפים שמאמינים –{" "}
                    <b>השמים הם לא הגבול.</b>
                    <br />
                    ב-DiversiTech אנחנו לא רק מכשירים –{" "}
                    <b>אנחנו מאמינים, מלווים, ומשנים מציאות.</b>
                  </span>
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </ThemeProvider>
  );
};

export default AboutPage;
