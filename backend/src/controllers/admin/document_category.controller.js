import asyncWrapper from '../../middlewares/error.handler.js';
import documentCategoryService from '../../services/admin/document_category.service.js';
import { slugify } from '../../utils/function.js';
import { success } from '../../utils/response.js';
import DocumentCategorySchema from '../../validation/admin/document_category.validation.js';
import {
  PaginationSchema,
  params,
} from '../../validation/common/common.schema.js';
import { message } from '../../common/message/index.js';

const documentCategoryController = {
  getAll: asyncWrapper(async (req, res) => {
    const query = PaginationSchema.cast(req.query);
    const { name } = req.query;
    const data = await documentCategoryService.getAll({
      ...query,
      filters: { name },
    });
    success(res, message.DOCCA.DOC_CATEGORY_GET_SUCCESS, data);
  }),

  getOne: asyncWrapper(async (req, res) => {
    const { id } = await params.id.validate(req.params, { abortEarly: false });
    const data = await documentCategoryService.getOne(id);
    success(res, message.DOCCA.DOC_CATEGORY_GET_DETAIL_SUCCESS, data);
  }),

  create: asyncWrapper(async (req, res) => {
    const { name, parent_id } = await DocumentCategorySchema.create.validate(
      req.body,
      { abortEarly: false },
    );
    const slug = slugify(name);
    const dataToCreate = {
      name,
      slug,
      parent_id: parent_id ?? null,
      created_by: null,
    };
    const result = await documentCategoryService.create(dataToCreate);
    success(res, message.DOCCA.DOC_CATEGORY_CREATE_SUCCESS, {
      id: result.insertId,
      name,
      slug,
    });
  }),

  update: asyncWrapper(async (req, res) => {
    const { id } = await params.id.validate(req.params, { abortEarly: false });
    const body = await DocumentCategorySchema.update.validate(req.body, {
      abortEarly: false,
    });

    const dataToUpdate = { ...body, updated_by: null };
    if (body.name) {
      dataToUpdate.slug = slugify(body.name);
    }

    await documentCategoryService.update(id, dataToUpdate);
    success(res, message.DOCCA.DOC_CATEGORY_UPDATE_SUCCESS);
  }),

  softDelete: asyncWrapper(async (req, res) => {
    const { id } = await params.id.validate(req.params, { abortEarly: false });
    await documentCategoryService.softDelete(id);
    success(res, message.DOCCA.DOC_CATEGORY_DELETE_SUCCESS);
  }),

  restore: asyncWrapper(async (req, res) => {
    const { id } = await params.id.validate(req.params, { abortEarly: false });
    await documentCategoryService.restore(id);
    success(res, 'Khôi phục danh mục tài liệu thành công');
  }),
};
export default documentCategoryController;
