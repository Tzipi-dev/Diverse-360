import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Checkbox, FormControlLabel, Snackbar, Alert
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../app/store';
import { Project } from './projectTypes';
import { fetchProjects } from './projectsSlice';

interface Props {
  open: boolean;
  project: Project;
  onClose: () => void;
}

const isValidUrl = (value: string) =>
  /^https?:\/\/.+\..+/.test(value);

const ProjectEditForm: React.FC<Props> = ({ open, project, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [linkUrl, setLinkUrl] = useState(project.linkUrl);
  const [isActive, setIsActive] = useState(project.isActive);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [successOpen, setSuccessOpen] = useState(false);
  const [errorText, setErrorText] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!linkUrl || !isValidUrl(linkUrl)) {
      setErrorText('כתובת קישור לא חוקית');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('linkUrl', linkUrl);
      formData.append('isActive', String(isActive));
      if (imageFile) formData.append('imageFile', imageFile);

      const res = await fetch(`/api/projects/${project.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!res.ok) throw new Error('שגיאה בהעלאת תמונה לשרת');

      await dispatch(fetchProjects());
      setSuccessOpen(true);
      onClose();
    } catch (err) {
      console.error('שגיאה בעדכון פרויקט:', err);
      setErrorText('שגיאה בעדכון פרויקט');
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>עריכת פרויקט</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="שם הפרויקט"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="תיאור"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ marginTop: 8 }}
            />
            <TextField
              label="קישור לפרויקט (URL)"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              error={linkUrl !== '' && !isValidUrl(linkUrl)}
              helperText={linkUrl !== '' && !isValidUrl(linkUrl) ? 'כתובת לא חוקית' : ''}
              fullWidth
              required
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
              }
              label="פעיל"
            />
            {errorText && <span style={{ color: 'red', fontSize: 13 }}>{errorText}</span>}
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="secondary">ביטול</Button>
            <Button type="submit" variant="contained" color="primary">
              שמירה
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccessOpen(false)} sx={{ width: '100%' }}>
          הפרויקט עודכן בהצלחה!
        </Alert>
      </Snackbar>

    </>
  );
};

export default ProjectEditForm;

