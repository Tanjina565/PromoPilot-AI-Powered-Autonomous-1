import mongoose from 'mongoose';
import axios from 'axios';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { config } from '../config/env.js';

export const getHealth = asyncHandler(async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

  let mlStatus = { status: 'offline' };
  try {
    const mlRes = await axios.get(`${config.mlServiceUrl}/health`, { timeout: 3000 });
    mlStatus = mlRes.data;
  } catch (err) {
    mlStatus = { status: 'offline', error: err.message };
  }

  const healthData = {
    service: 'PromoPilot Backend API',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: `${process.uptime().toFixed(1)} seconds`,
    port: config.port,
    database: {
      status: dbStatus,
      readyState: mongoose.connection.readyState,
    },
    mlService: mlStatus,
    version: '1.0.0',
    assignedMember: 'Member 2 (Capstone Architecture)',
  };

  return res.status(200).json(new ApiResponse(200, healthData, 'System is healthy and operational'));
});
