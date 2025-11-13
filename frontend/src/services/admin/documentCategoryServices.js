import axiosClient from "../api"; // Giả định đường dẫn

const BASE_PATH = "admin/documentCategory";

export const documentCategoryServices = {
  /**
   * Lấy danh sách danh mục (có filter và phân trang)
   * GET /admin/document-categories
   * @param {object} options - { page, limit, name }
   */
  getAll: async (options = {}) => {
    try {
      const params = new URLSearchParams();
      if (options.page) params.append("page", options.page);
      if (options.limit) params.append("limit", options.limit);
      if (options.name) params.append("name", options.name); // BE lọc theo 'name'

      const res = await axiosClient.get(BASE_PATH, { params });
      return res; //
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * Lấy chi tiết 1 danh mục
   * GET /admin/document-categories/:id
   */
  getOne: async (id) => {
    try {
      const res = await axiosClient.get(`${BASE_PATH}/${id}`); //
      return res;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * Tạo danh mục mới
   * POST /admin/document-categories
   * @param {object} data - { name, parent_id }
   */
  create: async (data) => {
    try {
      // BE chỉ cần name và parent_id, slug tự tạo
      const res = await axiosClient.post(BASE_PATH, data);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * Cập nhật danh mục (BE dùng PUT)
   * PUT /admin/document-categories/:id
   * @param {object} data - { name, parent_id }
   */
  update: async (id, data) => {
    try {
      const res = await axiosClient.put(`${BASE_PATH}/${id}`, data); //
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * Xóa mềm danh mục
   * DELETE /admin/document-categories/:id
   */
  softDelete: async (id) => {
    try {
      const res = await axiosClient.delete(`${BASE_PATH}/${id}`); //
      return res;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  // Không có hàm restore hoặc getDeleted vì BE không cung cấp API getDeleted
};
