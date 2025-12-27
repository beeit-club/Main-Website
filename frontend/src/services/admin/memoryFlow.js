import axiosClient from "../api";

export const memoryFlowService = {
  // Lấy tất cả items
  getAll: async (params) => {
    try {
      const res = await axiosClient.get("admin/memory-flow", { params });
      return res;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  // Lấy 1 item theo ID
  getById: async (id) => {
    try {
      const res = await axiosClient.get(`admin/memory-flow/${id}`);
      return res;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  // Tạo mới
  create: async (data) => {
    try {
      const res = await axiosClient.post("admin/memory-flow", data);
      return res;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  // Cập nhật
  update: async (id, data) => {
    try {
      const res = await axiosClient.put(`admin/memory-flow/${id}`, data);
      return res;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  // Xóa (soft delete)
  delete: async (id) => {
    try {
      const res = await axiosClient.delete(`admin/memory-flow/${id}`);
      return res;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  // Xóa vĩnh viễn
  deletePermanent: async (id) => {
    try {
      const res = await axiosClient.delete(`admin/memory-flow/${id}/permanent`);
      return res;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  // Khôi phục
  restore: async (id) => {
    try {
      const res = await axiosClient.patch(`admin/memory-flow/${id}/restore`);
      return res;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  // Cập nhật display_order
  updateOrder: async (id, displayOrder) => {
    try {
      const res = await axiosClient.patch(`admin/memory-flow/${id}/reorder`, {
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
      const res = await axiosClient.patch(`admin/memory-flow/${id}/toggle`, {
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
      const res = await axiosClient.get("admin/memory-flow/trash/list", {
        params,
      });
      return res;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },
};
