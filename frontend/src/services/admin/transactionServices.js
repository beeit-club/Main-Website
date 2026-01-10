// src/services/admin/transactionServices.js
import axiosClient from "../api";

const BASE_PATH = "admin/transactions";

export const transactionServices = {
  getBalance: async () => {
    try {
      const res = await axiosClient.get(`${BASE_PATH}/balance`);
      return res;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * Lấy danh sách giao dịch (hỗ trợ server-side)
   * @param {object} options - VD: { page, limit, search, type, sortBy, sortDirection }
   */
  getAllTransactions: async (options = {}) => {
    try {
      // Chuyển đổi options thành query params
      const params = new URLSearchParams();
      if (options.page) params.append("page", options.page);
      if (options.limit) params.append("limit", options.limit);
      if (options.search) params.append("search", options.search);
      if (options.type) params.append("type", options.type);
      if (options.sortBy) {
        params.append("sortBy", options.sortBy);
        params.append("sortDirection", options.sortDirection || "DESC");
      }

      const res = await axiosClient.get(BASE_PATH, { params });
      return res; // BE trả về: res.data.data.items và res.data.data.totalPages
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  getOneTransaction: async (id) => {
    try {
      const res = await axiosClient.get(`${BASE_PATH}/${id}`);
      return res;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  createTransaction: async (data) => {
    try {
      // BE của bạn nhận JSON, không phải FormData
      const res = await axiosClient.post(BASE_PATH, data);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * Cập nhật (dùng PATCH)
   */
  updateTransaction: async (id, data) => {
    try {
      const res = await axiosClient.patch(`${BASE_PATH}/${id}`, data);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  // Không có hàm deleteTransaction vì BE không cung cấp API
};
