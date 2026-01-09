// services/email/emailService.js
// Service xử lý tất cả các email trong hệ thống
// Đã chuyển đổi sang sử dụng Dynamic Email Templates (Database-driven)

import EmailTemplateModel from '../../models/admin/emailTemplate.model.js';
import SystemEmailMappingModel from '../../models/admin/systemEmailMapping.model.js';
import EmailLogModel from '../../models/admin/emailLog.model.js';
import templateRenderer from './templateRenderer.service.js';
import { sendMail } from '../../utils/mailer.js';
import ServiceError from '../../error/service.error.js';

class EmailService {
  /**
   * Gửi email theo một "hành động" hệ thống được định nghĩa trước
   * @param {string} actionKey - Key của hành động (e.g., 'AUTH_LOGIN_OTP')
   * @param {string} recipientEmail 
   * @param {Object} variables 
   */
  async sendEmailByAction(actionKey, recipientEmail, variables = {}) {
    const mapping = await SystemEmailMappingModel.getMappingByAction(actionKey);
    
    if (!mapping) {
      throw new ServiceError(
        `Hành động email "${actionKey}" không tồn tại.`, 'ACTION_NOT_FOUND', null, 404
      );
    }
    
    if (!mapping.template_id) {
      console.error(`Chưa có template nào được gán cho hành động "${actionKey}". Email sẽ không được gửi.`);
      // Hoặc throw lỗi để báo cho dev biết
      throw new ServiceError(
        `Chưa gán template cho hành động "${actionKey}".`, 'TEMPLATE_NOT_MAPPED', null, 500
      );
    }
    
    return this.sendDynamicEmail(mapping.template_id, recipientEmail, variables);
  }

  // ==================== CORE: GỬI EMAIL ĐỘNG ====================

  /**
   * Gửi email động sử dụng template từ database
   *
   * @param {number|string} templateIdOrSlug - Template ID hoặc slug
   * @param {string} recipientEmail - Email người nhận
   * @param {Object} variables - Variables để render template
   * @returns {Promise<Object>} Kết quả gửi email
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

      // 2. Lấy template từ database
      if (
        typeof templateIdOrSlug === 'number' ||
        /^\d+$/.test(templateIdOrSlug)
      ) {
        template = await EmailTemplateModel.getTemplateById(templateIdOrSlug);
      } else {
        // Use name instead of slug
        template = await EmailTemplateModel.getTemplateByName(templateIdOrSlug);
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

      // 6. Render template từ database
      html = await templateRenderer.renderFromDatabase(
        templateId, // Use ID for consistency
        variables,
      );
      subject = await templateRenderer.renderSubject(template, variables);

      // 7. Gửi email
      const result = await sendMail({
        to: recipientEmail,
        subject,
        html,
      });

      // 8. Log vào email_logs
      try {
        await EmailLogModel.createLog({
          template_id: templateId,
          template_name: templateName,
          recipient_email: recipientEmail,
          subject,
          status: 'sent',
          variables_used: JSON.stringify(variables),
          sent_at: new Date(),
        });
      } catch (logError) {
        console.error('Lỗi khi log email:', logError);
      }

      return result;
    } catch (error) {
      // Log error nếu có template_id
      if (templateId) {
        try {
          await EmailLogModel.createLog({
            template_id: templateId,
            template_name: templateName,
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

      if (error instanceof ServiceError) throw error;
      throw new ServiceError(
        'Gửi email động thất bại',
        'SEND_DYNAMIC_EMAIL_FAILED',
        error.message,
        500,
      );
    }
  }

  // ==================== XÁC THỰC ====================

  /**
   * Gửi email OTP đăng nhập
   * @param {Object} info - Thông tin: { email, otp }
   */
  async sendLoginOtp(info) {
    if (!info?.email || !info?.otp) {
      throw new ServiceError(
        'Thiếu thông tin email hoặc OTP',
        'MISSING_OTP_INFO',
        null,
        400,
      );
    }

    return this.sendEmailByAction('AUTH_LOGIN_OTP', info.email, {
      otp: info.otp,
    });
  }

