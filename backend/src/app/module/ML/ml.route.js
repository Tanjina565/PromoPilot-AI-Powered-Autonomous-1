import { Router } from 'express';
import {
  predictBestTimeAndEngagement,
  getModelMetrics,
} from './ml.controller.js';
import { authenticate } from '../../../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/predict', predictBestTimeAndEngagement);
router.get('/metrics', getModelMetrics);

export default router;
