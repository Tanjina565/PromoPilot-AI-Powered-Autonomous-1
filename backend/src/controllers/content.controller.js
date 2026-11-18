import { ContentService } from '../services/content.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const generateContent = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const content = await ContentService.generateContent({
    ...req.body,
    userId,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, content, 'AI content generated successfully'));
});

export const updateContent = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const updated = await ContentService.updateContent(req.params.id, userId, req.body);
  return res
    .status(200)
    .json(new ApiResponse(200, updated, 'Content updated successfully'));
});

export const regenerateContent = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const regenerated = await ContentService.regenerateContent(
    req.params.id,
    userId,
    req.body
  );
  return res
    .status(200)
    .json(new ApiResponse(200, regenerated, 'Content regenerated successfully'));
});

export const getContentHistory = asyncHandler(async (req, res) => {
  const history = await ContentService.getContentHistory({
    businessId: req.query.businessId,
    platform: req.query.platform,
    status: req.query.status,
    search: req.query.search,
    role: req.user.role,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, history, 'Content history retrieved successfully'));
});
