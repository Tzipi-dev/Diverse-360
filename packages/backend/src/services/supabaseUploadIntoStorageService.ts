// import { log } from 'node:console';
// import { supabase } from '../config/supabaseConfig';

// // export const uploadFile = async (
// //   bucketName: string,
// //   filePath: string,
// //   file: Buffer,
// //   contentType: string = 'application/octet-stream'
// // ) => {
// //   const { data, error } = await supabase.storage
// //     .from(bucketName)
// //     .upload(filePath, file, {
// //       contentType,
// //       upsert: true,
// //     });    
    
// //   if (error) throw new Error(`Upload error: ${error.message}`);
  
// //   return data;
// // };

// export const uploadFile = async (
//   bucketName: string,
//   path: string,
//   file: Buffer,
//   contentType: string
// ) => {
//   const { data, error } = await supabase.storage
//     .from(bucketName)
//     .upload(path, file, {
//       contentType,
//       upsert: true,
//     });
//   if (error) {
//     console.error("❌ Error uploading to Supabase Storage:", error);
//     throw new Error(`Upload error: ${error.message}`);
//   }
//   return data;
// };



// export const deleteFile = async (bucketName: string, filePath: string) => {
//   const { data, error } = await supabase.storage
//     .from(bucketName)
//     .remove([filePath]);

//   if (error) throw new Error(`Delete error: ${error.message}`);
//   return data;
// };

// export const downloadFile = async (bucketName: string, filePath: string) => {
//   const { data, error } = await supabase.storage
//     .from(bucketName)
//     .download(filePath);

//   if (error) throw new Error(`Download error: ${error.message}`);
//   return data;
// };

import { log } from 'node:console';
import { supabase } from '../config/supabaseConfig';

// ודא ששם הבאקט תואם לשם ב-Supabase שלך
const BUCKET_NAME = 'user-files-uploads'; 

export const uploadFile = async (
  bucketName: string,
  path: string,
  file: Buffer,
  contentType: string
) => {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(path, file, {
      contentType,
      upsert: true,
    });
  if (error) {
    console.error("❌ Error uploading to Supabase Storage:", error);
    throw new Error(`Upload error: ${error.message}`);
  }
  return data;
};

export const deleteFile = async (bucketName: string, filePath: string) => {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .remove([filePath]);

  if (error) throw new Error(`Delete error: ${error.message}`);
  return data;
};

export const downloadFile = async (bucketName: string, filePath: string) => {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .download(filePath);

  if (error) throw new Error(`Download error: ${error.message}`);
  return data;
};

// הוסף את הפונקציה החסרה הזו
export const getFilePublicUrl = async (filePath: string): Promise<string | null> => {
  try {
    const { data } = await supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
    if (data && data.publicUrl) {
      return data.publicUrl;
    }
    return null;
  } catch (e) {
    console.error("Error getting public URL from supabaseUploadIntoStorageService:", e);
    return null;
  }
};