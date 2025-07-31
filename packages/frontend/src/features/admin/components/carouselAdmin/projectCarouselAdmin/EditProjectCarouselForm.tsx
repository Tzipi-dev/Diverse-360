import React, { useState, useEffect,useRef } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, Typography, CardMedia
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProjectItem } from '../../../../home/homeTypes';
import { ProjectCarouselSchemaType, ProjectCarouselSchema } from '../../../../../schemas/ProjectCarouselSchema';
import {
  useCreateProjectCarouselMutation,
  useUpdateProjectCarouselMutation,
} from '../../../../home/projectCarouselApi';
import { supabase } from '../../../../../config/supabaseConfig';
import ImageSourceDialog from '../ImageSourceDilaog';
import { useImagePicker } from '../useImagePicker';




type Props = {
  projectItem?: ProjectItem;
  onClose: () => void;
  onSuccess: () => void;
};




const EditProjectCarouselForm: React.FC<Props> = ({ projectItem, onClose, onSuccess }) => {
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [supabaseDialogOpen, setSupabaseDialogOpen] = useState(false);
  const [driveDialogOpen, setDriveDialogOpen] = useState(false);




  const [addProject] = useCreateProjectCarouselMutation();
  const [updateProject] = useUpdateProjectCarouselMutation();




  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm<ProjectCarouselSchemaType>({
    resolver: zodResolver(ProjectCarouselSchema),
    defaultValues: {
      title: '',
      description: '',
      referenceLinkURL: '',
      imageURL: undefined,
    },
  });




  const {
    selectedFile,
    fileInputRef,
    handleFileChange,
    pickFromComputer,
    pickFromSupabase,
    selectSupabaseImage,
    supabaseImages,
    loadingSupabaseImages,
    pickFromDrive,
    googleDriveImages,
    selectDriveImage,
    requestAccessToken,
    accessToken
  } = useImagePicker();




  useEffect(() => {
    if (projectItem) {
      reset({
        title: projectItem.projectName,
        description: projectItem.description || '',
        referenceLinkURL: projectItem.referenceLinkURL || '',
        imageURL: undefined,
      });
    }
  }, [projectItem, reset]);




 
   // סינכרון setValue עם selectedFile
   useEffect(() => {
     if (selectedFile) {
      //  setSelectedImageFile(selectedFile);
       setValue('imageURL', selectedFile as any);
     }
   }, [selectedFile, setValue]);
 
   // מניעת ריצה חוזרת של pickFromDrive עם useRef
   const didLoadDriveRef = useRef(false);
 
   useEffect(() => {
     if (accessToken && !driveDialogOpen && !didLoadDriveRef.current) {
       pickFromDrive();
       setDriveDialogOpen(true);
       didLoadDriveRef.current = true;
     }
   }, [accessToken, driveDialogOpen, pickFromDrive]);




  const sanitizeFileName = (fileName: string): string =>
    fileName.normalize('NFD').replace(/\u0300-\u036f/g, '').replace(/[^a-zA-Z0-9.-]/g, '_');




  const uploadImageToSupabase = async (file: File): Promise<string | null> => {
    const fileName = `${Date.now()}_${sanitizeFileName(file.name)}`;
    const { error } = await supabase.storage.from('images').upload(fileName, file);
    if (error) {
      console.error('שגיאה בהעלאת קובץ ל-Supabase:', error);
      return null;
    }
    const { data: publicUrl } = supabase.storage.from('images').getPublicUrl(fileName);
    return publicUrl?.publicUrl || null;
  };




  const onSubmit = async (data: ProjectCarouselSchemaType) => {
    try {
      let imageURL = projectItem?.imageURL || '';
      if (selectedFile) {
        const uploadedUrl = await uploadImageToSupabase(selectedFile);
        if (!uploadedUrl) throw new Error('העלאת התמונה נכשלה');
        imageURL = uploadedUrl;
      }




      const payload: ProjectItem = {
        id: projectItem?.id || '',
        projectName: data.title,
        description: data.description || '',
        referenceLinkURL: data.referenceLinkURL,
        imageURL,
        created_at: projectItem?.created_at,
        updated_at: new Date().toISOString()
      };




      if (projectItem) {
        await updateProject(payload).unwrap();
      } else {
        await addProject(payload).unwrap();
      }
      onSuccess();
    } catch (err) {
      alert('שגיאה בשמירה');
      console.error(err);
    }
  };




  const handleGoogleDriveClick = () => {
    requestAccessToken();
    setImageDialogOpen(false);
  };




  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{projectItem ? 'עריכת פרויקט' : 'הוספת פרויקט חדש'}</DialogTitle>
      <DialogContent>
        <Box component="form" noValidate>
          <TextField
            fullWidth
            label="כותרת"
            {...register('title')}
            error={!!errors.title}
            helperText={errors.title?.message}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="תיאור"
            {...register('description')}
            error={!!errors.description}
            helperText={errors.description?.message}
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="קישור"
            {...register('referenceLinkURL')}
            error={!!errors.referenceLinkURL}
            helperText={errors.referenceLinkURL?.message}
            sx={{ mb: 2 }}
          />




          <Box sx={{ mb: 2 }}>
            <Button onClick={() => setImageDialogOpen(true)}>בחר מקור תמונה</Button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />




            <ImageSourceDialog
              open={imageDialogOpen}
              onClose={() => setImageDialogOpen(false)}
              onPickFromComputer={() => {
                pickFromComputer();
                setImageDialogOpen(false);
              }}
              onPickFromDrive={handleGoogleDriveClick}
              onPickFromSupabase={() => {
                pickFromSupabase();
                setImageDialogOpen(false);
                setTimeout(() => setSupabaseDialogOpen(true), 30);
              }}
            />




            <Dialog open={supabaseDialogOpen} onClose={() => setSupabaseDialogOpen(false)} fullWidth maxWidth="md">
              <DialogTitle>בחר תמונה מתוך המאגר</DialogTitle>
              <DialogContent>
                {loadingSupabaseImages ? (
                  <Typography>טוען תמונות...</Typography>
                ) : (
                  <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(120px, 1fr))" gap={2} mt={2}>
                    {supabaseImages.map((url) => (
                      <img
                        key={url}
                        src={url}
                        alt="supabase"
                        style={{ width: '100%', cursor: 'pointer', borderRadius: 8 }}
                        onClick={async () => {
                          await selectSupabaseImage(url);
                          setSupabaseDialogOpen(false);
                        }}
                      />
                    ))}
                  </Box>
                )}
              </DialogContent>
            </Dialog>




            <Dialog open={driveDialogOpen} onClose={() => setDriveDialogOpen(false)} fullWidth maxWidth="md">
              <DialogTitle>בחר תמונה מ־Google Drive</DialogTitle>
              <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(120px, 1fr))" gap={2} mt={2}>
                {googleDriveImages.map((file) => (
                  file.thumbnailLink && (
                    <Box
                      key={file.id}
                      onClick={async () => {
                        await selectDriveImage(file.id, file.name);
                        setDriveDialogOpen(false);
                      }}
                      sx={{
                        cursor: 'pointer',
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: '1px solid #ccc',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'scale(1.03)',
                          boxShadow: 3,
                        },
                      }}
                    >
                      <img
                        src={file.thumbnailLink}
                        alt={file.name}
                        style={{
                          width: '100%',
                          height: '100px',
                          objectFit: 'cover',
                          display: 'block'
                        }}
                      />
                      <Typography variant="caption" sx={{ p: 1, textAlign: 'center', display: 'block' }}>
                        {file.name}
                      </Typography>
                    </Box>
                  )
                ))}
              </Box>
            </Dialog>




            {(selectedFile || projectItem?.imageURL) && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">תמונה:</Typography>
                <CardMedia
                  component="img"
                  height="200"
                  image={
                    selectedFile
                      ? URL.createObjectURL(selectedFile)
                      : projectItem?.imageURL || ''
                  }
                  alt={projectItem?.projectName || 'תמונה'}
                  sx={{ mt: 1 }}
                />
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>ביטול</Button>
        <Button onClick={handleSubmit(onSubmit)} variant="contained">
          {projectItem ? 'שמור' : 'הוסף'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};




export default EditProjectCarouselForm;




