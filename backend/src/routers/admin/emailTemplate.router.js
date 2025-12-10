// routers/admin/emailTemplate.router.js

import express from 'express';
import { emailTemplateController, bulkEmailController } from '../../controllers/admin/index.js';
import { verifyToken } from '../../middlewares/jwt.js';

const router = express.Router();

// Tất cả routes cần authenticate
router.use(verifyToken);

// === EMAIL TEMPLATES ===
router.get('/', emailTemplateController.getAllTemplates);
router.get('/categories', emailTemplateController.getCategories);
router.get('/:id', emailTemplateController.getTemplateById);
router.post('/', emailTemplateController.createTemplate);
router.put('/:id', emailTemplateController.updateTemplate);
router.delete('/:id', emailTemplateController.deleteTemplate);
router.post('/:id/preview', emailTemplateController.previewTemplate);
router.post('/:id/test-send', emailTemplateController.testSendTemplate);

// === BULK EMAIL ===
router.post('/:id/send-bulk', bulkEmailController.sendBulkEmail);
router.get('/bulk-jobs', bulkEmailController.getAllBatchJobs);
router.get('/bulk-jobs/:id', bulkEmailController.getBatchJobById);
router.get('/bulk-jobs/:id/recipients', bulkEmailController.getBatchJobRecipients);
router.post('/bulk-jobs/:id/retry', bulkEmailController.retryFailedEmails);
router.post('/bulk-jobs/:id/cancel', bulkEmailController.cancelBatchJob);

export default router;

