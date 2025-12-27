// routers/admin/emailTemplate.router.js

import express from 'express';
import {
  emailTemplateController,
  bulkEmailController,
} from '../../controllers/admin/index.js';
import emailCustomVariableController from '../../controllers/admin/emailCustomVariable.controller.js';
import { verifyToken } from '../../middlewares/jwt.js';

const router = express.Router();

// Tất cả routes cần authenticate
router.use(verifyToken);

// === EMAIL TEMPLATES ===
// Lưu ý: Đặt các route cụ thể (specific routes) TRƯỚC các route có params (dynamic routes)
// để tránh route /:id match với các path như /custom-variables, /bulk-jobs, etc.

router.get('/', emailTemplateController.getAllTemplates);
router.get('/categories', emailTemplateController.getCategories);

// === BULK EMAIL ===
// Quản lý batch jobs (đặt trước /:id để tránh conflict)
router.get('/bulk-jobs', bulkEmailController.getAllBatchJobs);
router.get('/bulk-jobs/:id', bulkEmailController.getBatchJobById);
router.get(
  '/bulk-jobs/:id/recipients',
  bulkEmailController.getBatchJobRecipients,
);
router.post('/bulk-jobs/:id/retry', bulkEmailController.retryFailedEmails);
router.post('/bulk-jobs/:id/cancel', bulkEmailController.cancelBatchJob);

// === CUSTOM VARIABLES ===
// Đặt trước /:id để tránh /custom-variables bị match như một ID
router.get('/custom-variables', emailCustomVariableController.getAllVariables);
router.get(
  '/custom-variables/:id',
  emailCustomVariableController.getVariableById,
);
router.post('/custom-variables', emailCustomVariableController.createVariable);
router.put(
  '/custom-variables/:id',
  emailCustomVariableController.updateVariable,
);
router.delete(
  '/custom-variables/:id',
  emailCustomVariableController.deleteVariable,
);
router.post(
  '/custom-variables/validate',
  emailCustomVariableController.validateExpression,
);
router.post(
  '/custom-variables/preview',
  emailCustomVariableController.previewVariable,
);

// === EMAIL TEMPLATES (tiếp) ===
// Các route có params đặt sau cùng
router.get('/:id', emailTemplateController.getTemplateById);
router.post('/', emailTemplateController.createTemplate);
router.put('/:id', emailTemplateController.updateTemplate);
router.delete('/:id', emailTemplateController.deleteTemplate);
router.post('/:id/preview', emailTemplateController.previewTemplate);
router.post('/:id/test-send', emailTemplateController.testSendTemplate);

// === BULK EMAIL (tiếp) ===
// Gửi bulk email (manual recipients)
router.post('/:id/send-bulk', bulkEmailController.sendBulkEmail);
// Gửi bulk email từ user IDs (mới)
router.post(
  '/:id/send-bulk-from-users',
  bulkEmailController.sendBulkEmailFromUsers,
);
// Gửi bulk email từ filters (mới)
router.post(
  '/:id/send-bulk-from-filters',
  bulkEmailController.sendBulkEmailFromFilters,
);

export default router;
