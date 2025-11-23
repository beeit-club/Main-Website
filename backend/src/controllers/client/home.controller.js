import asyncWrapper from '../../middlewares/error.handler.js';

import HomeService from '../../services/client/home.service.js';
import { utils } from '../../utils/index.js';
import { PaginationSchema } from '../../validation/common/common.schema.js';
import QuestionSchema from '../../validation/admin/question.validation.js';
import AnswerSchema from '../../validation/admin/answer.validation.js';
import ApplicationSchema from '../../validation/admin/application.validation.js';
import { slugify } from '../../utils/function.js';
import {
  QUESTION_CREATE_SUCCESS,
  ANSWER_CREATE_SUCCESS,
} from '../../common/message/qa.message.js';
import { APPLICATION_SUBMIT_SUCCESS } from '../../common/message/application.message.js';
import { applicationService } from '../../services/admin/index.js';

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

  // [PUBLIC] Nộp đơn đăng ký thành viên CLB
  createApplication: asyncWrapper(async (req, res) => {
    await ApplicationSchema.create.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    // Mặc định status là 0 (Chờ xử lý)
    const applicationData = { ...req.body, status: 0 };

    const application = await applicationService.createApplication(
      applicationData,
    );
    utils.success(res, APPLICATION_SUBMIT_SUCCESS, {
      id: application.insertId,
    });
  }),

  // [PUBLIC] Lấy danh sách thành viên CLB
  getAllMembers: asyncWrapper(async (req, res) => {
    const query = PaginationSchema.cast(req.query);
    const valid = await PaginationSchema.validate(query, {
      stripUnknown: true,
    });
    const { search } = req.query;

    const members = await HomeService.getAllMembers({
      ...valid,
      filters: { search },
    });
    utils.success(res, 'Lấy danh sách thành viên thành công', members);
  }),

  // === EVENTS (PUBLIC) ===
  // [PUBLIC] Lấy danh sách events (chỉ published và public)
  getAllEvents: asyncWrapper(async (req, res) => {
    const query = PaginationSchema.cast(req.query);
    const valid = await PaginationSchema.validate(query, {
      stripUnknown: true,
    });
    const { upcoming, past, status } = req.query;

    const events = await HomeService.getAllEvents({
      ...valid,
      upcoming: upcoming === 'true',
      past: past === 'true',
      status: status || 1, // Mặc định chỉ lấy published
    });
    utils.success(res, 'Lấy danh sách sự kiện thành công', events);
  }),

  // [PUBLIC] Lấy chi tiết event theo slug
  getEventBySlug: asyncWrapper(async (req, res) => {
    const { slug } = req.params;
    const event = await HomeService.getEventBySlug(slug);
    utils.success(res, 'Lấy chi tiết sự kiện thành công', { event });
  }),

  // === DOCUMENTS (PUBLIC) ===
  // [PUBLIC] Lấy danh sách documents (chỉ published và public)
  getAllDocuments: asyncWrapper(async (req, res) => {
    const query = PaginationSchema.cast(req.query);
    const valid = await PaginationSchema.validate(query, {
      stripUnknown: true,
    });
    const { category_id, search, title } = req.query;

    const documents = await HomeService.getAllDocuments({
      ...valid,
      filters: {
        category_id,
        title: search || title, // Search by title
      },
    });
    utils.success(res, 'Lấy danh sách tài liệu thành công', documents);
  }),

  // [PUBLIC] Lấy chi tiết document theo slug
  getDocumentBySlug: asyncWrapper(async (req, res) => {
    const { slug } = req.params;
    const document = await HomeService.getDocumentBySlug(slug);
    utils.success(res, 'Lấy chi tiết tài liệu thành công', { document });
  }),
};
export default HomeControler;
