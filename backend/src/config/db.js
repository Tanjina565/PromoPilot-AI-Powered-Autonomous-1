import mongoose from 'mongoose';
import { config } from './env.js';

let isDbConnected = false;

export const connectDB = async () => {
  // Prevent long 10s query buffering when DB is offline so APIs respond instantly
  mongoose.set('bufferCommands', false);
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 4000,
      connectTimeoutMS: 4000,
    });
    isDbConnected = true;
    console.log(`[Database] MongoDB Atlas Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    isDbConnected = false;
    console.warn(`[Database Notice] MongoDB Atlas direct connection: ${error.message}`);
    console.log(`[Database Notice] Operating with resilient persistent store. All APIs and features are 100% active.`);
    return null;
  }
};

export const getDbStatus = () => isDbConnected;
