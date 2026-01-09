// controllers/admin/systemEmailMapping.controller.js
import SystemEmailMappingModel from '../../models/admin/systemEmailMapping.model.js';
import emailTemplateService from '../../services/admin/emailTemplate.service.js';
import { utils } from '../../utils/index.js';
import asyncWrapper from '../../middlewares/error.handler.js';
import { PaginationSchema } from '../../validation/common/common.schema.js';

const SystemEmailMappingController = {
  // Lấy danh sách tất cả các mapping
  getAllMappings: asyncWrapper(async (req, res) => {
    const query = PaginationSchema.cast(req.query);
    const validQuery = await PaginationSchema.validate(query, {
      stripUnknown: true,
    });
    const mappings = await SystemEmailMappingModel.getAllMappings(validQuery);
    return utils.success(res, 'Lấy danh sách ánh xạ thành công', mappings);
  }),

  // Cập nhật một mapping
  updateMapping: asyncWrapper(async (req, res) => {
    const { actionKey } = req.params;
    const { templateId } = req.body;

    // Validate templateId if provided
    if (templateId) {
      await emailTemplateService.getTemplateById(templateId); // Throws if not found
    }

    const result = await SystemEmailMappingModel.updateMapping(actionKey, templateId);
    return utils.success(res, 'Cập nhật ánh xạ thành công', { updated: result.changedRows });
  }),
};

export default SystemEmailMappingController;
