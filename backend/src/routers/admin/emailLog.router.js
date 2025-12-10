// routers/admin/emailLog.router.js

import express from 'express';
import { emailLogController } from '../../controllers/admin/index.js';
import { verifyToken } from '../../middlewares/jwt.js';

const router = express.Router();

// Tất cả routes cần authenticate
router.use(verifyToken);

// === EMAIL LOGS ===
router.get('/', emailLogController.getAllLogs);
router.get('/stats', emailLogController.getStats);
router.get('/:id', emailLogController.getLogById);

export default router;

