import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, FormControlLabel, Checkbox
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../app/store';
import { addProject, fetchProjects } from './projectsSlice';

interface ProjectsCreateFormProps {
  open: boolean;
  onClose: () => void;
}

const isValidUrl = (value: string) => /^https?:\/\/.+\..+/.test(value);

const ProjectsCreateForm: React.FC<ProjectsCreateFormProps> = ({ open, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors(prev => ({ ...prev, imageFile: '' }));
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) newErrors.title = 'יש למלא שם פרויקט';
    if (!description.trim()) newErrors.description = 'יש למלא תיאור';
    if (!imageFile) newErrors.imageFile = 'יש להעלות תמונה';
    if (!linkUrl.trim() || !isValidUrl(linkUrl)) newErrors.linkUrl = 'כתובת קישור לא חוקית';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!imageFile) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('linkUrl', linkUrl);
      formData.append('isActive', String(isActive));
      formData.append('imageFile', imageFile);

      const res = await fetch('/api/projects', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('שגיאה בעת שליחת הנתונים לשרת');

      const data = await res.json();
await dispatch(fetchProjects()); // רענון כל הפרויקטים מהשרת

      onClose();
      setTitle('');
      setDescription('');
      setLinkUrl('');
      setImageFile(null);
      setIsActive(true);
      setErrors({});
    } catch (err) {
      console.error('שגיאה בשליחה:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>הוספת פרויקט חדש</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="שם הפרויקט"
            value={title}
            onChange={e => setTitle(e.target.value)}
            fullWidth
            required
            error={!!errors.title}
            helperText={errors.title}
          />
          <TextField
            label="תיאור"
            value={description}
            onChange={e => setDescription(e.target.value)}
            fullWidth
            multiline
            required
            error={!!errors.description}
            helperText={errors.description}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
            style={{ marginTop: 8 }}
          />
          {errors.imageFile && (
            <div style={{ color: 'red', fontSize: 12 }}>{errors.imageFile}</div>
          )}
          <TextField
            label="קישור (URL)"
            value={linkUrl}
            onChange={e => setLinkUrl(e.target.value)}
            fullWidth
            required
            error={!!errors.linkUrl}
            helperText={errors.linkUrl}
          />
          <FormControlLabel
            control={<Checkbox checked={isActive} onChange={e => setIsActive(e.target.checked)} />}
            label="פעיל"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary" disabled={uploading}>
            ביטול
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={uploading}>
            {uploading ? 'מעלה...' : 'שמירה'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProjectsCreateForm;
