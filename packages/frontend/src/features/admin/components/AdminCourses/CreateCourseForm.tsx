import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useCreateCourseMutation, useGenerateCourseImageMutation } from "../../../courses/coursesApi"; // וודא שהוספת את useGenerateCourseImageMutation ב־apiSlice שלך
import { zodResolver } from "@hookform/resolvers/zod";
import { courseFormSchema, CourseSchemaType } from "../../../../schemas/courseSchema";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { createCourseFormStyles as styles } from "../../../../styles/courses/admin/createCourseForm.styles";
import { GenerateCourseImageOptions } from "types/coursesTypes";

const adminFormTheme = createTheme({
  palette: {
    primary: { main: "#ff4e8e" },
    secondary: { main: "#18181b" },
  },
});

type Props = {
  onSuccess?: () => void;
};

const CreateCourseForm: React.FC<Props> = ({ onSuccess }) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CourseSchemaType>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      isActive: true,
    },
  });

  const [createCourse, { isLoading }] = useCreateCourseMutation();
  const [generateCourseImage, { isLoading: isGenerating }] = useGenerateCourseImageMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  const subject = watch("subject");
  const description = watch("description");

  const onSubmit = async (data: CourseSchemaType) => {
    setSubmitError(null);
    setSubmitSuccess(false);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description || "");
      formData.append("uploadedAt", data.uploadedAt);
      formData.append("subject", data.subject);
      formData.append("lecturer", data.lecturer);
      formData.append("isActive", String(data.isActive));
      if (data.videoFile && data.videoFile.length > 0) {
        formData.append("video", data.videoFile[0]);
      }

      await createCourse(formData).unwrap();
      reset();
      setSubmitSuccess(true);
      setGeneratedImageUrl(null);
      onSuccess?.();
    } catch (err) {
      console.error("שגיאה ביצירת קורס:", err);
      setSubmitError("שגיאה ביצירת קורס. אנא נסה שוב.");
    }
  };

  const handleGenerateImage = async () => {
    if (!subject && !description) {
      setSubmitError("יש למלא נושא ותיאור לפני יצירת תמונה");
      return;
    }
    setSubmitError(null);
    try {
      const res = await generateCourseImage({
        subject,
        description,
        prompt: `${subject} ${description}`,
      } as GenerateCourseImageOptions).unwrap();
      setGeneratedImageUrl(res.publicUrl);
    } catch (err) {
      console.error("שגיאה ביצירת תמונה:", err);
      setSubmitError("שגיאה ביצירת תמונה. אנא נסה שוב.");
    }
  };

  return (
    <ThemeProvider theme={adminFormTheme}>
      <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button
          onClick={handleGenerateImage}
          disabled={isGenerating}
          sx={styles.generateImageButton}
        >
          {isGenerating ? (
            <CircularProgress size={24} sx={{ color: "#fff" }} />
          ) : (
            "🚀 צור תמונת רקע"
          )}
        </Button>
      </Box>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={styles.formWrapper} noValidate>
        <Typography variant="h5" sx={styles.title}>צור קורס חדש</Typography>

        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="שם הקורס" error={!!errors.title} helperText={errors.title?.message} fullWidth required variant="outlined" sx={styles.textField} />
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="תיאור הקורס" multiline rows={3} fullWidth variant="outlined" sx={styles.textField} />
          )}
        />

        <Controller
          name="uploadedAt"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="תאריך" type="date" error={!!errors.uploadedAt} helperText={errors.uploadedAt?.message} InputLabelProps={{ shrink: true }} fullWidth required variant="outlined" sx={styles.textField} />
          )}
        />

        <Controller
          name="subject"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="נושא הקורס" error={!!errors.subject} helperText={errors.subject?.message} fullWidth required variant="outlined" sx={styles.textField} />
          )}
        />

        <Controller
          name="lecturer"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="שם המרצה" error={!!errors.lecturer} helperText={errors.lecturer?.message} fullWidth required variant="outlined" sx={styles.textField} />
          )}
        />

        <Controller
          name="isActive"
          control={control}
          render={({ field }) => (
            <FormControlLabel control={<Checkbox {...field} checked={field.value} sx={styles.checkbox} />} label="פעיל" />
          )}
        />

        {generatedImageUrl && (
          <Box mt={2} sx={{ textAlign: "center" }}>
            <Typography variant="subtitle1" mb={1}>
              תמונת הרקע שנוצרה:
            </Typography>
            <img
              src={generatedImageUrl}
              alt="תמונת רקע שנוצרה"
              style={{ maxWidth: "100%", borderRadius: 8 }}
            />
          </Box>
        )}

        {submitError && <Alert severity="error" sx={{ mt: 2 }}>{submitError}</Alert>}
        {submitSuccess && <Alert severity="success" sx={{ mt: 2 }}>קורס נוצר בהצלחה!</Alert>}

        <Button variant="contained" type="submit" disabled={isLoading} sx={styles.submitButton}>
          {isLoading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "צור קורס"}
        </Button>
      </Box>
    </ThemeProvider>
  );
};

export default CreateCourseForm;
