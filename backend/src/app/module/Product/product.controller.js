import { ProductService } from './product.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const createProduct = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const product = await ProductService.createProduct(userId, req.body.businessId, req.body);
  return res
    .status(201)
    .json(new ApiResponse(201, product, 'Product created successfully'));
});

export const getProductsByBusiness = asyncHandler(async (req, res) => {
  const products = await ProductService.getProductsByBusiness(req.params.businessId);
  return res
    .status(200)
    .json(new ApiResponse(200, products, 'Products retrieved successfully'));
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await ProductService.getProductById(req.params.id);
  return res
    .status(200)
    .json(new ApiResponse(200, product, 'Product retrieved successfully'));
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const result = await ProductService.deleteProduct(req.params.id, userId, req.user.role);
  return res
    .status(200)
    .json(new ApiResponse(200, result, 'Product deleted successfully'));
});
