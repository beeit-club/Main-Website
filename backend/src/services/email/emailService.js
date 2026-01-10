// services/email/emailService.js
// Service xử lý tất cả các email trong hệ thống
// Đã chuyển đổi sang sử dụng cơ chế Queue (Database-driven) để không làm chậm response

import EmailTemplateModel from '../../models/admin/emailTemplate.model.js';
import SystemEmailMappingModel from '../../models/admin/systemEmailMapping.model.js';
import EmailLogModel from '../../models/admin/emailLog.model.js';
import templateRenderer from './templateRenderer.service.js';
import { sendMail } from '../../utils/mailer.js';
import ServiceError from '../../error/service.error.js';
import emailQueueService from './emailQueue.service.js';

class EmailService {
  /**
   * Gửi email theo một "hành động" hệ thống được định nghĩa trước
   * @param {string} actionKey - Key của hành động (e.g., 'AUTH_LOGIN_OTP')
   * @param {string} recipientEmail 
   * @param {Object} variables 
   * @param {boolean} useQueue - Có sử dụng hàng đợi hay không (mặc định true)
   */
  async sendEmailByAction(actionKey, recipientEmail, variables = {}, useQueue = true) {
    const mapping = await SystemEmailMappingModel.getMappingByAction(actionKey);

    if (!mapping) {
      throw new ServiceError(
        `Hành động email "${actionKey}" không tồn tại.`, 'ACTION_NOT_FOUND', null, 404
      );
    }

    if (!mapping.template_id) {
      console.error(`Chưa có template nào được gán cho hành động "${actionKey}". Email sẽ không được gửi.`);
      throw new ServiceError(
        `Chưa gán template cho hành động "${actionKey}".`, 'TEMPLATE_NOT_MAPPED', null, 500
      );
    }

    return this.sendDynamicEmail(mapping.template_id, recipientEmail, variables, useQueue);
  }

  // ==================== CORE: GỬI EMAIL ĐỘNG ====================

  /**
   * Gửi email động sử dụng template từ database
   *
   * @param {number|string} templateIdOrSlug - Template ID hoặc slug
   * @param {string} recipientEmail - Email người nhận
   * @param {Object} variables - Variables để render template
   * @param {boolean} useQueue - Có sử dụng hàng đợi hay không
   * @returns {Promise<Object>} Kết quả gửi email hoặc thông báo đã thêm vào hàng đợi
   */
  async sendDynamicEmail(templateIdOrSlug, recipientEmail, variables = {}, useQueue = true) {
    let template = null;
    let html = null;
    let subject = null;
    let templateId = null;
    let templateName = null;

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
        template = await EmailTemplateModel.getTemplateByName(templateIdOrSlug);
      }

      // 3. Validate template tồn tại
      if (!template) {
        throw new ServiceError(
          `Template không tồn tại: ${templateIdOrSlug}`,
          'TEMPLATE_NOT_FOUND',
          'Chỉ hỗ trợ template từ database.',
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

      templateId = template.id;
      templateName = template.name;

      // 5. NẾU SỬ DỤNG HÀNG ĐỢI (QUEUE) - MẶC ĐỊNH
      if (useQueue) {
        return await emailQueueService.addToQueue({
          recipientEmail,
          templateId,
          variables,
          recipientName: variables.fullname || null
        });
      }

      // 6. GỬI TRỰC TIẾP (Chỉ khi useQueue = false)
      html = await templateRenderer.renderFromDatabase(templateId, variables);
      subject = await templateRenderer.renderSubject(template, variables);

      const result = await sendMail({
        to: recipientEmail,
        subject,
        html,
      });

      // 7. Log vào email_logs
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
      // Log error nếu có template_id và không phải lỗi hàng đợi
      if (templateId && !useQueue) {
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
        'Xử lý email thất bại',
        'EMAIL_PROCESSING_FAILED',
        error.message,
        500,
      );
    }
  }

  // ==================== HÀM TIỆN ÍCH (Mặc định dùng Queue) ====================

  async sendLoginOtp(info) {
    return this.sendEmailByAction('AUTH_LOGIN_OTP', info.email, { otp: info.otp });
  }

  async sendApplicationReceived(application) {
    return this.sendEmailByAction('RECRUITMENT_APPLICATION_RECEIVED', application.email, {
      fullname: application.fullname || 'Ứng viên',
      email: application.email,
      student_id: application.student_id || '',
    });
  }

  async sendInterviewScheduled(application, schedule) {
    const interviewDate = new Date(schedule.interview_date).toLocaleDateString('vi-VN', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
    return this.sendEmailByAction('RECRUITMENT_INTERVIEW_SCHEDULED', application.email, {
      fullname: application.fullname || 'Ứng viên',
      schedule_title: schedule.title || 'Phỏng vấn',
      interview_date: interviewDate,
      start_time: schedule.start_time?.substring(0, 5) || '',
      end_time: schedule.end_time?.substring(0, 5) || '',
      location: schedule.location || '',
      description: schedule.description || '',
    });
  }

  async sendApplicationApproved(application) {
    return this.sendEmailByAction('RECRUITMENT_APPLICATION_APPROVED', application.email, {
      fullname: application.fullname || 'Ứng viên',
      email: application.email,
      interview_notes: application.interview_notes || '',
    });
  }

  async sendApplicationRejected(application) {
    return this.sendEmailByAction('RECRUITMENT_APPLICATION_REJECTED', application.email, {
      fullname: application.fullname || 'Ứng viên',
      interview_notes: application.interview_notes || '',
    });
  }

  async sendEventRegistrationConfirmed(registration, event, user = null) {
    const recipientEmail = registration.registration_type === 'private' && user ? user.email : registration.guest_email;
    const recipientName = registration.registration_type === 'private' && user ? user.fullname : registration.guest_name;
    
    const startTime = new Date(event.start_time).toLocaleString('vi-VN');
    const endTime = new Date(event.end_time).toLocaleString('vi-VN');

    return this.sendEmailByAction('EVENT_REGISTRATION_CONFIRMED', recipientEmail, {
      fullname: recipientName || 'Bạn',
      event_title: event.title,
      start_time: startTime,
      end_time: endTime,
      location: event.location,
      notes: registration.notes || '',
    });
  }

  async sendEventReminder(registration, event, user = null) {
    const recipientEmail = registration.registration_type === 'private' && user ? user.email : registration.guest_email;
    const recipientName = registration.registration_type === 'private' && user ? user.fullname : registration.guest_name;

    return this.sendEmailByAction('EVENT_REMINDER', recipientEmail, {
      fullname: recipientName || 'Bạn',
      event_title: event.title,
      start_time: new Date(event.start_time).toLocaleString('vi-VN'),
      location: event.location,
    });
  }

  async sendWelcomeEmail(user) {
    return this.sendEmailByAction('AUTH_WELCOME_EMAIL', user.email, {
      fullname: user.fullname || 'Thành viên',
      email: user.email,
    });
  }
}

export default new EmailService();
