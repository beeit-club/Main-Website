import express from 'express';
import { HomeControler } from '../../controllers/client/index.js';

const Router = express.Router();

Router.get('/', HomeControler.Home);
Router.get('/category', HomeControler.getCategories);
Router.get('/tags', HomeControler.getTags);
Router.get('/posts/:slug', HomeControler.postDetaill);
Router.get('/posts', HomeControler.getAllPost);
// Thêm 2 routes mới cho Questions
Router.get('/questions', HomeControler.getAllQuestions);
Router.get('/questions/:slug', HomeControler.getQuestionDetail);
export default Router;
