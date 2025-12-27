// controllers/admin/beeitLeader.controller.js

import asyncWrapper from '../../middlewares/error.handler.js';
import { beeitLeaderService } from '../../services/admin/index.js';
import { utils } from '../../utils/index.js';
import BeeitLeaderSchema from '../../validation/admin/beeitLeader.validation.js';
import {
  PaginationSchema,
  params,
} from '../../validation/common/common.schema.js';

const beeitLeaderController = {
  // Lấy tất cả leaders
  getLeaders: asyncWrapper(async (req, res) => {
    const query = PaginationSchema.cast(req.query);
    const valid = await PaginationSchema.validate(query, {
      stripUnknown: true,
    });

    const { status, role } = req.query;
    const leaders = await beeitLeaderService.getAllLeaders({
      ...valid,
      filters: { status, role },
    });
    utils.success(res, 'Lấy danh sách Leaders thành công', leaders);
  }),

  // Lấy leader theo ID
  getLeaderById: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;

    const leader = await beeitLeaderService.getLeaderById(id);
    utils.success(res, 'Lấy thông tin Leader thành công', { leader });
  }),

  // Tạo leader mới
  createLeader: asyncWrapper(async (req, res) => {
    const valid = await BeeitLeaderSchema.create.validate(req.body, {
      stripUnknown: true,
      abortEarly: false,
    });

    const result = await beeitLeaderService.createLeader(valid);
    utils.success(res, 'Tạo Leader thành công', { leader: result });
  }),

  // Cập nhật leader
  updateLeader: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;

    const valid = await BeeitLeaderSchema.update.validate(req.body, {
      stripUnknown: true,
      abortEarly: false,
    });

    await beeitLeaderService.updateLeader(id, valid);
    const leader = await beeitLeaderService.getLeaderById(id);
    utils.success(res, 'Cập nhật Leader thành công', { leader });
  }),

  // Xóa leader
  deleteLeader: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;

    await beeitLeaderService.deleteLeader(id);
    utils.success(res, 'Xóa Leader thành công');
  }),

  // Cập nhật display order
  updateDisplayOrder: asyncWrapper(async (req, res) => {
    const valid = await BeeitLeaderSchema.updateOrder.validate(req.body, {
      stripUnknown: true,
      abortEarly: false,
    });

    await beeitLeaderService.updateDisplayOrder(valid.leaders);
    utils.success(res, 'Cập nhật thứ tự Leaders thành công');
  }),
};

export default beeitLeaderController;

