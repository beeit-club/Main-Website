// src/services/admin/emailTemplateServices.js
import axiosClient from "../api";

export const emailTemplateServices = {
  /**
   * 📋 Lấy danh sách templates
   * GET /admin/email-templates
   */
  getAllTemplates: async (params) => {
    try {
      const res = await axiosClient.get("admin/email-templates", { params });
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * 🔹 Lấy template theo ID
   * GET /admin/email-templates/:id
   */
  getTemplateById: async (id) => {
    try {
      const res = await axiosClient.get(`admin/email-templates/${id}`);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * ➕ Tạo template mới
   * POST /admin/email-templates
   */
  createTemplate: async (data) => {
    try {
      const res = await axiosClient.post("admin/email-templates", data);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * ✏️ Cập nhật template
   * PUT /admin/email-templates/:id
   */
  updateTemplate: async (id, data) => {
    try {
      const res = await axiosClient.put(`admin/email-templates/${id}`, data);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * 🗑️ Xóa template
   * DELETE /admin/email-templates/:id
   */
  deleteTemplate: async (id) => {
    try {
      const res = await axiosClient.delete(`admin/email-templates/${id}`);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * 👁️ Preview template
   * POST /admin/email-templates/:id/preview
   */
  previewTemplate: async (id, variables = {}) => {
    try {
      const res = await axiosClient.post(`admin/email-templates/${id}/preview`, {
        variables,
      });
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * 📧 Test gửi email
   * POST /admin/email-templates/:id/test-send
   */
  testSendTemplate: async (id, recipientEmail, variables = {}) => {
    try {
      const res = await axiosClient.post(`admin/email-templates/${id}/test-send`, {
        recipient_email: recipientEmail,
        variables,
      });
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * 📂 Lấy danh sách categories
   * GET /admin/email-templates/categories
   */
  getCategories: async () => {
    try {
      const res = await axiosClient.get("admin/email-templates/categories");
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },
};

