import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useGetVideosByCourseIdQuery,
  useDeleteVideoMutation,
} from "../../videosApiSlice";
import {
  Box,
  IconButton,
  CircularProgress,
  Typography,
} from "@mui/material";
import { styles } from "../../../../styles/courses/admin/coursesAdmin.styles";

const VideoListForCourse: React.FC<{ courseId: string }> = ({ courseId }) => {
  const { data: videos, isLoading, refetch } = useGetVideosByCourseIdQuery(courseId, {
    skip: !courseId,
  });

  const [deleteVideo, { isLoading: isDeleting }] = useDeleteVideoMutation();
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteVideo(id).unwrap();
      refetch();
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress sx={{ color: "#ff4e8e" }} />
      </Box>
    );

  if (!videos || videos.length === 0)
    return <Typography color="text.secondary">אין סרטונים לקורס זה.</Typography>;

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 4,
        justifyContent: "center",
        alignItems: "flex-start",
        mt: 2,
      }}
    >
      {videos.map((video) => (
        <Box key={video.id} sx={styles.videoCard}>
          <IconButton
            onClick={() => handleDelete(video.id)}
            sx={styles.deleteVideoButton} // ✅ עדכון פה
            disabled={isDeleting && deletingId === video.id}
            aria-label="מחק סרטון"
          >
            <DeleteIcon />
          </IconButton>

          <Typography variant="h6" sx={styles.videoTitle}>
            {video.title}
          </Typography>
          <Typography variant="body2" sx={styles.videoDescription}>
            {video.description}
          </Typography>
          <video
            src={video.video_url}
            controls
            style={{ width: "100%", borderRadius: 8 }}
          />
        </Box>
      ))}
    </Box>
  );
};

export default VideoListForCourse;
