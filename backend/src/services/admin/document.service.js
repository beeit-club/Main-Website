// services/admin/document.service.js

import { code, message } from '../../common/message/index.js';
import ServiceError from '../../error/service.error.js';
import { documentModel } from '../../models/admin/index.js';

const documentService = {
  // Lấy toàn bộ
  getAllDocuments: async (options) => {
    try {
      return await documentModel.getAllDocuments(options);
    } catch (error) {
      throw error;
    }
  },
  // Lấy danh sách đã xóa
  getDeletedDocuments: async (options) => {
    try {
      return await documentModel.getDeletedDocuments(options);
    } catch (error) {
      throw error;
    }
  },
  // Lấy 1
  getOneDocument: async (id) => {
    const document = await documentModel.getOneDocument(id);
    if (!document) {
      throw new ServiceError(
        message.Doc.DOCUMENT_NOT_FOUND,
        code.Doc.DOCUMENT_NOT_FOUND_CODE,
        'Tài liệu không tồn tại hoặc đã bị xóa',
        404,
      );
    }
    return document;
  },

  // Thêm
  createDocument: async (docData) => {
    const isExist = await documentModel.checkIsDocument(docData.slug);
    if (isExist) {
      throw new ServiceError(
        message.Doc.DOCUMENT_EXISTS,
        code.Doc.DOCUMENT_EXISTS_CODE,
        'Slug đã được sử dụng bởi một tài liệu khác',
        409,
      );
    }
    return await documentModel.createDocument(docData);
  },

  // Cập nhật
  updateDocument: async (id, docData) => {
    await documentService.getOneDocument(id); // Check existence first

    if (docData.slug) {
      const isExist = await documentModel.checkIsDocument(docData.slug, id);
      if (isExist) {
        throw new ServiceError(
          message.Doc.DOCUMENT_EXISTS,
          code.Doc.DOCUMENT_EXISTS_CODE,
          'Slug đã được sử dụng bởi một tài liệu khác',
          409,
        );
      }
    }
    return await documentModel.updateDocument(id, docData);
  },

  // Xóa mềm
  deleteDocument: async (id) => {
    await documentService.getOneDocument(id); // Check existence
    return await documentModel.deleteDocument(id);
  },

  // Gán người dùng
  assignUsersToDocument: async (documentId, userIds) => {
    await documentService.getOneDocument(documentId); // Check if document exists
    // Bạn có thể thêm logic check xem userIds có tồn tại trong bảng users không ở đây
    return await documentModel.assignUsers(documentId, userIds);
  },

  // Xóa người dùng
  removeUserFromDocument: async (documentId, userId) => {
    const affectedRows = await documentModel.removeUser(documentId, userId);
    if (affectedRows === 0) {
      throw new ServiceError(
        message.Doc.DOCUMENT_USER_NOT_ASSIGNED,
        code.Doc.DOCUMENT_REMOVAL_FAILED_CODE,
        'Người dùng không được gán cho tài liệu này từ trước',
        404,
      );
    }
    return affectedRows;
  },
  // Khôi phục
  restoreDocument: async (id) => {
    // Kiểm tra xem tài liệu có tồn tại và đã bị xóa chưa
    const document = await documentModel.getOneDeletedDocument(id);
    if (!document) {
      throw new ServiceError(
        message.Doc.DOCUMENT_NOT_FOUND,
        code.Doc.DOCUMENT_NOT_FOUND_CODE,
        'Không tìm thấy tài liệu đã bị xóa với ID này',
        404,
      );
    }
    return await documentModel.restoreDocument(id);
  },
};

export default documentService;
