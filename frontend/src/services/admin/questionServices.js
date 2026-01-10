import axiosClient from "../api";

export const questionServices = {
  /**
   * Lấy danh sách câu hỏi (phân trang)
   */
  getQuestionsPaginated: async () => {
    try {
      const res = await axiosClient.get("admin/questions");
      return res;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * Lấy chi tiết 1 câu hỏi (bao gồm cả các câu trả lời)
   */
  getOneQuestion: async (id) => {
    try {
      const res = await axiosClient.get(`admin/questions/${id}`);
      return res;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * Cập nhật một phần của câu hỏi (dùng để đổi status)
   * @param {number|string} id
   * @param {object} data - (ví dụ: { status: 0 })
   */
  updateQuestion: async (id, data) => {
    try {
      const res = await axiosClient.put(`admin/questions/${id}`, data);
      return res.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },

  /**
   * Xóa mềm câu hỏi
   */
  deleteQuestion: async (id) => {
    try {
      const res = await axiosClient.delete(`admin/questions/${id}`);
      return res;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },
};
