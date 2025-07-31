import { supabase } from "../config/supabaseConfig";

const CONTENT_TYPES: Record<string, string> = {
  mp4: 'video/mp4',
  mov: 'video/quicktime',
  webm: 'video/webm',
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  aac: 'audio/aac',
};
export async function uploadFileToBucket(
  bucket: string,
  fileBuffer: Buffer,
  filePath: string
): Promise<string> {

  const ext = filePath.split('.').pop();
  const contentType = CONTENT_TYPES[ext?.toLowerCase()
    || ''] || 'application/octet-stream';
  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, fileBuffer, {
      contentType,
      upsert: false,
    });

  if (error) throw error;
  return filePath;
}

export async function deleteFileFromBucket(bucket: string, filePath: string): Promise<void> {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([filePath]);  // remove מקבל מערך של נתיבים

  if (error) throw error;
}

