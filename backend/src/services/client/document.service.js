// src/services/client/document.service.js
import { documentModel, DocumentCategoryModel } from '../../models/admin/index.js';
import { AuthModel } from '../../models/auth/index.js'; // Import AuthModel
import ServiceError from '../../error/service.error.js';

const documentClientService = {
  // ... (getCategories remains the same)
  getCategories: async () => {
    try {
      // Dùng hàm có sẵn của model admin
      return await DocumentCategoryModel.getAll();
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh sách tài liệu công khai
  getDocuments: async (options) => {
    try {
      // Ép status = 1 và access_level = public
      const filters = { 
        ...options.filters, 
        status: 1, 
        access_level: 'public' 
      };
      
      return await documentModel.getAllDocuments({ ...options, filters });
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh sách tài liệu dành cho tôi (Member + Restricted)
  getMyDocuments: async (options) => {
    try {
      let { user } = options;
      if (!user) {
        throw new ServiceError('Bạn cần đăng nhập', 'LOGIN_REQUIRED', null, 401);
      }

      // Fallback nếu token cũ thiếu role_id
      if (user.id && !user.role_id) {
        const dbUser = await AuthModel.getUserById(user.id);
        if (dbUser) {
          user = { ...user, role_id: dbUser.role_id };
        }
      }

      // Ép status = 1 và mode là private (sẽ xử lý trong model)
      const filters = { 
        ...options.filters, 
        status: 1,
        scope: 'private',
        current_user_id: user.id,
        current_user_role_id: user.role_id
      };

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

      // 1. Check Public
      if (document.access_level === 'public') {
        return document;
      }

      // Yêu cầu đăng nhập cho các cấp độ còn lại
      if (!user) {
        throw new ServiceError('Bạn cần đăng nhập để xem tài liệu này', 'LOGIN_REQUIRED', null, 401);
      }

      // Fallback nếu token cũ thiếu role_id
      if (user.id && !user.role_id) {
        const dbUser = await AuthModel.getUserById(user.id);
        if (dbUser) {
          user = { ...user, role_id: dbUser.role_id };
        }
      }

      // 2. Check Member Only
      if (document.access_level === 'member_only') {
        // Role 1: Super Admin, 2: Admin, 3: Moderator, 4: Member
        if (user.role_id > 4) {
          throw new ServiceError('Tài liệu chỉ dành cho thành viên chính thức', 'MEMBER_REQUIRED', null, 403);
        }
        return document;
      }

      // 3. Check Restricted (Gán riêng biệt)
      if (document.access_level === 'restricted') {
        // Admin trở lên (Role 1, 2) luôn xem được
        if (user.role_id <= 2) return document;

        // Check xem user có trong danh sách được gán không
        const isAssigned = await documentModel.checkUserAssignment(document.id, user.id);
        if (!isAssigned) {
          throw new ServiceError('Bạn không có quyền truy cập tài liệu này', 'ACCESS_DENIED', null, 403);
        }
        return document;
      }

      return document;
    } catch (error) {
      throw error;
    }
  }
};

export default documentClientService;
