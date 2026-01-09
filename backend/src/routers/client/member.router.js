import express from 'express';
import MemberController from '../../controllers/client/member.controller.js';
import { middleware } from '../../middlewares/index.js';

const router = express.Router();

router.use(middleware.verifyToken); // Require login

router.post('/request-update', MemberController.requestUpdate);

export default router;