  // ==================== ĐƠN ĐĂNG KÝ THÀNH VIÊN ====================

  /**
   * Gửi email xác nhận đã nhận đơn đăng ký
   * @param {Object} application - Thông tin đơn: { fullname, email, student_id }
   */
  async sendApplicationReceived(application) {
    if (!application?.email) {
      throw new ServiceError('Thiếu email người nhận', 'MISSING_EMAIL', null, 400);
    }

    return this.sendEmailByAction('RECRUITMENT_APPLICATION_RECEIVED', application.email, {
      fullname: application.fullname || 'Ứng viên',
      email: application.email,
      student_id: application.student_id || '',
    });
  }

  /**
   * Gửi email thông báo lịch phỏng vấn
   * @param {Object} application - Thông tin đơn
   * @param {Object} schedule - Thông tin lịch
   */
  async sendInterviewScheduled(application, schedule) {
    if (!application?.email) {
      throw new ServiceError('Thiếu email người nhận', 'MISSING_EMAIL', null, 400);
    }

    // Format ngày phỏng vấn
    const interviewDate = new Date(schedule.interview_date).toLocaleDateString(
      'vi-VN',
      {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      },
    );

    const startTime = schedule.start_time?.substring(0, 5) || '';
    const endTime = schedule.end_time?.substring(0, 5) || '';

    return this.sendEmailByAction('RECRUITMENT_INTERVIEW_SCHEDULED', application.email, {
      fullname: application.fullname || 'Ứng viên',
      schedule_title: schedule.title || 'Phỏng vấn',
      interview_date: interviewDate,
      start_time: startTime,
      end_time: endTime,
      location: schedule.location || '',
      description: schedule.description || '',
    });
  }

  /**
   * Gửi email thông báo đơn được phê duyệt
   * @param {Object} application - Thông tin đơn: { fullname, email, interview_notes }
   */
  async sendApplicationApproved(application) {
    if (!application?.email) {
      throw new ServiceError('Thiếu email người nhận', 'MISSING_EMAIL', null, 400);
    }

    return this.sendEmailByAction('RECRUITMENT_APPLICATION_APPROVED', application.email, {
      fullname: application.fullname || 'Ứng viên',
      email: application.email,
      interview_notes: application.interview_notes || '',
    });
  }

  /**
   * Gửi email thông báo đơn bị từ chối
   * @param {Object} application - Thông tin đơn: { fullname, email, interview_notes }
   */
  async sendApplicationRejected(application) {
    if (!application?.email) {
      throw new ServiceError('Thiếu email người nhận', 'MISSING_EMAIL', null, 400);
    }

    return this.sendEmailByAction('RECRUITMENT_APPLICATION_REJECTED', application.email, {
      fullname: application.fullname || 'Ứng viên',
      interview_notes: application.interview_notes || '',
    });
  }

  // ==================== SỰ KIỆN ====================

  /**
   * Gửi email xác nhận đăng ký sự kiện
   * @param {Object} registration - Thông tin đăng ký
   * @param {Object} event - Thông tin sự kiện
   * @param {Object|null} user - Thông tin user
   */
  async sendEventRegistrationConfirmed(registration, event, user = null) {
    const recipientEmail =
      registration.registration_type === 'private' && user
        ? user.email
        : registration.guest_email;

    const recipientName =
      registration.registration_type === 'private' && user
        ? user.fullname
        : registration.guest_name;

    if (!recipientEmail) {
      throw new ServiceError('Thiếu email người nhận', 'MISSING_EMAIL', null, 400);
    }

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

    return this.sendEmailByAction(
      'EVENT_REGISTRATION_CONFIRMED',
      recipientEmail,
      {
        fullname: recipientName || 'Bạn',
        event_title: event.title || 'Sự kiện',
        start_time: startTime,
        end_time: endTime,
        location: event.location || '',
        registration_deadline: registrationDeadline,
        notes: registration.notes || '',
      },
    );
  }

