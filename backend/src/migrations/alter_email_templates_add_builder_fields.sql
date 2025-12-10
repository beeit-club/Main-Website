-- =====================================================
-- Migration: Alter email templates for builder support
-- Description: Thêm design_json, variables_schema và liên kết batch_job_id cho logs
-- Created: 2025-12
-- =====================================================

-- Thêm cột cho email_templates (kéo-thả & schema biến)
ALTER TABLE `email_templates`
  ADD COLUMN IF NOT EXISTS `design_json` json NULL AFTER `html_content`,
  ADD COLUMN IF NOT EXISTS `variables_schema` json NULL AFTER `variables`,
  ADD COLUMN IF NOT EXISTS `description` text COLLATE utf8mb4_vietnamese_ci NULL AFTER `category`;

-- Thêm batch_job_id vào email_logs để trace log theo batch
ALTER TABLE `email_logs`
  ADD COLUMN IF NOT EXISTS `batch_job_id` bigint unsigned NULL AFTER `template_id`,
  ADD KEY `idx_email_logs_batch` (`batch_job_id`);

-- Ràng buộc FK: email_logs.batch_job_id -> email_batch_jobs.id (nếu bảng đã tồn tại)
ALTER TABLE `email_logs`
  ADD CONSTRAINT `email_logs_ibfk_batch`
  FOREIGN KEY (`batch_job_id`) REFERENCES `email_batch_jobs` (`id`) ON DELETE SET NULL;

-- Ghi chú: chạy sau khi đã có email_templates, email_logs, email_batch_jobs


