-- =====================================================
-- RUN ALL EMAIL MIGRATIONS
-- Chạy file này để tạo tất cả bảng cho email system
-- =====================================================

-- Bước 1: Email Templates System
-- Chạy nội dung từ create_email_templates_tables.sql

-- Bảng email_template_categories
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

-- Bảng email_templates
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

-- Bảng email_logs
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

-- Indexes cho email_templates
CREATE INDEX `idx_email_templates_category_active` ON `email_templates` (`category`, `is_active`, `deleted_at`);
CREATE INDEX `idx_email_logs_template_status` ON `email_logs` (`template_id`, `status`, `created_at`);

-- =====================================================
-- Bước 2: Bulk Email System
-- =====================================================

-- Bảng email_batch_jobs
CREATE TABLE IF NOT EXISTS `email_batch_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `template_id` bigint unsigned DEFAULT NULL COMMENT 'ID của template được sử dụng',
  `template_slug` varchar(255) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL COMMENT 'Slug template (backup)',
  `job_name` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL COMMENT 'Tên job (mô tả)',
  `status` enum('pending','processing','completed','failed','cancelled') COLLATE utf8mb4_vietnamese_ci DEFAULT 'pending' COMMENT 'Trạng thái job',
  `total_recipients` int unsigned NOT NULL COMMENT 'Tổng số người nhận',
  `sent_count` int unsigned DEFAULT 0 COMMENT 'Số email đã gửi thành công',
  `failed_count` int unsigned DEFAULT 0 COMMENT 'Số email gửi thất bại',
  `progress_percent` decimal(5,2) DEFAULT 0.00 COMMENT 'Tiến độ (%)',
  `started_at` timestamp NULL DEFAULT NULL COMMENT 'Thời gian bắt đầu xử lý',
  `completed_at` timestamp NULL DEFAULT NULL COMMENT 'Thời gian hoàn thành',
  `error_message` text COLLATE utf8mb4_vietnamese_ci DEFAULT NULL COMMENT 'Lỗi nếu job thất bại',
  `options` json DEFAULT NULL COMMENT 'Options: batchSize, delay, concurrency, etc.',
  `created_by` bigint unsigned DEFAULT NULL COMMENT 'User tạo job',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `status` (`status`),
  KEY `created_by` (`created_by`),
  KEY `template_id` (`template_id`),
  KEY `created_at` (`created_at`),
  CONSTRAINT `email_batch_jobs_ibfk_1` FOREIGN KEY (`template_id`) REFERENCES `email_templates` (`id`) ON DELETE SET NULL,
  CONSTRAINT `email_batch_jobs_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- Bảng email_batch_recipients
CREATE TABLE IF NOT EXISTS `email_batch_recipients` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `batch_job_id` bigint unsigned NOT NULL COMMENT 'ID của batch job',
  `recipient_email` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL COMMENT 'Email người nhận',
  `status` enum('pending','sent','failed') COLLATE utf8mb4_vietnamese_ci DEFAULT 'pending' COMMENT 'Trạng thái gửi',
  `variables` json DEFAULT NULL COMMENT 'Variables cho recipient này',
  `error_message` text COLLATE utf8mb4_vietnamese_ci DEFAULT NULL COMMENT 'Lỗi nếu gửi thất bại',
  `retry_count` int unsigned DEFAULT 0 COMMENT 'Số lần retry',
  `sent_at` timestamp NULL DEFAULT NULL COMMENT 'Thời gian gửi thành công',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `batch_job_id` (`batch_job_id`),
  KEY `status` (`status`),
  KEY `recipient_email` (`recipient_email`),
  CONSTRAINT `email_batch_recipients_ibfk_1` FOREIGN KEY (`batch_job_id`) REFERENCES `email_batch_jobs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- Indexes cho bulk email
CREATE INDEX `idx_batch_jobs_status_created` ON `email_batch_jobs` (`status`, `created_at`);
CREATE INDEX `idx_batch_recipients_job_status` ON `email_batch_recipients` (`batch_job_id`, `status`);

-- =====================================================
-- Comments
-- =====================================================
ALTER TABLE `email_template_categories` COMMENT = 'Danh mục email templates';
ALTER TABLE `email_templates` COMMENT = 'Email templates động - có thể quản lý qua admin panel';
ALTER TABLE `email_logs` COMMENT = 'Log các email đã gửi - dùng để tracking và analytics';
ALTER TABLE `email_batch_jobs` COMMENT = 'Batch jobs cho gửi email hàng loạt';
ALTER TABLE `email_batch_recipients` COMMENT = 'Danh sách recipients trong mỗi batch job';

-- =====================================================
-- HOÀN TẤT!
-- Đã tạo tất cả bảng cho email system
-- =====================================================

-- =====================================================
-- Bước 3: Alter cho builder & batch trace (chạy sau khi 2 bước trên)
-- =====================================================

-- Thêm design_json, variables_schema, mô tả (nếu chưa có) cho email_templates
ALTER TABLE `email_templates`
  ADD COLUMN IF NOT EXISTS `design_json` json NULL AFTER `html_content`,
  ADD COLUMN IF NOT EXISTS `variables_schema` json NULL AFTER `variables`,
  ADD COLUMN IF NOT EXISTS `description` text COLLATE utf8mb4_vietnamese_ci NULL AFTER `category`;

-- Thêm batch_job_id cho email_logs để liên kết log theo batch
ALTER TABLE `email_logs`
  ADD COLUMN IF NOT EXISTS `batch_job_id` bigint unsigned NULL AFTER `template_id`,
  ADD KEY `idx_email_logs_batch` (`batch_job_id`);

-- Ràng buộc FK: batch_job_id -> email_batch_jobs.id
ALTER TABLE `email_logs`
  ADD CONSTRAINT `email_logs_ibfk_batch`
  FOREIGN KEY (`batch_job_id`) REFERENCES `email_batch_jobs` (`id`) ON DELETE SET NULL;

