// services/email/emailService.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import templateRenderer from './templateRenderer.service.js';
import { sendMail } from '../../utils/mailer.js';
import ServiceError from '../../error/service.error.js';
import emailQueueService from './emailQueue.service.js';
import variableManager from './variables/variableManager.js';

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mapping Action Key -> Template Filename
const ACTION_TEMPLATE_MAP = {
  'AUTH_LOGIN_OTP': 'auth_login_otp.hbs',
  'AUTH_WELCOME': 'auth_welcome.hbs',
  'APP_RECEIVED': 'app_received.hbs',
  'APP_INTERVIEW': 'app_interview.hbs',
  'APP_APPROVED': 'app_approved.hbs',
  'APP_REJECTED': 'app_rejected.hbs'
};

class EmailService {
  /**
   * Đọc file template từ đĩa
   */
  loadTemplate(filename) {
    try {
      // Đường dẫn tới folder templates: backend/src/emails/templates
      // File hiện tại: backend/src/services/email/emailService.js
      // Cần đi ra 3 cấp: ../../../emails/templates
      const templatePath = path.join(__dirname, '../../emails/templates', filename);
      const layoutPath = path.join(__dirname, '../../emails/templates/layout.hbs');

      const content = fs.readFileSync(templatePath, 'utf8');
      const layout = fs.readFileSync(layoutPath, 'utf8');

      // Chèn content vào layout {{{body}}}
      // Đơn giản hóa việc này bằng string replace nếu không muốn dùng handlebars registration phức tạp
      // Tuy nhiên, templateRenderer.renderFinalHtml dùng handlebars nên ta có thể để layout riêng
      // Nhưng để đơn giản, ta replace {{{body}}} trong layout bằng content
      return layout.replace('{{{body}}}', content);
    } catch (error) {
      console.error(`[EmailService] Load template error: ${error.message}`);
      return null;
    }
  }

  /**
   * Gửi email theo Action Key (dùng cho các module khác gọi vào)
   * Ví dụ: auth.service gọi sendEmailByAction('AUTH_LOGIN_OTP', ...)
   */
  async sendEmailByAction(actionKey, recipientEmail, context = {}, useQueue = true) {
    const templateFile = ACTION_TEMPLATE_MAP[actionKey];
    if (!templateFile) {
      console.warn(`[EmailService] Không tìm thấy mapping cho action: ${actionKey}`);
      return null;
    }

    return this.sendDynamicEmail(templateFile, recipientEmail, context, useQueue, actionKey);
  }

  /**
   * Gửi email dynamic (Core)
   * Thay vì templateId (DB), ta dùng templateFilename (File)
   */
  async sendDynamicEmail(templateFilename, recipientEmail, context = {}, useQueue = true, actionKey = 'UNKNOWN') {
    try {
      // 1. Resolve tất cả các biến (System, User, Custom...)
      const resolvedVariables = await variableManager.getVariables(context);

      // Override recipient email nếu có trong context mà chưa có ở tham số (optional)
      const finalEmail = recipientEmail || resolvedVariables.email;

      // 2. Load nội dung template
      const fullHtmlTemplate = this.loadTemplate(templateFilename);
      if (!fullHtmlTemplate) {
        throw new ServiceError('Không thể đọc file template', 'TEMPLATE_READ_ERROR');
      }

      // Xác định Subject dựa trên Action (Hardcode hoặc map)
      const subjectMap = {
        'AUTH_LOGIN_OTP': 'Mã xác thực đăng nhập Bee IT Club',
        'AUTH_WELCOME': 'Chào mừng bạn đến với Bee IT Club',
        'APP_RECEIVED': 'Bee IT Club - Xác nhận nhận đơn ứng tuyển',
        'APP_INTERVIEW': 'Thư mời phỏng vấn - Bee IT Club',
        'APP_APPROVED': 'Thông báo kết quả tuyển dụng - Bee IT Club',
        'APP_REJECTED': 'Thông báo kết quả tuyển dụng - Bee IT Club'
      };

      const rawSubject = subjectMap[actionKey] || 'Thông báo từ Bee IT Club';
      const subject = await templateRenderer.renderSubject(rawSubject, resolvedVariables);

      // 3. Nếu dùng Queue (Khuyến nghị cho production)
      if (useQueue) {
        // Với logic mới, ta cần actionKey để worker biết dùng template nào.
        // actionKey đã được truyền vào hàm sendDynamicEmail ở tham số cuối.
        return await emailQueueService.addToQueue({
          recipientEmail: finalEmail,
          actionKey: actionKey,
          variables: resolvedVariables,
          recipientName: resolvedVariables.fullname || ''
        });
      }

      // 4. Render HTML
      // Normalize MJML nếu cần (nhưng file .hbs ta viết là HTML thường nên normalizeMJML sẽ bọc vào mj-text)
      // Tuy nhiên layout.hbs là HTML chuẩn, không phải MJML. 
      // TemplateRenderer có hàm normalizeMJML tự động bọc nếu chưa có tag mjml.
      // Nhưng layout ta viết là HTML <html>...</html>. NormalizeMJML sẽ phá vỡ nó nếu bọc vào <mj-text>.
      // -> Cần bypass normalize MJML nếu là HTML thường?
      // TemplateRenderer.compileMJML sẽ gọi mjml2html.

      // Để đơn giản nhất: Ta dùng handlebars compile trực tiếp layout html đã ghép, bỏ qua bước MJML nếu không cần thiết.
      // Hoặc sửa templateRenderer để không normalize nếu thấy <html>

      // Ở đây ta bypass compileMJML, chỉ dùng renderFinalHtml (handlebars)
      const html = templateRenderer.renderFinalHtml(fullHtmlTemplate, resolvedVariables);

      const result = await sendMail({
        to: finalEmail,
        subject: subject,
        html: html
      });

      console.log(`[EmailService] Sent email [${actionKey}] to ${finalEmail}`);
      return result;

    } catch (error) {
      console.error('[EmailService] Send Error:', error);
      throw error;
    }
  }

  // ==========================================
  // SHORTCUT METHODS
  // ==========================================

  async sendLoginOtp({ email, otp }) {
    return this.sendEmailByAction('AUTH_LOGIN_OTP', email, { otp, email });
  }

  async sendWelcome({ email, fullname }) {
    return this.sendEmailByAction('AUTH_WELCOME', email, { email, fullname });
  }

  // Tuyển dụng
  async sendApplicationReceived(data) {
    return this.sendEmailByAction('APP_RECEIVED', data.email, data);
  }

  async sendInterviewScheduled(data) {
    return this.sendEmailByAction('APP_INTERVIEW', data.email, data);
  }

  async sendApplicationApproved(data) {
    return this.sendEmailByAction('APP_APPROVED', data.email, data);
  }

  async sendApplicationRejected(data) {
    return this.sendEmailByAction('APP_REJECTED', data.email, data);
  }
}

export default new EmailService();