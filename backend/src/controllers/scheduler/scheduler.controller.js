// controllers/scheduler/scheduler.controller.js

import { runScheduledEmailJobs } from '../../services/scheduler/index.js';
import asyncWrapper from '../../middlewares/error.handler.js';
import { utils } from '../../utils/index.js';

const schedulerController = {
  // Chạy tất cả scheduled jobs (có thể gọi thủ công hoặc từ cron)
  runEmailJobs: asyncWrapper(async (req, res) => {
    const results = await runScheduledEmailJobs();
    return utils.success(res, 'Đã chạy scheduled email jobs', { results });
  }),

  // Chạy riêng event reminders
  runEventReminders: asyncWrapper(async (req, res) => {
    const { sendEventReminders } = await import(
      '../../services/scheduler/emailScheduler.service.js'
    );
    const result = await sendEventReminders();
    return utils.success(res, 'Đã chạy event reminders', { result });
  }),

  // Chạy riêng payment reminders
  runPaymentReminders: asyncWrapper(async (req, res) => {
    const { sendPaymentReminders } = await import(
      '../../services/scheduler/emailScheduler.service.js'
    );
    const result = await sendPaymentReminders();
    return utils.success(res, 'Đã chạy payment reminders', { result });
  }),
};

export default schedulerController;
