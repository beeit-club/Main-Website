
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import EmailTemplateModel from '../models/admin/emailTemplate.model.js';

// Load environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Simple Template Definitions (Content Only)
const SIMPLE_TEMPLATES = {
  'login-otp': {
    name: 'Mã OTP đăng nhập',
    subject: 'Mã OTP đăng nhập - Bee IT Club',
    html_content: `
      <p>Xin chào,</p>
      <p>Mã xác thực (OTP) của bạn là: <b style="font-size: 18px;">{{otp}}</b></p>
      <p>Mã này có hiệu lực trong thời gian ngắn. Tuyệt đối không chia sẻ mã này cho bất kỳ ai.</p>
    `
  },
  'application-received': {
    name: 'Xác nhận nộp đơn thành công',
    subject: 'Xác nhận nộp đơn - Bee IT Club',
    html_content: `
      <p>Chào <b>{{fullname}}</b>,</p>
      <p>Chúng tôi đã nhận được đơn đăng ký của bạn với thông tin sau:</p>
      <ul>
        <li>Email: {{email}}</li>
        <li>MSSV: {{student_id}}</li>
      </ul>
      <p>Kết quả sẽ được thông báo qua email trong thời gian sớm nhất.</p>
    `
  },
  'interview-scheduled': {
    name: 'Thông báo lịch phỏng vấn',
    subject: 'Mời phỏng vấn: {{schedule_title}}',
    html_content: `
      <p>Chào <b>{{fullname}}</b>,</p>
      <p>Chúc mừng bạn đã vượt qua vòng đơn. Chúng tôi trân trọng mời bạn tham gia phỏng vấn:</p>
      <ul>
        <li><b>Thời gian:</b> {{start_time}} - {{end_time}}, ngày {{interview_date}}</li>
        <li><b>Địa điểm:</b> {{location}}</li>
      </ul>
      <p>Ghi chú: {{description}}</p>
      <p>Vui lòng có mặt đúng giờ và chuẩn bị kỹ lưỡng.</p>
    `
  },
  'application-approved': {
    name: 'Đơn đăng ký được phê duyệt',
    subject: '🎉 Chúc mừng! Bạn đã trúng tuyển',
    html_content: `
      <p>Chào <b>{{fullname}}</b>,</p>
      <p>Chúc mừng bạn! Bạn đã chính thức trở thành thành viên của Bee IT Club.</p>
      <p><b>Bước tiếp theo:</b></p>
      <ul>
        <li>Đăng nhập hệ thống bằng email: {{email}}</li>
        <li>Cập nhật hồ sơ cá nhân.</li>
        <li>Tham gia Group chat của CLB.</li>
      </ul>
      <p>Lời nhắn từ ban phỏng vấn: "{{interview_notes}}"</p>
    `
  },
  'application-rejected': {
    name: 'Đơn đăng ký bị từ chối',
    subject: 'Thông báo kết quả tuyển thành viên',
    html_content: `
      <p>Chào <b>{{fullname}}</b>,</p>
      <p>Cảm ơn bạn đã quan tâm đến Bee IT Club. Sau khi cân nhắc kỹ, chúng tôi rất tiếc chưa thể đồng hành cùng bạn trong đợt tuyển này.</p>
      <p>Lý do/Góp ý: "{{interview_notes}}"</p>
      <p>Hy vọng sẽ được gặp lại bạn ở các đợt tuyển sau khi bạn đã sẵn sàng hơn.</p>
    `
  },
  'event-registration-confirmed': {
    name: 'Xác nhận đăng ký sự kiện',
    subject: '✅ Đăng ký thành công: {{event_title}}',
    html_content: `
      <p>Chào <b>{{fullname}}</b>,</p>
      <p>Bạn đã đăng ký thành công sự kiện <b>{{event_title}}</b>.</p>
      <ul>
        <li>Thời gian: {{start_time}}</li>
        <li>Địa điểm: {{location}}</li>
      </ul>
      <p>Ghi chú của bạn: {{notes}}</p>
      <p>Vui lòng mang theo email này khi đến check-in.</p>
    `
  },
  'event-reminder': {
    name: 'Nhắc nhở sự kiện',
    subject: '⏰ Nhắc nhở: {{event_title}} sắp diễn ra',
    html_content: `
      <p>Chào <b>{{fullname}}</b>,</p>
      <p>Sự kiện <b>{{event_title}}</b> sẽ diễn ra trong <b>{{time_until}}</b> nữa.</p>
      <ul>
        <li>Thời gian: {{start_time}}</li>
        <li>Địa điểm: {{location}}</li>
      </ul>
      <p>Hẹn gặp bạn tại sự kiện!</p>
    `
  },
  'event-check-in-confirmation': {
    name: 'Xác nhận điểm danh sự kiện',
    subject: '✅ Đã điểm danh: {{event_title}}',
    html_content: `
      <p>Chào <b>{{fullname}}</b>,</p>
      <p>Xác nhận bạn đã có mặt tại sự kiện <b>{{event_title}}</b>.</p>
      <p>Thời gian check-in: {{check_in_time}}</p>
    `
  },
  'event-cancellation': {
    name: 'Thông báo hủy/thay đổi sự kiện',
    subject: '⚠️ Thông báo quan trọng về sự kiện {{event_title}}',
    html_content: `
      <p>Chào <b>{{fullname}}</b>,</p>
      {{#if is_cancelled}}
        <p>Chúng tôi rất tiếc phải thông báo sự kiện <b>{{event_title}}</b> đã bị HỦY.</p>
      {{else}}
        <p>Sự kiện <b>{{event_title}}</b> có thay đổi thông tin:</p>
        <ul>
          <li>Thời gian mới: {{new_start_time}}</li>
          <li>Địa điểm mới: {{new_location}}</li>
        </ul>
      {{/if}}
      <p>Lý do: {{reason}}</p>
      <p>Mong bạn thông cảm cho sự bất tiện này.</p>
    `
  },
  'document-access-granted': {
    name: 'Cấp quyền truy cập tài liệu',
    subject: '📄 Chia sẻ tài liệu: {{document_title}}',
    html_content: `
      <p>Chào <b>{{fullname}}</b>,</p>
      <p>Bạn đã được cấp quyền xem tài liệu: <b>{{document_title}}</b>.</p>
      <p>Mô tả: {{document_description}}</p>
      <p>Vui lòng đăng nhập vào hệ thống để xem chi tiết.</p>
    `
  },
  'password-reset': {
    name: 'Đặt lại mật khẩu',
    subject: 'Yêu cầu đặt lại mật khẩu',
    html_content: `
      <p>Chào bạn,</p>
      <p>Mã OTP đặt lại mật khẩu của bạn là: <b style="font-size: 18px;">{{reset_code}}</b></p>
      <p>Mã này hết hạn sau {{expires_in}} phút.</p>
      {{#if reset_link}}
        <p>Hoặc bấm vào đây: <a href="{{reset_link}}">Đặt lại mật khẩu</a></p>
      {{/if}}
    `
  },
  'welcome-email': {
    name: 'Chào mừng thành viên mới',
    subject: 'Chào mừng đến với Bee IT Club!',
    html_content: `
      <p>Xin chào <b>{{fullname}}</b>,</p>
      <p>Chào mừng bạn gia nhập Bee IT Club!</p>
      <p>Tài khoản của bạn đã được kích hoạt với email: <b>{{email}}</b>.</p>
      <p>Hãy bắt đầu khám phá và kết nối cùng mọi người nhé.</p>
    `
  },
  'fee-reminder': {
    name: 'Nhắc nhở đóng phí',
    subject: '🔔 Nhắc đóng phí thành viên',
    html_content: `
      <p>Chào <b>{{name}}</b>,</p>
      <p>Vui lòng hoàn thành đóng phí thành viên trước ngày: <b>{{deadline}}</b>.</p>
      <ul>
        <li>Số tiền: {{amount}} VNĐ</li>
        <li>Trạng thái: Còn {{days_remaining}}</li>
      </ul>
      <p>Nếu bạn đã đóng, vui lòng bỏ qua email này.</p>
    `
  }
};

async function seedSimpleTemplates() {
  console.log('Starting SIMPLE email template seeding...');
  
  try {
    for (const [slug, config] of Object.entries(SIMPLE_TEMPLATES)) {
      // Check if template exists
      const existing = await EmailTemplateModel.getTemplateBySlug(slug);
      
      const templateData = {
        name: config.name,
        slug: slug,
        subject: config.subject,
        html_content: config.html_content, // Simple HTML
        is_active: true,
        // Keep category logic if needed, or simple ignore
      };

      if (existing) {
        console.log(`Updating simplified content for: ${slug}`);
        await EmailTemplateModel.updateTemplate(existing.id, templateData);
      } else {
        console.log(`Creating new simple template: ${slug}`);
        await EmailTemplateModel.createTemplate(templateData);
      }
    }

    console.log('Simplification completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedSimpleTemplates();
