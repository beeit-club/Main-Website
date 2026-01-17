// routers/admin/emailTemplate.router.js
import express from 'express';
import emailTemplateController from '../../controllers/admin/emailTemplate.controller.js';
import { verifyToken } from '../../middlewares/jwt.js';

const router = express.Router();

router.use(verifyToken);

// === LIVE PREVIEW (No DB) ===
router.post('/preview', emailTemplateController.compilePreview);

// === PREVIEW BY ID ===
router.post('/:id/preview', emailTemplateController.previewById);

// === TEST SEND ===
router.post('/:id/test-send', emailTemplateController.testSend);

// === CRUD ===
router.get('/', emailTemplateController.getAll);
router.get('/:id', emailTemplateController.getById);
router.post('/', emailTemplateController.create);
router.put('/:id', emailTemplateController.update);
router.delete('/:id', emailTemplateController.delete);

export default router;