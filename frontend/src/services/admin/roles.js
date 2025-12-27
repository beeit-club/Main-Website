// src/services/admin/roles.js
import axiosClient from "../api";

export const rolesServices = {
  /**
   * 📋 Lấy danh sách tất cả roles (có phân trang, filter)
   * GET /admin/roles?page=1&limit=10&search=...
   */
  getAllRoles: async (params) => {
    try {
      const res = await axiosClient.get("admin/roles", { params });
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * 🔹 Lấy thông tin chi tiết role theo ID
   * GET /admin/roles/:id
   */
  getRoleById: async (id) => {
    try {
      const res = await axiosClient.get(`admin/roles/${id}`);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * ➕ Tạo role mới
   * POST /admin/roles
   */
  createRole: async (data) => {
    try {
      const res = await axiosClient.post("admin/roles", data);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * ✏️ Cập nhật role
   * PATCH /admin/roles/:id
   */
  updateRole: async (id, data) => {
    try {
      const res = await axiosClient.patch(`admin/roles/${id}`, data);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * 🗑️ Xóa role
   * DELETE /admin/roles/:id
   */
  deleteRole: async (id) => {
    try {
      const res = await axiosClient.delete(`admin/roles/${id}`);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * 🔄 Gán role cho user
   * POST /admin/roles/:id/assign
   */
  assignRole: async (roleId, userId) => {
    try {
      const res = await axiosClient.post(`admin/roles/${roleId}/assign`, {
        user_id: userId,
      });
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },
};

