-- =====================================================
-- Migration: Bulk Email System
-- Description: Tạo các bảng cho hệ thống gửi email hàng loạt
-- Created: 2024
-- 
-- CHẠY FILE NÀY SAU KHI ĐÃ CHẠY create_email_templates_tables.sql
-- Vì có foreign key đến email_templates
-- =====================================================

-- Bảng email_batch_jobs (Lưu thông tin batch job)
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

-- =====================================================

-- Bảng email_batch_recipients (Lưu từng recipient trong batch job)
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

-- =====================================================

-- Tạo indexes để tối ưu performance
CREATE INDEX `idx_batch_jobs_status_created` ON `email_batch_jobs` (`status`, `created_at`);
CREATE INDEX `idx_batch_recipients_job_status` ON `email_batch_recipients` (`batch_job_id`, `status`);

-- =====================================================

-- Comments cho các bảng
ALTER TABLE `email_batch_jobs` COMMENT = 'Batch jobs cho gửi email hàng loạt';
ALTER TABLE `email_batch_recipients` COMMENT = 'Danh sách recipients trong mỗi batch job';

