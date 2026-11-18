import { BusinessService } from '../services/business.service.js';
import { ApiError } from '../utils/ApiError.js';

export const verifyBusinessOwnership = async (req, res, next) => {
  try {
    const businessId = req.params.id || req.params.businessId || req.body.businessId;
    if (!businessId) {
      return next(new ApiError(400, 'Business ID parameter is required'));
    }

    const userId = req.user.id || req.user._id;
    const role = req.user.role;

    const business = await BusinessService.getBusinessById(businessId, userId, role);
    req.business = business;
    next();
  } catch (err) {
    next(err);
  }
};
