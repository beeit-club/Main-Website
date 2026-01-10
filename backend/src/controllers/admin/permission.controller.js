import { message } from '../../common/message/index.js';
import asyncWrapper from '../../middlewares/error.handler.js';
import permissionService from '../../services/admin/permission.service.js';
import { utils } from '../../utils/index.js';
import Schema from '../../validation/admin/permission.validation.js';
import { sanitizeText } from '../../utils/sanitize.js';
import {
  PaginationSchema,
  params,
} from '../../validation/common/common.schema.js';

const permissionController = {
  /**
   * 📋 Lấy danh sách tất cả permissions (có phân trang)
   * GET /api/admin/permissions?page=1&limit=10
   */
  getAllPermissions: asyncWrapper(async (req, res) => {
    const query = PaginationSchema.cast(req.query);
    const valid = await PaginationSchema.validate(query, {
      stripUnknown: true,
    });
    const { search, module, sortBy, sortDirection } = req.query;
    const result = await permissionService.getAllPermissions({
      ...valid,
      filters: {
        search,
        module,
        sortBy,
        sortDirection,
      },
    });
    return utils.success(res, message.Permission?.FETCH_SUCCESS || 'Lấy danh sách quyền thành công', result);
  }),

  /**
   * 🔹 Lấy thông tin chi tiết permission theo ID
   * GET /api/admin/permissions/:id
   */
  getPermissionById: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;
    const permission = await permissionService.getPermissionById(id);
    return utils.success(res, message.Permission?.FETCH_SUCCESS || 'Lấy thông tin quyền thành công', { permission });
  }),

  /**
   * ➕ Tạo permission mới
   * POST /api/admin/permissions
   */
  createPermission: asyncWrapper(async (req, res) => {
    await Schema.createPermission.validate(req.body, { abortEarly: false });
    const { name, description, module } = req.body;
    const data = {
      name: sanitizeText(name),
      description: sanitizeText(description),
      module: module ? sanitizeText(module) : null,
    };
    const permission = await permissionService.createPermission(data);
    return utils.success(res, message.Permission?.CREATE_SUCCESS || 'Tạo quyền thành công', { permission });
  }),

  /**
   * ✏️ Cập nhật permission
   * PATCH /api/admin/permissions/:id
   */
  updatePermission: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    await Schema.updatePermission.validate(req.body, { abortEarly: false });
    const { id } = req.params;
    const { name, description, module } = req.body;
    const data = {};
    if (name) data.name = sanitizeText(name);
    if (description !== undefined) data.description = sanitizeText(description);
    if (module !== undefined) data.module = module ? sanitizeText(module) : null;
    const updatedPermission = await permissionService.updatePermission(id, data);
    return utils.success(res, message.Permission?.UPDATE_SUCCESS || 'Cập nhật quyền thành công', {
      permission: updatedPermission,
    });
  }),

  /**
   * 🗑️ Xóa permission
   * DELETE /api/admin/permissions/:id
   */
  deletePermission: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;
    const permission = await permissionService.getPermissionById(id);
    await permissionService.deletePermission(id);
    return utils.success(res, message.Permission?.DELETE_SUCCESS || 'Xóa quyền thành công', {
      id,
      name: permission.name,
    });
  }),

  /**
   * 📋 Lấy permissions của user
   * GET /api/admin/permissions/user/:userId
   */
  getUserPermissions: asyncWrapper(async (req, res) => {
    await params.id.validate({ id: req.params.userId }, { abortEarly: false });
    const { userId } = req.params;
    const permissions = await permissionService.getUserPermissions(userId);
    return utils.success(res, 'Lấy danh sách quyền của người dùng thành công', { permissions });
  }),

  /**
   * ➕ Gán permission cho user
   * POST /api/admin/permissions/user/:userId/grant
   */
  grantPermission: asyncWrapper(async (req, res) => {
    await params.id.validate({ id: req.params.userId }, { abortEarly: false });
    await Schema.grantPermission.validate(req.body, { abortEarly: false });
    const { userId } = req.params;
    const { permission_id } = req.body;
    const grantedBy = req.user.id;
    await permissionService.grantPermission(userId, permission_id, grantedBy);
    return utils.success(res, 'Gán quyền thành công');
  }),

  /**
   * ➖ Thu hồi permission từ user
   * DELETE /api/admin/permissions/user/:userId/revoke/:permissionId
   */
  revokePermission: asyncWrapper(async (req, res) => {
    await params.id.validate({ id: req.params.userId }, { abortEarly: false });
    await params.id.validate({ id: req.params.permissionId }, { abortEarly: false });
    const { userId, permissionId } = req.params;
    await permissionService.revokePermission(userId, permissionId);
    return utils.success(res, 'Thu hồi quyền thành công');
  }),

  /**
   * 📦 Gán nhiều permissions cho user (bulk)
   * POST /api/admin/permissions/user/:userId/bulk-grant
   */
  bulkGrantPermissions: asyncWrapper(async (req, res) => {
    await params.id.validate({ id: req.params.userId }, { abortEarly: false });
    await Schema.bulkGrantPermissions.validate(req.body, { abortEarly: false });
    const { userId } = req.params;
    const { permission_ids } = req.body;
    const grantedBy = req.user.id;
    await permissionService.bulkGrantPermissions(userId, permission_ids, grantedBy);
    return utils.success(res, 'Gán quyền hàng loạt thành công');
  }),
};

export default permissionController;

