// src/services/admin/dashboard.js
import axiosClient from "../api";

export const dashboardServices = {
  /**
   * 📊 Lấy thống kê tổng quan dashboard
   * GET /admin/dashboard/stats
   */
  getDashboardStats: async () => {
    try {
      const res = await axiosClient.get("admin/dashboard/stats");
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * 📈 Lấy dữ liệu biểu đồ theo thời gian
   * GET /admin/dashboard/timeseries?period=30d
   * @param {string} period - '7d', '30d', '90d', '1y'
   */
  getTimeSeriesData: async (period = '30d') => {
    try {
      const res = await axiosClient.get("admin/dashboard/timeseries", {
        params: { period }
      });
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },
};

