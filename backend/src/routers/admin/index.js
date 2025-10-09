import express from 'express';
import userRouter from './user.router.js';
import postRouter from './post.router.js';
import categoryRouter from './categories.router.js';
import { middleware } from '../../middlewares/index.js';
const router = express.Router();

router.use('/users', middleware.verifyToken, userRouter);
router.use('/posts', middleware.verifyToken, postRouter);
router.use('/categories', categoryRouter);

export default router;
