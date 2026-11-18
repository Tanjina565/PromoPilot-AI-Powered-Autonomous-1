import { AuthService } from './auth.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const register = asyncHandler(async (req, res) => {
  const result = await AuthService.register(req.body);
  return res
    .status(201)
    .json(new ApiResponse(201, result, 'User registered successfully'));
});

export const login = asyncHandler(async (req, res) => {
  const result = await AuthService.login(req.body);
  return res
    .status(200)
    .json(new ApiResponse(200, result, 'User logged in successfully'));
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await AuthService.getProfile(req.user.id || req.user._id);
  return res
    .status(200)
    .json(new ApiResponse(200, user, 'Profile retrieved successfully'));
});
