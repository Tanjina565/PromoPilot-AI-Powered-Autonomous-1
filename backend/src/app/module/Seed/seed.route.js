import { Router } from 'express';
import { seedDemoData } from './seed.controller.js';

const router = Router();

router.post('/demo-data', seedDemoData);
router.get('/demo-data', seedDemoData);

export default router;
