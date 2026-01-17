import express from 'express';
import { HomeControler } from '../../controllers/client/index.js';
import { verifyTokenOptional } from '../../middlewares/jwt.js';

const Router = express.Router();

Router.get('/landing', HomeControler.getLandingPage);
Router.get('/', HomeControler.Home);
Router.get('/category', HomeControler.getCategories);
Router.get('/documentCategory', HomeControler.getDocumentCategories);
Router.get('/tags', HomeControler.getTags);
Router.get('/posts/:slug', HomeControler.postDetaill);
Router.get('/posts', HomeControler.getAllPost);
// Routes cho Questions
Router.get('/questions', HomeControler.getAllQuestions);
Router.get('/questions/:slug', HomeControler.getQuestionDetail);
Router.post('/questions', verifyTokenOptional, HomeControler.createQuestion); // Client tạo câu hỏi mới (optional auth)
// Routes cho Answers
Router.post('/answers', HomeControler.createAnswer); // Client trả lời câu hỏi
// Routes cho Applications (PUBLIC - không cần đăng nhập)
Router.post('/applications', HomeControler.createApplication); // Client nộp đơn đăng ký thành viên
// Routes cho Members (PUBLIC - không cần đăng nhập)
Router.get('/members', HomeControler.getAllMembers); // Client xem danh sách thành viên

// Routes cho Events (PUBLIC - không cần đăng nhập hoặc Optional Auth)
Router.get('/events', verifyTokenOptional, HomeControler.getAllEvents); // Client xem danh sách sự kiện
Router.get('/events/:slug', verifyTokenOptional, HomeControler.getEventBySlug); // Client xem chi tiết sự kiện theo slug

// Routes cho Event Registration (Cần Auth cho Member, Public cho Guest)
Router.post('/events/:id/registrations', verifyTokenOptional, HomeControler.createEventRegistration);
Router.get('/events/:id/registrations/check', verifyTokenOptional, HomeControler.checkEventRegistration);

// Routes cho Documents (PUBLIC - không cần đăng nhập)
Router.get('/documents', HomeControler.getAllDocuments); // Client xem danh sách tài liệu
Router.get('/documents/:slug', HomeControler.getDocumentBySlug); // Client xem chi tiết tài liệu theo slug
// Routes cho Search (PUBLIC - không cần đăng nhập)
Router.get('/search', HomeControler.search); // Client tìm kiếm posts và questions
export default Router;
