// services/email/emailService.js
// Service xử lý tất cả các email trong hệ thống

import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import { sendMail } from '../../utils/mailer.js';
import templateRenderer from './templateRenderer.service.js';
import EmailTemplateModel from '../../models/admin/emailTemplate.model.js';
import EmailLogModel from '../../models/admin/emailLog.model.js';
import ServiceError from '../../error/service.error.js';
import { config } from '../../config/index.js';
const { emailConfig } = config;

/**
 * Render template từ file .hbs (cho email cố định)
 * @param {string} templateName - Tên template (không có .hbs)
 * @param {Object} variables - Biến để render
 * @returns {string} HTML đã render
 */
const renderTemplateFromFile = (templateName, variables) => {
  const filePath = path.join(
    process.cwd(),
    'src/emails',
    `${templateName}.hbs`,
  );

  if (!fs.existsSync(filePath)) {
    throw new ServiceError(
      `File template không tồn tại: ${templateName}.hbs`,
      'TEMPLATE_FILE_NOT_FOUND',
      `Không tìm thấy file tại: ${filePath}`,
      404,
    );
  }

  const source = fs.readFileSync(filePath, 'utf8');
  const compiled = handlebars.compile(source);
  const content = compiled(variables);

  // Kiểm tra xem content đã có wrapper HTML chưa
  const hasHtmlWrapper =
    content.trim().toLowerCase().startsWith('<!doctype') ||
    content.trim().toLowerCase().startsWith('<html');

  if (hasHtmlWrapper) {
    // Nếu đã có wrapper, chỉ thêm footer vào body
    return content.replace(/<\/body>/i, `${emailConfig.defaultFooter}</body>`);
  } else {
    // Nếu chưa có wrapper, wrap toàn bộ với email wrapper (có footer)
    return emailConfig.emailWrapper(content);
  }
};

class EmailService {
  // ==================== XÁC THỰC ====================

  /**
   * Gửi email OTP đăng nhập
   * @param {Object} info - Thông tin: { email, otp }
   * @returns {Promise<Object>} Kết quả gửi email
   */
  async sendLoginOtp(info) {
    try {
      if (!info?.email || !info?.otp) {
        throw new ServiceError(
          'Thiếu thông tin email hoặc OTP',
          'MISSING_OTP_INFO',
          'Cần có email và otp để gửi email OTP',
          400,
        );
      }

      const html = renderTemplateFromFile('loginOTP', {
        otp: info.otp,
      });

      return await sendMail({
        to: info.email,
        subject: 'Mã OTP đăng nhập - Bee IT Club',
        html,
      });
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(
        'Gửi email OTP thất bại',
        'SEND_OTP_FAILED',
        error.message,
        500,
      );
    }
  }

  // ==================== ĐƠN ĐĂNG KÝ THÀNH VIÊN ====================

  /**
   * Gửi email xác nhận đã nhận đơn đăng ký
   * @param {Object} application - Thông tin đơn: { fullname, email, student_id }
   * @returns {Promise<Object>} Kết quả gửi email
   */
  async sendApplicationReceived(application) {
    try {
      if (!application?.email) {
        throw new ServiceError(
          'Thiếu email người nhận',
          'MISSING_EMAIL',
          'Cần có email để gửi thông báo',
          400,
        );
      }

      const html = renderTemplateFromFile('applicationReceived', {
        fullname: application.fullname || 'Ứng viên',
        email: application.email,
        student_id: application.student_id || '',
      });

      return await sendMail({
        to: application.email,
        subject: 'Xác nhận nộp đơn thành công - Bee IT Club',
        html,
      });
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(
        'Gửi email xác nhận đơn thất bại',
        'SEND_APPLICATION_RECEIVED_FAILED',
        error.message,
        500,
      );
    }
  }

