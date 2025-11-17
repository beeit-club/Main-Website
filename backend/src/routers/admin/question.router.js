// routes/admin/question.router.js

import express from 'express';
import { questionController } from '../../controllers/admin/index.js';

const Router = express.Router();

// Routes cho Questions
Router.get('/', questionController.getQuestions);
Router.post('/', questionController.createQuestion);
Router.get('/:id', questionController.getQuestionById);
Router.put('/:id', questionController.updateQuestion);
Router.delete('/:id', questionController.deleteQuestion);

export default Router;
