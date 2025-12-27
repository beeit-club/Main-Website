import { message } from '../../common/message/index.js';
import asyncWrapper from '../../middlewares/error.handler.js';
import memberService from '../../services/admin/member.service.js';
import { utils } from '../../utils/index.js';
import Schema from '../../validation/admin/member.validation.js';
import {
  PaginationSchema,
  params,
} from '../../validation/common/common.schema.js';

const memberController = {
  /**
   * 📋 Lấy danh sách thành viên (có phân trang)
   * GET /api/admin/members?page=1&limit=10
   */
  getAllMembers: asyncWrapper(async (req, res) => {
    const query = PaginationSchema.cast(req.query);
    const valid = await PaginationSchema.validate(query, {
      stripUnknown: true,
    });
    const { search, sortBy, sortDirection } = req.query;
    const result = await memberService.getAllMembers({
      ...valid,
      filters: {
        search,
        sortBy,
        sortDirection,
      },
    });
    return utils.success(res, message.User.FETCH_SUCCESS, result);
  }),

  /**
   * 🔹 Lấy thông tin chi tiết thành viên theo user_id
   * GET /api/admin/members/:userId
   */
  getMemberByUserId: asyncWrapper(async (req, res) => {
    await params.id.validate(
      { id: req.params.userId },
      { abortEarly: false },
    );
    const { userId } = req.params;
    const member = await memberService.getMemberByUserId(userId);
    return utils.success(res, message.User.FETCH_SUCCESS, { member });
  }),

  /**
   * ➕ Tạo thành viên mới
   * POST /api/admin/members
   */
  createMember: asyncWrapper(async (req, res) => {
    await Schema.createMember.validate(req.body, { abortEarly: false });
    const data = req.body;
    const adminId = req.user?.id; // Lấy từ JWT token
    const member = await memberService.createMember(data, adminId);
    return utils.success(res, 'Tạo thành viên thành công', { member });
  }),

  /**
   * ✏️ Cập nhật thông tin thành viên
   * PATCH /api/admin/members/:userId
   */
  updateMember: asyncWrapper(async (req, res) => {
    await params.id.validate(
      { id: req.params.userId },
      { abortEarly: false },
    );
    await Schema.updateMember.validate(req.body, { abortEarly: false });
    const { userId } = req.params;
    const data = req.body;
    const adminId = req.user?.id;
    const member = await memberService.updateMember(userId, data, adminId);
    return utils.success(res, 'Cập nhật thành viên thành công', { member });
  }),

  /**
   * 🗑️ Xóa thành viên (soft delete)
   * DELETE /api/admin/members/:userId
   */
  deleteMember: asyncWrapper(async (req, res) => {
    await params.id.validate(
      { id: req.params.userId },
      { abortEarly: false },
    );
    const { userId } = req.params;
    await memberService.deleteMember(userId);
    return utils.success(res, 'Xóa thành viên thành công');
  }),

  /**
   * 📋 Lấy danh sách users chưa có member profile (để chọn khi thêm)
   * GET /api/admin/members/available-users?search=...
   */
  getAvailableUsers: asyncWrapper(async (req, res) => {
    const query = PaginationSchema.cast(req.query);
    const valid = await PaginationSchema.validate(query, {
      stripUnknown: true,
    });
    const { search } = req.query;
    const users = await memberService.getAvailableUsers({
      ...valid,
      filters: {
        search,
      },
    });
    return utils.success(res, 'Lấy danh sách users thành công', { users });
  }),
};

export default memberController;

