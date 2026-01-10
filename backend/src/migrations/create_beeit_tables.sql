-- ============================================
-- BEEIT LANDING PAGE MANAGEMENT TABLES
-- ============================================
-- Migration: Create all tables for BeeIT landing page content management
-- Date: 2025-01-XX

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================
-- 1. HERO SECTION
-- ============================================
CREATE TABLE IF NOT EXISTS `beeit_hero` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `background_image_url` VARCHAR(500),
  `background_image_alt` VARCHAR(200) DEFAULT 'BEE IT Club',
  `overlay_opacity` DECIMAL(3,2) DEFAULT 0.50,
  `title_line1` VARCHAR(100) DEFAULT 'BUILDING THE',
  `title_line2` VARCHAR(100) DEFAULT 'DIGITAL HIVE',
  `subtitle` TEXT,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- ============================================
-- 2. ABOUT SECTION
-- ============================================
CREATE TABLE IF NOT EXISTS `beeit_about` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `established_date` DATE,
  `main_title` VARCHAR(200) DEFAULT 'VỀ BEE IT CLUB',
  `description_paragraph1` TEXT,
  `description_paragraph2` TEXT,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

CREATE TABLE IF NOT EXISTS `beeit_about_cards` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `card_type` ENUM('target', 'mission', 'values', 'community') NOT NULL,
  `icon_name` VARCHAR(50) NOT NULL,
  `title` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `values_list` JSON,
  `display_order` INT DEFAULT 0,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_card_type` (`card_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- ============================================
-- 3. HALL OF FAME SECTION
-- ============================================
CREATE TABLE IF NOT EXISTS `beeit_hall_of_fame` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `section_number` VARCHAR(10) DEFAULT '03',
  `section_code` VARCHAR(100) DEFAULT 'Đại_Sảnh_Vinh_Quang',
  `section_title` VARCHAR(200) DEFAULT 'HALL OF FAME',
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

CREATE TABLE IF NOT EXISTS `beeit_achievements` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(200) NOT NULL,
  `year` VARCHAR(20) NOT NULL,
  `description` TEXT,
  `image_url` VARCHAR(500),
  `row_number` INT DEFAULT 1 COMMENT '1 or 2 for dual scrolling rows',
  `display_order` INT DEFAULT 0,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_row_order` (`row_number`, `display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- ============================================
-- 4. STATS SECTION
-- ============================================
CREATE TABLE IF NOT EXISTS `beeit_stats` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `stat_key` VARCHAR(50) UNIQUE NOT NULL COMMENT 'members, events, projects, partners',
  `label` VARCHAR(100) NOT NULL,
  `value` INT NOT NULL DEFAULT 0,
  `suffix` VARCHAR(10) DEFAULT '',
  `display_order` INT DEFAULT 0,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- ============================================
-- 5. LEADERS SECTION (The Kernel)
-- ============================================
CREATE TABLE IF NOT EXISTS `beeit_leaders` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(200) NOT NULL,
  `role` VARCHAR(200) NOT NULL,
  `image_url` VARCHAR(500),
  `bio` TEXT,
  `github_url` VARCHAR(500),
  `linkedin_url` VARCHAR(500),
  `facebook_url` VARCHAR(500),
  `email` VARCHAR(200),
  `display_order` INT DEFAULT 0,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- ============================================
-- 6. BEHIND THE SCENES SECTION
-- ============================================
CREATE TABLE IF NOT EXISTS `beeit_behind_scenes` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `image_url` VARCHAR(500) NOT NULL,
  `alt_text` VARCHAR(200),
  `display_order` INT DEFAULT 0,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- ============================================
-- 7. ACTIVITIES SECTION
-- ============================================
CREATE TABLE IF NOT EXISTS `beeit_activities` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `icon_name` VARCHAR(50) NOT NULL COMMENT 'Terminal, Mic, Share2, BookOpen, Swords, Rocket',
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT,
  `image_url` VARCHAR(500),
  `display_order` INT DEFAULT 0,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- ============================================
-- 8. TIMELINE SECTION
-- ============================================
CREATE TABLE IF NOT EXISTS `beeit_timeline_pillars` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `icon_name` VARCHAR(50) NOT NULL COMMENT 'Target, Flag, Zap, Users',
  `title` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `color_theme` VARCHAR(50) DEFAULT 'primary' COMMENT 'primary, accent, secondary, green-500',
  `display_order` INT DEFAULT 0,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

CREATE TABLE IF NOT EXISTS `beeit_timeline_events` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `year` VARCHAR(50) NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT,
  `image_url` VARCHAR(500),
  `display_order` INT DEFAULT 0,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- ============================================
