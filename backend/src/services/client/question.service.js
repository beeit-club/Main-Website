// src/services/client/question.service.js
import { questionModel, answerModel } from '../../models/admin/index.js';
import ServiceError from '../../error/service.error.js';
import { QUESTION_NOT_FOUND } from '../../common/message/qa.message.js';
import { QUESTION_NOT_FOUND_CODE } from '../../common/message/qa.code.js';

// Helper function để xây dựng cây comment
const buildAnswerTree = (answers) => {
  const map = {};
  const roots = [];

  // Khởi tạo map
  answers.forEach((ans) => {
    map[ans.id] = { ...ans, children: [] };
  });

  // Xếp vào cây
  answers.forEach((ans) => {
    if (ans.parent_id && map[ans.parent_id]) {
      map[ans.parent_id].children.push(map[ans.id]);
    } else {
      roots.push(map[ans.id]);
    }
  });

  return roots;
};

const questionClientService = {
  // Lấy danh sách câu hỏi cho người dùng (Chỉ lấy bài đã duyệt/công khai)
  getPublicQuestions: async (options) => {
    try {
      // Ép status = 1 (Công khai) cho client
      const filters = { ...options.filters, status: 1 };
      return await questionModel.getAllQuestions({ ...options, filters });
    } catch (error) {
      throw error;
    }
  },

  // Lấy chi tiết câu hỏi theo slug cho người dùng
  getQuestionDetail: async (slug) => {
    try {
      // 1. Tăng view count
      await questionModel.incrementViewCount(slug);

      // 2. Lấy thông tin
      const question = await questionModel.getOneQuestionBySlug(slug);
      
      if (!question || (question.status !== 1 && question.status !== '1')) {
        throw new ServiceError(
          QUESTION_NOT_FOUND,
          QUESTION_NOT_FOUND_CODE,
          'Câu hỏi không tồn tại hoặc chưa được duyệt',
          404,
        );
      }

      // 3. Lấy danh sách câu trả lời (Chỉ lấy câu trả lời công khai)
      // Lấy limit lớn để xây cây đầy đủ
      const answersResult = await answerModel.getAnswersForQuestion(question.id, { 
        limit: 500,
        filters: { status: 1 } 
      });
      
      // 4. Cấu trúc lại thành cây (Nested)
      question.answers = buildAnswerTree(answersResult.data || []);
      
      return question;
    } catch (error) {
      throw error;
    }
  },

  // Người dùng đặt câu hỏi
  askQuestion: async (questionData) => {
    try {
      return await questionModel.createQuestion({
        ...questionData,
        status: 1, 
        view_count: 0,
        created_at: new Date()
      });
    } catch (error) {
      throw error;
    }
  }
};

export default questionClientService;