import express, { Router } from 'express';
import {
  getAllInformationCarouselSortedByActivity,
  addInformationCarousel,
  deleteInformationCarousel,
  getInformationCarouselServiceByExactTitle,
  updateInformationCarousel
} from '../controllers/InformationCarouselController';

const router: Router = express.Router();

router.get('/', getAllInformationCarouselSortedByActivity);
router.post('/', addInformationCarousel);
router.delete('/:id', deleteInformationCarousel);
router.get('/title/:title', getInformationCarouselServiceByExactTitle);
router.put('/:id', updateInformationCarousel);

export default router;
