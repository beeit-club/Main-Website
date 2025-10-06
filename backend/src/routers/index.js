// src/routers/index.js
import express from 'express';
import authRouter from './auth/auth.router.js';
import emailRoutes from './email/emailRoutes.js';
import adminRouter from './admin/index.js';
const router = express.Router();

// gắn các route con
router.use('/auth', authRouter);
router.use('/email', emailRoutes);
router.use('/admin', adminRouter);

export default router;
