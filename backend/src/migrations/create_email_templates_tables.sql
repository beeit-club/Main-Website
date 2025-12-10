-- =====================================================
-- Migration: Email Templates System
-- Description: Tạo các bảng cho hệ thống email động
-- Created: 2024
-- 
-- CHẠY FILE NÀY TRƯỚC
-- Sau đó chạy: create_bulk_email_tables.sql
-- =====================================================

-- Bảng email_template_categories (Danh mục templates)
CREATE TABLE IF NOT EXISTS `email_template_categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_vietnamese_ci NOT NULL COMMENT 'Tên danh mục',
  `slug` varchar(100) COLLATE utf8mb4_vietnamese_ci NOT NULL COMMENT 'Slug danh mục',
  `description` text COLLATE utf8mb4_vietnamese_ci DEFAULT NULL COMMENT 'Mô tả danh mục',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- Insert default categories
INSERT INTO `email_template_categories` (`name`, `slug`, `description`) VALUES
('Authentication', 'authentication', 'Email liên quan đến xác thực: OTP, reset password'),
('Application', 'application', 'Email về đơn đăng ký thành viên'),
('Event', 'event', 'Email về sự kiện'),
('Document', 'document', 'Email về tài liệu'),
('System', 'system', 'Email hệ thống: welcome, notification'),
('Custom', 'custom', 'Email tùy biến');

-- =====================================================

-- Bảng email_templates (Templates email)
CREATE TABLE IF NOT EXISTS `email_templates` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL COMMENT 'Tên template (unique)',
  `slug` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL COMMENT 'Slug cho template (unique)',
  `subject` varchar(500) COLLATE utf8mb4_vietnamese_ci NOT NULL COMMENT 'Subject của email (có thể dùng variables)',
  `html_content` longtext COLLATE utf8mb4_vietnamese_ci NOT NULL COMMENT 'Nội dung HTML (Handlebars template)',
  `text_content` text COLLATE utf8mb4_vietnamese_ci DEFAULT NULL COMMENT 'Nội dung text thuần (optional)',
  `category` varchar(100) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL COMMENT 'Danh mục: authentication, application, event, document, system, custom',
  `description` text COLLATE utf8mb4_vietnamese_ci DEFAULT NULL COMMENT 'Mô tả template',
  `variables` json DEFAULT NULL COMMENT 'Danh sách variables và mô tả: [{"name": "fullname", "type": "string", "required": true, "description": "Họ và tên"}]',
  `default_variables` json DEFAULT NULL COMMENT 'Giá trị mặc định cho variables: {"fullname": "Nguyễn Văn A"}',
  `is_active` tinyint(1) DEFAULT '1' COMMENT 'Template có đang active không',
  `is_system` tinyint(1) DEFAULT '0' COMMENT 'Template hệ thống (không thể xóa)',
  `created_by` bigint unsigned DEFAULT NULL COMMENT 'User tạo template',
  `updated_by` bigint unsigned DEFAULT NULL COMMENT 'User cập nhật template',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `name` (`name`),
  KEY `category` (`category`),
  KEY `is_active` (`is_active`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  KEY `deleted_at` (`deleted_at`),
  CONSTRAINT `email_templates_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `email_templates_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- =====================================================

-- Bảng email_logs (Log email đã gửi)
CREATE TABLE IF NOT EXISTS `email_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `template_id` bigint unsigned DEFAULT NULL COMMENT 'ID của template được sử dụng',
  `template_name` varchar(255) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL COMMENT 'Tên template (backup nếu template bị xóa)',
  `template_slug` varchar(255) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL COMMENT 'Slug template (backup)',
  `recipient_email` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL COMMENT 'Email người nhận',
  `subject` varchar(500) COLLATE utf8mb4_vietnamese_ci NOT NULL COMMENT 'Subject đã render',
  `status` enum('pending','sent','failed') COLLATE utf8mb4_vietnamese_ci DEFAULT 'pending' COMMENT 'Trạng thái gửi',
  `error_message` text COLLATE utf8mb4_vietnamese_ci DEFAULT NULL COMMENT 'Lỗi nếu gửi thất bại',
  `variables_used` json DEFAULT NULL COMMENT 'Variables đã sử dụng khi gửi',
  `sent_at` timestamp NULL DEFAULT NULL COMMENT 'Thời gian gửi thành công',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `template_id` (`template_id`),
  KEY `recipient_email` (`recipient_email`),
  KEY `status` (`status`),
  KEY `created_at` (`created_at`),
  KEY `template_slug` (`template_slug`),
  CONSTRAINT `email_logs_ibfk_1` FOREIGN KEY (`template_id`) REFERENCES `email_templates` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- =====================================================

