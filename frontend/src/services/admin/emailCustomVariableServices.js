// services/admin/emailCustomVariableServices.js
import axiosClient from "../api";

export const emailCustomVariableServices = {
  /**
   * 📋 Lấy danh sách custom variables
   * GET /admin/email-templates/custom-variables
   */
  getAllVariables: async (params) => {
    try {
      const res = await axiosClient.get("admin/email-templates/custom-variables", {
        params,
      });
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * 🔹 Lấy custom variable theo ID
   * GET /admin/email-templates/custom-variables/:id
   */
  getVariableById: async (id) => {
    try {
      const res = await axiosClient.get(`admin/email-templates/custom-variables/${id}`);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * ➕ Tạo custom variable mới
   * POST /admin/email-templates/custom-variables
   */
  createVariable: async (data) => {
    try {
      const res = await axiosClient.post("admin/email-templates/custom-variables", data);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * ✏️ Cập nhật custom variable
   * PUT /admin/email-templates/custom-variables/:id
   */
  updateVariable: async (id, data) => {
    try {
      const res = await axiosClient.put(`admin/email-templates/custom-variables/${id}`, data);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * ❌ Xóa custom variable
   * DELETE /admin/email-templates/custom-variables/:id
   */
  deleteVariable: async (id) => {
    try {
      const res = await axiosClient.delete(`admin/email-templates/custom-variables/${id}`);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * ✅ Validate expression
   * POST /admin/email-templates/custom-variables/validate
   */
  validateExpression: async (expression, sampleVariables = {}) => {
    try {
      const res = await axiosClient.post("admin/email-templates/custom-variables/validate", {
        expression,
        sample_variables: sampleVariables,
      });
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * 👁️ Preview expression với sample data
   * POST /admin/email-templates/custom-variables/preview
   */
  previewVariable: async (expression, sampleVariables = {}) => {
    try {
      const res = await axiosClient.post("admin/email-templates/custom-variables/preview", {
        expression,
        sample_variables: sampleVariables,
      });
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },
};

