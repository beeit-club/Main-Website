import { AuthModel } from '../../models/auth/index.js';
import { message, code } from '../../common/message/index.js';
import ServiceError from '../../error/service.error.js';

const MemberService = {
  createRequest: async (user_id, data) => {
    // Check if there is a pending request
    const existingRequest = await AuthModel.getEditRequest(user_id);
    if (existingRequest && existingRequest.status === 'pending') {
      throw new ServiceError(
        'INVALID_REQUEST',
        'INVALID_REQUEST',
        'Bạn đang có yêu cầu chờ duyệt. Vui lòng chờ admin xử lý.',
        400
      );
    }

    const requestData = {
      user_id,
      student_id: data.student_id,
      academic_year: data.academic_year ? new Date(data.academic_year).toISOString().split('T')[0] : null, // YYYY-MM-DD
      reason: data.reason,
      status: 'pending'
    };

    const result = await AuthModel.createEditRequest(requestData);
    if (!result.insertId) {
      throw new ServiceError(
        'SERVER_ERROR',
        'SERVER_ERROR',
        'Lỗi khi tạo yêu cầu.',
        500
      );
    }

    return { id: result.insertId, ...requestData };
  }
};

export default MemberService;
