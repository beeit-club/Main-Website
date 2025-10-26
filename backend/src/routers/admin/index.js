import express from 'express';
import userRouter from './user.router.js';
import postRouter from './post.router.js';
import tagsRouter from './tags.router.js';
import categoryRouter from './categories.router.js';
import document_categoriesRouter from './document_categories.router.js';
import documents from './document.router.js';
import questionRouter from './question.router.js';
import answerRouter from './answer.router.js';
import enven from './event.router.js';
import applicationRouter from './application.router.js';
import transactionRouter from './transaction.router.js';
import { middleware } from '../../middlewares/index.js';
const router = express.Router();

router.use('/users', middleware.verifyToken, userRouter);
router.use('/posts', postRouter);
router.use('/categories', categoryRouter);
router.use('/tags', tagsRouter);
router.use('/documentCategory', document_categoriesRouter);
router.use('/documents', documents);
router.use('/events', enven);
router.use('/transaction', middleware.verifyToken, transactionRouter);

router.use('/questions', questionRouter);
router.use('/answers', answerRouter);
router.use('/application', middleware.verifyToken, applicationRouter);
export default router;
