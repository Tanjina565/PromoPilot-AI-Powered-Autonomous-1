import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { config } from '../config/env.js';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Authentication token missing or invalid'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded; // { id, email, role, name }
    next();
  } catch (err) {
    return next(new ApiError(401, 'Token expired or invalid'));
  }
};
