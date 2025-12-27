import express from 'express';
import permissionController from '../../controllers/admin/permission.controller.js';
import { verifyToken } from '../../middlewares/jwt.js';
import { checkSuperAdmin } from '../../middlewares/role.handler.js';

const Router = express.Router();

// Tất cả routes đều yêu cầu authentication và super admin
Router.use(verifyToken);
Router.use(checkSuperAdmin);

/**
 * 📋 Lấy danh sách tất cả permissions (có phân trang)
 * GET /api/admin/permissions?page=1&limit=10
 */
Router.get('/', permissionController.getAllPermissions);

/**
 * 🔹 Lấy thông tin chi tiết permission theo ID
 * GET /api/admin/permissions/:id
 */
Router.get('/:id', permissionController.getPermissionById);

// Disabled: Không cho phép thêm/sửa/xóa permissions
// /**
//  * ➕ Tạo permission mới
//  * POST /api/admin/permissions
//  */
// Router.post('/', permissionController.createPermission);

// /**
//  * ✏️ Cập nhật permission
//  * PATCH /api/admin/permissions/:id
//  */
// Router.patch('/:id', permissionController.updatePermission);

// /**
//  * 🗑️ Xóa permission
//  * DELETE /api/admin/permissions/:id
//  */
// Router.delete('/:id', permissionController.deletePermission);

/**
 * 📋 Lấy permissions của user
 * GET /api/admin/permissions/user/:userId
 */
Router.get('/user/:userId', permissionController.getUserPermissions);

/**
 * ➕ Gán permission cho user
 * POST /api/admin/permissions/user/:userId/grant
 */
Router.post('/user/:userId/grant', permissionController.grantPermission);

/**
 * ➖ Thu hồi permission từ user
 * DELETE /api/admin/permissions/user/:userId/revoke/:permissionId
 */
Router.delete('/user/:userId/revoke/:permissionId', permissionController.revokePermission);

/**
 * 📦 Gán nhiều permissions cho user (bulk)
 * POST /api/admin/permissions/user/:userId/bulk-grant
 */
Router.post('/user/:userId/bulk-grant', permissionController.bulkGrantPermissions);

export default Router;

