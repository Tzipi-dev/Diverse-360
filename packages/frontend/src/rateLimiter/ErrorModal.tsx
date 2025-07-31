// src/components/ErrorModal.tsx
import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { hideError } from './errorModalSlice';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export const ErrorModal = () => {
  const dispatch = useDispatch();
  const { open, message } = useSelector((state: RootState) => state.errorModal);

  const handleClose = () => {
    dispatch(hideError());
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2" gutterBottom>
          שגיאה
        </Typography>
        <Typography sx={{ mb: 2 }}>{message}</Typography>
        <Button variant="contained" onClick={handleClose}>
          סגור
        </Button>
      </Box>
    </Modal>
  );
};
