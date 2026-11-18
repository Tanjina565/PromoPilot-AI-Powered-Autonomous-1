import { Router } from 'express';
import {
  register,
  login,
  getProfile,
  getUsers,
  updateUserRole,
} from '../controllers/auth.controller.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { registerSchema, loginSchema } from '../validation/auth.validation.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.get('/profile', authenticate, getProfile);

// Admin Only: User role management endpoints
router.get('/users', authenticate, authorizeRoles('Admin'), getUsers);
router.patch('/users/:id/role', authenticate, authorizeRoles('Admin'), updateUserRole);

export default router;
