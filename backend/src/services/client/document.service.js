// src/services/client/document.service.js
import { documentModel, DocumentCategoryModel } from '../../models/admin/index.js';
import ServiceError from '../../error/service.error.js';

const documentClientService = {
  // Lấy danh sách danh mục
  getCategories: async () => {
    try {
      // Dùng hàm có sẵn của model admin
      return await DocumentCategoryModel.getAll();
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh sách tài liệu
  getDocuments: async (options) => {
    try {
      // Ép status = 1 (Công khai)
      const filters = { ...options.filters, status: 1 };
      // Sử dụng model admin nhưng filter theo status
      return await documentModel.getAllDocuments({ ...options, filters });
    } catch (error) {
      throw error;
    }
  },

  // Lấy chi tiết tài liệu (để check quyền nếu cần)
  getDocumentBySlug: async (slug, user) => {
    try {
      const document = await documentModel.getDocumentBySlug(slug);
      
      if (!document || document.status !== 1) {
        throw new ServiceError('Tài liệu không tồn tại', 'DOCUMENT_NOT_FOUND', null, 404);
      }

      // Check quyền truy cập
      if (document.access_level === 'member_only') {
        if (!user) {
          throw new ServiceError('Bạn cần đăng nhập để xem tài liệu này', 'LOGIN_REQUIRED', null, 401);
        }
        // Giả sử role_id 4 là Member, 1,2,3 là Admin/Leader
        if (user.role_id > 4) {
          throw new ServiceError('Tài liệu chỉ dành cho thành viên chính thức', 'MEMBER_REQUIRED', null, 403);
        }
      }

      // Tăng lượt xem/tải
      // await documentModel.incrementDownloadCount(document.id); // Cần thêm hàm này vào model sau

      return document;
    } catch (error) {
      throw error;
    }
  }
};

export default documentClientService;
