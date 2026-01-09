// services/admin/emailMapping.js
import axiosClient from "../api";

export const emailMappingServices = {
  getAllMappings: async (params) => {
    try {
      const res = await axiosClient.get("admin/email-mappings", { params });
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  updateMapping: async (actionKey, templateId) => {
    try {
      const res = await axiosClient.patch(`admin/email-mappings/${actionKey}`, { templateId });
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },
};
