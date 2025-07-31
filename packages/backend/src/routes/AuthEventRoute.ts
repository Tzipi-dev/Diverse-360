import { handleAuthEvent } from '../controllers/AuthEventController'; 

import express, { Router } from 'express';

const router: Router = express.Router();

router.post('/', handleAuthEvent);

export default router;
