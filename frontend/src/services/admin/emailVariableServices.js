
import axiosClient from "../api";

export const emailVariableServices = {
  /**
   * 📋 Lấy danh sách biến chuẩn
   * GET /admin/email-variables
   */
  getAllVariables: async () => {
    try {
      const res = await axiosClient.get("admin/email-variables");
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },
};
