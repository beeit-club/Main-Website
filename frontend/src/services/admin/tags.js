// src/services/admin/tags.js
import axiosClient from "../api";

export const tagServices = {
  /**
   * Lấy danh sách tất cả tags
   * Tương ứng với: GET /admin/tags
   */
  getAllTags: async (params) => {
    try {
      const res = await axiosClient.get("admin/tags", { params });
      return res;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  getDeletedTags: async (params) => {
    try {
      const res = await axiosClient.get("admin/tags/trash/list", { params });
      return res;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * LẤY CHI TIẾT (XEM CHI TIẾT)
   * Lấy chi tiết một tag bằng ID hoặc Slug
   * Tương ứng với: GET /admin/tags/:id (Backend route có thể xử lý cả slug)
   * @param {number|string} idOrSlug - ID hoặc Slug của tag
   */
  getOneTag: async (idOrSlug) => {
    try {
      const res = await axiosClient.get(`admin/tags/${idOrSlug}`);
      return res;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * Tạo một tag mới
   * Tương ứng với: POST /admin/tags
   * @param {object} data - Dữ liệu tag mới (ví dụ: { name, slug, meta_description })
   */
  createTag: async (data) => {
    try {
      // Gửi data dưới dạng JSON
      const res = await axiosClient.post("admin/tags", data);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * Cập nhật một tag
   * Tương ứng với: PUT /admin/tags/:id
   * @param {number|string} idOrSlug - ID hoặc Slug của tag
   * @param {object} data - Dữ liệu tag cần cập nhật (ví dụ: { name, slug, meta_description })
   */
  updateTag: async (idOrSlug, data) => {
    try {
      // Gửi data dưới dạng JSON
      const res = await axiosClient.put(`admin/tags/${idOrSlug}`, data);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  // xóa vĩnh viễn bài viết
  deleteTagPermanent: async (id) => {
    try {
      const res = await axiosClient.delete(`/admin/tags/${id}/permanent`);
      return res;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * Xóa mềm một tag
   * Tương ứng với: DELETE /admin/tags/:id
   * @param {number|string} idOrSlug - ID hoặc Slug của tag
   */
  deleteTag: async (idOrSlug) => {
    try {
      const res = await axiosClient.delete(`admin/tags/${idOrSlug}`);
      return res;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * Khôi phục một tag đã xóa mềm
   * Tương ứng với: PATCH /admin/tags/:id/restore
   * @param {number|string} idOrSlug - ID hoặc Slug của tag
   */
  restoreTag: async (idOrSlug) => {
    try {
      const res = await axiosClient.patch(`admin/tags/${idOrSlug}/restore`);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },
};
