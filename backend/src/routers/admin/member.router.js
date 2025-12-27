import express from 'express';
import memberController from '../../controllers/admin/member.controller.js';

const Router = express.Router();

/**
 * 📋 Lấy danh sách thành viên (có phân trang)
 * GET /api/admin/members?page=1&limit=10
 */
Router.get('/', memberController.getAllMembers);

/**
 * 📋 Lấy danh sách users chưa có member profile (để chọn khi thêm)
 * GET /api/admin/members/available-users?page=1&limit=10&search=...
 */
Router.get('/available-users', memberController.getAvailableUsers);

/**
 * 🔹 Lấy thông tin chi tiết thành viên theo user_id
 * GET /api/admin/members/:userId
 */
Router.get('/:userId', memberController.getMemberByUserId);

/**
 * ➕ Tạo thành viên mới
 * POST /api/admin/members
 */
Router.post('/', memberController.createMember);

/**
 * ✏️ Cập nhật thông tin thành viên
 * PATCH /api/admin/members/:userId
 */
Router.patch('/:userId', memberController.updateMember);

/**
 * 🗑️ Xóa thành viên (soft delete)
 * DELETE /api/admin/members/:userId
 */
Router.delete('/:userId', memberController.deleteMember);

export default Router;

