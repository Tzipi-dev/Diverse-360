import { Course } from "../models/CourseModel";
import { supabase } from '../config/supabaseConfig';
import { videoService } from "./videoService";

export const courseService = {
  async getAllCourses(): Promise<Course[]> {
    const { data, error } = await supabase.from("course").select("*");
    if (error) throw error;
    return data as Course[];
  },

  async getCourseByName(title: string): Promise<Course | null> {
    const { data, error } = await supabase
      .from('course')
      .select('*')
      .ilike('title', title);
    if (error) throw error;
    return data?.[0] || null;
  },

  async getCoursesBySubject(subject: string): Promise<Course[]> {
    const { data, error } = await supabase
      .from('course')
      .select('*')
      // .ilike('subject', ${subject});
      .ilike('subject', `${subject}`);
    if (error) throw error;
    return data as Course[];
  },

  async getCoursesByCategory(category: string): Promise<Course[]> {
    const { data, error } = await supabase
      .from("course")
      .select("*")
      .eq("category", category);
    if (error) throw error;
    return data as Course[];
  },

  async getCoursesByLecturer(lecturer: string): Promise<Course[]> {
    const { data, error } = await supabase
      .from("course")
      .select("*")
      .eq("lecturer", lecturer);
    if (error) throw error;
    return data as Course[];
  },

  async createCourse(courseData: Course): Promise<Course[]> {
    const { data, error } = await supabase
      .from('course')
      .insert([courseData])
      .select();
    if (error) throw error;
    return data as Course[];
  },

  async updateCourse(id: string, updatedData: Partial<Course>): Promise<Course> {
    const { data, error } = await supabase
      .from('course')
      .update(updatedData)
      .eq('id', id)
      .select('*');
    if (error) throw error;
    if (!data || data.length === 0) throw new Error('Update failed - no data returned');
    return data[0] as Course;
  },

  async deleteCourse(id: string): Promise<boolean> {
    await videoService.deleteVideosByCourseId(id);
    const { error } = await supabase
      .from('course')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  }
};