import { MLProxyService } from '../services/mlProxy.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const predictBestTimeAndEngagement = asyncHandler(async (req, res) => {
  const result = await MLProxyService.predict(req.body);
  return res
    .status(200)
    .json(new ApiResponse(200, result, 'Prediction generated successfully'));
});

export const getModelMetrics = asyncHandler(async (req, res) => {
  const metrics = await MLProxyService.getModelMetrics();
  return res
    .status(200)
    .json(new ApiResponse(200, metrics, 'Model evaluation metrics retrieved'));
});

export const trainModel = asyncHandler(async (req, res) => {
  const result = await MLProxyService.trainModel();
  return res
    .status(200)
    .json(new ApiResponse(200, result, 'Random Forest model retrained successfully'));
});
