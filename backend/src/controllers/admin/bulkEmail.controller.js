// controllers/admin/bulkEmail.controller.js
import asyncWrapper from '../../middlewares/error.handler.js';
import bulkEmailService from '../../services/admin/bulkEmail.service.js';
import { utils } from '../../utils/index.js';

const bulkEmailController = {
  // Tạo chiến dịch gửi mới
  sendBulkEmailFromFilters: asyncWrapper(async (req, res) => {
    const { template_id, job_name, filters, input_variables } = req.body;
    
    // Validate cơ bản
    if (!template_id) {
        return utils.error(res, 'Vui lòng chọn mẫu email', 400);
    }

    const result = await bulkEmailService.createBatchJob({
        templateId: template_id,
        jobName: job_name,
        filters: filters || {},
        inputVariables: input_variables || {}
    }, req.user?.id);

    return utils.success(res, 'Đã tạo chiến dịch gửi thành công', result);
  }),

  // Lấy danh sách chiến dịch (Jobs)
  getAllBatchJobs: asyncWrapper(async (req, res) => {
    const { page, limit } = req.query;
    const result = await bulkEmailService.getAllJobs({ page, limit });
    return utils.success(res, 'Lấy danh sách chiến dịch thành công', result);
  }),

  // Thử lại các email bị lỗi
  retryFailedEmails: asyncWrapper(async (req, res) => {
    const { id } = req.params; // Job ID
    const result = await bulkEmailService.retryJob(id);
    return utils.success(res, 'Đã đưa các email lỗi vào hàng đợi gửi lại', result);
  }),

  // Các hàm placeholder để tránh lỗi import nếu router cũ còn gọi
  getBatchJobById: asyncWrapper(async (req, res) => utils.success(res, 'OK')),
  getBatchJobRecipients: asyncWrapper(async (req, res) => utils.success(res, 'OK')),
  cancelBatchJob: asyncWrapper(async (req, res) => utils.success(res, 'OK')),
  sendBulkEmail: asyncWrapper(async (req, res) => utils.success(res, 'OK')),
  sendBulkEmailFromUsers: asyncWrapper(async (req, res) => utils.success(res, 'OK')),
};

export default bulkEmailController;