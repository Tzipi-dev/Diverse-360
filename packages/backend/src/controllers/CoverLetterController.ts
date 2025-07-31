import { Request, Response } from "express";
import { jobService } from "../services/JobService";
import { generateCoverLetterFromResume } from "../services/coverLetterService";

export const generateCoverLetter = async (
  req: Request & { file?: Express.Multer.File },
  res: Response
) => {
  try {
    const { job_id } = req.body;
    const file = req.file;

    if (!file || !job_id) {
      return res.status(400).json({ error: "חובה לצרף קובץ ומזהה משרה" });
    }

    const job = await jobService.getJobById(job_id);
    if (!job) {
      return res.status(404).json({ error: "משרה לא נמצאה" });
    }

    const coverLetter = await generateCoverLetterFromResume(file.buffer, job);
    
    return res.status(200).json({ content: coverLetter });
  } catch (err: any) {
    console.error("שגיאה ביצירת מכתב מקדים:", err);
    return res.status(500).json({ error: err.message || "שגיאת שרת" });
  }
};
