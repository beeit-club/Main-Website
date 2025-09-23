// src/routers/index.js
import express from 'express';
import authRouter from './auth.router.js';
const router = express.Router();

// gắn các route con
router.use('/auth', authRouter);

export default router;
