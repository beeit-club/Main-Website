// controllers/admin/beeitAchievement.controller.js

import asyncWrapper from '../../middlewares/error.handler.js';
import { beeitAchievementService } from '../../services/admin/index.js';
import { utils } from '../../utils/index.js';
import BeeitAchievementSchema from '../../validation/admin/beeitAchievement.validation.js';
import {
  PaginationSchema,
  params,
} from '../../validation/common/common.schema.js';

const beeitAchievementController = {
  // Lấy tất cả achievements
  getAchievements: asyncWrapper(async (req, res) => {
    const query = PaginationSchema.cast(req.query);
    const valid = await PaginationSchema.validate(query, {
      stripUnknown: true,
    });

    const { status, row_number, year } = req.query;
    const achievements = await beeitAchievementService.getAllAchievements({
      ...valid,
      filters: { status, row_number, year },
    });
    utils.success(res, 'Lấy danh sách Achievements thành công', achievements);
  }),

  // Lấy achievement theo ID
  getAchievementById: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;

    const achievement = await beeitAchievementService.getAchievementById(id);
    utils.success(res, 'Lấy thông tin Achievement thành công', { achievement });
  }),

  // Tạo achievement mới
  createAchievement: asyncWrapper(async (req, res) => {
    const valid = await BeeitAchievementSchema.create.validate(req.body, {
      stripUnknown: true,
      abortEarly: false,
    });

    const result = await beeitAchievementService.createAchievement(valid);
    utils.success(res, 'Tạo Achievement thành công', { achievement: result });
  }),

  // Cập nhật achievement
  updateAchievement: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;

    const valid = await BeeitAchievementSchema.update.validate(req.body, {
      stripUnknown: true,
      abortEarly: false,
    });

    await beeitAchievementService.updateAchievement(id, valid);
    const achievement = await beeitAchievementService.getAchievementById(id);
    utils.success(res, 'Cập nhật Achievement thành công', { achievement });
  }),

  // Xóa achievement
  deleteAchievement: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;

    await beeitAchievementService.deleteAchievement(id);
    utils.success(res, 'Xóa Achievement thành công');
  }),

  // Cập nhật display order
  updateDisplayOrder: asyncWrapper(async (req, res) => {
    const valid = await BeeitAchievementSchema.updateOrder.validate(req.body, {
      stripUnknown: true,
      abortEarly: false,
    });

    await beeitAchievementService.updateDisplayOrder(valid.achievements);
    utils.success(res, 'Cập nhật thứ tự Achievements thành công');
  }),
};

export default beeitAchievementController;

