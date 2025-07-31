import express, { Router } from 'express';
import multer from 'multer';
import { handleResumeAnalysis } from '../controllers/ResumeAnalysisController';

const router: Router = express.Router();
const upload = multer();

router.post('/', upload.single('file'), handleResumeAnalysis);

export default router;
