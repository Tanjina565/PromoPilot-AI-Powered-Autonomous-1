import { Router } from 'express';
import {
  generateContent,
  updateContent,
  regenerateContent,
  getContentHistory,
} from './content.controller.js';
import { authenticate } from '../../../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/generate', generateContent);
router.put('/:id', updateContent);
router.post('/:id/regenerate', regenerateContent);
router.get('/history', getContentHistory);

export default router;
