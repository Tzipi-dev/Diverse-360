import express, { Router } from 'express';
import {
  getAllLogoCarousel,
  addLogoCarousel,
  deleteLogoCarousel,
  getLogoCarouselById,
  getLogoCarouselByName,
  updateLogoCarousel
} from '../controllers/LogoCarouselController';

const router: Router = express.Router();

router.get('/', getAllLogoCarousel);
router.post('/', addLogoCarousel);
router.delete('/id/:id', deleteLogoCarousel);
router.get('/id/:id', getLogoCarouselById);
router.get('/name/:name', getLogoCarouselByName);
router.put('/id/:id', updateLogoCarousel);

export default router;
