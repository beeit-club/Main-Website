// src/services/admin/users.js
import axiosClient from "../api";

export const usersServices = {
  /**
   * 📊 Lấy thống kê user
   * GET /admin/users/stats
   */
  getUserStats: async () => {
    try {
      const res = await axiosClient.get("admin/users/stats");
      return res.data; // Thường data thống kê nằm trong res.data
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * 📋 Lấy danh sách tất cả user (có phân trang, filter)
   * GET /admin/users?page=1&limit=10&search=...&role=...&active=...
   * @param {URLSearchParams} params - query params
   */
  getAllUser: async (params) => {
    try {
      // params sẽ là một đối tượng URLSearchParams
      const res = await axiosClient.get("admin/users", { params });
      return res.data; // Giả sử API trả về { status, data: { data, total, ... } }
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * 📋 Lấy danh sách user đã xóa (trash)
   * GET /admin/users/trash?page=1&limit=10
   * @param {URLSearchParams} params - query params
   */
  getDeletedUsers: async (params) => {
    try {
      const res = await axiosClient.get("admin/users/trash", { params });
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * 🔹 Lấy thông tin chi tiết 1 user
   * GET /admin/users/:id
   */
  getUserById: async (id) => {
    try {
      const res = await axiosClient.get(`admin/users/${id}`);
      return res.data; // Giả sử API trả về { status, data: { user } }
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * ➕ Tạo user mới
   * POST /admin/users
   */
  createUser: async (data) => {
    try {
      // Gửi data dưới dạng JSON
      const res = await axiosClient.post("admin/users", data);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * ✏️ Cập nhật thông tin user
   * PATCH /admin/users/:id
   */
  updateUser: async (id, data) => {
    try {
      const res = await axiosClient.patch(`admin/users/${id}`, data);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * 🔄 Kích hoạt/vô hiệu hóa user
   * PATCH /admin/users/:id/toggle-active
   */
  toggleUserActive: async (id, data) => {
    try {
      // data: { is_active: 0 | 1 }
      const res = await axiosClient.put(`admin/users/${id}/toggleActive`, data);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * ♻️ Khôi phục user đã xóa
   * PATCH /admin/users/:id/restore
   */
  restoreUser: async (id) => {
    try {
      const res = await axiosClient.patch(`admin/users/${id}/restore`);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * 🗑️ Xóa mềm user
   * DELETE /admin/users/:id
   */
  deleteUser: async (id) => {
    try {
      const res = await axiosClient.delete(`admin/users/${id}`);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * 💀 Xóa vĩnh viễn user
   * DELETE /admin/users/:id/permanent
   */
  hardDeleteUser: async (id) => {
    try {
      const res = await axiosClient.delete(`admin/users/${id}/permanent`);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * -------------------------------------------------
   * CÁC API LIÊN QUAN (Cần thiết cho form/filter)
   * -------------------------------------------------
   */

  /**
   * 🏷️ Lấy danh sách Roles (để dùng cho filter và form)
   * GET /admin/roles (Giả định)
   */
  getAllRoles: async () => {
    try {
      // Giả định bạn có 1 endpoint để lấy list roles
      const res = await axiosClient.get("admin/roles");
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * 📋 Lấy danh sách thành viên CLB (có phân trang, filter)
   * GET /admin/members?page=1&limit=10&search=...
   * @param {URLSearchParams} params - query params
   */
  getAllMembers: async (params) => {
    try {
      const res = await axiosClient.get("admin/members", { params });
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * 🔹 Lấy thông tin chi tiết thành viên theo user_id
   * GET /admin/members/:userId
   */
  getMemberByUserId: async (userId) => {
    try {
      const res = await axiosClient.get(`admin/members/${userId}`);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * ➕ Tạo thành viên mới
   * POST /admin/members
   */
  createMember: async (data) => {
    try {
      const res = await axiosClient.post("admin/members", data);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * ✏️ Cập nhật thông tin thành viên
   * PATCH /admin/members/:userId
   */
  updateMember: async (userId, data) => {
    try {
      const res = await axiosClient.patch(`admin/members/${userId}`, data);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * 🗑️ Xóa thành viên
   * DELETE /admin/members/:userId
   */
  deleteMember: async (userId) => {
    try {
      const res = await axiosClient.delete(`admin/members/${userId}`);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * 📋 Lấy danh sách users chưa có member profile (để chọn khi thêm)
   * GET /admin/members/available-users?page=1&limit=10&search=...
   */
  getAvailableUsers: async (params) => {
    try {
      const res = await axiosClient.get("admin/members/available-users", { params });
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },
};
