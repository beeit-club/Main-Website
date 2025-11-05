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
import interviewsRouter from './interview.router.js';
import userController from '../../controllers/admin/user.controller.js';
const router = express.Router();

router.use('/users', userRouter);
router.use('/posts', postRouter);
router.use('/categories', categoryRouter);
router.use('/tags', tagsRouter);
router.use('/documentCategory', document_categoriesRouter);
router.use('/documents', documents);
router.use('/events', enven);
router.use('/transactions', transactionRouter);
router.use('/interviews', interviewsRouter);

router.use('/questions', questionRouter);
router.use('/answers', answerRouter);
router.use('/applications', applicationRouter);

router.get('/roles', userController.getAllRoles);
export default router;
