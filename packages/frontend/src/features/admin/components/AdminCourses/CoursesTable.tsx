// import React from "react";
// import { useGetAllCoursesQuery } from "../../../courses/coursesApi";
// import { Course } from "../../../../types/coursesTypes";
// import { Typography, Box } from "@mui/material";
// import { coursesTableStyles as styles } from "../../../../styles/courses/admin/coursesTable.styles";
// import CourseRow from "./CourseRow";

// type Props = {
//   onEdit: (course: Course) => void;
//   onAddVideo: (course_id: string, courseName: string) => void;
//   search?: string;
//   onManageVideos?: (course: Course) => void;
// };

// const CoursesTable: React.FC<Props> = ({ onEdit, onAddVideo, search, onManageVideos }) => {
//   const { data: courses, isLoading, error } = useGetAllCoursesQuery();

//   const filteredCourses = search
//     ? courses?.filter((course) =>
//         course.title.toLowerCase().includes(search.toLowerCase()) ||
//         course.lecturer.toLowerCase().includes(search.toLowerCase())
//       )
//     : courses;

//   if (isLoading)
//     return (
//       <Typography variant="body1" align="center" color="#ff4e8e">
//         טוען נתונים...
//       </Typography>
//     );

//   if (error)
//     return (
//       <Typography variant="body1" color="error" align="center">
//         אירעה שגיאה בטעינת הקורסים.
//       </Typography>
//     );

//   return (
//     <Box sx={styles.coursesGrid}>
//       {filteredCourses?.map((course) => (
//         <Box key={course.id} sx={styles.courseBoxWrapper}>
//           <CourseRow
//             course={course}
//             onEdit={onEdit}
//             onAddVideo={onAddVideo}
//             onManageVideos={onManageVideos}
//           />
//         </Box>
//       ))}
//     </Box>
//   );
// };

// export default CoursesTable;
import React, { useRef } from "react";
import {
  Typography,
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { useGetAllCoursesQuery } from "../../../courses/coursesApi";
import { Course } from "../../../../types/coursesTypes";
import CourseRow from "./CourseRow";

type Props = {
  onEdit: (course: Course) => void;
  onAddVideo: (course_id: string, courseName: string) => void;
  search?: string;
  onManageVideos?: (course: Course) => void;
};

const CoursesTable: React.FC<Props> = ({
  onEdit,
  onAddVideo,
  search,
  onManageVideos,
}) => {
  const { data: courses, isLoading, error } = useGetAllCoursesQuery();
  const scrollRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const filteredCourses = search
    ? courses?.filter(
        (course) =>
          course.title.toLowerCase().includes(search.toLowerCase()) ||
          course.lecturer.toLowerCase().includes(search.toLowerCase())
      )
    : courses;

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = isMobile ? 220 : 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (isLoading)
    return (
      <Typography variant="body1" align="center" color="#ff4e8e">
        טוען נתונים...
      </Typography>
    );

  if (error)
    return (
      <Typography variant="body1" color="error" align="center">
        אירעה שגיאה בטעינת הקורסים.
      </Typography>
    );

  return (
    <Box sx={{ position: "relative", width: "100%", mt: 4 }}>
      {/* חץ ימני */}
      <IconButton
        onClick={() => scroll("right")}
        sx={{
          position: "absolute",
          top: "45%",
          right: 4,
          zIndex: 2,
          backgroundColor: "#fff",
          boxShadow: 2,
          "&:hover": {
            backgroundColor: "#ffe0ed",
          },
        }}
      >
        <ArrowForwardIosIcon />
      </IconButton>

      {/* חץ שמאלי */}
      <IconButton
        onClick={() => scroll("left")}
        sx={{
          position: "absolute",
          top: "45%",
          left: 4,
          zIndex: 2,
          backgroundColor: "#fff",
          boxShadow: 2,
          "&:hover": {
            backgroundColor: "#ffe0ed",
          },
        }}
      >
        <ArrowBackIosNewIcon />
      </IconButton>

      {/* גלילה אופקית */}
      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          flexDirection: "row-reverse",
          overflowX: "auto",
          gap: 3,
          px: 5,
          py: 4,
          scrollBehavior: "smooth",
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            height: 6,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#ccc",
            borderRadius: 4,
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f0f0f0",
          },
        }}
      >
        {filteredCourses?.map((course) => (
          <Box key={course.id} sx={{ flex: "0 0 auto" }}>
            <CourseRow
              course={course}
              onEdit={onEdit}
              onAddVideo={onAddVideo}
              onManageVideos={onManageVideos}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CoursesTable;
