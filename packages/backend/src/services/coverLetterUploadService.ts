import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../config/supabaseConfig';
import { uploadFile } from './supabaseUploadIntoStorageService';

const BUCKET_NAME = 'user-files-uploads';

// export const handleCoverLetterUpload = async (req: Request) => {
//   const file = req.file;
//   const jobId = req.body.job_id;
//   const userId = req.body.user_id;
//   const summary = req.body.summary || ''; 

//   if (!file || !jobId ) {
//     throw new Error('חסר קובץ, מזהה משרה או מזהה משתמש');
//   }

//   const fileId = uuidv4();
//   const extension = file.originalname.split('.').pop();
//   const filePath = `cover_letters/${jobId}/${fileId}.${extension}`;

//   try {
//     await uploadFile(BUCKET_NAME, filePath, file.buffer, file.mimetype);
//   } catch (e) {
//     console.error('❌ שגיאה בהעלאת הקובץ ל-Supabase:', e);
//     throw e;
//   }

//   const { error } = await supabase.from('cover_letters').insert([
//     {
//       id: fileId,
//       job_id: jobId,
//       user_id: userId,
//       cover_letter_url: filePath,
//       summary_text: summary,
//       submitted: true,
//       created_at: new Date().toISOString(),
//     },
    
//   ]);

//   if (error) {
//     console.error('❌ שגיאה בשמירת הרשומה בטבלה:', error);
//     throw error;
//   }

//   return { file_path: filePath };
// };

export const handleCoverLetterUpload = async (req: Request) => {
  const file = req.file;
  const jobId = req.body.job_id;
  const userId = req.body.user_id;
  const summary = req.body.summary || ''; 
const cover_letter = req.body.cover_letter_url || ''; // טקסט המכתב

  if (!file || !jobId ) {
    throw new Error('חסר קובץ, מזהה משרה או מזהה משתמש');
  }

  const fileId = uuidv4();
  const extension = file.originalname.split('.').pop();
  const filePath = `cover_letters/${jobId}/${fileId}.${extension}`;

  try {
    await uploadFile(BUCKET_NAME, filePath, file.buffer, file.mimetype);
  } catch (e) {
    console.error('❌ שגיאה בהעלאת הקובץ ל-Supabase:', e);
    throw e;
  }

  try {
    const { error } = await supabase.from('cover_letters').insert([
      {
        id: fileId,
        job_id: jobId,
        user_id: userId,
        cover_letter_url: cover_letter,
        summary_text: summary,
        submitted: true,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error('❌ שגיאה בשמירת הרשומה בטבלה:', error);
      throw error;
    }

    return { file_path: filePath };
  } catch (e) {
    console.error('❌ שגיאה כללית בשמירה:', e);
    throw e;
  }
};