  /**
   * Gửi email nhắc nhở sự kiện
   * @param {Object} registration
   * @param {Object} event
   * @param {Object|null} user
   */
  async sendEventReminder(registration, event, user = null) {
    const recipientEmail =
      registration.registration_type === 'private' && user
        ? user.email
        : registration.guest_email;

    const recipientName =
      registration.registration_type === 'private' && user
        ? user.fullname
        : registration.guest_name;

    if (!recipientEmail) {
      throw new ServiceError('Thiếu email người nhận', 'MISSING_EMAIL', null, 400);
    }

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

    return this.sendEmailByAction('EVENT_REMINDER', recipientEmail, {
      fullname: recipientName || 'Bạn',
      event_title: event.title || 'Sự kiện',
      start_time: startTime,
      end_time: endTime,
      location: event.location || '',
      time_until: timeUntil,
    });
  }

  /**
   * Gửi email xác nhận điểm danh
   * @param {Object} attendance
   * @param {Object} event
   * @param {Object|null} user
   */
  async sendEventCheckInConfirmation(attendance, event, user = null) {
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

    return this.sendEmailByAction('EVENT_CHECK_IN_CONFIRMED', user.email, {
      fullname: user.fullname || 'Bạn',
      event_title: event.title || 'Sự kiện',
      check_in_time: checkInTime,
      location: event.location || '',
      notes: attendance.notes || '',
    });
  }

  /**
   * Gửi email thông báo hủy/thay đổi sự kiện
   */
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

    if (!recipientEmail) {
      throw new ServiceError('Thiếu email người nhận', 'MISSING_EMAIL', null, 400);
    }

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

    return this.sendEmailByAction('EVENT_CANCELLATION', recipientEmail, {
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
  }

  // ==================== EMAIL KHÁC ====================

  /**
   * Gửi email chào mừng thành viên mới
   */
  async sendWelcomeEmail(user) {
    if (!user?.email) {
      throw new ServiceError('Thiếu email người nhận', 'MISSING_EMAIL', null, 400);
    }

    return this.sendEmailByAction('AUTH_WELCOME_EMAIL', user.email, {
      fullname: user.fullname || 'Thành viên',
      email: user.email,
    });
  }

  /**
   * Gửi email thông báo cấp quyền truy cập tài liệu
   */
  async sendDocumentAccessGranted(user, document, category = null) {
    if (!user?.email) {
      throw new ServiceError('Thiếu email người nhận', 'MISSING_EMAIL', null, 400);
    }

    return this.sendEmailByAction('DOCUMENT_ACCESS_GRANTED', user.email, {
      fullname: user.fullname || 'Thành viên',
      document_title: document.title || 'Tài liệu',
      document_category: category?.name || null,
      document_description: document.description || '',
    });
  }

  /**
   * Gửi email đặt lại mật khẩu
   */
  async sendPasswordReset(user, resetCode, resetLink = null, expiresIn = 15) {
    if (!user?.email || !resetCode) {
      throw new ServiceError(
        'Thiếu email hoặc mã đặt lại mật khẩu',
        'MISSING_RESET_INFO',
        null,
        400,
      );
    }

    return this.sendEmailByAction('AUTH_PASSWORD_RESET', user.email, {
      fullname: user.fullname || 'Người dùng',
      reset_code: resetCode,
      reset_link: resetLink,
      expires_in: expiresIn,
    });
  }

  /**
   * Gửi email nhắc nhở đóng phí
   */
  async sendReminder(member) {
    if (!member?.email) {
      throw new ServiceError('Thiếu email người nhận', 'MISSING_EMAIL', null, 400);
    }

    const deadline = member.deadline
      ? new Date(member.deadline).toLocaleDateString('vi-VN', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : member.deadline;

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

    return this.sendEmailByAction('FINANCE_FEE_REMINDER', member.email, {
      name: member.fullname || 'Thành viên',
      deadline: deadline,
      amount: member.amount || 0,
      days_remaining: daysRemaining,
    });
  }
}

export default new EmailService();