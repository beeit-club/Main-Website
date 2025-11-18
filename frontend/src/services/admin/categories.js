// src/services/admin/categoryServices.js
import axiosClient from "../api";

export const categoryServices = {
  /**
   * Lấy danh sách tất cả danh mục
   * Tương ứng với: GET /admin/categories
   */
  getAllCategories: async (params) => {
    try {
      const res = await axiosClient.get("admin/categories", { params });
      return res;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  getAllDeletedCategories: async (params) => {
    try {
      const res = await axiosClient.get("admin/categories/trash/list", { params });
      return res;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  getAllClientCategories: async () => {
    try {
      const res = await axiosClient.get("client/category");
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

  // xóa vĩnh viễn bài viết
  deleteCategoryPermanent: async (id) => {
    try {
      const res = await axiosClient.delete(`/admin/categories/${id}/permanent`);
      return res;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  restoreCategory: async (id) => {
    try {
      const res = await axiosClient.patch(`admin/categories/${id}/restore`);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },
};
