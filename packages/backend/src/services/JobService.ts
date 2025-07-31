import { v4 as uuidv4 } from 'uuid';
import { Job } from "../models/JobModel";
import { supabase } from '../config/supabaseConfig';

const PAGE_SIZE = 10

export const jobService = {
    async getAllJobs(): Promise<Job[]> {
        const { data, error } = await supabase
            .from("jobs")
            .select("*");
        if (error) {
            console.error("Error fetching all jobs:", error);
            throw error;
        }
        return data as Job[];
    },
    async getJobsByTitle(title: string): Promise<Job | null> {
        const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .ilike('title', title);
        if (error) {
            if (error.message.includes("No rows found")) return null;
            throw error;
        }
        if (!data || data.length === 0) return null;
        return data[0] as Job;
    },
    async getJobsByLocation(location: string): Promise<Job[]> {
        const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .ilike('location', `%${location}%`);
        if (error) {
            console.error('Error fetching jobs by location:', error);
            throw error;
        }
        return data as Job[];
    },
    async getJobById(id: string): Promise<Job | null> {
        const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('id', id)
            .single();
        if (error) {
            console.error('Error fetching job by ID:', error);
            throw error;
        }
        return data as Job || null;
    },
    async updateJob(id: string, updatedData: Partial<Job>): Promise<Job> {
        const { data: existing, error: fetchError } = await supabase
            .from('jobs')
            .select()
            .eq('id', id)
            .maybeSingle();

        if (fetchError) throw fetchError;
        if (!existing) throw new Error(`משרה עם מזהה ${id} לא נמצאה`);

        const { data, error } = await supabase
            .from('jobs')
            .update(updatedData)
            .eq('id', id)
            .select();

        if (error || !data || data.length === 0) throw error || new Error('שגיאה בעדכון');

        return data[0] as Job;
    },
    async createJob(JobData: Job) {
        const { title, description, createdAt, requirements, location, isActive } = JobData;
        const id = uuidv4();
        const { data, error } = await supabase
            .from('jobs')
            .insert([{
                id,
                title,
                description,
                createdAt,
                requirements,
                location,
                is_active: isActive ?? true, 
            }]);
        if (error) {
            throw new Error(error.message);
        }
        return data;
    },
    async deleteJob(id: string): Promise<boolean> {
        const { error } = await supabase
            .from("jobs")
            .delete()
            .eq("id", id);
        if (error) {
            if (error.message.includes("No rows found")) return false;
            throw error;
        }
        return true;
    },
   async getFilteredJobs(filters: {
    search?: string
    field?: string
    jobType?: string
    location?: string
    dateFrom?: string 
  }): Promise<Job[]> {
    let query = supabase.from("jobs").select("*")

    if (filters.search) {
      query = query.ilike("title", `%${filters.search}%`)
    }
    if (filters.field) {
      query = query.ilike("description", `%${filters.field}%`)
    }
    if (filters.jobType) {
      query = query.eq("workMode", filters.jobType)
    }
    if (filters.location) {
      query = query.eq("location", filters.location)
    }
    if (filters.dateFrom) {
      query = query.eq("createdAt", filters.dateFrom)
    }

    const { data, error } = await query
    if (error) {
      console.error("Error filtering jobs:", error)
      throw error
    }
    return data as Job[]},
    
    async getJobsWithPagination(page: number = 0): Promise<Job[]> {
    const from = page * PAGE_SIZE
    const to   = from + PAGE_SIZE - 1

    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('createdAt', { ascending: false })
      .range(from, to)

    if (error) {
      console.error('Error fetching jobs with pagination:', error)
      throw error
    }
    return data as Job[]
  },
};