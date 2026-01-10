import express from 'express';
import dashboardController from '../../controllers/admin/dashboard.controller.js';
import { checkPermission } from '../../middlewares/permission.handler.js';

const router = express.Router();

/**
 * 📊 Thống kê tổng quan dashboard
 * GET /api/admin/dashboard/stats
 */
router.get('/stats', dashboardController.getDashboardStats);

/**
 * 📈 Dữ liệu biểu đồ theo thời gian
 * GET /api/admin/dashboard/timeseries?period=30d
 */
router.get('/timeseries', dashboardController.getTimeSeriesData);

export default router;

