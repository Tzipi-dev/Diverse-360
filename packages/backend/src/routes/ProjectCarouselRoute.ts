import express, { Router } from 'express';
import {
  getAllProjectCarousel,
  addProjectCarousel,
  deleteProjectCarousel,
  getProjectCarouselByProjectName,
  updateProjectCarouselPermissions
} from '../controllers/ProjectCarouselController';

const router: Router = express.Router();

router.get('/', getAllProjectCarousel);
router.post('/', addProjectCarousel);
router.delete('/:id', deleteProjectCarousel);
router.get('/projectName/:projectName', getProjectCarouselByProjectName);
router.put('/:id', updateProjectCarouselPermissions);

export default router;
