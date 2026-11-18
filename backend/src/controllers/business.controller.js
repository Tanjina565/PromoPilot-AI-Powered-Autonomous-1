import { BusinessService } from '../services/business.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createBusiness = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const business = await BusinessService.createBusiness(userId, req.body);
  return res
    .status(201)
    .json(new ApiResponse(201, business, 'Business profile created successfully'));
});

export const getBusinesses = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const businesses = await BusinessService.getBusinesses(userId, req.user.role);
  return res
    .status(200)
    .json(new ApiResponse(200, businesses, 'Businesses retrieved successfully'));
});

export const getBusinessById = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const business = await BusinessService.getBusinessById(req.params.id, userId, req.user.role);
  return res
    .status(200)
    .json(new ApiResponse(200, business, 'Business profile retrieved successfully'));
});

export const updateBusiness = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const updated = await BusinessService.updateBusiness(
    req.params.id,
    userId,
    req.user.role,
    req.body
  );
  return res
    .status(200)
    .json(new ApiResponse(200, updated, 'Business profile updated successfully'));
});

export const deleteBusiness = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const result = await BusinessService.deleteBusiness(req.params.id, userId, req.user.role);
  return res
    .status(200)
    .json(new ApiResponse(200, result, 'Business profile deleted successfully'));
});

export const connectSocialPage = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const updated = await BusinessService.connectSocialPage(
    req.params.id,
    userId,
    req.user.role,
    req.body
  );
  return res
    .status(200)
    .json(new ApiResponse(200, updated, 'Social media page connected successfully'));
});
