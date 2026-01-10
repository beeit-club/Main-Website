// src/controllers/client/answer.controller.js
import asyncWrapper from '../../middlewares/error.handler.js';
import answerService from '../../services/admin/answer.service.js'; // Có thể dùng chung service admin nếu logic đơn giản
import { utils } from '../../utils/index.js';
import { sanitizeHtml } from '../../utils/sanitize.js';
import { ANSWER_CREATE_SUCCESS } from '../../common/message/qa.message.js';

const answerController = {
  // Client trả lời câu hỏi
  createAnswer: asyncWrapper(async (req, res) => {
    const { content, question_id, parent_id } = req.body;
    const { id: userId } = req.user;

    const sanitizedContent = sanitizeHtml(content);

    const answerData = { 
      content: sanitizedContent,
      question_id,
      parent_id,
      created_by: userId,
      status: 1, // Công khai ngay
      created_at: new Date() // Chủ động gán thời gian
    };
    
    const newAnswer = await answerService.createAnswer(answerData);
    utils.success(res, ANSWER_CREATE_SUCCESS, { id: newAnswer.insertId });
  }),
};

export default answerController;
