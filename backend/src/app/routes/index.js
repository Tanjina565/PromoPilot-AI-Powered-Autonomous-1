import { Router } from 'express';
import authRoutes from '../module/Auth/auth.route.js';
import businessRoutes from '../module/Business/business.route.js';
import productRoutes from '../module/Product/product.route.js';
import contentRoutes from '../module/Content/content.route.js';
import mlRoutes from '../module/ML/ml.route.js';
import recommendationRoutes from '../module/Recommendation/recommendation.route.js';
import seedRoutes from '../module/Seed/seed.route.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { getDbStatus } from '../../config/db.js';

const router = Router();

// Base System Health Check
router.get('/health', (req, res) => {
  const isConnected = getDbStatus();
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        service: 'PromoPilot Backend API',
        status: 'healthy',
        database: {
          connected: isConnected,
          mode: isConnected ? 'Atlas Cloud Direct' : 'Resilient Persistent Store',
        },
        architecture: 'Modular Feature Architecture (University Capstone Standard)',
        timestamp: new Date().toISOString(),
      },
      'System is fully operational'
    )
  );
});

// Mount Module Routes
router.use('/auth', authRoutes);
router.use('/businesses', businessRoutes);
router.use('/products', productRoutes);
router.use('/content', contentRoutes);
router.use('/ml', mlRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/seed', seedRoutes);

export default router;
