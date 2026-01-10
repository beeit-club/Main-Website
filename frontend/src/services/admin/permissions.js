// src/services/admin/permissions.js
import axiosClient from "../api";

export const permissionsServices = {
  /**
   * 📋 Lấy danh sách tất cả permissions (có phân trang, filter)
   * GET /admin/permissions?page=1&limit=10&search=...&module=...
   */
  getAllPermissions: async (params) => {
    try {
      const res = await axiosClient.get("admin/permissions", { params });
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * 🔹 Lấy thông tin chi tiết permission theo ID
   * GET /admin/permissions/:id
   */
  getPermissionById: async (id) => {
    try {
      const res = await axiosClient.get(`admin/permissions/${id}`);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * ➕ Tạo permission mới
   * POST /admin/permissions
   */
  createPermission: async (data) => {
    try {
      const res = await axiosClient.post("admin/permissions", data);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * ✏️ Cập nhật permission
   * PATCH /admin/permissions/:id
   */
  updatePermission: async (id, data) => {
    try {
      const res = await axiosClient.patch(`admin/permissions/${id}`, data);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * 🗑️ Xóa permission
   * DELETE /admin/permissions/:id
   */
  deletePermission: async (id) => {
    try {
      const res = await axiosClient.delete(`admin/permissions/${id}`);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * 📋 Lấy permissions của user
   * GET /admin/permissions/user/:userId
   */
  getUserPermissions: async (userId) => {
    try {
      const res = await axiosClient.get(`admin/permissions/user/${userId}`);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * ➕ Gán permission cho user
   * POST /admin/permissions/user/:userId/grant
   */
  grantPermission: async (userId, permissionId) => {
    try {
      const res = await axiosClient.post(`admin/permissions/user/${userId}/grant`, {
        permission_id: permissionId,
      });
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * ➖ Thu hồi permission từ user
   * DELETE /admin/permissions/user/:userId/revoke/:permissionId
   */
  revokePermission: async (userId, permissionId) => {
    try {
      const res = await axiosClient.delete(
        `admin/permissions/user/${userId}/revoke/${permissionId}`
      );
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * 📦 Gán nhiều permissions cho user (bulk)
   * POST /admin/permissions/user/:userId/bulk-grant
   */
  bulkGrantPermissions: async (userId, permissionIds) => {
    try {
      const res = await axiosClient.post(
        `admin/permissions/user/${userId}/bulk-grant`,
        {
          permission_ids: permissionIds,
        }
      );
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },
};

