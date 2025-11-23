import express from 'express';
import { HomeControler } from '../../controllers/client/index.js';

const Router = express.Router();

Router.get('/', HomeControler.Home);
Router.get('/category', HomeControler.getCategories);
Router.get('/tags', HomeControler.getTags);
Router.get('/posts/:slug', HomeControler.postDetaill);
Router.get('/posts', HomeControler.getAllPost);
// Routes cho Questions
Router.get('/questions', HomeControler.getAllQuestions);
Router.get('/questions/:slug', HomeControler.getQuestionDetail);
Router.post('/questions', HomeControler.createQuestion); // Client tạo câu hỏi mới
// Routes cho Answers
Router.post('/answers', HomeControler.createAnswer); // Client trả lời câu hỏi
// Routes cho Applications (PUBLIC - không cần đăng nhập)
Router.post('/applications', HomeControler.createApplication); // Client nộp đơn đăng ký thành viên
// Routes cho Members (PUBLIC - không cần đăng nhập)
Router.get('/members', HomeControler.getAllMembers); // Client xem danh sách thành viên
// Routes cho Events (PUBLIC - không cần đăng nhập)
Router.get('/events', HomeControler.getAllEvents); // Client xem danh sách sự kiện
Router.get('/events/:slug', HomeControler.getEventBySlug); // Client xem chi tiết sự kiện theo slug
// Routes cho Documents (PUBLIC - không cần đăng nhập)
Router.get('/documents', HomeControler.getAllDocuments); // Client xem danh sách tài liệu
Router.get('/documents/:slug', HomeControler.getDocumentBySlug); // Client xem chi tiết tài liệu theo slug
export default Router;
