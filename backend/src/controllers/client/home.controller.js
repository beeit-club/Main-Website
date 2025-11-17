import asyncWrapper from '../../middlewares/error.handler.js';

import HomeService from '../../services/client/home.service.js';
import { utils } from '../../utils/index.js';
import { PaginationSchema } from '../../validation/common/common.schema.js';
import QuestionSchema from '../../validation/admin/question.validation.js';
import AnswerSchema from '../../validation/admin/answer.validation.js';
import { slugify } from '../../utils/function.js';
import {
  QUESTION_CREATE_SUCCESS,
  ANSWER_CREATE_SUCCESS,
} from '../../common/message/qa.message.js';

const HomeControler = {
  Home: asyncWrapper(async (req, res) => {
    // const { name, status } = req.query;
    const home = await HomeService.home({
      //   filters: { name, status },
    });

    utils.success(res, 'Lấy danh sách thành công', {
      home,
    });
  }),
  getAllQuestions: asyncWrapper(async (req, res) => {
    // Tạm thời bỏ qua validation, bạn có thể thêm sau
    // const valid = await PaginationSchema.validateAsync(req.query);
    const { page, limit } = req.query;
    const questions = await HomeService.getAllQuestions({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
      // filters: { title: req.query.title }
    });
    utils.success(res, 'Lấy danh sách câu hỏi thành công', questions);
  }),

  getQuestionDetail: asyncWrapper(async (req, res) => {
    const { slug } = req.params;
    const question = await HomeService.getQuestionDetail(slug);
    utils.success(res, 'Lấy chi tiết câu hỏi thành công', question);
  }),

  createQuestion: asyncWrapper(async (req, res) => {
    // Validate dữ liệu đầu vào
    await QuestionSchema.create.validate(req.body, { abortEarly: false });
    const { title } = req.body;
    const slug = slugify(title);

    // Tạo object dữ liệu câu hỏi
    const questionData = {
      ...req.body,
      slug,
      created_by: req.user?.id || null, // Lấy user từ JWT (nếu có middleware auth)
      status: 1, // Client tạo câu hỏi được publish ngay (1), không cần duyệt
    };

    const newQuestion = await HomeService.createQuestion(questionData);
    utils.success(res, QUESTION_CREATE_SUCCESS, { id: newQuestion.insertId });
  }),

  createAnswer: asyncWrapper(async (req, res) => {
    // Validate dữ liệu đầu vào
    await AnswerSchema.create.validate(req.body, { abortEarly: false });

    // Tạo object dữ liệu câu trả lời
    const answerData = {
      ...req.body,
      created_by: req.user?.id || null, // Lấy user từ JWT (nếu có middleware auth)
      status: 1, // Client tạo câu trả lời được publish ngay (1)
    };

    const newAnswer = await HomeService.createAnswer(answerData);
    utils.success(res, ANSWER_CREATE_SUCCESS, { id: newAnswer.insertId });
  }),
  // lấy toàn bộ
  getCategories: asyncWrapper(async (req, res) => {
    // const { name, status } = req.query;
    const categories = await HomeService.getAllCategory({
      //   filters: { name, status },
    });
    utils.success(res, 'Lấy danh sách thành công', {
      categories,
    });
  }),
  getTags: asyncWrapper(async (req, res) => {
    // const { name } = req.query;
    const tags = await HomeService.getAllTag({
      // ...valid,
      // filters: { name },
    });
    utils.success(res, 'Lấy danh sách thẻ thành công', tags);
  }),
  // lấy chi tiết bài viết
  postDetaill: asyncWrapper(async (req, res) => {
    const { slug } = req.params;
    const post = await HomeService.getPostDetaill(slug);
    utils.success(res, 'Lấy post thành công', post);
  }),
  getAllPost: asyncWrapper(async (req, res) => {
    const query = PaginationSchema.cast(req.query);
    const valid = await PaginationSchema.validate(query, {
      stripUnknown: true,
    });
    const { category, title } = req.query;
    const post = await HomeService.getAllPost({
      ...valid,
      filters: { status: 1, category, title }, // Client chỉ xem published posts
    });
    utils.success(res, 'Lấy danh sách bài viết thành công', post);
  }),
};
export default HomeControler;
