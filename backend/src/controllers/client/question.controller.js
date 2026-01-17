// src/controllers/client/question.controller.js
import asyncWrapper from '../../middlewares/error.handler.js';
import questionClientService from '../../services/client/question.service.js';
import { slugify } from '../../utils/function.js';
import { utils } from '../../utils/index.js';
import { sanitizeHtml, sanitizeText } from '../../utils/sanitize.js';
import { PaginationSchema } from '../../validation/common/common.schema.js';
import {
  QUESTION_CREATE_SUCCESS,
  QUESTION_GET_DETAIL_SUCCESS,
  QUESTION_GET_SUCCESS,
} from '../../common/message/qa.message.js';

const questionController = {
  // Client lấy danh sách câu hỏi
  getQuestions: asyncWrapper(async (req, res) => {
    const query = PaginationSchema.cast(req.query);
    const validQuery = await PaginationSchema.validate(query, {
      stripUnknown: true,
    });

    const result = await questionClientService.getPublicQuestions({
      ...validQuery,
      filters: req.query,
    });
    utils.success(res, QUESTION_GET_SUCCESS, result);
  }),

  // Client lấy chi tiết câu hỏi qua Slug
  getQuestionBySlug: asyncWrapper(async (req, res) => {
    const { slug } = req.params;
    const question = await questionClientService.getQuestionDetail(slug);
    utils.success(res, QUESTION_GET_DETAIL_SUCCESS, { question });
  }),

  // Client đặt câu hỏi
  createQuestion: asyncWrapper(async (req, res) => {
    const { title, content } = req.body;
    // Nếu có user thì lấy id, nếu không (ẩn danh) thì null
    const userId = req.user ? req.user.id : null;

    const slug = slugify(title);
    const sanitizedContent = sanitizeHtml(content);
    const sanitizedTitle = sanitizeText(title);

    const questionData = {
      title: sanitizedTitle,
      content: sanitizedContent,
      slug,
      created_by: userId,
    };

    const newQuestion = await questionClientService.askQuestion(questionData);
    utils.success(res, QUESTION_CREATE_SUCCESS, { id: newQuestion.insertId });
  }),

  // Client lấy danh sách câu trả lời của câu hỏi
  getAnswersBySlug: asyncWrapper(async (req, res) => {
    const { slug } = req.params;
    const answers = await questionClientService.getAnswersBySlug(slug);
    utils.success(res, QUESTION_GET_DETAIL_SUCCESS, { answers });
  }),

  // Client lấy thống kê (view count) của câu hỏi
  getQuestionStats: asyncWrapper(async (req, res) => {
    const { slug } = req.params;
    const stats = await questionClientService.getQuestionStats(slug);
    utils.success(res, QUESTION_GET_DETAIL_SUCCESS, { stats });
  }),
};

export default questionController;