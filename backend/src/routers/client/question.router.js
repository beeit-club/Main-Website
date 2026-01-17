// src/routers/client/question.router.js
import express from 'express';
import questionController from '../../controllers/client/question.controller.js';
import { middleware } from '../../middlewares/index.js';

const Router = express.Router();

// Public routes
Router.get('/', questionController.getQuestions);
Router.get('/:slug', questionController.getQuestionBySlug);
Router.get('/:slug/answers', questionController.getAnswersBySlug);
Router.get('/:slug/stats', questionController.getQuestionStats);

// Protected routes
Router.post('/', middleware.verifyTokenOptional, questionController.createQuestion);

export default Router;
