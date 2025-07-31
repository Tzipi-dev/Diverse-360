import { Request, Response } from "express";
import { videoService } from "../services/videoService";
import { CourseVideo } from "../models/CourseModel";
import { supabase } from '../config/supabaseConfig';
import path from 'path';

export class VideoController {
  // Get all videos by course ID
  async getVideosByCourseId(req: Request, res: Response): Promise<void> {
    const { course_id } = req.params;
    try {
      if (!course_id) {
        res.status(400).json({ message: 'Missing courseId param' });
        return;
      }
      const videos: CourseVideo[] = await videoService.getVideosByCourseId(course_id);
      res.status(200).json(videos);
    } catch (error: any) {
      console.error('Error fetching videos:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  // Create new video
  async createVideo(req: Request, res: Response): Promise<void> {
    try {
      const { course_id, title, description } = req.body;
      let videoUrl = '';
      let videoPath = '';
      if (req.file) {
        const fileExt = path.extname(req.file.originalname);
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExt}`;
        const { error } = await supabase.storage
          .from('course-videos')
          .upload(fileName, req.file.buffer, {
            contentType: req.file.mimetype,
            upsert: false,
          });
        if (error) throw error;
        const { data: publicUrlData } = supabase
          .storage
          .from('course-videos')
          .getPublicUrl(fileName);
        videoUrl = publicUrlData.publicUrl;
        videoPath = fileName;
      }
      const videoData = {
        title, description, course_id,  video_url: videoUrl,  video_path: videoPath,
         duration: 0,order_in_course: 0};
      const result = await videoService.createVideo(videoData);
      res.status(201).json({ message: 'Video created successfully', data: result });
    } catch (error: any) {
      console.error('Error creating video:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  async updateVideo(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      if (!id) {
        res.status(400).json({ message: 'Missing video id param' });
        return;
      }

      // בניית אובייקט השדות שיתעדכנו (רק title ו-description)
      const updatedData: Partial<Pick<CourseVideo, 'title' | 'description'>> = {};

      if (req.body.title) {
        updatedData.title = req.body.title;
      }

      if (req.body.description) {
        updatedData.description = req.body.description;
      }

      const newFile = req.file;
      let oldFilePath: string | undefined;

      if (newFile) {
        // שליפת הווידאו הקיים לצורך מחיקת הקובץ הישן במידת הצורך
        const existing = await videoService.getVideoById(id);
        if (!existing) {
          res.status(404).json({ message: 'Video not found' });
          return;
        }
        oldFilePath = existing.video_path;
      }

      // עדכון הווידאו כולל קובץ במידת הצורך
      const updatedRows = await videoService.updateVideo(
        id,
        updatedData,
        newFile?.buffer,
        newFile?.originalname,
        oldFilePath
      );

      if (!updatedRows) {
        res.status(404).json({ message: 'Video not found or no changes applied' });
        return;
      }

      res.status(200).json({
        message: 'Video updated successfully',
        data: updatedRows,
      });

    } catch (error: any) {
      console.error('Error updating video:', error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }

  // Delete single video
  async deleteVideo(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      if (!id) {
        res.status(400).json({ message: 'Missing video id param' });
        return;
      }

      const success = await videoService.deleteVideo(id);
      if (!success) {
        res.status(404).json({ error: 'Video not found' });
        return;
      }

      res.status(200).json({ message: 'Video deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting video:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  // Delete all videos by course ID
  async deleteVideosByCourseId(req: Request, res: Response): Promise<void> {
    const { course_id } = req.params;
    try {
      if (!course_id) {
        res.status(400).json({ message: 'Missing courseId param' });
        return;
      }

      await videoService.deleteVideosByCourseId(course_id);
      res.status(200).json({ message: 'All videos for the course deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting videos by course ID:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }
}