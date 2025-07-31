import { v4 as uuidv4 } from 'uuid';
import { Job } from "../models/JobModel";
import { supabase } from '../config/supabaseConfig';
import { Comment } from '../models/Comment';
export const commentService = {
    async getAllComments(): Promise<Comment[]> {
        const { data, error } = await supabase
            .from("comments")
            .select("*");
        if (error) {
            console.error("Error fetching all jobs:", error);
            throw error;
        }
        return data as Comment[];
    },
    async getCommentsByCourseId(course_id: string): Promise<Comment[]> {
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('course_id', course_id); 

        if (error) {
            throw error; 
        }

        return data as Comment[]; 
    },
   
    async getCommentById(id: string): Promise<Comment | null> {
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('id', id)
            .single();
        if (error) {
            console.error('Error fetching job by ID:', error);
            throw error;
        }
        return data as Comment || null;
    },
    async updateComment(id: string, updatedData: Partial<Comment>): Promise<Comment[]> {
        const { data: existing, error: fetchError } = await supabase
            .from('comments')
            .select()
            .eq('id', id)
            .maybeSingle();
        if (fetchError) {
            console.error('error :x:', fetchError);
            throw fetchError;
        }
        if (!existing) {
            throw new Error(`תגובה עם מזהה ${id} לא נמצאה`);
        }
        const { data, error } = await supabase
            .from('comments')
            .update(updatedData)
            .eq('id', id)
            .select();
        if (error) {
            console.error(':x: שגיאה בעדכון התגובה:', error);
            throw error;
        }
        console.log(':white_check_mark: עדכון המשרה:', data);
        return data as Comment[];
    },
    async createComment(JobData: Comment) {
        const { text, user_name, course_id } = JobData;
        const id = uuidv4();
        const { data, error } = await supabase
            .from('comments')
            .insert([{
                id,
                course_id,
                text,
                user_name
            }]);
        if (error) {
            throw new Error(error.message);
        }
        return data;
    },
    async deleteComment(id: string): Promise<boolean> {
        const { error } = await supabase
            .from("comments")
            .delete()
            .eq("id", id);
        if (error) {
            if (error.message.includes("No rows found")) return false;
            throw error;
        }
        return true;
    },
};