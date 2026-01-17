
import express from 'express';
import bulkEmailController from '../../controllers/admin/bulkEmail.controller.js';
import { checkAdmin } from '../../middlewares/role.handler.js';

const router = express.Router();

router.use(checkAdmin);

// Tạo Job gửi hàng loạt
router.post('/create-job', bulkEmailController.sendBulkEmailFromFilters);

// Quản lý Job
router.get('/', bulkEmailController.getAllBatchJobs);
router.post('/:id/retry', bulkEmailController.retryFailedEmails);

// (Optional) Các route cũ giữ lại nếu cần
// router.get('/:id', ...);

export default router;