  /**
   * Gửi email thông báo lịch phỏng vấn
   * @param {Object} application - Thông tin đơn
   * @param {Object} schedule - Thông tin lịch: { title, interview_date, start_time, end_time, location, description }
   * @returns {Promise<Object>} Kết quả gửi email
   */
  async sendInterviewScheduled(application, schedule) {
    try {
      if (!application?.email) {
        throw new ServiceError(
          'Thiếu email người nhận',
          'MISSING_EMAIL',
          null,
          400,
        );
      }

      // Format ngày phỏng vấn
      const interviewDate = new Date(
        schedule.interview_date,
      ).toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      // Format thời gian (HH:MM)
      const startTime = schedule.start_time?.substring(0, 5) || '';
      const endTime = schedule.end_time?.substring(0, 5) || '';

      const html = renderTemplateFromFile('interviewScheduled', {
        fullname: application.fullname || 'Ứng viên',
        schedule_title: schedule.title || 'Phỏng vấn',
        interview_date: interviewDate,
        start_time: startTime,
        end_time: endTime,
        location: schedule.location || '',
        description: schedule.description || '',
      });

      return await sendMail({
        to: application.email,
        subject: `Thông báo lịch phỏng vấn - ${
          schedule.title || 'Bee IT Club'
        }`,
        html,
      });
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(
        'Gửi email lịch phỏng vấn thất bại',
        'SEND_INTERVIEW_SCHEDULED_FAILED',
        error.message,
        500,
      );
    }
  }

  /**
   * Gửi email thông báo đơn được phê duyệt
   * @param {Object} application - Thông tin đơn: { fullname, email, interview_notes }
   * @returns {Promise<Object>} Kết quả gửi email
   */
  async sendApplicationApproved(application) {
    try {
      if (!application?.email) {
        throw new ServiceError(
          'Thiếu email người nhận',
          'MISSING_EMAIL',
          null,
          400,
        );
      }

      const html = renderTemplateFromFile('applicationApproved', {
        fullname: application.fullname || 'Ứng viên',
        email: application.email,
        interview_notes: application.interview_notes || '',
      });

      return await sendMail({
        to: application.email,
        subject: '🎉 Chúc mừng! Đơn đăng ký của bạn đã được phê duyệt',
        html,
      });
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(
        'Gửi email phê duyệt đơn thất bại',
        'SEND_APPLICATION_APPROVED_FAILED',
        error.message,
        500,
      );
    }
  }

  /**
   * Gửi email thông báo đơn bị từ chối
   * @param {Object} application - Thông tin đơn: { fullname, email, interview_notes }
   * @returns {Promise<Object>} Kết quả gửi email
   */
  async sendApplicationRejected(application) {
    try {
      if (!application?.email) {
        throw new ServiceError(
          'Thiếu email người nhận',
          'MISSING_EMAIL',
          null,
          400,
        );
      }

      const html = renderTemplateFromFile('applicationRejected', {
        fullname: application.fullname || 'Ứng viên',
        interview_notes: application.interview_notes || '',
      });

      return await sendMail({
        to: application.email,
        subject: 'Thông báo về đơn đăng ký - Bee IT Club',
        html,
      });
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(
        'Gửi email từ chối đơn thất bại',
        'SEND_APPLICATION_REJECTED_FAILED',
        error.message,
        500,
      );
    }
  }

  // ==================== SỰ KIỆN ====================

  /**
   * Gửi email xác nhận đăng ký sự kiện
   * @param {Object} registration - Thông tin đăng ký: { registration_type, guest_email, guest_name, notes }
   * @param {Object} event - Thông tin sự kiện: { title, start_time, end_time, location, registration_deadline }
   * @param {Object|null} user - Thông tin user (nếu đăng ký private)
   * @returns {Promise<Object>} Kết quả gửi email
   */
  async sendEventRegistrationConfirmed(registration, event, user = null) {
    try {
      // Xác định email và tên người nhận
      const recipientEmail =
        registration.registration_type === 'private' && user
          ? user.email
          : registration.guest_email;

      const recipientName =
        registration.registration_type === 'private' && user
          ? user.fullname
          : registration.guest_name;

      if (!recipientEmail) {
        throw new ServiceError(
          'Thiếu email người nhận',
          'MISSING_EMAIL',
          null,
          400,
        );
      }

      // Format thời gian
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

      const html = renderTemplateFromFile('eventRegistrationConfirmed', {
        fullname: recipientName || 'Bạn',
        event_title: event.title || 'Sự kiện',
        start_time: startTime,
        end_time: endTime,
        location: event.location || '',
        registration_deadline: registrationDeadline,
        notes: registration.notes || '',
      });

      return await sendMail({
        to: recipientEmail,
        subject: `✅ Xác nhận đăng ký tham gia: ${event.title || 'Sự kiện'}`,
        html,
      });
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(
        'Gửi email xác nhận đăng ký sự kiện thất bại',
        'SEND_EVENT_REGISTRATION_FAILED',
        error.message,
        500,
      );
    }
  }

