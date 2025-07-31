import React, { useEffect, useState, useCallback } from 'react';
import { useDeleteForumMutation } from '../fourmApi';
import { Forum } from '../forumTypes';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from '@mui/material';
import { jwtDecode } from "jwt-decode";

interface DeleteFormProps {
  forum: Forum | null;
  currentUserId: string | null;
  isAdmin: boolean;
  onsave: () => void;
}
interface CustomJwtPayload {
  role: string;
  userId: string;
}

const DeleteForm: React.FC<DeleteFormProps> = ({
  forum,
  currentUserId,
  isAdmin,
  onsave
}) => {
  const [deleteForum, { isLoading: isDeleting, isError }] = useDeleteForumMutation();
  const [errorMessage, setErrorMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [hasErrorOccurred, setHasErrorOccurred] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);


  useEffect(() => {
    setOpenDialog(true);
  }, []);


useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    const decoded = jwtDecode<CustomJwtPayload>(token);
    setUserId(decoded.userId);
  }
}, []);
  
  const handleDelete = async () => {
    if (forum) {
      if (forum.created_by_user_id === currentUserId || isAdmin) {
        try {
          if(!userId)return;
          await deleteForum({ id: forum.id, userId }).unwrap();
          setOpenDialog(false);
          setOpenSuccessDialog(true);
        } catch (error: any) {
          setOpenDialog(false);
          if (error?.status === 500) {
            setErrorMessage('אין לך הרשאות למחוק טופס זה');
          } else {
            setErrorMessage('שגיאה במחיקת הטופס');
          }
          setHasErrorOccurred(true);
        }
      } else {
        setOpenDialog(false);
        setErrorMessage('אין לך הרשאות למחוק טופס זה');
        setHasErrorOccurred(true);
      }
    }
  };

  const cancelDelete = () => {
    setOpenDialog(false);
    onsave();
  };

  const closeErrorDialog = useCallback(() => {
    setOpenErrorDialog(false);
    setErrorMessage('');
    if (hasErrorOccurred) {
      onsave();
      setHasErrorOccurred(false);
    }
  }, [hasErrorOccurred, onsave]);

  const closeSuccessDialog = useCallback(() => {
    setOpenSuccessDialog(false);
    onsave();
  }, [onsave]);

  useEffect(() => {
    if (errorMessage) {
      setOpenErrorDialog(true);
      const timer = setTimeout(() => {
        closeErrorDialog();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [errorMessage, closeErrorDialog]);

  useEffect(() => {
    if (openSuccessDialog) {
      const timer = setTimeout(() => {
        closeSuccessDialog();
        window.location.reload();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [openSuccessDialog, closeSuccessDialog]); 

  return (
    <div>
      <Dialog open={openDialog} onClose={cancelDelete}>
        <DialogTitle>אישור מחיקה</DialogTitle>
        <DialogContent>
          <DialogContentText>
            האם אתה בטוח שברצונך למחוק את טופס <strong>{forum?.title}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            לא, ביטול
          </Button>
          <Button onClick={handleDelete} color="primary" disabled={isDeleting}>
            כן, מחק
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openSuccessDialog}>
        <DialogTitle>הצלחה</DialogTitle>
        <DialogContent>
          <DialogContentText>
            הפורום נמחק בהצלחה!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeSuccessDialog} color="primary">
            סגור
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openErrorDialog} onClose={closeErrorDialog}>
        <DialogTitle>שגיאה</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {errorMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeErrorDialog} color="primary">
            סגור
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeleteForm;
