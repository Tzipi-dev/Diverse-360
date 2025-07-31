import { Request, Response } from "express";
import { courseService } from "../services/CourseService";
import { videoService } from "../services/videoService";
import { Course, CourseVideo } from "../models/CourseModel";
import { uploadFile } from "../services/supabaseUploadIntoStorageService";

export class CourseController {

  async getCourseByCategory(req: Request, res: Response): Promise<void> {
    try {
      const category = req.params.category;
      if (!category) {
        res.status(400).json({ error: "Category is required" });
        return;
      }
      const courses: Course[] = await courseService.getCoursesByCategory(category);
      res.status(200).json(courses);
    } catch (err: any) {
      console.error("Error fetching courses by category:", err);
      res.status(500).json({ error: err.message || "Internal server error" });
    }
  }

  async getCoursesBySubject(req: Request, res: Response) {
    try {
      const subject = req.params.subject;
      const courses = await courseService.getCoursesBySubject(subject);
      return res.status(200).json(courses);
    } catch (error) {
      console.error("Error fetching courses by subject:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getCoursesByLecturer(req: Request, res: Response): Promise<void> {
    try {
      const lecturer = req.params.lecturer;
      if (!lecturer) {
        res.status(400).json({ error: "Lecturer name is required" });
        return;
      }
      const courses: Course[] = await courseService.getCoursesByLecturer(lecturer);
      res.status(200).json(courses);
    } catch (err: any) {
      console.error("Error fetching courses by lecturer:", err);
      res.status(500).json({ error: err.message || "Internal server error" });
    }
  }

  async getCourseBtTitle(req: Request, res: Response): Promise<void> {
    try {
      const title = req.params.title;
      if (!title) {
        res.status(400).json({ error: "title is required" });
        return;
      }
      const course = await courseService.getCourseByName(title);
      if (!course) {
        res.status(404).json({ error: "Course not found" });
        return;
      }
      res.status(200).json(course);
    } catch (error: any) {
      console.error("Error fetching course by title:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  }

  async getAllCourses(req: Request, res: Response): Promise<void> {
    try {
      const courses: Course[] = await courseService.getAllCourses();
      res.status(200).json(courses);
    } catch (err: any) {
      console.error("Error fetching all courses:", err);
      res.status(500).json({ error: err.message || "Internal server error" });
    }
  }

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


  async updateCourseController(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      if (!id || typeof id !== 'string') {
        res.status(400).json({ message: 'Invalid course id' });
        return;
      }

      const updatedData = {
        ...req.body,
        isActive: req.body.isActive === 'true',
        uploadedAt: req.body.uploadedAt ? new Date(req.body.uploadedAt) : undefined,
      };

      const updatedCourse: Course = await courseService.updateCourse(id, updatedData);
      res.status(200).json({ message: 'הקורס עודכן בהצלחה', data: updatedCourse });
    } catch (error: any) {
      console.error('❌ Error updating course:', error);
      res.status(500).json({ message: error.message || 'Internal server error' });
    }
  }

  async CreateCourse(req: Request, res: Response): Promise<void> {
    try {
      const courseData = {
        ...req.body,
        isActive: req.body.isActive === 'true',
        uploadedAt: req.body.uploadedAt ? new Date(req.body.uploadedAt) : new Date(),
      };

      const result = await courseService.createCourse(courseData);
      res.status(201).json({ message: 'קורס נוצר בהצלחה', data: result });
    } catch (error: any) {
      console.error('Error creating course:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  async DeleteCourse(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      if (!id) {
        res.status(400).json({ error: 'Missing course id in request params' });
        return;
      }
      await videoService.deleteVideosByCourseId(id);
      console.log("✔ All videos deleted for course id:", id);
      const remainingVideos = await videoService.getVideosByCourseId(id);
      console.log('Remaining videos after delete:', remainingVideos);
      if (remainingVideos.length > 0) {
        throw new Error('Videos still exist after delete');
      }
      const success = await courseService.deleteCourse(id);
      if (!success) {
        res.status(404).json({ error: 'Course not found' });
        return;
      }
      res.status(200).json({ message: 'Course and its videos deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting course:', error);
      res.status(500).json({
        error: 'Failed to delete course',
        details: error.message || error.toString()
      });
    }
  }
}
export const generateCourseImage = async (req: Request, res: Response) => {
};