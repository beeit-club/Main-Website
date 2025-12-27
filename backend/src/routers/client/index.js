import express from 'express';
import commentRouter from './comment.router.js';
import homeRouter from './home.router.js';
import landingRouter from './landing.router.js';
import beeitRouter from './beeit.router.js';

const Router = express.Router();

Router.use('/comments', commentRouter);
Router.use('/landing', landingRouter);
Router.use('/beeit', beeitRouter);
Router.use('/', homeRouter);

export default Router;
