import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useCreateVideoMutation } from "../../videosApiSlice";
import {TextField,Button,Typography,Box,Alert,ThemeProvider,} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { styles } from "../../../../styles/courses/admin/addVideoForm.styles";
import { VideoFormData } from "../../../../types/coursesTypes";
type Props = {
  course_id: string;
  courseName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};
const formTheme = createTheme({
  palette: {
    primary: { main: "#ff4e8e" },
    secondary: { main: "#18181b" },
    text: {
      primary: "#222",
    },
  },
  typography: {
    h5: {
      color: "#222",
    },
  },
});

const AddVideoToCourseForm: React.FC<Props> = ({
  course_id,
  courseName,
  onSuccess,
  onCancel,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VideoFormData>();

  const [createVideo, { isLoading }] = useCreateVideoMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const onSubmit = async (data: VideoFormData) => {
    setSubmitError(null);
    setSubmitSuccess(false);

    if (!data.videoFile || data.videoFile.length === 0) {
      setSubmitError("נא לבחור קובץ וידאו");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("course_id", course_id);
      formData.append("title", data.title);
      formData.append("description", data.description || "");
      formData.append("video", data.videoFile[0]);

      await createVideo(formData).unwrap();
      reset();
      setSubmitSuccess(true);

      if (onSuccess) {
        setTimeout(() => onSuccess(), 1500);
      }
    } catch (err: any) {
      console.error("שגיאה בהוספת וידאו:", err);
      setSubmitError(
        err?.data?.message || "שגיאה בהוספת וידאו. אנא נסה שוב."
      );
    }
  };

  return (
    <ThemeProvider theme={formTheme}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={styles.formContainer}
        noValidate
      >
        <Typography
          variant="subtitle1"
          color="text.secondary"
          textAlign="center"
          sx={{ mb: 2 }}
        >
          {courseName}
        </Typography>

        <Controller
          name="title"
          control={control}
          rules={{ required: "נא להזין כותרת לוידאו" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="כותרת הוידאו"
              error={!!errors.title}
              helperText={errors.title?.message}
              fullWidth
              required
              variant="outlined"
              sx={styles.textField}
            />
          )}
        />
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="תיאור הוידאו"
              multiline
              rows={3}
              fullWidth
              variant="outlined"
              sx={styles.textField}
            />
          )}
        />
        <Box sx={{ width: "100%" }}>
          <Controller
            name="videoFile"
            control={control}
            rules={{ required: "נא לבחור קובץ וידאו" }}
            render={({ field }) => (
              <>
                <input
                  id="video-upload"
                  type="file"
                  accept="video/*"
                  onChange={(e) => field.onChange(e.target.files)}
                  style={{ display: "none" }}
                />
                <label htmlFor="video-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    sx={styles.fileButton}
                  >
                    בחרי קובץ מהמחשב
                  </Button>
                </label>
                {errors.videoFile && (
                  <Typography variant="body2" color="error" mt={1}>
                    {errors.videoFile.message}
                  </Typography>
                )}
              </>
            )}
          />
        </Box>
        {submitError && <Alert severity="error">{submitError}</Alert>}
        {submitSuccess && <Alert severity="success">וידאו נוסף בהצלחה לקורס!</Alert>}
        <Box sx={styles.buttonContainer}>
          <Button
            variant="contained"
            type="submit"
            disabled={isLoading}
            sx={styles.submitButton}
          >
            {isLoading ? "מעלה..." : "הוסף וידאו"}
          </Button>
          {onCancel && (
            <Button variant="outlined" onClick={onCancel} sx={styles.cancelButton}>
              ביטול
            </Button>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};
export default AddVideoToCourseForm;
