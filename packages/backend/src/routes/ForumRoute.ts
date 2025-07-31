import express, { Router } from 'express';
import {
  getAllForumsSortedByActivity,
  addForum,
  deleteForum,
  getForumByExactTitle,
  updateForumPermissions,
  markViewed,
  getViewedForumsByUser,
} from '../controllers/ForumController';

const router: Router = express.Router();

router.get('/', getAllForumsSortedByActivity);
router.post('/', addForum);
router.delete('/:id', deleteForum);
router.get('/title/:title', getForumByExactTitle);
router.put('/:id/permissions', updateForumPermissions);
router.post('/mark-viewed', markViewed);
router.get('/viewed', getViewedForumsByUser);

export default router;
