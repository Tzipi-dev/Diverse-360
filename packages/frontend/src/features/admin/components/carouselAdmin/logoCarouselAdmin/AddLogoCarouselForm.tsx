
import React, { useState, useEffect ,useRef} from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, Typography, CardMedia
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LogoItem } from '../../../../home/homeTypes';
import { logoCarouselSchema, LogoCarouselSchemaType } from '../../../../../schemas/logoCarouselSchema';
import { useCreateLogoCarouselMutation } from '../../../../home/logoCarouselApi';
import { supabase } from '../../../../../config/supabaseConfig';
import ImageSourceDialog from '../ImageSourceDilaog';
import { useImagePicker } from '../useImagePicker';




type Props = {
  logoItem?: LogoItem;
  onClose: () => void;
  onSuccess: () => void;
};




const AddLogoCarouselForm: React.FC<Props> = ({ logoItem, onClose, onSuccess }) => {
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [supabaseDialogOpen, setSupabaseDialogOpen] = useState(false);
  const [driveDialogOpen, setDriveDialogOpen] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [addLogo] = useCreateLogoCarouselMutation();




  const {
    register, handleSubmit, setValue,
    formState: { errors }
  } = useForm<LogoCarouselSchemaType>({
    resolver: zodResolver(logoCarouselSchema),
    defaultValues: {
      name: logoItem?.name || '',
      imageURL: undefined,
    },
  });




  const {
    selectedFile, fileInputRef, handleFileChange,
    pickFromComputer, pickFromSupabase, selectSupabaseImage,
    supabaseImages, loadingSupabaseImages,
    pickFromDrive, googleDriveImages, selectDriveImage,
    requestAccessToken, accessToken
  } = useImagePicker();




 
    // סינכרון setValue עם selectedFile
    useEffect(() => {
      if (selectedFile) {
        setSelectedImageFile(selectedFile);
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




  const onSubmit = async (data: LogoCarouselSchemaType) => {
    try {
      let imageURL = logoItem?.imageURL || '';
      if (selectedImageFile) {
        const uploadedUrl = await uploadImageToSupabase(selectedImageFile);
        if (!uploadedUrl) throw new Error('העלאת התמונה נכשלה');
        imageURL = uploadedUrl;
      }
      const payload: LogoItem = {
        id: logoItem?.id || '',
        name: data.name,
        imageURL,
        created_at: logoItem?.created_at,
        updated_at: new Date().toISOString()
      };
      if (!logoItem) {
        await addLogo(payload).unwrap();
        onSuccess();
      }
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
      <DialogTitle>הוספת לוגו</DialogTitle>
      <DialogContent>
        <Box component="form" noValidate>
          <TextField
            fullWidth label="שם" {...register('name')}
            error={!!errors.name} helperText={errors.name?.message} sx={{ mb: 2 }}
          />
          <Box sx={{ mb: 2 }}>
            <Button onClick={() => setImageDialogOpen(true)}>בחרי מקור תמונה</Button>
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
              <DialogTitle>בחרי תמונה מתוך תמונות שמורות</DialogTitle>
              <DialogContent>
                {loadingSupabaseImages ? (
                  <Typography>טוען תמונות...</Typography>
                ) : (
                  <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(120px, 1fr))" gap={2} mt={2}>
                    {supabaseImages.map((url) => (
                      <img key={url} src={url} alt="supabase" style={{ width: '100%', cursor: 'pointer', borderRadius: 8 }}
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
              <DialogTitle>בחרי תמונה מ־Google Drive</DialogTitle>
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




            {(selectedImageFile || logoItem?.imageURL) && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">תמונה</Typography>
                <CardMedia
                  component="img" height="200"
                  image={selectedImageFile ? URL.createObjectURL(selectedImageFile) : logoItem?.imageURL || ''}
                  alt={logoItem?.name || 'תמונה'}
                  sx={{ mt: 1 }}
                />
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>ביטול</Button>
        <Button onClick={handleSubmit(onSubmit)} variant="contained">הוסף</Button>
      </DialogActions>
    </Dialog>
  );
};




export default AddLogoCarouselForm;







