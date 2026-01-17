// src/services/admin/emailTemplateServices.js
import axiosClient from "../api";

export const emailTemplateServices = {
  // ... (Các hàm template cũ giữ nguyên) ...
  getAllTemplates: async (params) => {
    const res = await axiosClient.get("admin/email-templates", { params });
    return res.data;
  },
  getTemplateById: async (id) => {
    const res = await axiosClient.get(`admin/email-templates/${id}`);
    return res.data;
  },
  createTemplate: async (data) => {
    const res = await axiosClient.post("admin/email-templates", data);
    return res.data;
  },
  updateTemplate: async (id, data) => {
    const res = await axiosClient.put(`admin/email-templates/${id}`, data);
    return res.data;
  },
  deleteTemplate: async (id) => {
    const res = await axiosClient.delete(`admin/email-templates/${id}`);
    return res.data;
  },
  previewTemplate: async (id, variables = {}) => {
    const res = await axiosClient.post(`admin/email-templates/${id}/preview`, { variables });
    return res.data;
  },
  // API mới: Preview Raw
  previewRaw: async (data) => {
    const res = await axiosClient.post(`admin/email-templates/preview`, data);
    return res.data;
  },
  testSendTemplate: async (id, recipientEmail, variables = {}) => {
    const res = await axiosClient.post(`admin/email-templates/${id}/test-send`, {
      recipient_email: recipientEmail,
      variables,
    });
    return res.data;
  },

  // === BULK EMAIL APIs ===
  
  // Tạo chiến dịch gửi
  createBatchJob: async (data) => {
    // data: { template_id, job_name, filters, input_variables }
    const res = await axiosClient.post(`admin/campaigns/create-job`, data);
    return res.data;
  },

  // Lấy danh sách Jobs
  getAllBatchJobs: async (params) => {
    const res = await axiosClient.get("admin/campaigns", { params });
    return res.data;
  },

  // Retry
  retryBatchJob: async (id) => {
    const res = await axiosClient.post(`admin/campaigns/${id}/retry`);
    return res.data;
  }
};