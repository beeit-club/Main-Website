-- ============================================
-- BULK EMAIL SYSTEM TABLES
-- ============================================

-- 1. Bảng quản lý các chiến dịch gửi (Campaigns)
-- Lưu thông tin tổng quát: Tên chiến dịch, Template dùng, Tổng số người, Tiến độ
CREATE TABLE IF NOT EXISTS `email_campaigns` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL COMMENT 'Tên chiến dịch, VD: Tuyển dụng đợt 1',
  `template_id` BIGINT UNSIGNED NOT NULL,
  `status` ENUM('pending', 'processing', 'completed', 'paused', 'failed') DEFAULT 'pending',
  `total_recipients` INT DEFAULT 0,
  `success_count` INT DEFAULT 0,
  `fail_count` INT DEFAULT 0,
  `scheduled_at` DATETIME DEFAULT NULL COMMENT 'Gửi vào lúc nào (NULL = Gửi ngay)',
  `completed_at` DATETIME DEFAULT NULL,
  `created_by` BIGINT UNSIGNED, -- User ID của Admin tạo
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`template_id`) REFERENCES `email_templates`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- 2. Bảng hàng đợi chi tiết (Queue)
-- Lưu từng email cụ thể cần gửi
CREATE TABLE IF NOT EXISTS `email_queue` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `campaign_id` INT NOT NULL,
  `recipient_email` VARCHAR(255) NOT NULL,
  `recipient_name` VARCHAR(255),
  `variables` JSON COMMENT 'Snapshot các biến tại thời điểm tạo (VD: {name: "A", time: "9h"})',
  `status` ENUM('pending', 'processing', 'sent', 'failed') DEFAULT 'pending',
  `attempts` INT DEFAULT 0 COMMENT 'Số lần thử lại',
  `error_message` TEXT,
  `sent_at` DATETIME,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`campaign_id`) REFERENCES `email_campaigns`(`id`) ON DELETE CASCADE,
  INDEX `idx_status` (`status`),
  INDEX `idx_campaign` (`campaign_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;