// src/controllers/client/document.controller.js
import asyncWrapper from '../../middlewares/error.handler.js';
import documentClientService from '../../services/client/document.service.js';
import { utils } from '../../utils/index.js';
import { PaginationSchema } from '../../validation/common/common.schema.js';

const documentController = {
  getCategories: asyncWrapper(async (req, res) => {
    const categories = await documentClientService.getCategories();
    utils.success(res, 'Lấy danh sách danh mục thành công', categories);
  }),

  getDocuments: asyncWrapper(async (req, res) => {
    const query = PaginationSchema.cast(req.query);
    const validQuery = await PaginationSchema.validate(query, {
      stripUnknown: true,
    });

    const result = await documentClientService.getDocuments({
      ...validQuery,
      filters: req.query,
    });
    utils.success(res, 'Lấy danh sách tài liệu thành công', result);
  }),

  getDocumentBySlug: asyncWrapper(async (req, res) => {
    const { slug } = req.params;
    // req.user có thể undefined nếu chưa đăng nhập (middleware verifyTokenOptional)
    const document = await documentClientService.getDocumentBySlug(slug, req.user);
    utils.success(res, 'Lấy chi tiết tài liệu thành công', document);
  }),
};

export default documentController;
