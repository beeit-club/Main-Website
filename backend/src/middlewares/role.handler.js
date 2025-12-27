import { code } from '../common/message/index.js';
import { businessError } from '../utils/response.js';
import db from '../db.js';
import { ROLE } from '../common/enum.js';

/**
 * Middleware to check if the authenticated user is Admin (role_id = 2) or Super Admin (role_id = 1).
 * Only Admin and Super Admin can access admin routes.
 */
export const checkAdmin = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return businessError(
        res,
        'Không tìm thấy người dùng',
        code.Auth.INVALID_USER,
        'Không tìm thấy người dùng',
      );
    }

    // Get user's role_id from database
    const [userRows] = await db.query(
      'SELECT role_id FROM users WHERE id = ? AND deleted_at IS NULL',
      [user.id],
    );

    if (userRows.length === 0) {
      return businessError(
        res,
        'Người dùng không tồn tại',
        code.Auth.INVALID_USER,
        'Người dùng không tồn tại',
      );
    }

    const userRoleId = userRows[0].role_id;

    // Check if user is Admin (role_id = 2) or Super Admin (role_id = 1)
    if (userRoleId !== ROLE.ADMIN && userRoleId !== ROLE.SUPER_ADMIN) {
      return businessError(
        res,
        'Forbidden: Chỉ Admin và Super Admin mới có quyền truy cập trang quản trị.',
        code.Auth.NOT_PREMIS,
        'Bạn không có quyền truy cập trang quản trị. Chỉ Admin và Super Admin mới được phép.',
        403,
      );
    }

    next();
  } catch (error) {
    console.error('Error checking admin:', error);
    return businessError(
      res,
      'Lỗi kiểm tra quyền',
      code.Auth.NOT_PREMIS,
      'Có lỗi xảy ra khi kiểm tra quyền',
      500,
    );
  }
};

/**
 * Middleware to check if the authenticated user is Super Admin (role_id = 1).
 * Only Super Admin can manage roles and permissions.
 */
export const checkSuperAdmin = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return businessError(
        res,
        'Không tìm thấy người dùng',
        code.Auth.INVALID_USER,
        'Không tìm thấy người dùng',
      );
    }

    // Get user's role_id from database
    const [userRows] = await db.query(
      'SELECT role_id FROM users WHERE id = ? AND deleted_at IS NULL',
      [user.id],
    );

    if (userRows.length === 0) {
      return businessError(
        res,
        'Người dùng không tồn tại',
        code.Auth.INVALID_USER,
        'Người dùng không tồn tại',
      );
    }

    const userRoleId = userRows[0].role_id;

    // Check if user is Super Admin (role_id = 1)
    if (userRoleId !== ROLE.SUPER_ADMIN) {
      return businessError(
        res,
        'Forbidden: Chỉ Super Admin mới có quyền thực hiện thao tác này.',
        code.Auth.NOT_PREMIS,
        'Bạn không có quyền thực hiện thao tác này. Chỉ Super Admin mới được quản lý quyền và vai trò.',
        403,
      );
    }

    next();
  } catch (error) {
    console.error('Error checking super admin:', error);
    return businessError(
      res,
      'Lỗi kiểm tra quyền',
      code.Auth.NOT_PREMIS,
      'Có lỗi xảy ra khi kiểm tra quyền',
      500,
    );
  }
};
