import axiosClient from "../api";

export const answerServices = {
  /**
   * Admin tạo câu trả lời mới
   * @param {object} data - (ví dụ: { content: "...", question_id: 1 })
   */
  createAnswer: async (data) => {
    try {
      const res = await axiosClient.post("admin/answers", data);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * Cập nhật câu trả lời (Sửa nội dung, đổi status, set accepted)
   * @param {number|string} id
   * @param {object} data - (ví dụ: { content: "..." } hoặc { status: 0 } hoặc { is_accepted: true })
   */
  updateAnswer: async (id, data) => {
    try {
      const res = await axiosClient.put(`admin/answers/${id}`, data);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * Xóa mềm câu trả lời
   */
  deleteAnswer: async (id) => {
    try {
      const res = await axiosClient.delete(`admin/answers/${id}`);
      return res;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },
};
