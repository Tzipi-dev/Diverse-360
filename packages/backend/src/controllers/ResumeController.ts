// // backend/src/controllers/ResumeController.ts
// import { Request, Response } from 'express';
// import { handleUpload, handleDelete, handleDownload, getResumesByJobId } from '../services/ResumeService'; // ייבוא הפונקציה החדשה

// export const handleFileUpload = async (req: Request, res: Response) => {
//   try {
//     const { file_path } = await handleUpload(req);
//     console.log(file_path);
//     res.status(201).json({ success: true, file_path });
//   } catch (err: any) {
//     console.error("שגיאה בהעלאת קובץ:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// export const handleFileDelete = async (req: Request, res: Response) => {
//   try {
//     const filePath = decodeURIComponent(req.params.path);
//     await handleDelete(filePath);
//     res.json({ success: true });
//   } catch (err: any) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// export const handleFileDownload = async (req: Request, res: Response) => {
//   try {
//     const filePath = decodeURIComponent(req.params.path);
//     const response = await handleDownload(filePath);
//     if (!response) {
//       return res.status(404).json({ success: false, message: 'הקובץ לא נמצא' });
//     }
//     const arrayBuffer = await response.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);
//     res.setHeader('Content-Type', 'application/pdf'); // ייתכן שנצטרך לזהות סוג קובץ דינמית
//     res.setHeader('Content-Disposition', `attachment; filename="${filePath.split('/').pop()}"`);
//     res.send(buffer);
//   } catch (err: any) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // --- פונקציה חדשה בקונטרולר לשליפת קורות חיים לפי job_id ---
// export const getResumesForJob = async (req: Request, res: Response): Promise<void> => {
//   const { jobId } = req.params;
//   try {
//     const resumes = await getResumesByJobId(jobId);
//     res.status(200).json(resumes);
//   } catch (err: any) {
//     console.error(`Error in getResumesForJob controller for job ${jobId}:`, err);
//     res.status(500).json({ success: false, message: err.message || 'Internal server error' });
//   }
// };

// backend/src/controllers/ResumeController.ts
import { Request, Response } from 'express';
import { handleUpload, handleDelete, handleDownload, getResumesByJobId, getPublicUrl } from '../services/ResumeService';

// הרחבת ה-Request לכלול את המאפיין user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id?: string;
        email?: string;
      };
    }
  }
}

export const handleFileUpload = async (req: Request, res: Response) => {
  try {
    // תיקון: גישה לקובץ דרך req.file, מאחר שמשתמשים ב-upload.single()
    if (!req.file) {
      return res.status(400).json({ success: false, message: "חסר קובץ" });
    }
    const file = req.file;
    const userId = req.user?.id; // קריאת ה-userId מהטוקן המפוענח

    // העברת ה-userId כארגומנט שלישי לפונקציה handleUpload
    const { file_path } = await handleUpload(req, file, userId);
    console.log(file_path);
    res.status(201).json({ success: true, file_path });
  } catch (err: any) {
    console.error("שגיאה בהעלאת קובץ:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const handleFileDelete = async (req: Request, res: Response) => {
  try {
    const filePath = decodeURIComponent(req.params.path);
    await handleDelete(filePath);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const handleFileDownload = async (req: Request, res: Response) => {
  try {
    const filePath = decodeURIComponent(req.params.path);
    const response = await handleDownload(filePath);
    if (!response) {
      return res.status(404).json({ success: false, message: 'הקובץ לא נמצא' });
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.setHeader('Content-Type', 'application/pdf'); // ייתכן שנצטרך לזהות סוג קובץ דינמית
    res.setHeader('Content-Disposition', `attachment; filename="${filePath.split('/').pop()}"`);
    res.send(buffer);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const handleViewFile = async (req: Request, res: Response) => {
  try {
    const filePath = decodeURIComponent(req.params.path);
    const publicUrl = await getPublicUrl(filePath);

    if (!publicUrl) {
      return res.status(404).json({ success: false, message: 'הקובץ לא נמצא.' });
    }
    res.redirect(publicUrl);
  } catch (err: any) {
    console.error(`Error in handleViewFile:`, err);
    res.status(500).json({ success: false, message: err.message || 'Internal server error' });
  }
};

// export const getResumesForJob = async (req: Request, res: Response): Promise<void> => {
//   const { jobId } = req.params;
//   try {
//     const resumes = await getResumesByJobId(jobId);
//     res.status(200).json(resumes);
//   } catch (err: any) {
//     console.error(`Error in getResumesForJob controller for job ${jobId}:`, err);
//     res.status(500).json({ success: false, message: err.message || 'Internal server error' });
//   }
// };
export const getResumesForJob = async (req: Request, res: Response): Promise<void> => {
  const { jobId } = req.params;
  try {
    const resumes = await getResumesByJobId(jobId);
    res.status(200).json(resumes);
  } catch (err: any) {
    console.error(`[ResumeController] Error in getResumesForJob controller for job ${jobId}:`, err.message); //
    res.status(500).json({ success: false, message: err.message || 'Internal server error' }); //
  }
};