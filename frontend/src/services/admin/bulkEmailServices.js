// src/services/admin/bulkEmailServices.js
import axiosClient from "../api";

export const bulkEmailServices = {
  /**
   * 📧 Gửi bulk email từ user IDs
   * POST /admin/email-templates/:id/send-bulk-from-users
   */
  sendBulkEmailFromUsers: async (templateId, data) => {
    try {
      const res = await axiosClient.post(
        `admin/email-templates/${templateId}/send-bulk-from-users`,
        data
      );
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * 📧 Gửi bulk email từ filters
   * POST /admin/email-templates/:id/send-bulk-from-filters
   */
  sendBulkEmailFromFilters: async (templateId, data) => {
    try {
      const res = await axiosClient.post(
        `admin/email-templates/${templateId}/send-bulk-from-filters`,
        data
      );
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * 📋 Lấy danh sách batch jobs
   * GET /admin/email-templates/bulk-jobs
   */
  getAllBatchJobs: async (params) => {
    try {
      const res = await axiosClient.get("admin/email-templates/bulk-jobs", {
        params,
      });
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * 🔹 Lấy batch job theo ID
   * GET /admin/email-templates/bulk-jobs/:id
   */
  getBatchJobById: async (jobId) => {
    try {
      const res = await axiosClient.get(
        `admin/email-templates/bulk-jobs/${jobId}`
      );
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * 📋 Lấy danh sách recipients của batch job
   * GET /admin/email-templates/bulk-jobs/:id/recipients
   */
  getBatchJobRecipients: async (jobId, params) => {
    try {
      const res = await axiosClient.get(
        `admin/email-templates/bulk-jobs/${jobId}/recipients`,
        { params }
      );
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * 🔄 Retry failed emails
   * POST /admin/email-templates/bulk-jobs/:id/retry
   */
  retryFailedEmails: async (jobId) => {
    try {
      const res = await axiosClient.post(
        `admin/email-templates/bulk-jobs/${jobId}/retry`
      );
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * ❌ Cancel batch job
   * POST /admin/email-templates/bulk-jobs/:id/cancel
   */
  cancelBatchJob: async (jobId) => {
    try {
      const res = await axiosClient.post(
        `admin/email-templates/bulk-jobs/${jobId}/cancel`
      );
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },
};

