// routers/scheduler/scheduler.router.js

import express from 'express';
import schedulerController from '../../controllers/scheduler/scheduler.controller.js';
import { middleware } from '../../middlewares/index.js';

const Router = express.Router();

// Tất cả routes này nên được bảo vệ bởi admin middleware
// Chạy tất cả scheduled jobs
Router.post(
  '/run-all',
  middleware.verifyToken,
  // middleware.isAdmin, // Uncomment khi có middleware isAdmin
  schedulerController.runEmailJobs,
);

// Chạy riêng event reminders
Router.post(
  '/event-reminders',
  middleware.verifyToken,
  // middleware.isAdmin,
  schedulerController.runEventReminders,
);

// Chạy riêng payment reminders
Router.post(
  '/payment-reminders',
  middleware.verifyToken,
  // middleware.isAdmin,
  schedulerController.runPaymentReminders,
);

export default Router;
