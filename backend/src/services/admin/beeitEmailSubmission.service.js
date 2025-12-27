// services/admin/beeitEmailSubmission.service.js

import { code, message } from '../../common/message/index.js';
import ServiceError from '../../error/service.error.js';
import { BeeitEmailSubmissionModel } from '../../models/admin/index.js';

const beeitEmailSubmissionService = {
  // Lấy tất cả submissions
  getAllSubmissions: async (options) => {
    try {
      return await BeeitEmailSubmissionModel.getAllSubmissions(options);
    } catch (error) {
      throw error;
    }
  },

  // Lấy submission theo ID
  getSubmissionById: async (id) => {
    const submission = await BeeitEmailSubmissionModel.getSubmissionById(id);
    if (!submission) {
      throw new ServiceError(
        'Email submission không tồn tại',
        'SUBMISSION_NOT_FOUND',
        'Không tìm thấy Email submission với ID này',
        404,
      );
    }
    return submission;
  },

  // Tạo submission mới (từ form)
  createSubmission: async (email) => {
    // Kiểm tra email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ServiceError(
        'Email không hợp lệ',
        'INVALID_EMAIL',
        'Vui lòng nhập email hợp lệ',
        400,
      );
    }

    // Kiểm tra email đã submit trong 24h chưa (optional - có thể bỏ qua)
    // const recent = await BeeitEmailSubmissionModel.checkEmailExists(email);
    // if (recent) {
    //   throw new ServiceError(
    //     'Email đã được gửi gần đây',
    //     'EMAIL_RECENTLY_SUBMITTED',
    //     'Vui lòng đợi 24 giờ trước khi gửi lại',
    //     429,
    //   );
    // }

    const submissionData = {
      email: email.toLowerCase().trim(),
      status: 'new',
    };

    return await BeeitEmailSubmissionModel.createSubmission(submissionData);
  },

  // Cập nhật submission (mark as processed, etc.)
  updateSubmission: async (id, submissionData) => {
    await beeitEmailSubmissionService.getSubmissionById(id); // Check existence

    // Nếu update status thành processed, set processed_at
    if (submissionData.status === 'processed' && !submissionData.processed_at) {
      submissionData.processed_at = new Date();
    }

    return await BeeitEmailSubmissionModel.updateSubmission(id, submissionData);
  },

  // Mark as processed
  markAsProcessed: async (id, notes = null) => {
    const data = {
      status: 'processed',
      processed_at: new Date(),
    };
    if (notes) {
      data.notes = notes;
    }
    return await beeitEmailSubmissionService.updateSubmission(id, data);
  },

  // Mark as archived
  markAsArchived: async (id) => {
    return await beeitEmailSubmissionService.updateSubmission(id, {
      status: 'archived',
    });
  },

  // Get statistics
  getStatistics: async () => {
    const total = await BeeitEmailSubmissionModel.getTotalCount();
    const newCount = await BeeitEmailSubmissionModel.getCountByStatus('new');
    const processedCount = await BeeitEmailSubmissionModel.getCountByStatus('processed');
    const archivedCount = await BeeitEmailSubmissionModel.getCountByStatus('archived');

    return {
      total,
      new: newCount,
      processed: processedCount,
      archived: archivedCount,
    };
  },
};

export default beeitEmailSubmissionService;

