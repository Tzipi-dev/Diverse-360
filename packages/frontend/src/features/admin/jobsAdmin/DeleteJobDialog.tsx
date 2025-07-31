import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button
} from '@mui/material';
import { useDeleteJobMutation } from './adminJobsApi';

interface Props {
  open: boolean;
  jobId: string | null;
  onClose: () => void;
  afterDelete: () => void;
}

const DeleteJobDialog: React.FC<Props> = ({ open, jobId, onClose, afterDelete }) => {
  const [deleteJob] = useDeleteJobMutation();

  const handleConfirm = async () => {
    if (!jobId) return;
    try {
      await deleteJob(jobId).unwrap();
    } catch (error) {
      alert('שגיאה במחיקת משרה');
      console.error(error);
    } finally {
      onClose();
      afterDelete();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>אישור מחיקה</DialogTitle>
      <DialogContent>האם את בטוחה שברצונך למחוק את המשרה?</DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">ביטול</Button>
        <Button onClick={handleConfirm} color="error">מחק</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteJobDialog;