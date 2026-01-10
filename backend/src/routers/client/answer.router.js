// src/routers/client/answer.router.js
import express from 'express';
import answerController from '../../controllers/client/answer.controller.js';
import { middleware } from '../../middlewares/index.js';

const Router = express.Router();

// Chỉ người dùng đã đăng nhập mới được trả lời
Router.post('/', middleware.verifyToken, answerController.createAnswer);

export default Router;
