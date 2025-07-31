// backend/src/routes/ResumeUploadRoute.ts
import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import {
  handleFileUpload,
  handleFileDelete,
  handleFileDownload,
  getResumesForJob,
  handleViewFile
} from '../controllers/ResumeController';
import { userService } from '../services/UserService';

const router: Router = Router();
const upload = multer();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret';

// פונקציית Middleware מקומית
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  if (token == null) {
    // אם אין טוקן, נמשיך כאורח.
    req.user = { id: undefined, email: undefined };
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err: any, userPayload: any) => {
    if (err) {
      console.error("❌ JWT verification failed:", err);
      // הטוקן לא תקין, נמשיך כאורח.
      req.user = { id: undefined, email: undefined };
      return next();
    }
    // req.user = { id: userPayload.userId, email: userPayload.email };
        req.user = { id: userPayload.id, email: userPayload.email };
    next();
  });
};
console.log('✅ ResumeUploadRoute initialized');

// פונקציית Middleware לאימות משתמשים
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "לא מחובר" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string, email: string, role: string };
    (req as any).userId = decoded.id; // שים את זה על req.userId לשימוש בהמשך
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: "טוקן לא תקין" });
  }
};


// עדכון הנתיב הקיים של העלאת קורות חיים
router.post('/upload', authenticateToken, upload.single('file'), handleFileUpload);
router.delete('/:path', handleFileDelete);
router.get('/:path', handleFileDownload);
router.get('/job/:jobId', getResumesForJob);
router.get('/view/:path', handleViewFile); // <-- נתיב חדש לצפייה בדפדפן
router.get("/profile", authenticate, async (req, res) => {
  const userId = (req as any).userId;

  const user = await userService.getUserById(userId);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.json({ success: true, data: user });
});

export default router;