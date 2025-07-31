import { CourseVideo } from "../models/CourseModel";
import { supabase } from '../config/supabaseConfig';
import { uploadFileToBucket } from "./uploadService";

const TABLE_NAME = 'course_videos';
const STORAGE_BUCKETS = {
  video: 'course-videos',
  audio: 'course-audios',
};
const CONTENT_TYPES: Record<string, string> = {
  mp4: 'video/mp4',
  mov: 'video/quicktime',
  webm: 'video/webm',
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  aac: 'audio/aac',
};
export const videoService = {
  async getVideosByCourseId(course_id: string): Promise<CourseVideo[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('course_id', course_id);
    if (error) throw error;

    // מיפוי שדות ל-snake_case לפי המודל
    return (data || []).map((item: any) => ({
      id: item.id,
      course_id: item.course_id,
      title: item.title,
      description: item.description,
      video_url: item.video_url,
      video_path: item.video_path,
      duration: item.duration,
      order_in_course: item.order_in_course,
    })) as CourseVideo[];
  },

  async getVideoById(id: string): Promise<CourseVideo | null> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async createVideo(videoData: any): Promise<any> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([videoData])
      .select();
    if (error) throw error;
    return data;
  },

  async deleteVideosByCourseId(course_id: string): Promise<boolean> {
    const { data: videos, error: fetchError } = await supabase
      .from(TABLE_NAME)
      .select('video_path')
      .eq('course_id', course_id);
    if (fetchError) throw fetchError;

    for (const video of videos || []) {
      if (video.video_path) {
        const { error: deleteError } = await supabase.storage
          .from(STORAGE_BUCKETS.video)
          .remove([video.video_path]);
        if (deleteError) {
          console.error('Error deleting file from storage:', deleteError);
        }
      }
    }

    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('course_id', course_id);
    if (error) throw error;

    console.log('Deleted files from DB and storage for course:', course_id);
    return true;
  },

  async updateVideo(
    id: string,
    updatedData: Partial<Pick<CourseVideo, 'title' | 'description'>>,
    newFileBuffer?: Buffer,
    originalFileName?: string,
    oldFilePath?: string,
    fileType: 'video' | 'audio' = 'video'
  ): Promise<CourseVideo[]> {
    if (newFileBuffer && originalFileName && oldFilePath) {
      const rem = await supabase.storage
        .from(STORAGE_BUCKETS[fileType])
        .remove([oldFilePath]);
      if (rem.error) throw rem.error;
      const ext = originalFileName.split('.').pop();
      const filePath = `${id}-${Date.now()}.${ext}`;
      const contentType = CONTENT_TYPES[ext?.toLowerCase() || ''] || 'application/octet-stream';
      // const up = await supabase.storage
      //   .from(STORAGE_BUCKETS[fileType])
      //   .upload(filePath, newFileBuffer, { contentType, upsert: true });
      const newFilePath = await uploadFileToBucket(STORAGE_BUCKETS[fileType], newFileBuffer, originalFileName);
      (updatedData as any).video_path = newFilePath;
      // if (up.error) throw up.error;
      (updatedData as any).video_path = filePath;
    }

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(updatedData)
      .eq('id', id)
      .select('*');
    if (error) throw error;
    return data as CourseVideo[];
  },

  async deleteVideo(id: string, fileType: 'video' | 'audio' = 'video'): Promise<boolean> {
    const { data: video, error: fetchError } = await supabase
      .from(TABLE_NAME)
      .select('video_path')
      .eq('id', id)
      .single();
    if (fetchError) throw fetchError;

    if (video?.video_path) {
      const { error: deleteError } = await supabase.storage
        .from(STORAGE_BUCKETS[fileType])
        .remove([video.video_path]);
      if (deleteError) {
        console.error('Error deleting file from storage:', deleteError);
      }
    }

    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  }
};