// services/scheduler/emailScheduler.service.js

import eventModel from '../../models/admin/event.model.js';
import emailService from '../email/emailService.js';
import { AuthModel } from '../../models/auth/index.js';

/**
 * Gửi reminder cho các sự kiện sắp diễn ra
 * Nên chạy mỗi giờ để gửi reminder cho events trong 24h tới
 */
export async function sendEventReminders() {
  try {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setHours(tomorrow.getHours() + 24);

    // Lấy tất cả events sắp diễn ra trong 24h tới và chưa bị xóa
    // getAllEvents trả về paginated result với { data, pagination }
    const eventsResult = await eventModel.getAllEvents({
      start_date: now.toISOString().split('T')[0],
      end_date: tomorrow.toISOString().split('T')[0],
      status: 1, // Chỉ lấy events đã published
      limit: 1000, // Lấy nhiều events
    });

    const events = eventsResult.data || eventsResult || [];
    if (!events || events.length === 0) {
      return { sent: 0, message: 'Không có sự kiện nào sắp diễn ra' };
    }

    let totalSent = 0;
    const errors = [];

    for (const event of events) {
      try {
        // Lấy tất cả registrations của event này
        const registrationsResult =
          await eventModel.getAllRegistrationsForEvent(event.id, {
            limit: 1000, // Lấy nhiều registrations
          });
        // getAllRegistrationsForEvent trả về paginated result
        const registrations =
          registrationsResult.data || registrationsResult || [];

        // Chỉ gửi reminder cho events trong 24h tới
        const eventStart = new Date(event.start_time);
        const hoursUntil = (eventStart - now) / (1000 * 60 * 60);

        // Gửi reminder nếu event diễn ra trong 24h tới và chưa diễn ra
        if (hoursUntil > 0 && hoursUntil <= 24) {
          for (const reg of registrations) {
            try {
              const user = reg.user_id
                ? await AuthModel.getUserById(reg.user_id)
                : null;

              // Kiểm tra xem đã gửi reminder chưa (có thể lưu flag trong DB)
              // Tạm thời gửi mỗi lần chạy, có thể cải thiện sau
              await emailService.sendEventReminder(reg, event, user);
              totalSent++;
            } catch (emailError) {
              errors.push({
                event_id: event.id,
                registration_id: reg.id,
                error: emailError.message,
              });
            }
          }
        }
      } catch (eventError) {
        errors.push({
          event_id: event.id,
          error: eventError.message,
        });
      }
    }

    return {
      sent: totalSent,
      errors: errors.length > 0 ? errors : null,
      message: `Đã gửi ${totalSent} email reminder`,
    };
  } catch (error) {
    console.error('Lỗi khi gửi event reminders:', error);
    throw error;
  }
}

/**
 * Chạy tất cả scheduled email jobs
 */
export async function runScheduledEmailJobs() {
  const results = {
    eventReminders: null,
  };

  try {
    results.eventReminders = await sendEventReminders();
  } catch (error) {
    results.eventReminders = { error: error.message };
  }

  return results;
}
