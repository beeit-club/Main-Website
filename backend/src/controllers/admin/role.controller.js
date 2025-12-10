import { message } from '../../common/message/index.js';
import asyncWrapper from '../../middlewares/error.handler.js';
import roleService from '../../services/admin/role.service.js';
import { utils } from '../../utils/index.js';
import Schema from '../../validation/admin/role.validation.js';
import { sanitizeText } from '../../utils/sanitize.js';
import {
  PaginationSchema,
  params,
} from '../../validation/common/common.schema.js';

const roleController = {
  /**
   * 📋 Lấy danh sách tất cả roles (có phân trang)
   * GET /api/admin/roles?page=1&limit=10
   */
  getAllRoles: asyncWrapper(async (req, res) => {
    const query = PaginationSchema.cast(req.query);
    const valid = await PaginationSchema.validate(query, {
      stripUnknown: true,
    });
    const { search, sortBy, sortDirection } = req.query;
    const result = await roleService.getAllRoles({
      ...valid,
      filters: {
        search,
        sortBy,
        sortDirection,
      },
    });
    return utils.success(res, message.Role?.FETCH_SUCCESS || 'Lấy danh sách vai trò thành công', result);
  }),

  /**
   * 🔹 Lấy thông tin chi tiết role theo ID
   * GET /api/admin/roles/:id
   */
  getRoleById: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;
    const role = await roleService.getRoleById(id);
    return utils.success(res, message.Role?.FETCH_SUCCESS || 'Lấy thông tin vai trò thành công', { role });
  }),

  /**
   * ➕ Tạo role mới
   * POST /api/admin/roles
   */
  createRole: asyncWrapper(async (req, res) => {
    await Schema.createRole.validate(req.body, { abortEarly: false });
    const { name, description } = req.body;
    const data = {
      name: sanitizeText(name),
      description: description ? sanitizeText(description) : null,
    };
    const role = await roleService.createRole(data);
    return utils.success(res, message.Role?.CREATE_SUCCESS || 'Tạo vai trò thành công', { role });
  }),

  /**
   * ✏️ Cập nhật role
   * PATCH /api/admin/roles/:id
   */
  updateRole: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    await Schema.updateRole.validate(req.body, { abortEarly: false });
    const { id } = req.params;
    const { name, description } = req.body;
    const data = {};
    if (name) data.name = sanitizeText(name);
    if (description !== undefined) data.description = description ? sanitizeText(description) : null;
    const updatedRole = await roleService.updateRole(id, data);
    return utils.success(res, message.Role?.UPDATE_SUCCESS || 'Cập nhật vai trò thành công', {
      role: updatedRole,
    });
  }),

  /**
   * 🗑️ Xóa role
   * DELETE /api/admin/roles/:id
   */
  deleteRole: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;
    const role = await roleService.getRoleById(id);
    await roleService.deleteRole(id);
    return utils.success(res, message.Role?.DELETE_SUCCESS || 'Xóa vai trò thành công', {
      id,
      name: role.name,
    });
  }),

  /**
   * 🔄 Gán role cho user
   * POST /api/admin/roles/:id/assign
   */
  assignRole: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    await Schema.assignRole.validate(req.body, { abortEarly: false });
    const { id } = req.params;
    const { user_id } = req.body;
    await roleService.assignRole(user_id, id);
    return utils.success(res, message.Role?.ASSIGN_SUCCESS || 'Gán vai trò thành công');
  }),
};

export default roleController;

