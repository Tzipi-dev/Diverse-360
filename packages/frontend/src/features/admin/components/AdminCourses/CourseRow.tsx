import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
  IconButton,
  Stack,
  Chip,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import DeleteCourseButton from "./DeleteCourseButton.tsx";
import { Course } from "../../../../types/coursesTypes";
import { courseRowStyles as styles } from "../../../../styles/courses/admin/courseRow.style";

type CourseRowProps = {
  course: Course;
  onEdit: (course: Course) => void;
  onAddVideo: (course_id: string, courseName: string) => void;
  onManageVideos?: (course: Course) => void;
};

const CourseRow: React.FC<CourseRowProps> = ({
  course,
  onEdit,
  onAddVideo,
  onManageVideos,
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Card
      sx={styles.card}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* תמונת הכרטיס בראש */}
      <img
        src={course.imageUrl}
        alt={course.title}
        style={styles.image as React.CSSProperties}
      />

      <Box sx={styles.chipBox}>
        <Chip
          label={course.isActive ? "פעיל" : "לא פעיל"}
          color={course.isActive ? "success" : "default"}
          size="small"
          sx={styles.chip}
        />
      </Box>

      <CardContent sx={styles.cardContent}>
        <Typography variant="h5" sx={styles.title}>
          {course.title}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            ...styles.description,
            whiteSpace: hovered ? "normal" : "nowrap",
            overflow: hovered ? "visible" : "hidden",
            textOverflow: hovered ? "clip" : "ellipsis",
            cursor: "default",
            transition: "all 0.3s ease",
            minHeight: hovered ? "auto" : 24, // גובה שורה אחת
          }}
        >
          {course.description}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center" sx={styles.stackRow}>
          <Typography variant="caption" sx={styles.dateText}>
            {new Date(course.uploadedAt).toLocaleDateString()}
          </Typography>
        </Stack>
        <Typography variant="body2" sx={styles.subjectLecturer}>
          נושא: {course.subject}
        </Typography>
        <Typography variant="body2" sx={styles.subjectLecturer}>
          מרצה: {course.lecturer}
        </Typography>
      </CardContent>

      <CardActions sx={styles.cardActions}>
        <Tooltip title="ערוך קורס" arrow>
          <IconButton onClick={() => onEdit(course)} sx={styles.iconButton}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="מחק קורס" arrow>
          <DeleteCourseButton id={course.id} icon sx={styles.deleteButton} />
        </Tooltip>
        <Button
          variant="contained"
          startIcon={<VideoLibraryIcon />}
          onClick={() => onManageVideos && onManageVideos(course)}
          sx={styles.manageVideosButton}
        >
          ניהול סרטונים
        </Button>
      </CardActions>
    </Card>
  );
};

export default CourseRow;
