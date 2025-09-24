// skk
import express from 'express';
import { emailController } from '../../controllers/email/emailController.js';

const router = express.Router();

router.post('/reminder', emailController.sendReminder);

export default router;
