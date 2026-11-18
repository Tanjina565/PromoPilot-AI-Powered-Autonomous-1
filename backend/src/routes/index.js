import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import businessRoutes from './business.routes.js';
import productRoutes from './product.routes.js';
import contentRoutes from './content.routes.js';
import mlRoutes from './ml.routes.js';
import recommendationRoutes from './recommendation.routes.js';
import seedRoutes from './seed.routes.js';

const router = Router();

// Mount all feature route modules under /api/v1
router.use('/', healthRoutes);
router.use('/auth', authRoutes);
router.use('/businesses', businessRoutes);
router.use('/products', productRoutes);
router.use('/content', contentRoutes);
router.use('/ml', mlRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/seed', seedRoutes);

export default router;
