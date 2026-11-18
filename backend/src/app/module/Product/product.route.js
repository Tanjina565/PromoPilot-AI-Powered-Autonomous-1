import { Router } from 'express';
import {
  createProduct,
  getProductsByBusiness,
  getProductById,
  deleteProduct,
} from './product.controller.js';
import { authenticate } from '../../../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/', createProduct);
router.get('/business/:businessId', getProductsByBusiness);
router.get('/:id', getProductById);
router.delete('/:id', deleteProduct);

export default router;
