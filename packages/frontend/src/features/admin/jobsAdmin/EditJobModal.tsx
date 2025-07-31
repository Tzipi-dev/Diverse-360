
import React from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobsFormSchema, FormValues, Job } from "../../../schemas/jobsModel";

import { useUpdateJobMutation } from "./adminJobsApi";


interface EditJobModalProps {
  job: Job;
  open: boolean;
  onCancel: () => void;
  onSave: () => void;
}

const EditJobModal: React.FC<EditJobModalProps> = ({
  job,
  open,
  onCancel,
  onSave,
}) => {
  const [updateJob, { isLoading, error }] = useUpdateJobMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(jobsFormSchema),
    defaultValues: {
      title: job.title,
      description: job.description,
      location: job.location,
      requirements: job.requirements,
      isActive: job.isActive ?? true,
      workMode: job.workMode,
    },
  });

  React.useEffect(() => {
    if (job) {
      reset({
        title: job.title,
        description: job.description,
        location: job.location,
        requirements: job.requirements,
        isActive: job.isActive ?? true,
        workMode: job.workMode,
      });
    }
  }, [job, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      const updatedData = {
        ...data,
      };
      delete (updatedData as any).isActive;

      await updateJob({ id: job.id, updatedData }).unwrap();
      onSave();
    } catch (e) {
      console.error("Error updating job:", e);
    }
  };

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>עריכת משרה</DialogTitle>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        autoComplete="off"
      >
        <DialogContent dividers sx={{ mt: 1 }}>
          <TextField
            label="כותרת"
            fullWidth
            margin="normal"
            {...register("title")}
            error={!!errors.title}
            helperText={errors.title?.message}
          />
          <TextField
            label="תיאור"
            fullWidth
            margin="normal"
            multiline
            minRows={3}
            {...register("description")}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
          <TextField
            label="מיקום"
            fullWidth
            margin="normal"
            {...register("location")}
            error={!!errors.location}
            helperText={errors.location?.message}
          />
          <TextField
            label="דרישות"
            fullWidth
            margin="normal"
            multiline
            minRows={3}
            {...register("requirements")}
            error={!!errors.requirements}
            helperText={errors.requirements?.message}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="work-mode-label">אופן העבודה</InputLabel>
            <Select
              labelId="work-mode-label"
              label="אופן העבודה"
              defaultValue={job.workMode}
              {...register("workMode")}
              error={!!errors.workMode}
            >
              <MenuItem value="משרד">משרד</MenuItem>
              <MenuItem value="היברידי">היברידי</MenuItem>
              <MenuItem value="מהבית">מהבית</MenuItem>
            </Select>
            {errors.workMode && (
              <Typography color="error" variant="caption">
                {errors.workMode.message}
              </Typography>
            )}
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                {...register("isActive")}
                defaultChecked={job.isActive ?? true}
              />
            }
            label="פעילה"
          />
          {error && (
            <Typography color="error" mt={2}>
              שגיאה בעדכון המשרה
            </Typography>
          )}
        </DialogContent>

        <DialogActions>
      <Button
  onClick={onCancel}
  disabled={isLoading}
  sx={{
    backgroundColor: '#442063',
    color: '#e0e0e0',
    '&:hover': {
      backgroundColor: '#e0e0e0',
      color: '#442063',
    },
    transition: 'all 0.3s ease',
  }}
>
  בטל
</Button>

<Button
  type="submit"
  disabled={isLoading}
  sx={{
   backgroundColor: '#442063',
    color: '#e0e0e0',
    '&:hover': {
      backgroundColor: '#e0e0e0',
      color: '#442063',
    
    },
    transition: 'all 0.3s ease',
  }}
>
  {isLoading ? <CircularProgress size={24} color="inherit" /> : "שמור"}
</Button>

        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default EditJobModal;