  /**
   * Gửi email nhắc nhở sự kiện
   * @param {Object} registration - Thông tin đăng ký
   * @param {Object} event - Thông tin sự kiện
   * @param {Object|null} user - Thông tin user
   * @returns {Promise<Object>} Kết quả gửi email
   */
  async sendEventReminder(registration, event, user = null) {
    try {
      const recipientEmail =
        registration.registration_type === 'private' && user
          ? user.email
          : registration.guest_email;

      const recipientName =
        registration.registration_type === 'private' && user
          ? user.fullname
          : registration.guest_name;

      if (!recipientEmail) {
        throw new ServiceError(
          'Thiếu email người nhận',
          'MISSING_EMAIL',
          null,
          400,
        );
      }

      // Format thời gian
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

      // Tính thời gian còn lại
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

      const html = renderTemplateFromFile('eventReminder', {
        fullname: recipientName || 'Bạn',
        event_title: event.title || 'Sự kiện',
        start_time: startTime,
        end_time: endTime,
        location: event.location || '',
        time_until: timeUntil,
      });

      return await sendMail({
        to: recipientEmail,
        subject: `⏰ Nhắc nhở: ${event.title || 'Sự kiện'} sắp diễn ra`,
        html,
      });
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(
        'Gửi email nhắc nhở sự kiện thất bại',
        'SEND_EVENT_REMINDER_FAILED',
        error.message,
        500,
      );
    }
  }

  /**
   * Gửi email xác nhận điểm danh sự kiện
   * @param {Object} attendance - Thông tin điểm danh: { check_in_time, notes }
   * @param {Object} event - Thông tin sự kiện
   * @param {Object|null} user - Thông tin user
   * @returns {Promise<Object>} Kết quả gửi email
   */
  async sendEventCheckInConfirmation(attendance, event, user = null) {
    try {
      if (!user?.email) {
        throw new ServiceError(
          'Chỉ gửi email cho user đã đăng nhập',
          'USER_NOT_LOGGED_IN',
          null,
          400,
        );
      }

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

      const html = renderTemplateFromFile('eventCheckInConfirmation', {
        fullname: user.fullname || 'Bạn',
        event_title: event.title || 'Sự kiện',
        check_in_time: checkInTime,
        location: event.location || '',
        notes: attendance.notes || '',
      });

      return await sendMail({
        to: user.email,
        subject: `✅ Xác nhận điểm danh: ${event.title || 'Sự kiện'}`,
        html,
      });
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(
        'Gửi email xác nhận điểm danh thất bại',
        'SEND_CHECKIN_CONFIRMATION_FAILED',
        error.message,
        500,
      );
    }
  }

  /**
   * Gửi email thông báo hủy/thay đổi sự kiện
   * @param {Object} registration - Thông tin đăng ký
   * @param {Object} event - Thông tin sự kiện
   * @param {boolean} isCancelled - Sự kiện bị hủy hay chỉ thay đổi
   * @param {Object} changes - Thông tin thay đổi: { original_start_time, new_start_time, original_location, new_location, reason }
   * @param {Object|null} user - Thông tin user
   * @returns {Promise<Object>} Kết quả gửi email
   */
  async sendEventCancellation(
    registration,
    event,
    isCancelled = false,
    changes = {},
    user = null,
  ) {
    try {
      const recipientEmail =
        registration.registration_type === 'private' && user
          ? user.email
          : registration.guest_email;

      const recipientName =
        registration.registration_type === 'private' && user
          ? user.fullname
          : registration.guest_name;

      if (!recipientEmail) {
        throw new ServiceError(
          'Thiếu email người nhận',
          'MISSING_EMAIL',
          null,
          400,
        );
      }

      // Format các thời gian nếu có thay đổi
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

      const html = renderTemplateFromFile('eventCancellation', {
        fullname: recipientName || 'Bạn',
        event_title: event.title || 'Sự kiện',
        is_cancelled: isCancelled,
        original_start_time: originalStartTime,
        new_start_time: newStartTime,
        start_time: startTime,
        original_location: changes.original_location || '',
        new_location: changes.new_location || '',
        location: event.location || '',
        reason: changes.reason || '',
      });

      return await sendMail({
        to: recipientEmail,
        subject: isCancelled
          ? `🚫 Sự kiện "${event.title || 'Sự kiện'}" đã bị hủy`
          : `⚠️ Thông báo thay đổi: ${event.title || 'Sự kiện'}`,
        html,
      });
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(
        'Gửi email thông báo hủy/thay đổi sự kiện thất bại',
        'SEND_EVENT_CANCELLATION_FAILED',
        error.message,
        500,
      );
    }
  }

