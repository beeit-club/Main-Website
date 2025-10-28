// src/services/admin/categoryServices.js
import axiosClient from "../api";

export const categoryServices = {
  /**
   * Lấy danh sách tất cả danh mục
   * Tương ứng với: GET /admin/categories
   */
  getAllCategories: async () => {
    try {
      const res = await axiosClient.get("admin/categories");
      return res;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * LẤY CHI TIẾT (XEM CHI TIẾT)
   * Tương ứng với: GET /admin/categories/:id
   */
  getOneCategory: async (idOrSlug) => {
    try {
      const res = await axiosClient.get(`admin/categories/${idOrSlug}`);
      return res;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * Tạo một danh mục mới
   * Tương ứng với: POST /admin/categories
   * @param {object} data - Dữ liệu (ví dụ: { name, parent_id })
   */
  createCategory: async (data) => {
    try {
      const res = await axiosClient.post("admin/categories", data);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * Cập nhật một danh mục
   * Tương ứng với: PUT /admin/categories/:id
   */
  updateCategory: async (id, data) => {
    try {
      const res = await axiosClient.put(`admin/categories/${id}`, data);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * Xóa mềm một danh mục
   * Tương ứng với: DELETE /admin/categories/:id
   */
  deleteCategory: async (id) => {
    try {
      const res = await axiosClient.delete(`admin/categories/${id}`);
      return res;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },
};
