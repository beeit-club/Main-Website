import express from 'express';
import userController from './../../controllers/admin/user.controller.js';
import { checkPermission } from '../../middlewares/permission.handler.js';

const Router = express.Router();

/**
 * 📊 Thống kê user
 * GET /api/admin/users/stats
 */
Router.get('/stats', userController.getUserStats);

/**
 * 📋 Danh sách user đã xóa (trash)
 * GET /api/admin/users/trash?page=1&limit=10
 */
Router.get('/trash', userController.getDeletedUsers);

/**
 * 🔢 Đếm user theo bộ lọc
 * GET /api/admin/users/count
 */
Router.get('/count', userController.countUsersByFilters);

/**
 * 📋 Lấy danh sách tất cả user (có phân trang)
 * GET /api/admin/users?page=1&limit=1000
 */
Router.get('/', userController.getAllUser);
// -- tìm kiếm them name email phone
// -- https localhost:8080/admin/users?search=":name,email,phone"&role="id"&active="0||1"

/**
 * 🔹 Lấy thông tin chi tiết 1 user
 * GET /api/admin/users/:id
 */
Router.get('/:id', userController.getUserById);

/**
 * ➕ Tạo user mới
 * POST /api/admin/users
 */
Router.post('/', userController.createUser);
/**
 * 🔄 Kích hoạt/vô hiệu hóa user
 * PATCH /api/admin/users/:id/toggle-active
 * Body: { is_active: 0 | 1 }
 */
Router.put('/:id/toggleActive', userController.toggleUserActive);

/**
 * ♻️ Khôi phục user đã xóa
 * PATCH /api/admin/users/:id/restore
 */
Router.patch('/:id/restore', userController.restoreUser);

/**
 * ✏️ Cập nhật thông tin user
 * PATCH /api/admin/users/:id
 */
Router.patch('/:id', userController.updateUser);

/**
 * 🗑️ Xóa mềm user
 * DELETE /api/admin/users/:id
 */
Router.delete('/:id', userController.deleteUser);

/**
 * 💀 Xóa vĩnh viễn user
 * DELETE /api/admin/users/:id/permanent
 */
Router.delete('/:id/permanent', userController.hardDeleteUser);

export default Router;
