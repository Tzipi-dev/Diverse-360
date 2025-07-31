import express, { Router } from 'express';
import {
  createScreenAnalytics,
  getAnalyticsByScreen,
   getAnalyticsByUser
} from '../controllers/ScreenTimeController';

const router: Router = express.Router();

router.post('/', createScreenAnalytics);
router.get('/by-screen', getAnalyticsByScreen);
router.get('/by-user', getAnalyticsByUser);
export default router;