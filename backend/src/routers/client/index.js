import express from 'express';
import commentRouter from './comment.router.js';
import homeRouter from './home.router.js';

const Router = express.Router();

Router.use('/comments', commentRouter);
Router.use('/', homeRouter);

export default Router;
