import { ApiError } from '../utils/ApiError.js';

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return next(new ApiError(401, 'Unauthorized request'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `Access forbidden: Requires one of [${allowedRoles.join(', ')}] permissions`
        )
      );
    }

    next();
  };
};
