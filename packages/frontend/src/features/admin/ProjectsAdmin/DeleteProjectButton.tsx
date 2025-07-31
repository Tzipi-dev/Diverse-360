import React, { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../app/store";
import { removeProject } from "./projectsSlice";
import {
  Button, CircularProgress, Typography, Box,
  Fade, Paper, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
  id: string;
}

const DeleteProjectButton: React.FC<Props> = ({ id }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const handleDelete = async () => {
    setError(null);
    try {
      setIsDeleting(true);
      await dispatch(removeProject(id)).unwrap();
      setDeleted(true);
      setOpenDialog(false);
    } catch (err: any) {
      console.error("שגיאה במחיקה:", err);
      setError(err?.message || "שגיאה לא ידועה");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        color="error"
        size="small"
        startIcon={<DeleteIcon />}
        onClick={() => setOpenDialog(true)}
        disabled={deleted}
      >
        {deleted ? "נמחק" : "מחק"}
      </Button>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="confirm-delete-dialog-title"
        aria-describedby="confirm-delete-dialog-description"
      >
        <DialogTitle id="confirm-delete-dialog-title">אישור מחיקה</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-delete-dialog-description" dir="rtl">
            האם אתה בטוח שברצונך למחוק את הפרויקט הזה?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            ביטול
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            autoFocus
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {isDeleting ? "מוחק..." : "מחק"}
          </Button>
        </DialogActions>
      </Dialog>

      {error && (
        <Fade in>
          <Box
            sx={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1300,
            }}
          >
            <Paper
              elevation={6}
              sx={{
                px: 4,
                py: 3,
                bgcolor: "#fff0f0",
                border: "1px solid #f44336",
                borderRadius: 2,
                minWidth: 300,
                textAlign: "center",
              }}
            >
              <Typography variant="h6" color="error" fontWeight="bold">
                ⚠ שגיאה במחיקת הפרויקט
              </Typography>
              <Typography variant="body1" color="error" mt={1}>
                {error}
              </Typography>
              <Button
                onClick={() => setError(null)}
                variant="outlined"
                color="error"
                sx={{ mt: 2 }}
              >
                סגור
              </Button>
            </Paper>
          </Box>
        </Fade>
      )}
    </>
  );
};

export default DeleteProjectButton;
