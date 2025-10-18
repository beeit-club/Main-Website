import { message } from '../../common/message/index.js';
import asyncWrapper from '../../middlewares/error.handler.js';
import userService from '../../services/admin/user.service.js';
import { utils } from '../../utils/index.js';
import Schema from '../../validation/admin/user.validation.js';
import {
  PaginationSchema,
  params,
} from '../../validation/common/common.schema.js';

const userController = {
  /**
   * 📋 Lấy danh sách tất cả user (có phân trang)
   * GET /api/users?page=1&limit=10
   */
  getAllUser: asyncWrapper(async (req, res) => {
    // Ép apply default trước khi validate
    const query = PaginationSchema.cast(req.query);

    // Validate (nhưng sẽ không lỗi vì transform đã fallback)
    const valid = await PaginationSchema.validate(query, {
      stripUnknown: true,
    });
    const { search, roleId, active, sortBy, sortDirection } = req.query;
    const result = await userService.getAllUser({
      ...valid,
      filters: {
        search,
        roleId,
        active,
        sortBy,
        sortDirection,
      },
    });
    return utils.success(res, message.User.FETCH_SUCCESS, result);
  }),

  /**
   * 🔹 Lấy thông tin chi tiết user theo ID
   * GET /api/users/:id
   */
  getUserById: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;
    const user = await userService.getUserById(id);
    return utils.success(res, message.User.FETCH_SUCCESS, { user });
  }),

  /**
   * ➕ Tạo user mới
   * POST /api/users
   */
  createUser: asyncWrapper(async (req, res) => {
    await Schema.createUser.validate(req.body, { abortEarly: false });
    const data = req.body;
    const user = await userService.createUser(data);
    return utils.success(res, message.User.CREATE_SUCCESS, { user });
  }),

  /**
   * ✏️ Cập nhật thông tin user
   * PUT /api/users/:id
   */
  updateUser: asyncWrapper(async (req, res) => {
    await Schema.updateUser.validate(req.body, { abortEarly: false });
    const { id } = req.params;
    const {
      fullname,
      email,
      phone,
      avatar_url,
      bio,
      role_id,
      is_active,
      email_verified_at,
    } = req.body;
    const data = {
      ...(fullname && { fullname }),
      ...(email && { email }),
      ...(phone && { phone }),
      ...(avatar_url && { avatar_url }),
      ...(bio && { bio }),
      ...(role_id && { role_id }),
      ...(is_active && { is_active }),
      ...(email_verified_at && { email_verified_at }),
    };
    const updatedUser = await userService.updateUser(id, data);
    return utils.success(res, message.User.UPDATE_SUCCESS, {
      user: updatedUser,
    });
  }),

  /**
   * 🗑️ Xóa mềm user
   * DELETE /api/users/:id
   */
  deleteUser: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;
    const { fullname, email } = await userService.getUserById(id);
    await userService.deleteUser(id);
    return utils.success(res, message.User.DELETE_SUCCESS, {
      id,
      fullname,
      email,
    });
  }),

  /**
   * 🔄 Kích hoạt/vô hiệu hóa user
   * PATCH /api/users/:id/toggle-active
   */
  toggleUserActive: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    await Schema.toggleActive.validate(req.body, { abortEarly: false });
    const { id } = req.params;
    const { is_active } = req.body;
    const { fullname, email } = await userService.getUserById(id);
    await userService.toggleUserActive(id, is_active);
    return utils.success(
      res,
      is_active
        ? message.User.ACTIVATE_SUCCESS
        : message.User.DEACTIVATE_SUCCESS,
      {
        fullname,
        email,
      },
    );
  }),

  /**
   * ♻️ Khôi phục user đã xóa
   * PATCH /api/users/:id/restore
   */
  restoreUser: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;
    const { fullname, email } = await userService.getUserById(id);
    await userService.restoreUser(id);
    return utils.success(res, message.User.RESTORE_SUCCESS, {
      fullname,
      email,
    });
  }),

  /**
   * 💀 Xóa vĩnh viễn user (chỉ super admin)
   * DELETE /api/users/:id/permanent
   */
  hardDeleteUser: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;
    const { fullname, email } = await userService.getUserById(id);
    await userService.hardDeleteUser(id);
    return utils.success(res, message.User.HARD_DELETE_SUCCESS, {
      id,
      fullname,
      email,
    });
  }),

  /**
   * 📋 Lấy danh sách user đã xóa
   * GET /api/users/trash?page=1&limit=10
   */
  getDeletedUsers: asyncWrapper(async (req, res) => {
    const query = PaginationSchema.cast(req.query);

    // Validate (nhưng sẽ không lỗi vì transform đã fallback)
    const valid = await PaginationSchema.validate(query, {
      stripUnknown: true,
    });
    const { search, roleId, active, sortBy, sortDirection } = req.query;
    const result = await userService.getDeletedUsers({
      ...valid,
      filters: {
        search,
        roleId,
        active,
        sortBy,
        sortDirection,
      },
    });
    return utils.success(res, message.User.FETCH_DELETED_SUCCESS, result);
  }),

  /**
   * 📊 Thống kê user
   * GET /api/users/stats
   */
  getUserStats: asyncWrapper(async (req, res) => {
    const stats = await userService.getUserStats();
    return utils.success(res, message.User.STATS_SUCCESS, { stats });
  }),
};

export default userController;
