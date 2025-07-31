import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../config/supabaseConfig';
import { Job } from '../models/JobModel';
import { jobService } from "../services/JobService";
import { z } from "zod";
import { generateEmbedding } from '../services/embeddingService';
import { cosineSimilarity } from '../utils/cosineSimilarity';

const jobSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  location: z.string().min(2),
  requirements: z.string().min(5),
  workMode: z.enum(["מרחוק", "היברידי", "משרד"]).optional(),
  isActive: z.boolean().optional(),
});

export class JobController {
  // שליפת כל המשרות
  async getAllJobs(req: Request, res: Response): Promise<void> {
    try {
      const jobs: Job[] = await jobService.getAllJobs();
      res.status(200).json(jobs);
    } catch (err: any) {
      console.error("Error fetching all jobs:", err);
      res.status(500).json({ error: err.message || "Internal server error" });
    }
  }

  // שליפת משרה לפי ID
  async getJobById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      if (!id || typeof id !== 'string') {
        res.status(400).json({ message: 'Invalid job id' });
        return;
      }

      const job: Job | null = await jobService.getJobById(id);
      if (!job) {
        res.status(404).json({ message: 'Job not found' });
        return;
      }

      res.status(200).json(job);
    } catch (error: any) {
      console.error('Error fetching job by ID:', error);
      res.status(500).json({ message: error.message || 'Internal server error' });
    }
  }

  async createJob(req: Request, res: Response): Promise<void> {
    try {
      const parsed = jobSchema.safeParse(req.body);

      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.errors });
        return;
      }
      const {
        title,
        description,
        location,
        requirements,
        workMode = "מרחוק",
        isActive = true,
      } = parsed.data;

      const id = uuidv4();
      const createdAt = new Date();
      const jobText = `${title} ${description} ${requirements}`;
      const embedding = await generateEmbedding(jobText);

      const newJob = {
        id,
        title,
        description,
        location,
        requirements,
        workMode,
        isActive,
        createdAt,
        embedding,
      };

      const { error } = await supabase.from("jobs").insert([newJob]);

      if (error) {
        console.error("Supabase error:", error);
        res.status(500).json({ error: "שגיאה בהכנסת משרה", details: error.message });
        return;
      }

      res.status(201).json({ job: newJob });
    } catch (err: any) {
      console.error("Unhandled error:", err);
      res.status(500).json({ error: "שגיאה כללית", details: err.message });
    }
  }

  // עדכון משרה לפי ID
  async updateJob(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const updatedData = req.body;

    try {
      if (!id || typeof id !== 'string') {
        res.status(400).json({ message: 'Invalid job id' });
        return;
      }

      const updatedJob: Job | null = await jobService.updateJob(id, updatedData);

      if (!updatedJob) {
        res.status(404).json({ message: `משרה עם מזהה ${id} לא נמצאה` });
        return;
      }

      res.status(200).json({
        message: 'המשרה עודכנה בהצלחה',
        data: updatedJob
      });

    } catch (error: any) {
      if (error.message && error.message.includes('לא נמצאה')) {
        res.status(404).json({ message: error.message });
      } else {
        console.error('Error updating job:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
      }
    }
  }

  // מחיקת משרה לפי ID
  async deleteJob(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const success = await jobService.deleteJob(id);
      if (!success) {
        res.status(404).json({ success: false, message: "job not found" });
        return;
      }
      res.json({ success: true, message: "Job deleted" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: "Unknown error" });
      }
    }
  }

  async getFilterJobs(req: Request, res: Response): Promise<void> {
    try {
      const { search, field, jobType, location, dateFrom } = req.query

      const jobs: Job[] = await jobService.getFilteredJobs({
        search: search as string,
        field: field as string,
        jobType: jobType as string,
        location: location as string,
        dateFrom: dateFrom as string,
      })

      res.status(200).json(jobs)
    } catch (error: any) {
      console.error("Error filtering jobs:", error)
      res.status(500).json({ error: error.message || "Internal server error" })
    }
  }
  async getJobsWithPagination(req: Request, res: Response): Promise<void> {
    try {
      const page = Number(req.query.page) || 0
      const jobs: Job[] = await jobService.getJobsWithPagination(page)
      res.status(200).json(jobs)
    } catch (err: any) {
      console.error('Error fetching jobs with pagination:', err)
      res.status(500).json({ error: err.message || 'Internal server error' })
    }
  }



  // שליפת מועמדים מתאימים למשרה
  async getMatchingCandidates(req: Request, res: Response): Promise<void> {
    const jobId = req.params.id;
  
    const { data: jobData, error: jobErr } = await supabase
      .from("jobs")
      .select("embedding")
      .eq("id", jobId)
      .single();
  
    if (jobErr || !jobData?.embedding) {
      res.status(404).json({ message: "משרה לא נמצאה או ללא embedding" });
      return;
    }
  
    const { data: resumes, error: resumesErr } = await supabase
      .from("resumes")
      .select("id, file_path, uploaded_at, embedding");
  
    if (resumesErr) {
      res.status(500).json({ message: "שגיאה בשליפת קורות חיים" });
      return;
    }
  
    const jobEmbedding = typeof jobData.embedding === "string"
      ? JSON.parse(jobData.embedding)
      : jobData.embedding;
  
    const matches = resumes
      .map((r) => {
        const resumeEmbedding = typeof r.embedding === "string"
          ? JSON.parse(r.embedding)
          : r.embedding;
  
        if (!Array.isArray(jobEmbedding) || !Array.isArray(resumeEmbedding)) {
          console.warn("❗Embedding לא תקין", { jobEmbedding, resumeEmbedding, resumeId: r.id });
          return null;
        }
  
        const score = cosineSimilarity(jobEmbedding, resumeEmbedding);
  
        return {
          id: r.id,
          resumeUrl: `/api/resumes/${encodeURIComponent(r.file_path)}`,
          uploaded_at: r.uploaded_at,
          score
        };
      })
      .filter((match): match is NonNullable<typeof match> => match !== null && match.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  
    res.json(matches);
  }
  }

