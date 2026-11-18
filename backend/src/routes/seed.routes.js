import { Router } from 'express';
import { seedDemoData } from '../controllers/seed.controller.js';

const router = Router();

// Public seed endpoint for 1-click capstone demonstration
router.post('/demo-data', seedDemoData);
router.get('/demo-data', seedDemoData);

export default router;
