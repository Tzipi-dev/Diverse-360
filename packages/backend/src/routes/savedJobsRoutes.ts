// server/routes/savedJobsRoutes.ts
import { Router } from 'express';
import { SavedJobController } from '../controllers/SavedJobController'; // ייבוא ה-Controller

const router = Router();

// GET all saved jobs for a specific user
// Route: /api/saved-jobs/:userId
router.get('/saved-jobs/:userId', SavedJobController.getSavedJobs);

// POST to save a new job
// Route: /api/saved-jobs
router.post('/saved-jobs', SavedJobController.saveJob);

// DELETE to unsave a job
// Route: /api/saved-jobs/:userId/:jobId
router.delete('/saved-jobs/:userId/:jobId', SavedJobController.unsaveJob);

export default router; // השתמש ב-default export עבור ראוטרים