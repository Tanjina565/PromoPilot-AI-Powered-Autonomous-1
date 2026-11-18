import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config/env.js';
import rootRouter from './routes/index.js';
import { errorHandler } from './middleware/error.middleware.js';
import { ApiError } from './utils/ApiError.js';

const app = express();

// Global Middlewares - Allow both Localhost and Network IP
app.use(cors({
  origin: true, // Dynamically reflect request origin for local + network access
  credentials: true,
}));

app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// Mount API v1 Routes
app.use('/api/v1', rootRouter);

// 404 Catch-All Handler
app.use('*', (req, res, next) => {
  next(new ApiError(404, `Resource not found: ${req.method} ${req.originalUrl}`));
});

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