  // ==================== EMAIL KHÁC ====================

  /**
   * Gửi email chào mừng thành viên mới
   * @param {Object} user - Thông tin user: { fullname, email }
   * @returns {Promise<Object>} Kết quả gửi email
   */
  async sendWelcomeEmail(user) {
    try {
      if (!user?.email) {
        throw new ServiceError(
          'Thiếu email người nhận',
          'MISSING_EMAIL',
          null,
          400,
        );
      }

      const html = renderTemplateFromFile('welcome', {
        fullname: user.fullname || 'Thành viên',
        email: user.email,
      });

      return await sendMail({
        to: user.email,
        subject: '🎉 Chào mừng bạn đến với CLB!',
        html,
      });
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(
        'Gửi email chào mừng thất bại',
        'SEND_WELCOME_EMAIL_FAILED',
        error.message,
        500,
      );
    }
  }

  /**
   * Gửi email thông báo cấp quyền truy cập tài liệu
   * @param {Object} user - Thông tin user
   * @param {Object} document - Thông tin tài liệu: { title, description }
   * @param {Object|null} category - Thông tin danh mục: { name }
   * @returns {Promise<Object>} Kết quả gửi email
   */
  async sendDocumentAccessGranted(user, document, category = null) {
    try {
      if (!user?.email) {
        throw new ServiceError(
          'Thiếu email người nhận',
          'MISSING_EMAIL',
          null,
          400,
        );
      }

      const html = renderTemplateFromFile('documentAccessGranted', {
        fullname: user.fullname || 'Thành viên',
        document_title: document.title || 'Tài liệu',
        document_category: category?.name || null,
        document_description: document.description || '',
      });

      return await sendMail({
        to: user.email,
        subject: `📄 Bạn đã được cấp quyền truy cập: ${
          document.title || 'Tài liệu'
        }`,
        html,
      });
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(
        'Gửi email cấp quyền tài liệu thất bại',
        'SEND_DOCUMENT_ACCESS_FAILED',
        error.message,
        500,
      );
    }
  }

  /**
   * Gửi email đặt lại mật khẩu
   * @param {Object} user - Thông tin user
   * @param {string} resetCode - Mã đặt lại mật khẩu
   * @param {string|null} resetLink - Link đặt lại mật khẩu (nếu có)
   * @param {number} expiresIn - Thời gian hết hạn (phút, mặc định 15)
   * @returns {Promise<Object>} Kết quả gửi email
   */
  async sendPasswordReset(user, resetCode, resetLink = null, expiresIn = 15) {
    try {
      if (!user?.email || !resetCode) {
        throw new ServiceError(
          'Thiếu email hoặc mã đặt lại mật khẩu',
          'MISSING_RESET_INFO',
          null,
          400,
        );
      }

      const html = renderTemplateFromFile('passwordReset', {
        fullname: user.fullname || 'Người dùng',
        reset_code: resetCode,
        reset_link: resetLink,
        expires_in: expiresIn,
      });

      return await sendMail({
        to: user.email,
        subject: '🔐 Đặt lại mật khẩu - Bee IT Club',
        html,
      });
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(
        'Gửi email đặt lại mật khẩu thất bại',
        'SEND_PASSWORD_RESET_FAILED',
        error.message,
        500,
      );
    }
  }

