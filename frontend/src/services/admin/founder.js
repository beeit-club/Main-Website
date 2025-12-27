import axiosClient from "../api";

export const founderService = {
  // Lấy tất cả
  getAll: async (params) => {
    try {
      const res = await axiosClient.get("admin/founders", { params });
      return res;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  // Lấy 1 item theo ID
  getById: async (id) => {
    try {
      const res = await axiosClient.get(`admin/founders/${id}`);
      return res;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  // Tạo mới
  create: async (data) => {
    try {
      const res = await axiosClient.post("admin/founders", data);
      return res;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  // Cập nhật
  update: async (id, data) => {
    try {
      const res = await axiosClient.put(`admin/founders/${id}`, data);
      return res;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  // Xóa (soft delete)
  delete: async (id) => {
    try {
      const res = await axiosClient.delete(`admin/founders/${id}`);
      return res;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  // Xóa vĩnh viễn
  deletePermanent: async (id) => {
    try {
      const res = await axiosClient.delete(`admin/founders/${id}/permanent`);
      return res;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  // Khôi phục
  restore: async (id) => {
    try {
      const res = await axiosClient.patch(`admin/founders/${id}/restore`);
      return res;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  // Cập nhật display_order
  updateOrder: async (id, displayOrder) => {
    try {
      const res = await axiosClient.patch(`admin/founders/${id}/reorder`, {
        display_order: displayOrder,
      });
      return res;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  // Toggle is_active
  toggleActive: async (id, isActive) => {
    try {
      const res = await axiosClient.patch(`admin/founders/${id}/toggle`, {
        is_active: isActive,
      });
      return res;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  // Lấy items đã xóa
  getDeleted: async (params) => {
    try {
      const res = await axiosClient.get("admin/founders/trash/list", {
        params,
      });
      return res;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },
};
