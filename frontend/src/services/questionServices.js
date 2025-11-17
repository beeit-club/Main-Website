import axiosClient from "./api";

export const questionServices = {
  /**
   * Lấy danh sách câu hỏi (cho admin)
   * @param {Object} params - Tùy chọn phân trang (ví dụ: { page: 1, limit: 10, q: 'test' })
   */
  getAllQuestions: async (params) => {
    try {
      const response = await axiosClient.get("/admin/questions", { params });
      return response.data; // { status: 'success', data: { data: [], pagination: {} } }
    } catch (error) {
      console.error(
        "Error fetching all questions:",
        error.response?.data || error.message
      );
      throw (
        error.response?.data || new Error("Không thể tải danh sách câu hỏi")
      );
    }
  },

  /**
   * Lấy chi tiết 1 câu hỏi
   * @param {string|number} id - ID của câu hỏi
   */
  getQuestionById: async (id) => {
    try {
      const response = await axiosClient.get(`/admin/questions/${id}`);
      return response.data; // { status: 'success', data: { question: {...} } }
    } catch (error) {
      console.error(
        `Error fetching question ${id}:`,
        error.response?.data || error.message
      );
      throw error.response?.data || new Error("Không thể tải chi tiết câu hỏi");
    }
  },

  /**
   * Tạo câu hỏi mới (GỬI JSON)
   * @param {Object} data - Dữ liệu câu hỏi (title, content, status...)
   */
  createQuestion: async (data) => {
    try {
      // Gửi object JSON, không dùng FormData
      const response = await axiosClient.post("/admin/questions", data, {
        headers: {
          "Content-Type": "application/json", // Gửi dạng JSON
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error creating question:",
        error.response?.data || error.message
      );
      throw error.response?.data || new Error("Không thể tạo câu hỏi");
    }
  },

  /**
   * Cập nhật câu hỏi (GỬI JSON)
   * @param {string|number} id - ID câu hỏi
   * @param {Object} data - Dữ liệu cập nhật
   */
  updateQuestion: async (id, data) => {
    try {
      // Gửi object JSON
      const response = await axiosClient.put(`/admin/questions/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        `Error updating question ${id}:`,
        error.response?.data || error.message
      );
      throw error.response?.data || new Error("Không thể cập nhật câu hỏi");
    }
  },

  /**
   * Xóa (mềm) câu hỏi
   * @param {string|number} id - ID câu hỏi
   */
  deleteQuestion: async (id) => {
    try {
      const response = await axiosClient.delete(`/admin/questions/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error deleting question ${id}:`,
        error.response?.data || error.message
      );
      throw error.response?.data || new Error("Không thể xóa câu hỏi");
    }
  },
};
