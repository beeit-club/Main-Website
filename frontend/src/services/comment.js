"use client";
import axiosClient from "./api";

export const commentService = {
  /**
   * Lấy danh sách comments của một bài viết
   * @param {string|number} postId - ID của bài viết
   * @param {Object} params - Tùy chọn phân trang (ví dụ: { page: 1, limit: 20 })
   */
  getCommentsByPostId: async (postId, params = {}) => {
    try {
      const response = await axiosClient.get(`/client/comments/${postId}`, { params });
      return response.data; // { status: 'success', data: { comments: [] } }
    } catch (error) {
      console.error("Error fetching comments:", error.response?.data || error.message);
      throw error?.response?.data || new Error("Không thể tải bình luận");
    }
  },

  /**
   * Tạo comment mới
   * @param {Object} data - { post_id, content, parent_id? }
   */
  createComment: async (data) => {
    try {
      const response = await axiosClient.post("/client/comments", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating comment:", error.response?.data || error.message);
      throw error?.response?.data || new Error("Không thể tạo bình luận");
    }
  },

  /**
   * Cập nhật comment
   * @param {string|number} id - ID comment
   * @param {Object} data - { content }
   */
  updateComment: async (id, data) => {
    try {
      const response = await axiosClient.patch(`/client/comments/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating comment:", error.response?.data || error.message);
      throw error?.response?.data || new Error("Không thể cập nhật bình luận");
    }
  },

  /**
   * Xóa comment (soft delete)
   * @param {string|number} id - ID comment
   */
  deleteComment: async (id) => {
    try {
      const response = await axiosClient.delete(`/client/comments/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting comment:", error.response?.data || error.message);
      throw error?.response?.data || new Error("Không thể xóa bình luận");
    }
  },
};

