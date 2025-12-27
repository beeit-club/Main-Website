// controllers/admin/beeitStat.controller.js

import asyncWrapper from '../../middlewares/error.handler.js';
import { beeitStatService } from '../../services/admin/index.js';
import { utils } from '../../utils/index.js';
import BeeitStatSchema from '../../validation/admin/beeitStat.validation.js';
import {
  PaginationSchema,
  params,
} from '../../validation/common/common.schema.js';

const beeitStatController = {
  // Lấy tất cả stats
  getStats: asyncWrapper(async (req, res) => {
    const query = PaginationSchema.cast(req.query);
    const valid = await PaginationSchema.validate(query, {
      stripUnknown: true,
    });

    const stats = await beeitStatService.getAllStats(valid);
    utils.success(res, 'Lấy danh sách Stats thành công', stats);
  }),

  // Lấy stat theo ID
  getStatById: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;

    const stat = await beeitStatService.getStatById(id);
    utils.success(res, 'Lấy thông tin Stat thành công', { stat });
  }),

  // Tạo stat mới
  createStat: asyncWrapper(async (req, res) => {
    const valid = await BeeitStatSchema.create.validate(req.body, {
      stripUnknown: true,
      abortEarly: false,
    });

    const result = await beeitStatService.createStat(valid);
    utils.success(res, 'Tạo Stat thành công', { stat: result });
  }),

  // Cập nhật stat
  updateStat: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;

    const valid = await BeeitStatSchema.update.validate(req.body, {
      stripUnknown: true,
      abortEarly: false,
    });

    await beeitStatService.updateStat(id, valid);
    const stat = await beeitStatService.getStatById(id);
    utils.success(res, 'Cập nhật Stat thành công', { stat });
  }),

  // Xóa stat
  deleteStat: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;

    await beeitStatService.deleteStat(id);
    utils.success(res, 'Xóa Stat thành công');
  }),
};

export default beeitStatController;

