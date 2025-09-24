// src/routers/index.js
import express from 'express';
import authRouter from './auth/auth.router.js';
import emailRoutes from './email/emailRoutes.js';
const router = express.Router();

// gắn các route con
router.use('/auth', authRouter);
router.use('/email', emailRoutes);

export default router;
