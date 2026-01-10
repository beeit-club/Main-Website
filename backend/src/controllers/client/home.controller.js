import asyncWrapper from '../../middlewares/error.handler.js';

import HomeService from '../../services/client/home.service.js';
import { utils } from '../../utils/index.js';
import { PaginationSchema } from '../../validation/common/common.schema.js';
import QuestionSchema from '../../validation/admin/question.validation.js';
import AnswerSchema from '../../validation/admin/answer.validation.js';
import ApplicationSchema from '../../validation/admin/application.validation.js';
import { slugify } from '../../utils/function.js';
import { sanitizeHtml, sanitizeText } from '../../utils/sanitize.js';
import {
  QUESTION_CREATE_SUCCESS,
  ANSWER_CREATE_SUCCESS,
} from '../../common/message/qa.message.js';
import { APPLICATION_SUBMIT_SUCCESS } from '../../common/message/application.message.js';
import {
  applicationService,
  eventService,
} from '../../services/admin/index.js';
import EventSchema from '../../validation/admin/event.validation.js';
import { params } from '../../validation/common/common.schema.js';

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
    
    // Log dữ liệu trước khi trả về
    console.log('=== DEBUG: Question data in Controller (before response) ===');
    console.log('author_name:', question?.author_name);
    console.log('author_avatar:', question?.author_avatar);
    console.log('Full question keys:', Object.keys(question || {}));
    console.log('============================================================');
    
    utils.success(res, 'Lấy chi tiết câu hỏi thành công', question);
  }),

  createQuestion: asyncWrapper(async (req, res) => {
    // Validate dữ liệu đầu vào
    await QuestionSchema.create.validate(req.body, { abortEarly: false });
    const { title, content } = req.body;
    const slug = slugify(title);

    // Sanitize HTML content để tránh XSS
    const sanitizedContent = sanitizeHtml(content);
    const sanitizedTitle = sanitizeText(title);

    // Log để debug
    console.log('=== DEBUG: Create Question ===');
    console.log('req.user:', req.user);
    console.log('req.user?.id:', req.user?.id);
    console.log('Has token:', !!req.headers.authorization);
    console.log('==============================');

    // Tạo object dữ liệu câu hỏi
    // Nếu đã đăng nhập thì lấy user id, nếu không thì null (ẩn danh)
    const questionData = {
      ...req.body,
      title: sanitizedTitle,
      content: sanitizedContent,
      slug,
      created_by: req.user?.id || null, // Lấy user từ JWT nếu có, nếu không thì null (ẩn danh)
      status: 1, // Client tạo câu hỏi được publish ngay (1), không cần duyệt
    };

    console.log('questionData.created_by:', questionData.created_by);

    const newQuestion = await HomeService.createQuestion(questionData);
    utils.success(res, QUESTION_CREATE_SUCCESS, { id: newQuestion.insertId });
  }),

  createAnswer: asyncWrapper(async (req, res) => {
    // Validate dữ liệu đầu vào
    await AnswerSchema.create.validate(req.body, { abortEarly: false });
    const { content } = req.body;

    // Sanitize HTML content để tránh XSS
    const sanitizedContent = sanitizeHtml(content);

    // Tạo object dữ liệu câu trả lời
    const answerData = {
      ...req.body,
      content: sanitizedContent,
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
  getDocumentCategories: asyncWrapper(async (req, res) => {
    // const { name, status } = req.query;
    const documentCategories = await HomeService.getAllDocumentCategory({
      //   filters: { name, status },
    });
    utils.success(res, 'Lấy danh sách thành công', {
      documentCategories,
    });
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
    const validatedData = await ApplicationSchema.create.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    // Chuẩn hóa ngày tháng về định dạng YYYY-MM-DD cho MySQL
    if (validatedData.student_year) {
      const date = new Date(validatedData.student_year);
      validatedData.student_year = date.toISOString().split('T')[0];
    }

    // Mặc định status là 0 (Chờ xử lý)
    const applicationData = { ...validatedData, status: 0 };

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

  // === EVENTS (PUBLIC/CLIENT) ===
  // [CLIENT] Lấy danh sách events (published, public/internal tùy auth)
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
      isMember: !!req.user, // Nếu có user là có thể xem internal events
    });
    utils.success(res, 'Lấy danh sách sự kiện thành công', events);
  }),

  // [CLIENT] Lấy chi tiết event theo slug
  getEventBySlug: asyncWrapper(async (req, res) => {
    const { slug } = req.params;
    const event = await HomeService.getEventBySlug(slug, !!req.user);
    utils.success(res, 'Lấy chi tiết sự kiện thành công', { event });
  }),

  // [CLIENT] Đăng ký tham gia sự kiện
  createEventRegistration: asyncWrapper(async (req, res) => {
    const { id } = await params.id.validate(req.params);
    const validatedData = await EventSchema.createRegistration.validate(
      req.body,
      { abortEarly: false },
    );

    // Nếu đã đăng nhập, tự động gán user_id và ép kiểu registration_type
    if (req.user) {
      validatedData.user_id = req.user.id;
    }

    const result = await eventService.createRegistration(id, validatedData);
    utils.success(res, 'Đăng ký tham gia sự kiện thành công', result);
  }),

  // [CLIENT] Kiểm tra xem user đã đăng ký chưa
  checkEventRegistration: asyncWrapper(async (req, res) => {
    const { id } = await params.id.validate(req.params);
    
    // Chỉ kiểm tra cho user đã đăng nhập
    if (!req.user) {
      return utils.success(res, 'Chưa đăng ký (Guest)', { registration: null });
    }

    const registration = await HomeService.checkEventRegistration(id, req.user.id);
    utils.success(res, 'Kiểm tra đăng ký thành công', { registration });
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

  // === SEARCH (PUBLIC) ===
  // [PUBLIC] Tìm kiếm posts và questions
  search: asyncWrapper(async (req, res) => {
    const query = PaginationSchema.cast(req.query);
    const valid = await PaginationSchema.validate(query, {
      stripUnknown: true,
    });
    const { q } = req.query;

    if (!q || q.trim() === '') {
      return utils.success(res, 'Tìm kiếm thành công', {
        data: [],
        pagination: {
          page: 1,
          limit: valid.limit || 10,
          total: 0,
          totalPages: 0,
        },
      });
    }

    const results = await HomeService.searchPostsAndQuestions({
      ...valid,
      q: q.trim(),
    });
    utils.success(res, 'Tìm kiếm thành công', results);
  }),
};
export default HomeControler;
