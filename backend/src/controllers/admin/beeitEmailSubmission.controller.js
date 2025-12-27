// controllers/admin/beeitEmailSubmission.controller.js

import asyncWrapper from '../../middlewares/error.handler.js';
import { beeitEmailSubmissionService } from '../../services/admin/index.js';
import { utils } from '../../utils/index.js';
import BeeitEmailSubmissionSchema from '../../validation/admin/beeitEmailSubmission.validation.js';
import {
  PaginationSchema,
  params,
} from '../../validation/common/common.schema.js';

const beeitEmailSubmissionController = {
  // Lấy tất cả submissions (Admin)
  getSubmissions: asyncWrapper(async (req, res) => {
    const query = PaginationSchema.cast(req.query);
    const valid = await PaginationSchema.validate(query, {
      stripUnknown: true,
    });

    const { email, status } = req.query;
    const submissions = await beeitEmailSubmissionService.getAllSubmissions({
      ...valid,
      filters: { email, status },
    });
    utils.success(res, 'Lấy danh sách Email submissions thành công', submissions);
  }),

  // Lấy submission theo ID
  getSubmissionById: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;

    const submission = await beeitEmailSubmissionService.getSubmissionById(id);
    utils.success(res, 'Lấy thông tin Email submission thành công', { submission });
  }),

  // Tạo submission mới (Public - từ form)
  createSubmission: asyncWrapper(async (req, res) => {
    const valid = await BeeitEmailSubmissionSchema.create.validate(req.body, {
      stripUnknown: true,
      abortEarly: false,
    });

    const result = await beeitEmailSubmissionService.createSubmission(valid.email);
    utils.success(res, 'Gửi email thành công', { submission: result });
  }),

  // Cập nhật submission
  updateSubmission: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;

    const valid = await BeeitEmailSubmissionSchema.update.validate(req.body, {
      stripUnknown: true,
      abortEarly: false,
    });

    await beeitEmailSubmissionService.updateSubmission(id, valid);
    const submission = await beeitEmailSubmissionService.getSubmissionById(id);
    utils.success(res, 'Cập nhật Email submission thành công', { submission });
  }),

  // Mark as processed
  markAsProcessed: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;
    const { notes } = req.body;

    await beeitEmailSubmissionService.markAsProcessed(id, notes);
    const submission = await beeitEmailSubmissionService.getSubmissionById(id);
    utils.success(res, 'Đánh dấu đã xử lý thành công', { submission });
  }),

  // Mark as archived
  markAsArchived: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;

    await beeitEmailSubmissionService.markAsArchived(id);
    const submission = await beeitEmailSubmissionService.getSubmissionById(id);
    utils.success(res, 'Đánh dấu đã lưu trữ thành công', { submission });
  }),

  // Get statistics
  getStatistics: asyncWrapper(async (req, res) => {
    const stats = await beeitEmailSubmissionService.getStatistics();
    utils.success(res, 'Lấy thống kê Email submissions thành công', { stats });
  }),
};

export default beeitEmailSubmissionController;

