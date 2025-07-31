// server/controllers/SavedJobController.ts
import { Request, Response } from 'express';
import { SavedJobService } from '../services/SavedJobService'; // ייבוא ה-Service

export class SavedJobController {
    /**
     * מטפל בבקשת GET לשליפת משרות שמורות עבור משתמש.
     * GET /api/saved-jobs/:userId
     */
    static async getSavedJobs(req: Request, res: Response): Promise<void> {
        const { userId } = req.params; // קבל את userId מהפרמטרים של ה-URL
        if (!userId) {
            res.status(400).json({ message: 'User ID is required.' });
            return;
        }
        try {
            const savedJobs = await SavedJobService.getSavedJobsByUserId(userId);
            res.status(200).json(savedJobs);
        } catch (error: any) {
            console.error('Error in SavedJobController.getSavedJobs:', error);
            res.status(500).json({ message: error.message || 'Internal server error' });
        }
    }

    /**
     * מטפל בבקשת POST לשמירת משרה.
     * POST /api/saved-jobs
     * מצפה ל-body: { userId: string, jobData: Job }
     */
    static async saveJob(req: Request, res: Response): Promise<void> {
        const { userId, jobData } = req.body; // קבל את userId ו-jobData מתוך ה-body
        if (!userId || !jobData || !jobData.id) {
            res.status(400).json({ message: 'User ID and complete job data are required.' });
            return;
        }
        try {
            const newSavedJob = await SavedJobService.saveJob(userId, jobData);
            res.status(201).json(newSavedJob); // החזר את המשרה השמורה שנוצרה
        } catch (error: any) {
            console.error('Error in SavedJobController.saveJob:', error);
            if (error.message && error.message.includes('Job already saved')) {
                res.status(409).json({ message: error.message }); // 409 Conflict
            } else {
                res.status(500).json({ message: error.message || 'Internal server error' });
            }
        }
    }

    /**
     * מטפל בבקשת DELETE לביטול שמירה של משרה.
     * DELETE /api/saved-jobs/:userId/:jobId
     */
    static async unsaveJob(req: Request, res: Response): Promise<void> {
        const { userId, jobId } = req.params; // קבל את userId ו-jobId מהפרמטרים
        if (!userId || !jobId) {
            res.status(400).json({ message: 'User ID and Job ID are required.' });
            return;
        }
        try {
            const success = await SavedJobService.unsaveJob(userId, jobId);
            if (success) {
                res.status(200).json({ message: 'Job unsaved successfully.' });
            } else {
                res.status(404).json({ message: 'Saved job not found for this user.' });
            }
        } catch (error: any) {
            console.error('Error in SavedJobController.unsaveJob:', error);
            res.status(500).json({ message: error.message || 'Internal server error' });
        }
    }
}