  /**
   * Gửi email nhắc nhở đóng phí
   * @param {Object} member - Thông tin thành viên: { fullname, email, deadline, amount }
   * @returns {Promise<Object>} Kết quả gửi email
   */
  async sendReminder(member) {
    try {
      if (!member?.email) {
        throw new ServiceError(
          'Thiếu email người nhận',
          'MISSING_EMAIL',
          null,
          400,
        );
      }

      // Format deadline
      const deadline = member.deadline
        ? new Date(member.deadline).toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : member.deadline;

      // Tính số ngày còn lại
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

      const html = renderTemplateFromFile('reminder', {
        name: member.fullname || 'Thành viên',
        deadline: deadline,
        amount: member.amount || 0,
        days_remaining: daysRemaining,
      });

      return await sendMail({
        to: member.email,
        subject: '⏰ Nhắc nhở hạn đóng phí - Bee IT Club',
        html,
      });
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(
        'Gửi email nhắc nhở thất bại',
        'SEND_REMINDER_FAILED',
        error.message,
        500,
      );
    }
  }

  // ==================== EMAIL ĐỘNG (TEMPLATE TỪ DATABASE) ====================

  /**
   * Gửi email động sử dụng template từ database
   * CHỈ hỗ trợ template từ database, không có fallback file
   *
   * @param {number|string} templateIdOrSlug - Template ID hoặc slug
   * @param {string} recipientEmail - Email người nhận
   * @param {Object} variables - Variables để render template
   * @returns {Promise<Object>} Kết quả gửi email
   *
   * @example
   * await emailService.sendDynamicEmail(
   *   'event-notification',
   *   'user@example.com',
   *   { fullname: 'Nguyễn Văn A', event_title: 'Workshop ReactJS' }
   * );
   */
  async sendDynamicEmail(templateIdOrSlug, recipientEmail, variables = {}) {
    let template = null;
    let html = null;
    let subject = null;
    let templateId = null;
    let templateName = null;
    let templateSlug = null;

    try {
      // 1. Validate email người nhận
      if (!recipientEmail || typeof recipientEmail !== 'string') {
        throw new ServiceError(
          'Email người nhận không hợp lệ',
          'INVALID_RECIPIENT_EMAIL',
          'Email phải là chuỗi không rỗng',
          400,
        );
      }

      // 2. Lấy template từ database (CHỈ từ DB, không có fallback)
      if (
        typeof templateIdOrSlug === 'number' ||
        /^\d+$/.test(templateIdOrSlug)
      ) {
        template = await EmailTemplateModel.getTemplateById(templateIdOrSlug);
      } else {
        template = await EmailTemplateModel.getTemplateBySlug(templateIdOrSlug);
      }

      // 3. Validate template tồn tại
      if (!template) {
        throw new ServiceError(
          `Template không tồn tại: ${templateIdOrSlug}`,
          'TEMPLATE_NOT_FOUND',
          'Chỉ hỗ trợ template từ database. Vui lòng kiểm tra lại template ID hoặc slug.',
          404,
        );
      }

      // 4. Kiểm tra template có active không
      if (!template.is_active) {
        throw new ServiceError(
          'Template không được kích hoạt',
          'TEMPLATE_NOT_ACTIVE',
          `Template "${template.name}" đang ở trạng thái không hoạt động`,
          400,
        );
      }

      // 5. Lưu thông tin template
      templateId = template.id;
      templateName = template.name;
      templateSlug = template.slug;

      // 6. Render template từ database
      html = await templateRenderer.renderFromDatabase(
        templateIdOrSlug,
        variables,
      );
      subject = await templateRenderer.renderSubject(template, variables);

      // 7. Gửi email
      const result = await sendMail({
        to: recipientEmail,
        subject,
        html,
      });

      // 8. Log vào email_logs (chỉ log nếu có template từ DB)
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
          // Không throw error để không ảnh hưởng đến việc gửi email
          console.error('Lỗi khi log email:', logError);
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

      // Throw lại error (đã là ServiceError hoặc chuyển thành ServiceError)
      if (error instanceof ServiceError) {
        throw error;
      }

      throw new ServiceError(
        'Gửi email động thất bại',
        'SEND_DYNAMIC_EMAIL_FAILED',
        error.message,
        500,
      );
    }
  }
}

export default new EmailService();
