import React, { useState } from "react";
import { Course } from "../../../../types/coursesTypes";
import CreateCourseForm from "./CreateCourseForm";
import EditCourseForm from "./EditCourseForm";
import CoursesTable from "./CoursesTable";
import AddVideoToCourseForm from "./AddVideoToCourseForm";
import { useGetVideosByCourseIdQuery } from "../../videosApiSlice";
import { Dialog, DialogTitle, DialogContent, IconButton, Button, CircularProgress, Box, Typography, ThemeProvider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { styles, adminTheme } from "../../../../styles/courses/admin/coursesAdmin.styles";
import VideoListForCourse from "./VideoListForCourse";

const CoursesAdmin: React.FC = () => {
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [addVideoData, setAddVideoData] = useState<{ course_id: string; courseName: string } | null>(null);
  const [selectedCourseForVideos, setSelectedCourseForVideos] = useState<Course | null>(null);

  const { data: courseVideos, isLoading: isVideosLoading } = useGetVideosByCourseIdQuery(
    editCourse?.id ?? "",
    { skip: !editCourse }
  );

  return (
    <ThemeProvider theme={adminTheme}>
      <Box sx={styles.container}>
        <Box sx={styles.header}>
          <Typography variant="h3" sx={styles.title}>ניהול קורסים</Typography>
          <Typography variant="h6" sx={styles.subtitle}>
            מערכת ניהול מתקדמת לקורסי וידאו - עיצוב טכנולוגי מקצועי
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => setCreateOpen(true)}
            sx={styles.addButton}
          >
            הוסף קורס חדש
          </Button>
        </Box>

        <CoursesTable
          onEdit={setEditCourse}
          onAddVideo={(id, name) => setAddVideoData({ course_id: id, courseName: name })}
          onManageVideos={setSelectedCourseForVideos}
        />

        {/* יצירת קורס */}
        <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle sx={styles.dialogTitle}>
            <Box sx={styles.dialogTitleBox}>
              <Typography variant="h6" sx={styles.dialogTitleText}>צור קורס חדש</Typography>
              <IconButton onClick={() => setCreateOpen(false)}><CloseIcon /></IconButton>
            </Box>
          </DialogTitle>
          <DialogContent dividers sx={styles.dialogContent}>
            <CreateCourseForm onSuccess={() => setCreateOpen(false)} />
          </DialogContent>
        </Dialog>

        {/* עריכת קורס */}
        <Dialog open={!!editCourse} onClose={() => setEditCourse(null)} fullWidth maxWidth="md">
          <DialogTitle sx={styles.dialogTitle}>
            <Box sx={styles.dialogTitleBox}>
              <Typography variant="h6" sx={styles.dialogTitleText}>ערוך קורס</Typography>
              <IconButton onClick={() => setEditCourse(null)}><CloseIcon /></IconButton>
            </Box>
          </DialogTitle>
          <DialogContent dividers sx={styles.dialogContent}>
            {editCourse && (
              isVideosLoading ? (
                <Box textAlign="center" py={4}><CircularProgress sx={styles.loader} /></Box>
              ) : (
                <EditCourseForm
                  editCourse={editCourse}
                  videos={courseVideos || []}
                  setEditCourse={setEditCourse}
                  onSuccess={() => setEditCourse(null)}
                />
              )
            )}
          </DialogContent>
        </Dialog>

        {/* הוספת וידאו */}
        <Dialog open={!!addVideoData} onClose={() => setAddVideoData(null)} fullWidth maxWidth="sm">
          <DialogTitle sx={styles.dialogTitle}>
            <Box sx={styles.dialogTitleBox}>
              <Typography variant="h6" sx={styles.dialogTitleText}>הוסף וידאו לקורס</Typography>
              <IconButton onClick={() => setAddVideoData(null)}><CloseIcon /></IconButton>
            </Box>
          </DialogTitle>
          <DialogContent dividers sx={styles.dialogContent}>
            {addVideoData && (
              <AddVideoToCourseForm
                course_id={addVideoData.course_id}
                courseName={addVideoData.courseName}
                onSuccess={() => setAddVideoData(null)}
                onCancel={() => setAddVideoData(null)}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* ניהול סרטונים */}
        <Dialog open={!!selectedCourseForVideos} onClose={() => setSelectedCourseForVideos(null)} fullWidth maxWidth="md">
          <DialogTitle sx={styles.dialogTitle}>
            <Box sx={styles.dialogTitleBox}>
              <Typography variant="h6" sx={styles.dialogTitleText}>
                ניהול סרטונים - {selectedCourseForVideos?.title}
              </Typography>
              <Box>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => selectedCourseForVideos && setAddVideoData({ course_id: selectedCourseForVideos.id, courseName: selectedCourseForVideos.title })}
                  sx={styles.manageVideoButton}
                >
                  הוסף סרטון
                </Button>
                <IconButton onClick={() => setSelectedCourseForVideos(null)}><CloseIcon /></IconButton>
              </Box>
            </Box>
          </DialogTitle>
          <DialogContent dividers sx={styles.dialogContent}>
            {selectedCourseForVideos && <VideoListForCourse courseId={selectedCourseForVideos.id} />}
          </DialogContent>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default CoursesAdmin;