-- 9. FOOTER SECTION
-- ============================================
CREATE TABLE IF NOT EXISTS `beeit_footer_settings` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `terminal_prompt` VARCHAR(100) DEFAULT 'guest@beeit-terminal:~',
  `heading_text` VARCHAR(200) DEFAULT '# Kết nối với chúng tôi',
  `subheading_text` VARCHAR(300) DEFAULT 'Sẵn sàng kích hoạt tiềm năng của bạn?',
  `command_prompt` VARCHAR(100) DEFAULT 'guest@beeit:~$',
  `command_text` VARCHAR(100) DEFAULT 'join --email',
  `placeholder_text` VARCHAR(200) DEFAULT 'nhập_email_của_bạn',
  `button_text` VARCHAR(100) DEFAULT '[GỬI_LỆNH]',
  `contact_email` VARCHAR(200) DEFAULT 'contact@beeit.club',
  `location_text` VARCHAR(200) DEFAULT 'TP.HCM, Việt Nam',
  `github_url` VARCHAR(500),
  `facebook_url` VARCHAR(500),
  `instagram_url` VARCHAR(500),
  `copyright_text` VARCHAR(500) DEFAULT '© {year} BEE IT CLUB. MỌI HỆ THỐNG ĐANG HOẠT ĐỘNG.',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

CREATE TABLE IF NOT EXISTS `beeit_email_submissions` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `email` VARCHAR(200) NOT NULL,
  `status` ENUM('new', 'processed', 'archived') DEFAULT 'new',
  `submitted_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `processed_at` TIMESTAMP NULL,
  `notes` TEXT,
  INDEX `idx_email` (`email`),
  INDEX `idx_status` (`status`),
  INDEX `idx_submitted` (`submitted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- INSERT DEFAULT DATA
-- ============================================

-- Insert default Hero (only one record)
INSERT INTO `beeit_hero` (
  `background_image_url`,
  `title_line1`,
  `title_line2`,
  `subtitle`
) VALUES (
  'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop',
  'BUILDING THE',
  'DIGITAL HIVE',
  'Cộng đồng lập trình viên đam mê công nghệ. Nơi kết nối tri thức, chia sẻ kinh nghiệm và kiến tạo những sản phẩm đột phá.'
) ON DUPLICATE KEY UPDATE `id` = `id`;

-- Insert default Stats
INSERT INTO `beeit_stats` (`stat_key`, `label`, `value`, `suffix`, `display_order`) VALUES
('members', 'THÀNH VIÊN', 350, '+', 1),
('events', 'SỰ KIỆN TỔ CHỨC', 42, '', 2),
('projects', 'DỰ ÁN', 150, '+', 3),
('partners', 'ĐỐI TÁC', 12, '', 4)
ON DUPLICATE KEY UPDATE `id` = `id`;

-- Insert default Footer Settings (only one record)
INSERT INTO `beeit_footer_settings` (
  `terminal_prompt`,
  `heading_text`,
  `subheading_text`,
  `command_prompt`,
  `command_text`,
  `placeholder_text`,
  `button_text`,
  `contact_email`,
  `location_text`,
  `copyright_text`
) VALUES (
  'guest@beeit-terminal:~',
  '# Kết nối với chúng tôi',
  'Sẵn sàng kích hoạt tiềm năng của bạn?',
  'guest@beeit:~$',
  'join --email',
  'nhập_email_của_bạn',
  '[GỬI_LỆNH]',
  'contact@beeit.club',
  'TP.HCM, Việt Nam',
  '© {year} BEE IT CLUB. MỌI HỆ THỐNG ĐANG HOẠT ĐỘNG.'
) ON DUPLICATE KEY UPDATE `id` = `id`;

-- Insert default About
INSERT INTO `beeit_about` (
  `established_date`,
  `main_title`,
  `description_paragraph1`,
  `description_paragraph2`
) VALUES (
  '2023-07-01',
  'VỀ BEE IT CLUB',
  'Trực thuộc FPT Polytechnic, chúng tôi không chỉ là một câu lạc bộ.',
  'Chúng tôi là một "Tổ Ong Kỹ Thuật Số" (Digital Hive) - nơi những dòng code kiến tạo tương lai và niềm đam mê công nghệ được kết nối không giới hạn.'
) ON DUPLICATE KEY UPDATE `id` = `id`;

-- Insert default About Cards
INSERT INTO `beeit_about_cards` (`card_type`, `icon_name`, `title`, `description`, `values_list`, `display_order`) VALUES
('target', 'Target', 'Mục Tiêu', 'Xây dựng cộng đồng CNTT vững mạnh, nơi mọi thành viên đều là một "mắt xích" quan trọng trong hệ sinh thái công nghệ.', NULL, 1),
('mission', 'Flag', 'Sứ Mệnh', 'Lan tỏa ngọn lửa đam mê, trang bị vũ khí kiến thức thực chiến để sinh viên tự tin chinh phục thị trường việc làm IT.', NULL, 2),
('values', 'Zap', 'Giá Trị Cốt Lõi', NULL, '["Đam mê (Passion)", "Sáng tạo (Creativity)", "Hợp tác (Collaboration)"]', 3),
('community', 'Users', 'Cộng Đồng', 'Mạng lưới kết nối Alumni, Mentor và Doanh nghiệp. Nơi hỗ trợ nhau từ dòng code đầu tiên đến dự án triệu đô.', NULL, 4)
ON DUPLICATE KEY UPDATE `id` = `id`;

-- Insert default Hall of Fame settings
INSERT INTO `beeit_hall_of_fame` (
  `section_number`,
  `section_code`,
  `section_title`
) VALUES (
  '03',
  'Đại_Sảnh_Vinh_Quang',
  'HALL OF FAME'
) ON DUPLICATE KEY UPDATE `id` = `id`;

