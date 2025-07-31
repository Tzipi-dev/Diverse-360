import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import {
  Course,
  CourseVideo,
} from "../../../../types/coursesTypes";
import {
  useUpdateCourseMutation,
} from "../../../courses/coursesApi";
import {
  useUpdateVideoMutation,
} from "../../videosApiSlice";
import {
  courseFormSchema,
  CourseSchemaType,
} from "../../../../schemas/courseSchema";
import { styles } from "../../../../styles/courses/admin/editCourseForm.style";

type Props = {
  editCourse: Course;
  videos: CourseVideo[];
  setEditCourse: React.Dispatch<React.SetStateAction<Course | null>>;
  onSuccess?: () => void;
};

const EditCourseForm: React.FC<Props> = ({
  editCourse,
  videos,
  setEditCourse,
  onSuccess,
}) => {
  const [updateCourse, { isLoading }] = useUpdateCourseMutation();
  const [updateVideo] = useUpdateVideoMutation();
  const [apiError, setApiError] = useState<string | null>(null);
  const [selectedVideoFiles, setSelectedVideoFiles] = useState<
    Record<string, File | null>
  >({});
  const [videoEdits, setVideoEdits] = useState<
    Record<string, { title: string; description: string }>
  >(() =>
    Object.fromEntries(
      videos.map((video) => [
        video.id,
        { title: video.title, description: video.description || "" },
      ])
    )
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CourseSchemaType>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      ...editCourse,
      uploadedAt: editCourse.uploadedAt
        ? new Date(editCourse.uploadedAt).toISOString().substring(0, 10)
        : "",
    },
  });

  const handleVideoFileChange = (videoId: string, file: File | null) => {
    setSelectedVideoFiles((prev) => ({ ...prev, [videoId]: file }));
  };

  const handleVideoFieldChange = (
    videoId: string,
    field: "title" | "description",
    value: string
  ) => {
    setVideoEdits((prev) => ({
      ...prev,
      [videoId]: {
        ...prev[videoId],
        [field]: value,
      },
    }));
  };

  const onSubmit = async (data: CourseSchemaType) => {
    setApiError(null);
    try {
      const formData = new FormData();
      formData.append("id", editCourse.id);
      formData.append("title", data.title);
      formData.append("description", data.description || "");
      formData.append("uploadedAt", data.uploadedAt);
      formData.append("subject", data.subject);
      formData.append("lecturer", data.lecturer);
      formData.append("isActive", String(data.isActive));

      const updatedCourse = await updateCourse(formData).unwrap();

      await Promise.all(
        videos.map(async (video) => {
          const file = selectedVideoFiles[video.id];
          const edited = videoEdits[video.id];

          const videoFormData = new FormData();
          videoFormData.append("title", edited.title);
          videoFormData.append("description", edited.description);
          videoFormData.append("course_id", editCourse.id);
          if (file) {
            videoFormData.append("video", file);
          }

          await updateVideo({
            id: video.id,
            formData: videoFormData,
          }).unwrap();
        })
      );

      setEditCourse(updatedCourse);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      if (err?.data?.message) setApiError(err.data.message);
      else if (err.message) setApiError(err.message);
      else setApiError("שגיאה לא ידועה בעדכון הקורס");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={styles.formContainer}
      noValidate
    >
      <Typography variant="h5" textAlign="center" sx={styles.title}>
        עריכת קורס
      </Typography>

      {[
        { label: "שם הקורס", name: "title", multiline: false, required: true },
        { label: "תיאור קצר", name: "description", multiline: true, rows: 3 },
        { label: "תאריך", name: "uploadedAt", type: "date", required: true },
        { label: "נושא הקורס", name: "subject", multiline: false, required: true },
        { label: "שם המרצה", name: "lecturer", multiline: false, required: true },
      ].map(({ label, name, multiline, rows, type, required }) => (
        <TextField
          key={name}
          label={label}
          type={type || "text"}
          multiline={multiline}
          rows={rows}
          {...register(name as keyof CourseSchemaType)}
          error={!!errors[name as keyof CourseSchemaType]}
          required={required}
          InputLabelProps={type === "date" ? { shrink: true } : undefined}
          sx={styles.textField}
          fullWidth
        />
      ))}

      <FormControlLabel
        sx={styles.checkboxLabel}
        control={
          <Checkbox
            {...register("isActive")}
            defaultChecked={editCourse.isActive}
            sx={styles.checkbox}
          />
        }
        label="פעיל"
      />

      <Typography variant="h6" mt={3} mb={1}>
        סרטונים קיימים:
      </Typography>

      {videos.map((video) => (
        <Box key={video.id} sx={styles.videoBox}>
          <TextField
            label="כותרת סרטון"
            value={videoEdits[video.id]?.title || ""}
            onChange={(e) =>
              handleVideoFieldChange(video.id, "title", e.target.value)
            }
            fullWidth
            sx={styles.textField}
          />
          <TextField
            label="תיאור סרטון"
            value={videoEdits[video.id]?.description || ""}
            onChange={(e) =>
              handleVideoFieldChange(video.id, "description", e.target.value)
            }
            fullWidth
            multiline
            rows={2}
            sx={styles.textField}
          />
          <video
            width="100%"
            controls
            src={video.video_url}
            style={{ borderRadius: 8 }}
          />
          <Box mt={1}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              החלף סרטון זה:
            </Typography>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                handleVideoFileChange(video.id, file);
              }}
              style={{ width: "100%" }}
            />
          </Box>
        </Box>
      ))}

      {apiError && <Alert severity="error">{apiError}</Alert>}

      <Box sx={styles.buttonsBox}>
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          sx={styles.submitBtn}
        >
          {isLoading ? "שומר..." : "שמור שינויים"}
        </Button>
        <Button
          variant="outlined"
          onClick={() => setEditCourse(null)}
          sx={styles.cancelBtn}
        >
          ביטול
        </Button>
      </Box>
    </Box>
  );
};

export default EditCourseForm;
