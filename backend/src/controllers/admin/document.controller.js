// controllers/admin/document.controller.js

import asyncWrapper from '../../middlewares/error.handler.js';
import { documentService } from '../../services/admin/index.js';
import { slugify } from '../../utils/function.js';
import { utils } from '../../utils/index.js';
import DocumentSchema from '../../validation/admin/document.validation.js';
import {
  PaginationSchema,
  params,
} from '../../validation/common/common.schema.js';
import { message } from '../../common/message/index.js';

const documentController = {
  // Lấy toàn bộ tài liệu
  getDocuments: asyncWrapper(async (req, res) => {
    const query = PaginationSchema.cast(req.query);
    const valid = await PaginationSchema.validate(query, {
      stripUnknown: true,
    });
    const { title, category_id } = req.query;

    const documents = await documentService.getAllDocuments({
      ...valid,
      filters: { title, category_id },
    });
    utils.success(res, message.Doc.DOCUMENT_GET_SUCCESS, documents);
  }),
  getDeletedDocuments: asyncWrapper(async (req, res) => {
    const query = PaginationSchema.cast(req.query);
    const valid = await PaginationSchema.validate(query, {
      stripUnknown: true,
    });

    const documents = await documentService.getDeletedDocuments(valid);
    utils.success(res, 'Lấy danh sách tài liệu đã xóa thành công', {
      documents,
    });
  }),

  // Lấy 1 tài liệu
  getDocumentById: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;
    const document = await documentService.getOneDocument(id);
    utils.success(res, message.Doc.DOCUMENT_GET_DETAIL_SUCCESS, { document });
  }),

  // Thêm tài liệu
  createDocument: asyncWrapper(async (req, res) => {
    await DocumentSchema.create.validate(req.body, { abortEarly: false });
    const { title, ...rest } = req.body;
    const slug = slugify(title);

    const docData = { title, slug, ...rest };
    const document = await documentService.createDocument(docData);

    utils.success(res, message.Doc.DOCUMENT_CREATE_SUCCESS, {
      id: document.insertId,
      title,
      slug,
    });
  }),

  // Cập nhật tài liệu
  updateDocument: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    await DocumentSchema.update.validate(req.body, { abortEarly: false });

    const { id } = req.params;
    const { title, ...rest } = req.body;

    const docData = { ...rest };
    if (title) {
      docData.title = title;
      docData.slug = slugify(title);
    }

    await documentService.updateDocument(id, docData);
    utils.success(res, message.Doc.DOCUMENT_UPDATE_SUCCESS);
  }),

  // Xóa mềm tài liệu
  deleteDocument: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;
    await documentService.deleteDocument(id);
    utils.success(res, message.Doc.DOCUMENT_DELETE_SUCCESS);
  }),

  // Gán người dùng vào tài liệu
  assignUsersToDocument: asyncWrapper(async (req, res) => {
    const { id } = await params.id.validate(req.params, { abortEarly: false });
    const { userIds } = await DocumentSchema.assignUsers.validate(req.body, {
      abortEarly: false,
    });

    await documentService.assignUsersToDocument(id, userIds);
    utils.success(res, message.Doc.DOCUMENT_ASSIGN_USERS_SUCCESS);
  }),

  // Xóa người dùng khỏi tài liệu
  removeUserFromDocument: asyncWrapper(async (req, res) => {
    const { id } = await params.id.validate(req.params); // Giả sử bạn có schema này
    const { userId } = req.params;
    await documentService.removeUserFromDocument(id, userId);
    utils.success(res, message.Doc.DOCUMENT_REMOVE_USER_SUCCESS);
  }),
  // Khôi phục tài liệu
  restoreDocument: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;
    await documentService.restoreDocument(id);
    utils.success(res, 'Khôi phục tài liệu thành công');
  }),
};

export default documentController;
