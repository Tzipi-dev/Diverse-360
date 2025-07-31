import express, { Router } from 'express';
import {
  getAllComments,
  getCommentsByCourseId,
  getCommentById,
  createComment,
  updateComment,
  deleteComment
} from '../controllers/CommentController';

const router: Router = express.Router();

router.get('/', getAllComments);
router.get('/by-course/:course_id', getCommentsByCourseId);
router.get('/:id', getCommentById);
router.post('/', createComment);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);

export default router;
