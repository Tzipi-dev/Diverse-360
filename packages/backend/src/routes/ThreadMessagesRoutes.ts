import express, { Router } from 'express';
import multer from 'multer';
import {
  addThreadMessage,
  deleteThreadMessage,
  getAllThreadMessagesByForumMessageId,
  getThreadMessageById,
  updateThreadMessage,
} from '../controllers/ThreadMessagesController';

const router: Router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', upload.single('file'), addThreadMessage);
router.delete('/:id', deleteThreadMessage);
router.get('/forumMessage/:forumMessageId', getAllThreadMessagesByForumMessageId);
router.get('/:id', getThreadMessageById);
router.put('/:id', updateThreadMessage);

export default router;
