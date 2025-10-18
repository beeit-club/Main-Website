import express from 'express';
import commentRouter from './comment.router.js';

const Router = express.Router();

Router.use('/comments', commentRouter);

export default Router;
