// controllers/admin/beeitFooter.controller.js

import asyncWrapper from '../../middlewares/error.handler.js';
import { beeitFooterService } from '../../services/admin/index.js';
import { utils } from '../../utils/index.js';
import BeeitFooterSchema from '../../validation/admin/beeitFooter.validation.js';
import { params } from '../../validation/common/common.schema.js';

const beeitFooterController = {
  // Lấy Footer Settings
  getFooterSettings: asyncWrapper(async (req, res) => {
    const settings = await beeitFooterService.getFooterSettings();
    utils.success(res, 'Lấy Footer settings thành công', { settings });
  }),

  // Cập nhật Footer Settings
  updateFooterSettings: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;

    const valid = await BeeitFooterSchema.update.validate(req.body, {
      stripUnknown: true,
      abortEarly: false,
    });

    await beeitFooterService.updateFooterSettings(id, valid);
    const settings = await beeitFooterService.getFooterSettings();
    utils.success(res, 'Cập nhật Footer settings thành công', { settings });
  }),
};

export default beeitFooterController;

