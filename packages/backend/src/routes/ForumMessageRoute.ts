import express, { Router } from 'express';
import multer from 'multer';

import {
  addForumMessage,
  deleteForumMessage,
  getAllForumMessagesByForumId,
  getForumMessagesById,
  updateForumMessage,
  uploadAudio
} from '../controllers/ForumMessageController';

const router: Router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/',upload.single('file'), addForumMessage);
router.delete('/:id', deleteForumMessage);
router.get('/:id', getAllForumMessagesByForumId);
router.get('/:id', getForumMessagesById);
router.put('/update/:id', updateForumMessage);
router.post('/upload-audio', upload.single('file'), uploadAudio);

export default router;
