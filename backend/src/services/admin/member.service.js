import MemberModel from '../../models/admin/member.model.js';
import ServiceError from '../../error/service.error.js';
import { message, code } from '../../common/message/index.js';

const memberService = {
  getAllMembers: async (params) => {
    const { page, limit, filters } = params;
    const offset = (page - 1) * limit;
    return await MemberModel.getAllMembers({
      limit,
      offset,
      ...filters,
    });
  },

  getMemberByUserId: async (userId) => {
    const member = await MemberModel.getMemberByUserId(userId);
    if (!member) {
      throw new ServiceError(
        message.User.USER_NOT_FOUND,
        code.User.USER_NOT_FOUND,
        'Không tìm thấy thành viên',
        404
      );
    }
    return member;
  },

  createMember: async (data, adminId) => {
    // Check if member already exists
    const existing = await MemberModel.getMemberByUserId(data.user_id);
    if (existing) {
      throw new ServiceError(
        'INVALID_REQUEST',
        'INVALID_REQUEST',
        'User này đã là thành viên',
        400
      );
    }
    
    const insertData = {
      user_id: data.user_id,
      student_id: data.student_id,
      academic_year: data.academic_year,
      join_date: data.join_date,
      created_by: adminId,
    };
    const result = await MemberModel.createMember(insertData);
    if (!result.insertId) throw new Error('Create member failed');
    return result;
  },

  updateMember: async (userId, data, adminId) => {
    const updateData = {
      ...(data.student_id && { student_id: data.student_id }),
      ...(data.academic_year && { academic_year: data.academic_year }),
      ...(data.join_date && { join_date: data.join_date }),
      updated_by: adminId,
    };
    const result = await MemberModel.updateMember(userId, updateData);
    return result;
  },

  deleteMember: async (userId) => {
    return await MemberModel.deleteMember(userId);
  },

  getAvailableUsers: async (params) => {
    const { page, limit, filters } = params;
    const offset = (page - 1) * limit;
    return await MemberModel.getAvailableUsers({
      limit,
      offset,
      ...filters,
    });
  },

  // --- REQUESTS ---

  getPendingRequests: async (params) => {
    const { page = 1, limit = 10 } = params;
    const offset = (page - 1) * limit;
    return await MemberModel.getPendingRequests({ limit, offset });
  },

  approveRequest: async (requestId, adminId, note = '') => {
    const request = await MemberModel.getRequestById(requestId);
    if (!request) {
      throw new ServiceError('NOT_FOUND', 'NOT_FOUND', 'Không tìm thấy yêu cầu', 404);
    }
    if (request.status !== 'pending') {
      throw new ServiceError('INVALID_REQUEST', 'INVALID_REQUEST', 'Yêu cầu đã được xử lý', 400);
    }

    // Check if student_id is already used by another user
    if (request.student_id) {
      const existingStudent = await MemberModel.getMemberByStudentId(request.student_id);
      if (existingStudent && existingStudent.user_id !== request.user_id) {
              throw new ServiceError(
                message.User.INVALID_REQUEST || 'INVALID_REQUEST',
                'INVALID_REQUEST',
                `Mã sinh viên ${request.student_id} đã được sử dụng bởi thành viên khác.`,
                409 // Conflict
              );      }
    }

    // Upsert member profile
    const memberData = {
      user_id: request.user_id,
      student_id: request.student_id,
      academic_year: request.academic_year ? new Date(request.academic_year).toISOString().split('T')[0] : null,
      updated_by: adminId
    };

    const existingMember = await MemberModel.getMemberByUserId(request.user_id);
    if (existingMember) {
      await MemberModel.updateMember(request.user_id, memberData);
    } else {
      memberData.created_by = adminId;
      await MemberModel.createMember(memberData);
    }

    // Update request status
    await MemberModel.updateRequestStatus(requestId, 'approved', note, adminId);
    
    return { success: true };
  },

  rejectRequest: async (requestId, adminId, note = '') => {
    const request = await MemberModel.getRequestById(requestId);
    if (!request) {
      throw new ServiceError('NOT_FOUND', 'NOT_FOUND', 'Không tìm thấy yêu cầu', 404);
    }
    if (request.status !== 'pending') {
      throw new ServiceError('INVALID_REQUEST', 'INVALID_REQUEST', 'Yêu cầu đã được xử lý', 400);
    }

    await MemberModel.updateRequestStatus(requestId, 'rejected', note, adminId);
    return { success: true };
  }
};

export default memberService;