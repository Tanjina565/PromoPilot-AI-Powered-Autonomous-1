import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError.js';
import { config } from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
  let error = err;

  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    error = new ApiError(400, 'Validation failed', formattedErrors);
  }
  // Handle Mongoose Bad ObjectId (CastError)
  else if (err.name === 'CastError') {
    const message = `Resource not found with id: ${err.value}`;
    error = new ApiError(404, message);
  }
  // Handle Mongoose Duplicate Key Error
  else if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const message = `Duplicate value entered for ${field}. It must be unique.`;
    error = new ApiError(409, message);
  }
  // Handle Mongoose Validation Error
  else if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    error = new ApiError(400, messages.join(', '));
  }
  // Handle JWT Errors
  else if (err.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Invalid authentication token');
  } else if (err.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Authentication token expired');
  }
  // Fallback if not an ApiError instance
  else if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, [], err.stack);
  }

  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors || [],
    ...(config.nodeEnv === 'development' && { stack: error.stack }),
  };

  res.status(error.statusCode).json(response);
};
