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
export default Router;
