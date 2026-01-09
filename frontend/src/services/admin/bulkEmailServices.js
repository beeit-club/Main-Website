import axiosClient from "../api";

export const bulkEmailServices = {
  /**
   * Tạo chiến dịch mới
   * POST /admin/campaigns
   * data: { name, template_id, recipients, common_variables }
   */
  createCampaign: async (data) => {
    try {
      const res = await axiosClient.post("admin/campaigns", data);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * Lấy danh sách chiến dịch
   * GET /admin/campaigns
   */
  getCampaigns: async (params) => {
    try {
      const res = await axiosClient.get("admin/campaigns", { params });
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * Lấy chi tiết chiến dịch
   * GET /admin/campaigns/:id
   */
  getCampaignDetail: async (id) => {
    try {
      const res = await axiosClient.get(`admin/campaigns/${id}`);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  }
};