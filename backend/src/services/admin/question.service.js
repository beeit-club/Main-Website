import { QUESTION_NOT_FOUND } from '../../common/message/qa.message.js';
import { QUESTION_NOT_FOUND_CODE } from '../../common/message/qa.code.js';
import ServiceError from '../../error/service.error.js';
import { questionModel, answerModel } from '../../models/admin/index.js';

const questionService = {
  getAllQuestions: async (options) => {
    return questionModel.getAllQuestions(options);
  },

  getOneQuestion: async (id) => {
    const question = await questionModel.getOneQuestion(id);
    if (!question) {
      throw new ServiceError(
        QUESTION_NOT_FOUND,
        QUESTION_NOT_FOUND_CODE,
        null,
        404,
      );
    }
    // Lấy kèm các câu trả lời
    const answers = await answerModel.getAnswersForQuestion(id, { limit: 100 }); // Lấy 100 câu trả lời đầu
    question.answers = answers.data;
    return question;
  },

  createQuestion: async (questionData) => {
    return questionModel.createQuestion(questionData);
  },

  updateQuestion: async (id, questionData) => {
    const exists = await questionModel.getOneQuestion(id);
    if (!exists) {
      throw new ServiceError(
        QUESTION_NOT_FOUND,
        QUESTION_NOT_FOUND_CODE,
        null,
        404,
      );
    }
    return questionModel.updateQuestion(id, questionData);
  },

  deleteQuestion: async (id) => {
    const exists = await questionModel.getOneQuestion(id);
    if (!exists) {
      throw new ServiceError(
        QUESTION_NOT_FOUND,
        QUESTION_NOT_FOUND_CODE,
        null,
        404,
      );
    }
    return questionModel.deleteQuestion(id);
  },
};

export default questionService;
