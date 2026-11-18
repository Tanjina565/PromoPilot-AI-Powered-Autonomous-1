import { Router } from 'express';
import {
  predictBestTimeAndEngagement,
  getModelMetrics,
  trainModel,
} from '../controllers/ml.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = Router();

// Publicly accessible ML simulator endpoint (allows visitors and authenticated users to test predictions)
router.post('/predict', predictBestTimeAndEngagement);

// Protected endpoints for evaluation and training
router.get('/metrics', authenticate, getModelMetrics);
router.post('/train', authenticate, authorizeRoles('Admin'), trainModel);

export default router;
