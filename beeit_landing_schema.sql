-- =========================================================
-- BEEIT LANDING PAGE SCHEMA
-- =========================================================

-- 1. Hero Section
CREATE TABLE IF NOT EXISTS `bee_hero_section` (
  `id` int NOT NULL AUTO_INCREMENT,
  `background_image_url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `background_image_alt` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `title_line1` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `title_line2` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `subtitle` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `overlay_opacity` decimal(3,2) DEFAULT '0.60',
  `is_active` tinyint(1) DEFAULT '1',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- 2. Stats
CREATE TABLE IF NOT EXISTS `bee_stats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `label` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `value` int NOT NULL DEFAULT '0',
  `suffix` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT '',
  `display_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- 3. Leaders
CREATE TABLE IF NOT EXISTS `bee_leaders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `role` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `image_url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `bio` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `linkedin_url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `github_url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `facebook_url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `display_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- 4. Achievements
CREATE TABLE IF NOT EXISTS `bee_achievements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `year` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `image` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `row_number` int DEFAULT '1',
  `display_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- 5. Timeline (Pillars & Events)
-- Note: Pillars are fairly static but we can store them too if needed. 
-- For now, focused on Events which change more often.
CREATE TABLE IF NOT EXISTS `bee_timeline_events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `year` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `image` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `display_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- 6. Activities
CREATE TABLE IF NOT EXISTS `bee_activities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `icon` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `image` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `display_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- 7. Projects
CREATE TABLE IF NOT EXISTS `bee_projects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `category` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `tech_stack` json COMMENT 'Array of strings e.g. ["React", "Node"]',
  `image` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `demo_url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `github_url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `display_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- 8. Gallery / Moments
CREATE TABLE IF NOT EXISTS `bee_gallery` (
  `id` int NOT NULL AUTO_INCREMENT,
  `image_url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `caption` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `height_class` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `display_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- 9. Testimonials
CREATE TABLE IF NOT EXISTS `bee_testimonials` (
  `id` int NOT NULL AUTO_INCREMENT,
  `author` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `role` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `avatar_url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `year_info` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `display_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- 10. Join Process
CREATE TABLE IF NOT EXISTS `bee_join_process` (
  `id` int NOT NULL AUTO_INCREMENT,
  `icon` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `date_range` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `display_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
