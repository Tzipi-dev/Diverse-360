
import express, { Router } from "express";
import multer from "multer";
import { generateCoverLetter } from "../controllers/CoverLetterController";
import { handleCoverLetterUpload } from '../services/coverLetterUploadService';
import { jobService } from '../services/JobService';


const router: Router = express.Router();
const upload = multer();

router.post("/", upload.single("file"), generateCoverLetter);
router.post('/upload-cover-letter', upload.single('file'), async (req, res) => {
  try {
    const result = await handleCoverLetterUpload(req);
    res.status(200).json(result); // ← חשוב מאוד!
  } catch (error: any) {
    console.error("שגיאה:", error);
    res.status(500).json({ error: error.message || "שגיאה בהעלאת מכתב" });
  }
});

export default router;
