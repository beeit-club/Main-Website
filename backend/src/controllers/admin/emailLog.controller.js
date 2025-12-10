// controllers/admin/emailLog.controller.js

import asyncWrapper from '../../middlewares/error.handler.js';
import EmailLogModel from '../../models/admin/emailLog.model.js';
import { utils } from '../../utils/index.js';
import {
  PaginationSchema,
  params,
} from '../../validation/common/common.schema.js';

const emailLogController = {
  // Lấy danh sách logs
  getAllLogs: asyncWrapper(async (req, res) => {
    const query = PaginationSchema.cast(req.query);
    const validQuery = await PaginationSchema.validate(query, {
      stripUnknown: true,
    });

    const { template_id, status, recipient_email, date_from, date_to } =
      req.query;
    const result = await EmailLogModel.getAllLogs({
      ...validQuery,
      template_id,
      status,
      recipient_email,
      date_from,
      date_to,
    });

    return utils.success(res, 'Lấy danh sách email logs thành công', result);
  }),

  // Lấy log theo ID
  getLogById: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params);
    const { id } = req.params;

    const log = await EmailLogModel.getLogById(id);
    if (!log) {
      return utils.error(res, 'Log không tồn tại', 404);
    }

    // Parse JSON fields
    if (log.variables_used && typeof log.variables_used === 'string') {
      log.variables_used = JSON.parse(log.variables_used);
    }

    return utils.success(res, 'Lấy email log thành công', { log });
  }),

  // Lấy thống kê
  getStats: asyncWrapper(async (req, res) => {
    const { template_id, date_from, date_to } = req.query;

    const stats = await EmailLogModel.getStats({
      template_id,
      date_from,
      date_to,
    });

    return utils.success(res, 'Lấy thống kê thành công', { stats });
  }),
};

export default emailLogController;

