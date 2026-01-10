// services/admin/bulkEmail.service.js
// Service xử lý gửi email hàng loạt (batch jobs)

import EmailBatchJobModel from '../../models/admin/emailBatchJob.model.js';
import EmailBatchRecipientModel from '../../models/admin/emailBatchRecipient.model.js';
import EmailTemplateModel from '../../models/admin/emailTemplate.model.js';
import UserModel from '../../models/admin/user.model.js';
import userDataMapper from '../email/userDataMapper.service.js';
import emailService from '../email/emailService.js';
import ServiceError from '../../error/service.error.js';

class BulkEmailService {
  /**
   * Tạo batch job mới
   * @param {number|string} templateIdOrSlug - Template ID hoặc slug
   * @param {Array<Object>} recipients - Danh sách recipients: [{ email, variables }]
   * @param {Object} options - Options: { jobName, createdBy, batchSize, delay }
   * @returns {Promise<Object>} Batch job đã tạo
   */
  async createBatchJob(templateIdOrSlug, recipients, options = {}) {
    try {
      // 1. Validate recipients
      if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
        throw new ServiceError(
          'Danh sách người nhận không được rỗng',
          'INVALID_RECIPIENTS',
          'Phải có ít nhất 1 người nhận',
          400,
        );
      }

      // 2. Validate template
      let template;
      if (
        typeof templateIdOrSlug === 'number' ||
        /^\d+$/.test(templateIdOrSlug)
      ) {
        template = await EmailTemplateModel.getTemplateById(templateIdOrSlug);
      } else {
        template = await EmailTemplateModel.getTemplateBySlug(templateIdOrSlug);
      }

      if (!template) {
        throw new ServiceError(
          'Template không tồn tại',
          'TEMPLATE_NOT_FOUND',
          null,
          404,
        );
      }

      // 3. Validate recipients format
      for (const recipient of recipients) {
        if (!recipient.email) {
          throw new ServiceError(
            'Mỗi người nhận phải có email',
            'INVALID_RECIPIENT',
            'Mỗi recipient phải có field email',
            400,
          );
        }
      }

      // 4. Tạo batch job
      const job = await EmailBatchJobModel.createJob({
        template_id: template.id,
        template_slug: template.slug,
        job_name: options.jobName || `Gửi email hàng loạt - ${template.name}`,
        total_recipients: recipients.length,
        status: 'pending',
        options: JSON.stringify(options),
        created_by: options.createdBy || null,
      });

      // 5. Tạo recipients records
      const recipientRecords = recipients.map((rec) => ({
        batch_job_id: job.id,
        recipient_email: rec.email,
        variables: rec.variables || {},
        status: 'pending',
      }));

      await EmailBatchRecipientModel.bulkCreate(recipientRecords);

      return job;
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(
        'Tạo batch job thất bại',
        'CREATE_BATCH_JOB_FAILED',
        error.message,
        500,
      );
    }
  }

  /**
   * Xử lý batch job (gửi emails)
   * @param {number} jobId - Batch job ID
   * @param {Object} options - Options: { batchSize, delay }
   * @returns {Promise<Object>} Kết quả xử lý
   */
  async processBatchJob(jobId, options = {}) {
    try {
      // 1. Lấy job và validate
      const job = await EmailBatchJobModel.getJobById(jobId);
      if (!job) {
        throw new ServiceError(
          'Batch job không tồn tại',
          'BATCH_JOB_NOT_FOUND',
          null,
          404,
        );
      }

      // 2. Kiểm tra status
      if (job.status === 'processing') {
        throw new ServiceError(
          'Job đang được xử lý',
          'JOB_ALREADY_PROCESSING',
          null,
          409,
        );
      }

      if (job.status === 'completed' || job.status === 'cancelled') {
        throw new ServiceError(
          `Không thể xử lý job với status: ${job.status}`,
          'INVALID_JOB_STATUS',
          null,
          400,
        );
      }

      // 3. Cập nhật status thành processing
      await EmailBatchJobModel.updateJob(jobId, {
        status: 'processing',
        started_at: new Date(),
      });

      // 4. Cấu hình batch processing
      const batchSize = options.batchSize || 20; // Số email gửi mỗi batch
      const delay = options.delay || 1000; // Delay giữa các batch (ms)

      // 5. Lấy tất cả recipients pending
      let recipients = await EmailBatchRecipientModel.getPendingByJobId(jobId);
      const total = recipients.length;

      // 6. Xử lý theo batch
      for (let i = 0; i < recipients.length; i += batchSize) {
        const batch = recipients.slice(i, i + batchSize);

        // Xử lý batch song song (parallel)
        await Promise.all(
          batch.map((recipient) => this.processRecipient(job, recipient)),
        );

        // Cập nhật progress
        const processed = Math.min(i + batchSize, total);
        const progress = total > 0 ? (processed / total) * 100 : 0;

        // Lấy stats hiện tại
        const stats = await EmailBatchRecipientModel.getStatsByJobId(jobId);

        await EmailBatchJobModel.updateJob(jobId, {
          sent_count: stats.sent || 0,
          failed_count: stats.failed || 0,
          progress_percent: progress,
        });

        // Delay giữa các batch (trừ batch cuối)
        if (i + batchSize < recipients.length) {
          await this.sleep(delay);
        }
      }

      // 7. Lấy stats cuối cùng và cập nhật job
      const finalStats = await EmailBatchRecipientModel.getStatsByJobId(jobId);

      await EmailBatchJobModel.updateJob(jobId, {
        status: 'completed',
        completed_at: new Date(),
        sent_count: finalStats.sent || 0,
        failed_count: finalStats.failed || 0,
        progress_percent: 100,
      });

      return {
        success: true,
        stats: finalStats,
      };
    } catch (error) {
      // Cập nhật job status thành failed nếu có lỗi
      try {
        await EmailBatchJobModel.updateJob(jobId, {
          status: 'failed',
          error_message: error.message,
        });
      } catch (updateError) {
        console.error('Lỗi khi cập nhật job status:', updateError);
      }

      throw error;
    }
  }

  /**
   * Xử lý từng recipient (gửi email cho 1 người)
   * @param {Object} job - Batch job object
   * @param {Object} recipient - Recipient object
   */
  async processRecipient(job, recipient) {
    try {
      // Parse variables từ JSON nếu cần
      const variables = recipient.variables
        ? typeof recipient.variables === 'string'
          ? JSON.parse(recipient.variables)
          : recipient.variables
        : {};

      // Gửi email
      await emailService.sendDynamicEmail(
        job.template_slug || job.template_id,
        recipient.recipient_email,
        variables,
      );

      // Cập nhật recipient thành sent
      await EmailBatchRecipientModel.updateRecipient(recipient.id, {
        status: 'sent',
        sent_at: new Date(),
      });
    } catch (error) {
      // Cập nhật recipient thành failed
      await EmailBatchRecipientModel.updateRecipient(recipient.id, {
        status: 'failed',
        error_message: error.message,
        retry_count: (recipient.retry_count || 0) + 1,
      });
    }
  }

  /**
   * Retry failed emails
   * @param {number} jobId - Batch job ID
   * @returns {Promise<Object>} Kết quả retry
   */
  async retryFailedEmails(jobId) {
    try {
      const job = await EmailBatchJobModel.getJobById(jobId);
      if (!job) {
        throw new ServiceError(
          'Batch job không tồn tại',
          'BATCH_JOB_NOT_FOUND',
          null,
          404,
        );
      }

      // Lấy danh sách failed recipients
      const failedRecipients = await EmailBatchRecipientModel.getFailedByJobId(
        jobId,
      );

      if (failedRecipients.length === 0) {
        return {
          success: true,
          message: 'Không có email nào cần retry',
          retried_count: 0,
        };
      }

      // Reset status của failed recipients về pending
      const recipientIds = failedRecipients.map((r) => r.id);
      await EmailBatchRecipientModel.resetStatus(recipientIds);

      // Xử lý lại batch job
      return this.processBatchJob(jobId);
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(
        'Retry failed emails thất bại',
        'RETRY_FAILED_EMAILS_FAILED',
        error.message,
        500,
      );
    }
  }

  /**
   * Lấy trạng thái batch job
   * @param {number} jobId - Batch job ID
   * @returns {Promise<Object>} Trạng thái job
   */
  async getBatchJobStatus(jobId) {
    try {
      const job = await EmailBatchJobModel.getJobById(jobId);
      if (!job) {
        throw new ServiceError(
          'Batch job không tồn tại',
          'BATCH_JOB_NOT_FOUND',
          null,
          404,
        );
      }

      // Lấy stats
      const stats = await EmailBatchRecipientModel.getStatsByJobId(jobId);

      // Parse options
      let options = {};
      if (job.options) {
        options =
          typeof job.options === 'string'
            ? JSON.parse(job.options)
            : job.options;
      }

      return {
        id: job.id,
        job_name: job.job_name,
        status: job.status,
        total_recipients: job.total_recipients,
        sent_count: stats.sent || 0,
        failed_count: stats.failed || 0,
        pending_count: stats.pending || 0,
        progress_percent: job.progress_percent,
        started_at: job.started_at,
        completed_at: job.completed_at,
        options,
      };
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(
        'Lấy trạng thái batch job thất bại',
        'GET_BATCH_JOB_STATUS_FAILED',
        error.message,
        500,
      );
    }
  }

  /**
   * Hủy batch job
   * @param {number} jobId - Batch job ID
   * @returns {Promise<Object>} Kết quả hủy
   */
  async cancelBatchJob(jobId) {
    try {
      const job = await EmailBatchJobModel.getJobById(jobId);
      if (!job) {
        throw new ServiceError(
          'Batch job không tồn tại',
          'BATCH_JOB_NOT_FOUND',
          null,
          404,
        );
      }

      if (job.status === 'completed' || job.status === 'cancelled') {
        throw new ServiceError(
          `Không thể hủy job với status: ${job.status}`,
          'INVALID_JOB_STATUS',
          null,
          400,
        );
      }

      await EmailBatchJobModel.updateJob(jobId, {
        status: 'cancelled',
      });

      return {
        success: true,
        message: 'Job đã được hủy',
      };
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(
        'Hủy batch job thất bại',
        'CANCEL_BATCH_JOB_FAILED',
        error.message,
        500,
      );
    }
  }

  /**
   * Helper: Sleep (delay)
   * @param {number} ms - Số milliseconds
   * @returns {Promise<void>}
   */
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Tạo batch job từ user IDs
   * Lấy users từ DB, map thành variables, tạo batch job
   *
   * @param {number|string} templateIdOrSlug - Template ID hoặc slug
   * @param {Array<number>} userIds - Danh sách user IDs
   * @param {Object} additionalData - Dữ liệu bổ sung (event, document, message, ...)
   * @param {Object} options - Options cho batch job
   * @returns {Promise<Object>} Batch job đã tạo
   *
   * @example
   * const job = await bulkEmailService.createBatchJobFromUserIds(
   *   1, // template ID
   *   [1, 2, 3], // user IDs
   *   { event_title: "Workshop ReactJS" }, // additional data
   *   { jobName: "Event Notification" }
   * );
   */
  async createBatchJobFromUserIds(
    templateIdOrSlug,
    userIds,
    additionalData = {},
    options = {},
  ) {
    try {
      // 1. Validate userIds
      if (!Array.isArray(userIds) || userIds.length === 0) {
        throw new ServiceError(
          'Danh sách user IDs không được rỗng',
          'INVALID_USER_IDS',
          'Phải có ít nhất 1 user ID',
          400,
        );
      }

      // 2. Validate template
      let template;
      if (
        typeof templateIdOrSlug === 'number' ||
        /^\d+$/.test(templateIdOrSlug)
      ) {
        template = await EmailTemplateModel.getTemplateById(templateIdOrSlug);
      } else {
        template = await EmailTemplateModel.getTemplateBySlug(templateIdOrSlug);
      }

      if (!template) {
        throw new ServiceError(
          'Template không tồn tại',
          'TEMPLATE_NOT_FOUND',
          null,
          404,
        );
      }

      // 3. Lấy users từ DB (1 query duy nhất - tối ưu)
      const usersData = await UserModel.getUsersForEmail(userIds);

      if (usersData.length === 0) {
        throw new ServiceError(
          'Không tìm thấy users',
          'NO_USERS_FOUND',
          'Không có user nào hợp lệ trong danh sách',
          404,
        );
      }

      // 4. Map users → recipients với variables
      const recipients = userDataMapper.createRecipientsList(
        usersData,
        additionalData,
      );

      if (recipients.length === 0) {
        throw new ServiceError(
          'Không có recipients hợp lệ',
          'NO_VALID_RECIPIENTS',
          'Tất cả users đều không có email',
          400,
        );
      }

      // 5. Tạo batch job
      return this.createBatchJob(templateIdOrSlug, recipients, options);
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(
        'Tạo batch job từ user IDs thất bại',
        'CREATE_BATCH_JOB_FROM_USER_IDS_FAILED',
        error.message,
        500,
      );
    }
  }

  /**
   * Tạo batch job từ filters
   * Lấy users theo filter, map thành variables, tạo batch job
   *
   * @param {number|string} templateIdOrSlug - Template ID hoặc slug
   * @param {Object} filters - Filters: { role_id, search, is_member_only }
   * @param {Object} additionalData - Dữ liệu bổ sung
   * @param {Object} options - Options cho batch job
   * @returns {Promise<Object>} Batch job đã tạo
   *
   * @example
   * const job = await bulkEmailService.createBatchJobFromFilters(
   *   1, // template ID
   *   { is_member_only: true, role_id: 4 }, // filters
   *   { message: "Thông báo quan trọng" }, // additional data
   *   { jobName: "Member Notification" }
   * );
   */
  async createBatchJobFromFilters(
    templateIdOrSlug,
    filters = {},
    additionalData = {},
    options = {},
  ) {
    try {
      // 1. Validate template
      let template;
      if (
        typeof templateIdOrSlug === 'number' ||
        /^\d+$/.test(templateIdOrSlug)
      ) {
        template = await EmailTemplateModel.getTemplateById(templateIdOrSlug);
      } else {
        template = await EmailTemplateModel.getTemplateBySlug(templateIdOrSlug);
      }

      if (!template) {
        throw new ServiceError(
          'Template không tồn tại',
          'TEMPLATE_NOT_FOUND',
          null,
          404,
        );
      }

      // 2. Lấy users từ DB theo filter
      const usersData = await UserModel.getUsersForEmailByFilter(filters);

      if (usersData.length === 0) {
        throw new ServiceError(
          'Không tìm thấy users',
          'NO_USERS_FOUND',
          'Không có user nào phù hợp với filter',
          404,
        );
      }

      // 3. Map users → recipients
      const recipients = userDataMapper.createRecipientsList(
        usersData,
        additionalData,
      );

      if (recipients.length === 0) {
        throw new ServiceError(
          'Không có recipients hợp lệ',
          'NO_VALID_RECIPIENTS',
          'Tất cả users đều không có email',
          400,
        );
      }

      // 4. Tạo batch job
      return this.createBatchJob(templateIdOrSlug, recipients, options);
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(
        'Tạo batch job từ filters thất bại',
        'CREATE_BATCH_JOB_FROM_FILTERS_FAILED',
        error.message,
        500,
      );
    }
  }
}

export default new BulkEmailService();
