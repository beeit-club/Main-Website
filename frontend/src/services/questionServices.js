import axiosClient from "./api";

export const questionServices = {
  /**
   * Lấy danh sách câu hỏi (Public)
   * @param {Object} params - Tùy chọn phân trang
   */
  getAllQuestions: async (params) => {
    try {
      // Chuyển sang dùng endpoint client
      const response = await axiosClient.get("/client/questions", { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Không thể tải danh sách câu hỏi");
    }
  },

  /**
   * Lấy chi tiết 1 câu hỏi theo Slug
   * @param {string} slug - Slug của câu hỏi
   */
  getQuestionBySlug: async (slug) => {
    try {
      const response = await axiosClient.get(`/client/questions/${slug}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Không thể tải chi tiết câu hỏi");
    }
  },

  /**
   * Tạo câu hỏi mới (Yêu cầu đăng nhập)
   * @param {Object} data - Dữ liệu câu hỏi (title, content)
   */
  createQuestion: async (data) => {
    try {
      const response = await axiosClient.post("/client/questions", data);
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Không thể tạo câu hỏi");
    }
  },

  /**
   * Cập nhật câu hỏi (Owner only - backend handles check)
   */
  updateQuestion: async (id, data) => {
    try {
      // Giữ nguyên endpoint admin nếu chỉ admin mới được sửa bài người khác
      // Hoặc tạo thêm endpoint client/questions/:id nếu cho phép user sửa bài mình
      const response = await axiosClient.put(`/admin/questions/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Không thể cập nhật câu hỏi");
    }
  },

  /**
   * Xóa câu hỏi
   */
  deleteQuestion: async (id) => {
    try {
      const response = await axiosClient.delete(`/admin/questions/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Không thể xóa câu hỏi");
    }
  },
};