import { code } from '../common/message/index.js';
import { userHasPermission } from '../services/permission.service.js';
import { businessError } from '../utils/response.js';

/**
 * Middleware to check if the authenticated user has a specific permission.
 * @param {string} permissionName - The name of the permission required.
 */
export const checkPermission = (permissionName) => {
  return async (req, res, next) => {
    // Assuming user information is attached to the request object by a previous middleware (e.g., jwt.js)
    const user = req.user;
    if (!user) {
      return businessError(
        res,
        'Không tìm thấy người dùng',
        code.Auth.INVALID_USER,
        'Không tìm thấy người dùng',
      );
    }

    const hasPermission = await userHasPermission(user.id, permissionName);

    if (!hasPermission) {
      return businessError(
        res,
        `Forbidden: You do not have the required '${permissionName}' permission.`,
        code.Auth.NOT_PREMIS,
        'Bạn không có quyền thực hiện thao tác này',
        403,
      );
    }

    next();
  };
};
