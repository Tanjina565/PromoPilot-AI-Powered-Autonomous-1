import { Router } from 'express';
import {
  createBusiness,
  getBusinesses,
  getBusinessById,
  updateBusiness,
  deleteBusiness,
  connectSocialPage,
} from './business.controller.js';
import { authenticate } from '../../../middleware/auth.middleware.js';
import { validateRequest } from '../../../middleware/validate.middleware.js';
import {
  createBusinessSchema,
  updateBusinessSchema,
  connectSocialSchema,
} from './business.validation.js';

const router = Router();

router.use(authenticate);

router.post('/', validateRequest(createBusinessSchema), createBusiness);
router.get('/', getBusinesses);
router.get('/:id', getBusinessById);
router.put('/:id', validateRequest(updateBusinessSchema), updateBusiness);
router.delete('/:id', deleteBusiness);
router.post('/:id/social-accounts', validateRequest(connectSocialSchema), connectSocialPage);

export default router;
