import { RecommendationService } from '../services/recommendation.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getBusinessRecommendations = asyncHandler(async (req, res) => {
  const recommendations = await RecommendationService.getBusinessRecommendations(
    req.params.businessId
  );
  return res
    .status(200)
    .json(new ApiResponse(200, recommendations, 'Recommendations retrieved successfully'));
});

export const getAdminPlatformOverview = asyncHandler(async (req, res) => {
  const data = await RecommendationService.getPlatformAdminAnalytics();
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Platform analytics retrieved successfully'));
});
