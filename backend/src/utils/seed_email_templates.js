
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import EmailTemplateModel from '../models/admin/emailTemplate.model.js';
import pool from '../db.js';

// Load environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

const TEMPLATE_DIR = path.join(__dirname, '../emails');

// Mapping configuration
const TEMPLATE_CONFIG = {
  'loginOTP.hbs': {
    slug: 'login-otp',
    name: 'Mã OTP đăng nhập',
    subject: 'Mã OTP đăng nhập - Bee IT Club',
    category: 'Authentication',
    variables: { otp: 'string' }
  },
  'applicationReceived.hbs': {
    slug: 'application-received',
    name: 'Xác nhận nộp đơn thành công',
    subject: 'Xác nhận nộp đơn thành công - Bee IT Club',
    category: 'Recruitment',
    variables: { fullname: 'string', email: 'string', student_id: 'string' }
  },
  'interviewScheduled.hbs': {
    slug: 'interview-scheduled',
    name: 'Thông báo lịch phỏng vấn',
    subject: 'Thông báo lịch phỏng vấn - {{schedule_title}}',
    category: 'Recruitment',
    variables: { fullname: 'string', schedule_title: 'string', interview_date: 'string', start_time: 'string', end_time: 'string', location: 'string', description: 'string' }
  },
  'applicationApproved.hbs': {
    slug: 'application-approved',
    name: 'Đơn đăng ký được phê duyệt',
    subject: '🎉 Chúc mừng! Đơn đăng ký của bạn đã được phê duyệt',
    category: 'Recruitment',
    variables: { fullname: 'string', email: 'string', interview_notes: 'string' }
  },
  'applicationRejected.hbs': {
    slug: 'application-rejected',
    name: 'Đơn đăng ký bị từ chối',
    subject: 'Thông báo về đơn đăng ký - Bee IT Club',
    category: 'Recruitment',
    variables: { fullname: 'string', interview_notes: 'string' }
  },
  'eventRegistrationConfirmed.hbs': {
    slug: 'event-registration-confirmed',
    name: 'Xác nhận đăng ký sự kiện',
    subject: '✅ Xác nhận đăng ký tham gia: {{event_title}}',
    category: 'Events',
    variables: { fullname: 'string', event_title: 'string', start_time: 'string', end_time: 'string', location: 'string', registration_deadline: 'string', notes: 'string' }
  },
  'eventReminder.hbs': {
    slug: 'event-reminder',
    name: 'Nhắc nhở sự kiện',
    subject: '⏰ Nhắc nhở: {{event_title}} sắp diễn ra',
    category: 'Events',
    variables: { fullname: 'string', event_title: 'string', start_time: 'string', end_time: 'string', location: 'string', time_until: 'string' }
  },
  'eventCheckInConfirmation.hbs': {
    slug: 'event-check-in-confirmation',
    name: 'Xác nhận điểm danh sự kiện',
    subject: '✅ Xác nhận điểm danh: {{event_title}}',
    category: 'Events',
    variables: { fullname: 'string', event_title: 'string', check_in_time: 'string', location: 'string', notes: 'string' }
  },
  'eventCancellation.hbs': {
    slug: 'event-cancellation',
    name: 'Thông báo hủy/thay đổi sự kiện',
    subject: '{{#if is_cancelled}}🚫 Sự kiện "{{event_title}}" đã bị hủy{{else}}⚠️ Thông báo thay đổi: {{event_title}}{{/if}}',
    category: 'Events',
    variables: { fullname: 'string', event_title: 'string', is_cancelled: 'boolean', original_start_time: 'string', new_start_time: 'string', start_time: 'string', original_location: 'string', new_location: 'string', location: 'string', reason: 'string' }
  },
  'documentAccessGranted.hbs': {
    slug: 'document-access-granted',
    name: 'Cấp quyền truy cập tài liệu',
    subject: '📄 Bạn đã được cấp quyền truy cập: {{document_title}}',
    category: 'Documents',
    variables: { fullname: 'string', document_title: 'string', document_category: 'string', document_description: 'string' }
  },
  'passwordReset.hbs': {
    slug: 'password-reset',
    name: 'Đặt lại mật khẩu',
    subject: '🔐 Đặt lại mật khẩu - Bee IT Club',
    category: 'Authentication',
    variables: { fullname: 'string', reset_code: 'string', reset_link: 'string', expires_in: 'number' }
  },
  'welcome.hbs': {
    slug: 'welcome-email',
    name: 'Chào mừng thành viên mới',
    subject: '🎉 Chào mừng bạn đến với CLB!',
    category: 'System',
    variables: { fullname: 'string', email: 'string' }
  },
  'reminder.hbs': {
    slug: 'fee-reminder',
    name: 'Nhắc nhở đóng phí',
    subject: '⏰ Nhắc nhở hạn đóng phí - Bee IT Club',
    category: 'Finance',
    variables: { name: 'string', deadline: 'string', amount: 'number', days_remaining: 'string' }
  }
};

async function seedTemplates() {
  console.log('Starting email template seeding...');
  
  try {
    for (const [filename, config] of Object.entries(TEMPLATE_CONFIG)) {
      const filePath = path.join(TEMPLATE_DIR, filename);
      
      if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filename}, skipping...`);
        continue;
      }

      const htmlContent = fs.readFileSync(filePath, 'utf8');

      // Check if template exists
      const existing = await EmailTemplateModel.getTemplateBySlug(config.slug);
      
      const templateData = {
        name: config.name,
        slug: config.slug,
        subject: config.subject,
        html_content: htmlContent,
        category: config.category,
        variables: config.variables,
        is_active: true,
        is_system: true // Mark migrated templates as system initially
      };

      if (existing) {
        console.log(`Updating existing template: ${config.slug}`);
        await EmailTemplateModel.updateTemplate(existing.id, templateData);
      } else {
        console.log(`Creating new template: ${config.slug}`);
        await EmailTemplateModel.createTemplate(templateData);
      }
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedTemplates();
