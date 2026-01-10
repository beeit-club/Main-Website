// controllers/admin/bulkEmail.controller.js

import asyncWrapper from '../../middlewares/error.handler.js';
import bulkEmailService from '../../services/admin/bulkEmail.service.js';
import EmailBatchJobModel from '../../models/admin/emailBatchJob.model.js';
import EmailBatchRecipientModel from '../../models/admin/emailBatchRecipient.model.js';
import { utils } from '../../utils/index.js';
import BulkEmailSchema from '../../validation/admin/bulkEmail.validation.js';
import {
  PaginationSchema,
  params,
} from '../../validation/common/common.schema.js';

const bulkEmailController = {
  // Gửi bulk email (manual recipients)
  sendBulkEmail: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params);
    await BulkEmailSchema.sendBulk.validate(req.body, { abortEarly: false });

    const { id } = req.params;
    const { recipients, options } = req.body;
    const userId = req.user?.id;

    // Tạo batch job
    const job = await bulkEmailService.createBatchJob(id, recipients, {
      ...options,
      createdBy: userId,
    });

    // Process job (async - không block response)
    bulkEmailService.processBatchJob(job.id, options).catch((error) => {
      console.error('Lỗi khi process batch job:', error);
    });

    return utils.success(res, 'Đã tạo batch job và bắt đầu xử lý', {
      job_id: job.id,
      status: 'pending',
      total_recipients: job.total_recipients,
    });
  }),

  // Gửi bulk email từ user IDs
  sendBulkEmailFromUsers: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params);
    await BulkEmailSchema.sendBulkFromUsers.validate(req.body, {
      abortEarly: false,
    });

    const { id } = req.params;
    const { user_ids, additional_data = {}, options = {} } = req.body;
    const userId = req.user?.id;

    // Tạo batch job từ user IDs
    const job = await bulkEmailService.createBatchJobFromUserIds(
      id,
      user_ids,
      additional_data,
      {
        ...options,
        createdBy: userId,
      },
    );

    // Process job (async - không block response)
    bulkEmailService.processBatchJob(job.id, options).catch((error) => {
      console.error('Lỗi khi process batch job:', error);
    });

    return utils.success(res, 'Đã tạo batch job từ user IDs và bắt đầu xử lý', {
      job_id: job.id,
      status: 'pending',
      total_recipients: job.total_recipients,
    });
  }),

  // Gửi bulk email từ filters
  sendBulkEmailFromFilters: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params);
    await BulkEmailSchema.sendBulkFromFilters.validate(req.body, {
      abortEarly: false,
    });

    const { id } = req.params;
    const { filters = {}, additional_data = {}, options = {} } = req.body;
    const userId = req.user?.id;

    // Tạo batch job từ filters
    const job = await bulkEmailService.createBatchJobFromFilters(
      id,
      filters,
      additional_data,
      {
        ...options,
        createdBy: userId,
      },
    );

    // Process job (async - không block response)
    bulkEmailService.processBatchJob(job.id, options).catch((error) => {
      console.error('Lỗi khi process batch job:', error);
    });

    return utils.success(res, 'Đã tạo batch job từ filters và bắt đầu xử lý', {
      job_id: job.id,
      status: 'pending',
      total_recipients: job.total_recipients,
    });
  }),

  // Lấy danh sách batch jobs
  getAllBatchJobs: asyncWrapper(async (req, res) => {
    const query = PaginationSchema.cast(req.query);
    const validQuery = await PaginationSchema.validate(query, {
      stripUnknown: true,
    });

    const { status, template_id, q } = req.query;
    const result = await EmailBatchJobModel.getAllJobs({
      ...validQuery,
      status,
      template_id,
      q,
    });

    return utils.success(res, 'Lấy danh sách batch jobs thành công', result);
  }),

  // Lấy batch job theo ID
  getBatchJobById: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params);
    const { id } = req.params;

    const status = await bulkEmailService.getBatchJobStatus(id);
    return utils.success(res, 'Lấy batch job thành công', { job: status });
  }),

  // Lấy danh sách recipients của batch job
  getBatchJobRecipients: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params);
    const query = PaginationSchema.cast(req.query);
    const validQuery = await PaginationSchema.validate(query, {
      stripUnknown: true,
    });

    const { id } = req.params;
    const { status } = req.query;

    const result = await EmailBatchRecipientModel.getRecipientsByJobId(id, {
      ...validQuery,
      status,
    });

    return utils.success(res, 'Lấy danh sách recipients thành công', result);
  }),

  // Retry failed emails
  retryFailedEmails: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params);
    const { id } = req.params;

    const result = await bulkEmailService.retryFailedEmails(id);
    return utils.success(res, 'Đã bắt đầu retry failed emails', { result });
  }),

  // Cancel batch job
  cancelBatchJob: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params);
    const { id } = req.params;

    const result = await bulkEmailService.cancelBatchJob(id);
    return utils.success(res, 'Đã hủy batch job', { result });
  }),
};

export default bulkEmailController;
