import { Router } from 'express';
import { register, login, getProfile } from './auth.controller.js';
import { validateRequest } from '../../../middleware/validate.middleware.js';
import { registerSchema, loginSchema } from './auth.validation.js';
import { authenticate } from '../../../middleware/auth.middleware.js';

const router = Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.get('/profile', authenticate, getProfile);

export default router;