-- Insert một số template mẫu (optional - có thể xóa nếu không cần)

-- Template mẫu: Custom Event Notification
INSERT INTO `email_templates` (
  `name`,
  `slug`,
  `subject`,
  `html_content`,
  `category`,
  `description`,
  `variables`,
  `default_variables`,
  `is_active`,
  `is_system`
) VALUES (
  'Custom Event Notification',
  'custom-event-notification',
  'Thông báo sự kiện: {{event_title}}',
  '<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 20px 0; text-align: center; background-color: #ffffff;">
          <table role="presentation" style="width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <tr>
              <td style="padding: 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0; color: #ffffff; font-size: 24px;">📅 Thông báo sự kiện</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 40px 30px;">
                <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                  Xin chào <strong>{{fullname}}</strong>,
                </p>
                <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                  {{#if message}}{{message}}{{else}}Chúng tôi muốn thông báo về sự kiện sắp tới.{{/if}}
                </p>
                <div style="background-color: #e7f3ff; padding: 25px; border-radius: 6px; margin: 25px 0; border-left: 4px solid #2196F3;">
                  <h2 style="margin: 0 0 15px 0; color: #1976D2; font-size: 18px;">📅 Thông tin sự kiện</h2>
                  <p style="margin: 8px 0; color: #333333; font-size: 15px;"><strong>Tên sự kiện:</strong> {{event_title}}</p>
                  {{#if start_time}}
                  <p style="margin: 8px 0; color: #333333; font-size: 15px;"><strong>Thời gian:</strong> {{start_time}}</p>
                  {{/if}}
                  {{#if location}}
                  <p style="margin: 8px 0; color: #333333; font-size: 15px;"><strong>Địa điểm:</strong> {{location}}</p>
                  {{/if}}
                </div>
                {{#if notes}}
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #6c757d;">
                  <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">{{notes}}</p>
                </div>
                {{/if}}
                <p style="margin: 20px 0 0 0; color: #333333; font-size: 16px; line-height: 1.6;">
                  Chúng tôi rất mong được gặp bạn tại sự kiện!
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px 30px; text-align: center; background-color: #f8f9fa; border-radius: 0 0 8px 8px; border-top: 1px solid #e9ecef;">
                <p style="margin: 0; color: #666666; font-size: 14px;">
                  Trân trọng,<br />
                  <strong style="color: #333333;">Ban Quản Lý CLB</strong>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>',
  'event',
  'Template tùy biến cho thông báo sự kiện',
  JSON_ARRAY(
    JSON_OBJECT('name', 'fullname', 'type', 'string', 'required', true, 'description', 'Họ và tên người nhận'),
    JSON_OBJECT('name', 'event_title', 'type', 'string', 'required', true, 'description', 'Tên sự kiện'),
    JSON_OBJECT('name', 'start_time', 'type', 'string', 'required', false, 'description', 'Thời gian bắt đầu (đã format)'),
    JSON_OBJECT('name', 'location', 'type', 'string', 'required', false, 'description', 'Địa điểm sự kiện'),
    JSON_OBJECT('name', 'message', 'type', 'string', 'required', false, 'description', 'Nội dung thông báo tùy biến'),
    JSON_OBJECT('name', 'notes', 'type', 'string', 'required', false, 'description', 'Ghi chú thêm')
  ),
  JSON_OBJECT(
    'fullname', 'Nguyễn Văn A',
    'event_title', 'Workshop ReactJS',
    'start_time', 'Thứ Hai, 15 tháng 1, 2024, 09:00',
    'location', 'Phòng 101',
    'message', 'Chúng tôi muốn thông báo về sự kiện sắp tới.'
  ),
  1,
  0
);

-- =====================================================

-- Tạo index để tối ưu performance
CREATE INDEX `idx_email_templates_category_active` ON `email_templates` (`category`, `is_active`, `deleted_at`);
CREATE INDEX `idx_email_logs_template_status` ON `email_logs` (`template_id`, `status`, `created_at`);

-- =====================================================

-- Comments cho các bảng
ALTER TABLE `email_template_categories` COMMENT = 'Danh mục email templates';
ALTER TABLE `email_templates` COMMENT = 'Email templates động - có thể quản lý qua admin panel';
ALTER TABLE `email_logs` COMMENT = 'Log các email đã gửi - dùng để tracking và analytics';

