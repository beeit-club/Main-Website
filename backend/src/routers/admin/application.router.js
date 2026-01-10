import express from 'express';
import applicationController from '../../controllers/admin/application.controller.js';

const Router = express.Router();

// === CÁC ROUTE CƠ BẢN ===
Router.get('/', applicationController.getApplications);
Router.post('/', applicationController.createApplication);
Router.get('/:id', applicationController.getApplicationById);

// === CÁC ROUTE WORKFLOW MỚI ===

// Bước 1: Duyệt đơn (Status 0 -> 1)
Router.patch('/:id/review', applicationController.reviewApplication);

// Bước 2: Đặt lịch (Status 1 -> 2)
Router.patch('/:id/schedule', applicationController.scheduleApplication);

// Bước 3: Phê duyệt (Status 2 -> 3)
Router.patch('/:id/approve', applicationController.approveApplication);

// Bước 4: Từ chối (Status 0/2 -> 4)
Router.patch('/:id/reject', applicationController.rejectApplication);

export default Router;
