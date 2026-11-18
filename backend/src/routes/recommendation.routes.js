import { Router } from 'express';
import {
  getBusinessRecommendations,
  getAdminPlatformOverview,
} from '../controllers/recommendation.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/business/:businessId', getBusinessRecommendations);
router.get('/admin/overview', authorizeRoles('Admin'), getAdminPlatformOverview);

export default router;
