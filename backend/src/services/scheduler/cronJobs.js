// services/scheduler/cronJobs.js
import cron from 'node-cron';
import { sendEventReminders } from './emailScheduler.service.js';

/**
 * Scheduled Jobs cho Hệ thống
 */

// Chạy event reminders mỗi giờ
cron.schedule('0 * * * *', async () => {
  console.log('🕐 [Cron] Chạy event reminders...', new Date().toISOString());
  try {
    const result = await sendEventReminders();
    console.log('✅ [Cron] Event reminders kết quả:', result);
  } catch (error) {
    console.error('❌ [Cron] Lỗi event reminders:', error);
  }
});

// Có thể thêm các job khác ở đây
// cron.schedule('0 9 * * *', async () => { ... });

console.log('📅 Scheduled jobs (Cron) đã được khởi động');
