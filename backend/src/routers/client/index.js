import express from 'express';
import commentRouter from './comment.router.js';
import homeRouter from './home.router.js';
import landingRouter from './landing.router.js';
import beeitRouter from './beeit.router.js';
import questionRouter from './question.router.js';
import answerRouter from './answer.router.js';
import documentRouter from './document.router.js';
import memberRouter from './member.router.js';

const Router = express.Router();

Router.use('/comments', commentRouter);
Router.use('/landing', landingRouter);
Router.use('/beeit', beeitRouter);
Router.use('/questions', questionRouter);
Router.use('/answers', answerRouter);
Router.use('/documents', documentRouter);
Router.use('/members', memberRouter);
Router.use('/', homeRouter);

export default Router;
