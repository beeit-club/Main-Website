import express from 'express';
import roleController from '../../controllers/admin/role.controller.js';
import { verifyToken } from '../../middlewares/jwt.js';
import { checkSuperAdmin } from '../../middlewares/role.handler.js';

const Router = express.Router();

// Tất cả routes đều yêu cầu authentication và super admin
Router.use(verifyToken);
Router.use(checkSuperAdmin);

/**
 * 📋 Lấy danh sách tất cả roles (có phân trang)
 * GET /api/admin/roles?page=1&limit=10
 */
Router.get('/', roleController.getAllRoles);

/**
 * 🔹 Lấy thông tin chi tiết role theo ID
 * GET /api/admin/roles/:id
 */
Router.get('/:id', roleController.getRoleById);

// Disabled: Không cho phép thêm/sửa/xóa roles
// /**
//  * ➕ Tạo role mới
//  * POST /api/admin/roles
//  */
// Router.post('/', roleController.createRole);

// /**
//  * ✏️ Cập nhật role
//  * PATCH /api/admin/roles/:id
//  */
// Router.patch('/:id', roleController.updateRole);

// /**
//  * 🗑️ Xóa role
//  * DELETE /api/admin/roles/:id
//  */
// Router.delete('/:id', roleController.deleteRole);

/**
 * 🔄 Gán role cho user
 * POST /api/admin/roles/:id/assign
 */
Router.post('/:id/assign', roleController.assignRole);

export default Router;

