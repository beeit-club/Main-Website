import express from 'express';
import userRouter from './user.router.js';
import postRouter from './post.router.js';
import tagsRouter from './tags.router.js';
import categoryRouter from './categories.router.js';
import document_categoriesRouter from './document_categories.router.js';
import { middleware } from '../../middlewares/index.js';
const router = express.Router();

router.use('/users', middleware.verifyToken, userRouter);
router.use('/posts', postRouter);
router.use('/categories', categoryRouter);
router.use('/tags', tagsRouter);
router.use('/documentCategory', document_categoriesRouter);

export default router;
