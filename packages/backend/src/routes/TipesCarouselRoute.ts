import express, { Router } from 'express';
import {
 getAllTipesCarouselSortedByActivity,
  addTipesCarousel,
  deleteTipesCarousel,
  getTipesCarouselServiceByExactTitle,
  updateTipesCarousel
} from '../controllers/TipesCarouselController';

const router: Router = express.Router();

router.get('/', getAllTipesCarouselSortedByActivity);
router.post('/', addTipesCarousel);
router.delete('/:id', deleteTipesCarousel);
router.get('/title/:title', getTipesCarouselServiceByExactTitle);
router.put('/:id', updateTipesCarousel);

export default router;
