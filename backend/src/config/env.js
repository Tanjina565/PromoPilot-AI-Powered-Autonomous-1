import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/promopilot',
  jwtSecret: process.env.JWT_SECRET || 'promopilot_jwt_super_secret_dev_key_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  mlServiceUrl: process.env.ML_SERVICE_URL || 'http://localhost:8000',
  redisHost: process.env.REDIS_HOST || 'localhost',
  redisPort: parseInt(process.env.REDIS_PORT || '6379', 10),
};
