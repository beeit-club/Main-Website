import axiosClient from "../api"; // Giả định đường dẫn

const BASE_PATH = "admin/documents";

export const documentServices = {
  /**
   * Lấy danh sách tài liệu (có filter)
   * GET /admin/documents
   * @param {object} options - { page, limit, search (title), category_id }
   */
  getAllDocuments: async (options = {}) => {
    try {
      const params = new URLSearchParams();
      if (options.page) params.append("page", options.page);
      if (options.limit) params.append("limit", options.limit);
      if (options.search) params.append("title", options.search); // BE dùng 'title'
      if (options.category_id)
        params.append("category_id", options.category_id);

      // (BE chưa hỗ trợ sort, nên không thêm)

      const res = await axiosClient.get(BASE_PATH, { params });
      return res;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * Lấy danh sách tài liệu ĐÃ XÓA
   * GET /admin/documents/deleted
   */
  getDeletedDocuments: async (options = {}) => {
    try {
      const params = new URLSearchParams();
      if (options.page) params.append("page", options.page);
      if (options.limit) params.append("limit", options.limit);

      const res = await axiosClient.get(`${BASE_PATH}/deleted`, { params });
      return res;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * Lấy tài liệu theo ID
   * GET /admin/documents/:id
   */
  getOneDocument: async (id) => {
    try {
      const res = await axiosClient.get(`${BASE_PATH}/${id}`);
      return res; // Giả định trả về { ..., assigned_users: [] }
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * Tạo tài liệu mới
   * POST /admin/documents
   */
  createDocument: async (data) => {
    try {
      // BE dùng PUT/POST nên gửi JSON
      const res = await axiosClient.post(BASE_PATH, data);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * Cập nhật tài liệu (BE dùng PUT)
   * PUT /admin/documents/:id
   */
  updateDocument: async (id, data) => {
    try {
      const res = await axiosClient.put(`${BASE_PATH}/${id}`, data);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * Xóa tài liệu (soft delete)
   * DELETE /admin/documents/:id
   */
  deleteDocument: async (id) => {
    try {
      const res = await axiosClient.delete(`${BASE_PATH}/${id}`);
      return res;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * Khôi phục tài liệu đã xóa
   * PATCH /admin/documents/:id/restore
   */
  restoreDocument: async (id) => {
    try {
      const res = await axiosClient.patch(`${BASE_PATH}/${id}/restore`);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * Gán quyền truy cập cho một hoặc nhiều người dùng
   * POST /admin/documents/:id/assign-users
   * @param {string|number} id - ID tài liệu
   * @param {Array<number>} userIds - Mảng các ID người dùng [1, 2, 3]
   */
  assignUsersToDocument: async (id, userIds) => {
    try {
      const res = await axiosClient.post(`${BASE_PATH}/${id}/assign-users`, {
        userIds, // BE mong nhận { userIds: [...] }
      });
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * Xóa quyền truy cập của một người dùng
   * DELETE /admin/documents/:id/remove-user/:userId
   */
  removeUserFromDocument: async (id, userId) => {
    try {
      const res = await axiosClient.delete(
        `${BASE_PATH}/${id}/remove-user/${userId}`
      );
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },
};
