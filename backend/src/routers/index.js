// src/routers/index.js
import express from 'express';
import authRouter from './auth/auth.router.js';
import emailRoutes from './email/emailRoutes.js';
import adminRouter from './admin/index.js';
import uploadRouter from './upload/upload.js';
import clientRouter from './client/index.js';
import { middleware } from '../middlewares/index.js';
const router = express.Router();

// gắn các route con
router.use('/auth', authRouter);
router.use('/email', emailRoutes);
router.use('/admin', middleware.verifyToken, adminRouter);
router.use('/upload', uploadRouter);
router.use('/client', clientRouter);

export default router;
