// controllers/admin/emailTemplate.controller.js

import asyncWrapper from '../../middlewares/error.handler.js';
import emailTemplateService from '../../services/admin/emailTemplate.service.js';
import { utils } from '../../utils/index.js';
import EmailTemplateSchema from '../../validation/admin/emailTemplate.validation.js';
import {
  PaginationSchema,
  params,
} from '../../validation/common/common.schema.js';

const emailTemplateController = {
  // Lấy danh sách templates
  getAllTemplates: asyncWrapper(async (req, res) => {
    const query = PaginationSchema.cast(req.query);
    const validQuery = await PaginationSchema.validate(query, {
      stripUnknown: true,
    });

    const { category, is_active, q } = req.query;
    const result = await emailTemplateService.getAllTemplates({
      ...validQuery,
      category,
      is_active,
      q,
    });

    return utils.success(res, 'Lấy danh sách templates thành công', result);
  }),

  // Lấy template theo ID
  getTemplateById: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params);
    const { id } = req.params;

    const template = await emailTemplateService.getTemplateById(id);
    return utils.success(res, 'Lấy template thành công', { template });
  }),

  // Tạo template mới
  createTemplate: asyncWrapper(async (req, res) => {
    await EmailTemplateSchema.create.validate(req.body, { abortEarly: false });

    const userId = req.user?.id;
    const template = await emailTemplateService.createTemplate(
      req.body,
      userId,
    );

    return utils.success(res, 'Tạo template thành công', { template });
  }),

  // Cập nhật template
  updateTemplate: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params);
    await EmailTemplateSchema.update.validate(req.body, { abortEarly: false });

    const { id } = req.params;
    const userId = req.user?.id;
    const template = await emailTemplateService.updateTemplate(
      id,
      req.body,
      userId,
    );

    return utils.success(res, 'Cập nhật template thành công', { template });
  }),

  // Xóa template
  deleteTemplate: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params);
    const { id } = req.params;

    await emailTemplateService.deleteTemplate(id);
    return utils.success(res, 'Xóa template thành công');
  }),

  // Preview template
  previewTemplate: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params);
    await EmailTemplateSchema.preview.validate(req.body, {
      abortEarly: false,
    });

    const { id } = req.params;
    const { variables } = req.body;

    const preview = await emailTemplateService.previewTemplate(id, variables);
    return utils.success(res, 'Preview template thành công', { preview });
  }),

  // Test gửi email
  testSendTemplate: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params);
    await EmailTemplateSchema.testSend.validate(req.body, {
      abortEarly: false,
    });

    const { id } = req.params;
    const { recipient_email, variables } = req.body;

    const result = await emailTemplateService.testSendTemplate(
      id,
      recipient_email,
      variables,
    );
    return utils.success(res, 'Gửi email test thành công', { result });
  }),

  // Lấy danh sách categories
  getCategories: asyncWrapper(async (req, res) => {
    const categories = await emailTemplateService.getCategories();
    return utils.success(res, 'Lấy danh sách categories thành công', {
      categories,
    });
  }),
};

export default emailTemplateController;

