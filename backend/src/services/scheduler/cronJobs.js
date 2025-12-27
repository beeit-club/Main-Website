// services/scheduler/cronJobs.js
// Lưu ý: Cần cài đặt node-cron: npm install node-cron

/**
 * Scheduled Jobs cho Email System
 * 
 * Để sử dụng, uncomment code bên dưới và cài đặt node-cron:
 * npm install node-cron
 * 
 * Sau đó import file này vào server.js:
 * import './services/scheduler/cronJobs.js';
 */

// Uncomment để sử dụng:
/*
import cron from 'node-cron';
import { sendEventReminders, sendPaymentReminders } from './emailScheduler.service.js';

// Chạy event reminders mỗi giờ (vào phút 0 của mỗi giờ)
cron.schedule('0 * * * *', async () => {
  console.log('🕐 [Cron] Chạy event reminders...', new Date().toISOString());
  try {
    const result = await sendEventReminders();
    console.log('✅ [Cron] Event reminders kết quả:', result);
  } catch (error) {
    console.error('❌ [Cron] Lỗi event reminders:', error);
  }
});

// Chạy payment reminders mỗi ngày lúc 9h sáng
cron.schedule('0 9 * * *', async () => {
  console.log('💰 [Cron] Chạy payment reminders...', new Date().toISOString());
  try {
    const result = await sendPaymentReminders();
    console.log('✅ [Cron] Payment reminders kết quả:', result);
  } catch (error) {
    console.error('❌ [Cron] Lỗi payment reminders:', error);
  }
});

console.log('📅 Scheduled jobs đã được khởi động');
*/

// Tạm thời comment để không cần node-cron ngay
// Uncomment và cài node-cron khi cần sử dụng

