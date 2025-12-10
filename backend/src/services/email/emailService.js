import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import { sendMail } from '../../utils/mailer.js';
import templateRenderer from './templateRenderer.service.js';
import EmailTemplateModel from '../../models/admin/emailTemplate.model.js';
import EmailLogModel from '../../models/admin/emailLog.model.js';

const renderTemplate = (templateName, variables) => {
  const filePath = path.join(
    process.cwd(),
    'src/emails',
    `${templateName}.hbs`,
  );
  const source = fs.readFileSync(filePath, 'utf8');
  const compiled = handlebars.compile(source);
  return compiled(variables);
};

export const emailService = {
  // === AUTHENTICATION ===
  async sendLoginOtp(info) {
    const html = renderTemplate('loginOTP', {
      otp: info.otp,
    });
    return sendMail({
      to: info.email,
      subject: 'Mã OTP đăng nhập - CLB Management',
      html,
    });
  },

  // === MEMBERSHIP APPLICATIONS ===
  async sendApplicationReceived(application) {
    const html = renderTemplate('applicationReceived', {
      fullname: application.fullname,
      email: application.email,
      student_id: application.student_id,
    });
    return sendMail({
      to: application.email,
      subject: 'Xác nhận nộp đơn thành công - CLB Management',
      html,
    });
  },

  async sendInterviewScheduled(application, schedule) {
    // Format date and time
    const interviewDate = new Date(schedule.interview_date).toLocaleDateString(
      'vi-VN',
      {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      },
    );
    const startTime = schedule.start_time.substring(0, 5); // HH:MM
    const endTime = schedule.end_time.substring(0, 5); // HH:MM

    const html = renderTemplate('interviewScheduled', {
      fullname: application.fullname,
      schedule_title: schedule.title,
      interview_date: interviewDate,
      start_time: startTime,
      end_time: endTime,
      location: schedule.location,
      description: schedule.description,
    });
    return sendMail({
      to: application.email,
      subject: `Thông báo lịch phỏng vấn - ${schedule.title}`,
      html,
    });
  },

  async sendApplicationApproved(application) {
    const html = renderTemplate('applicationApproved', {
      fullname: application.fullname,
      email: application.email,
      interview_notes: application.interview_notes,
    });
    return sendMail({
      to: application.email,
      subject: '🎉 Chúc mừng! Đơn đăng ký của bạn đã được phê duyệt',
      html,
    });
  },

  async sendApplicationRejected(application) {
    const html = renderTemplate('applicationRejected', {
      fullname: application.fullname,
      interview_notes: application.interview_notes,
    });
    return sendMail({
      to: application.email,
      subject: 'Thông báo về đơn đăng ký - CLB Management',
      html,
    });
  },

  // === EVENT REGISTRATIONS ===
  async sendEventRegistrationConfirmed(registration, event, user = null) {
    // Format dates
    const startTime = new Date(event.start_time).toLocaleString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    const endTime = new Date(event.end_time).toLocaleString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const registrationDeadline = event.registration_deadline
      ? new Date(event.registration_deadline).toLocaleDateString('vi-VN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : null;

    const recipientEmail =
      registration.registration_type === 'private' && user
        ? user.email
        : registration.guest_email;

    const recipientName =
      registration.registration_type === 'private' && user
        ? user.fullname
        : registration.guest_name;

    const html = renderTemplate('eventRegistrationConfirmed', {
      fullname: recipientName,
      event_title: event.title,
      start_time: startTime,
      end_time: endTime,
      location: event.location,
      registration_deadline: registrationDeadline,
      notes: registration.notes,
    });
    return sendMail({
      to: recipientEmail,
      subject: `✅ Xác nhận đăng ký tham gia: ${event.title}`,
      html,
    });
  },

  // === WELCOME EMAIL ===
  async sendWelcomeEmail(user) {
    const html = renderTemplate('welcome', {
      fullname: user.fullname,
      email: user.email,
    });
    return sendMail({
      to: user.email,
      subject: '🎉 Chào mừng bạn đến với CLB!',
      html,
    });
  },

  // === EVENT REMINDERS & NOTIFICATIONS ===
  async sendEventReminder(registration, event, user = null) {
    const startTime = new Date(event.start_time).toLocaleString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    const endTime = new Date(event.end_time).toLocaleString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    // Calculate time until event
    const now = new Date();
    const eventStart = new Date(event.start_time);
    const diffMs = eventStart - now;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    let timeUntil = '';
    if (diffDays > 0) {
      timeUntil = `${diffDays} ngày`;
    } else if (diffHours > 0) {
      timeUntil = `${diffHours} giờ`;
    } else {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      timeUntil = `${diffMinutes} phút`;
    }

    const recipientEmail =
      registration.registration_type === 'private' && user
        ? user.email
        : registration.guest_email;

    const recipientName =
      registration.registration_type === 'private' && user
        ? user.fullname
        : registration.guest_name;

    const html = renderTemplate('eventReminder', {
      fullname: recipientName,
      event_title: event.title,
      start_time: startTime,
      end_time: endTime,
      location: event.location,
      time_until: timeUntil,
    });
    return sendMail({
      to: recipientEmail,
      subject: `⏰ Nhắc nhở: ${event.title} sắp diễn ra`,
      html,
    });
  },

  async sendEventCheckInConfirmation(attendance, event, user = null) {
    const checkInTime = new Date(attendance.check_in_time).toLocaleString(
      'vi-VN',
      {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      },
    );

    const recipientName = user ? user.fullname : 'bạn';

    const html = renderTemplate('eventCheckInConfirmation', {
      fullname: recipientName,
      event_title: event.title,
      check_in_time: checkInTime,
      location: event.location,
      notes: attendance.notes,
    });
    return sendMail({
      to: user ? user.email : null, // Chỉ gửi cho user đã đăng nhập
      subject: `✅ Xác nhận điểm danh: ${event.title}`,
      html,
    });
  },

  async sendEventCancellation(
    registration,
    event,
    isCancelled = false,
    changes = {},
    user = null,
  ) {
    const recipientEmail =
      registration.registration_type === 'private' && user
        ? user.email
        : registration.guest_email;

    const recipientName =
      registration.registration_type === 'private' && user
        ? user.fullname
        : registration.guest_name;

    // Format dates if changed
    const originalStartTime = changes.original_start_time
      ? new Date(changes.original_start_time).toLocaleString('vi-VN', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : null;

    const newStartTime = changes.new_start_time
      ? new Date(changes.new_start_time).toLocaleString('vi-VN', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : null;

    const startTime = event.start_time
      ? new Date(event.start_time).toLocaleString('vi-VN', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : null;

    const html = renderTemplate('eventCancellation', {
      fullname: recipientName,
      event_title: event.title,
      is_cancelled: isCancelled,
      original_start_time: originalStartTime,
      new_start_time: newStartTime,
      start_time: startTime,
      original_location: changes.original_location,
      new_location: changes.new_location,
      location: event.location,
      reason: changes.reason,
    });
    return sendMail({
      to: recipientEmail,
      subject: isCancelled
        ? `🚫 Sự kiện "${event.title}" đã bị hủy`
        : `⚠️ Thông báo thay đổi: ${event.title}`,
      html,
    });
  },

  // === DOCUMENT ACCESS ===
  async sendDocumentAccessGranted(user, document, category = null) {
    const html = renderTemplate('documentAccessGranted', {
      fullname: user.fullname,
      document_title: document.title,
      document_category: category ? category.name : null,
      document_description: document.description,
    });
    return sendMail({
      to: user.email,
      subject: `📄 Bạn đã được cấp quyền truy cập: ${document.title}`,
      html,
    });
  },

  // === PASSWORD RESET ===
  async sendPasswordReset(user, resetCode, resetLink = null, expiresIn = 15) {
    const html = renderTemplate('passwordReset', {
      fullname: user.fullname,
      reset_code: resetCode,
      reset_link: resetLink,
      expires_in: expiresIn,
    });
    return sendMail({
      to: user.email,
      subject: '🔐 Đặt lại mật khẩu - CLB Management',
      html,
    });
  },

  // === REMINDER ===
  async sendReminder(member) {
    // Format deadline
    const deadline = member.deadline
      ? new Date(member.deadline).toLocaleDateString('vi-VN', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : member.deadline;

    // Calculate days remaining
    let daysRemaining = null;
    if (member.deadline) {
      const now = new Date();
      const deadlineDate = new Date(member.deadline);
      const diffMs = deadlineDate - now;
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays > 0) {
        daysRemaining = `${diffDays} ngày`;
      } else if (diffDays === 0) {
        daysRemaining = 'Hôm nay';
      } else {
        daysRemaining = 'Đã quá hạn';
      }
    }

    const html = renderTemplate('reminder', {
      name: member.fullname,
      deadline: deadline,
      amount: member.amount,
      days_remaining: daysRemaining,
    });
    return sendMail({
      to: member.email,
      subject: '⏰ Nhắc nhở hạn đóng phí - CLB Management',
      html,
    });
  },

  // === DYNAMIC EMAIL ===
  async sendDynamicEmail(templateIdOrSlug, recipientEmail, variables = {}) {
    let template = null;
    let html = null;
    let subject = null;
    let templateId = null;
    let templateName = null;
    let templateSlug = null;

    try {
      // 1. Try get template từ database
      if (typeof templateIdOrSlug === 'number' || /^\d+$/.test(templateIdOrSlug)) {
        template = await EmailTemplateModel.getTemplateById(templateIdOrSlug);
      } else {
        template = await EmailTemplateModel.getTemplateBySlug(templateIdOrSlug);
      }

      if (template) {
        // Render từ database
        templateId = template.id;
        templateName = template.name;
        templateSlug = template.slug;
        html = await templateRenderer.renderFromDatabase(templateIdOrSlug, variables);
        subject = templateRenderer.renderSubject(template, variables);
      } else {
        // 2. Fallback về file
        html = templateRenderer.renderFromFile(templateIdOrSlug, variables);
        subject = 'Email từ CLB Management';
        templateSlug = templateIdOrSlug;
      }

      // 3. Gửi email
      const result = await sendMail({
        to: recipientEmail,
        subject,
        html,
      });

      // 4. Log vào email_logs (chỉ log nếu có template từ DB)
      if (templateId) {
        try {
          await EmailLogModel.createLog({
            template_id: templateId,
            template_name: templateName,
            template_slug: templateSlug,
            recipient_email: recipientEmail,
            subject,
            status: 'sent',
            variables_used: JSON.stringify(variables),
            sent_at: new Date(),
          });
        } catch (logError) {
          console.error('Lỗi khi log email:', logError);
          // Không throw error để không ảnh hưởng đến việc gửi email
        }
      }

      return result;
    } catch (error) {
      // Log error nếu có template_id
      if (templateId) {
        try {
          await EmailLogModel.createLog({
            template_id: templateId,
            template_name: templateName,
            template_slug: templateSlug,
            recipient_email: recipientEmail,
            subject: subject || 'Error',
            status: 'failed',
            error_message: error.message,
            variables_used: JSON.stringify(variables),
          });
        } catch (logError) {
          console.error('Lỗi khi log email error:', logError);
        }
      }

      throw error;
    }
  },
};
