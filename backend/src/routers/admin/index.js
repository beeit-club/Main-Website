import express from 'express';
import userRouter from './user.router.js';
import { middleware } from '../../middlewares/index.js';
const router = express.Router();

router.use('/users', middleware.verifyToken, userRouter);

export default router;
