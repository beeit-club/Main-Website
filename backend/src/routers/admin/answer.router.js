// routes/admin/answer.router.js

import express from 'express';
import { answerController } from '../../controllers/admin/index.js';

const Router = express.Router();

// 💡 MỚI: Lấy danh sách câu trả lời (có thể lọc theo question_id)
// VD: GET /answers?question_id=123
Router.get('/', answerController.getAnswers);

// // 💡 MỚI: Tạo một câu trả lời mới (truyền question_id trong body)
Router.post('/', answerController.createAnswer);

// Các route cho một câu trả lời cụ thể (giữ nguyên)
Router.get('/:id', answerController.getAnswerById);
Router.put('/:id', answerController.updateAnswer);
Router.delete('/:id', answerController.deleteAnswer);
Router.post('/:id/vote', answerController.voteAnswer);

export default Router;
