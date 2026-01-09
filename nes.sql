-- MySQL dump 10.13  Distrib 8.0.44, for Linux (x86_64)
--
-- Host: localhost    Database: beeit
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `answers`
--

DROP TABLE IF EXISTS `answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `answers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `question_id` bigint unsigned DEFAULT NULL,
  `status` tinyint DEFAULT '1',
  `vote_score` int DEFAULT '0',
  `is_accepted` tinyint(1) DEFAULT '0',
  `parent_id` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `question_id` (`question_id`),
  KEY `parent_id` (`parent_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `answers_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `answers_ibfk_2` FOREIGN KEY (`parent_id`) REFERENCES `answers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `answers_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `answers_ibfk_4` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answers`
--

LOCK TABLES `answers` WRITE;
/*!40000 ALTER TABLE `answers` DISABLE KEYS */;
INSERT INTO `answers` VALUES (1,'<p>sao lai the dc&nbsp;</p>\n<p>&nbsp;</p>',2,1,0,0,NULL,NULL,NULL,'2026-01-03 12:21:47','2026-01-03 12:21:47',NULL),(2,'<p>khong bniet nua</p>',2,1,0,0,NULL,NULL,NULL,'2026-01-03 19:26:04','2026-01-03 12:26:03',NULL),(3,'<p>that a</p>',2,1,0,0,2,NULL,NULL,'2026-01-03 19:37:39','2026-01-03 12:37:39',NULL);
/*!40000 ALTER TABLE `answers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `beeit_about`
--

DROP TABLE IF EXISTS `beeit_about`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `beeit_about` (
  `id` int NOT NULL AUTO_INCREMENT,
  `established_date` date DEFAULT NULL,
  `main_title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT 'VỀ BEE IT CLUB',
  `description_paragraph1` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `description_paragraph2` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `beeit_about`
--

LOCK TABLES `beeit_about` WRITE;
/*!40000 ALTER TABLE `beeit_about` DISABLE KEYS */;
/*!40000 ALTER TABLE `beeit_about` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `beeit_about_cards`
--

DROP TABLE IF EXISTS `beeit_about_cards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `beeit_about_cards` (
  `id` int NOT NULL AUTO_INCREMENT,
  `card_type` enum('target','mission','values','community') CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `icon_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `values_list` json DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_card_type` (`card_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `beeit_about_cards`
--

LOCK TABLES `beeit_about_cards` WRITE;
/*!40000 ALTER TABLE `beeit_about_cards` DISABLE KEYS */;
/*!40000 ALTER TABLE `beeit_about_cards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `beeit_achievements`
--

DROP TABLE IF EXISTS `beeit_achievements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `beeit_achievements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `year` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `row_number` int DEFAULT '1' COMMENT '1 or 2 for dual scrolling rows',
  `display_order` int DEFAULT '0',
  `status` enum('active','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_row_order` (`row_number`,`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `beeit_achievements`
--

LOCK TABLES `beeit_achievements` WRITE;
/*!40000 ALTER TABLE `beeit_achievements` DISABLE KEYS */;
/*!40000 ALTER TABLE `beeit_achievements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `beeit_activities`
--

DROP TABLE IF EXISTS `beeit_activities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `beeit_activities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `icon_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL COMMENT 'Terminal, Mic, Share2, BookOpen, Swords, Rocket',
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `status` enum('active','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `beeit_activities`
--

LOCK TABLES `beeit_activities` WRITE;
/*!40000 ALTER TABLE `beeit_activities` DISABLE KEYS */;
/*!40000 ALTER TABLE `beeit_activities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `beeit_behind_scenes`
--

DROP TABLE IF EXISTS `beeit_behind_scenes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `beeit_behind_scenes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `alt_text` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `status` enum('active','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `beeit_behind_scenes`
--

LOCK TABLES `beeit_behind_scenes` WRITE;
/*!40000 ALTER TABLE `beeit_behind_scenes` DISABLE KEYS */;
/*!40000 ALTER TABLE `beeit_behind_scenes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `beeit_email_submissions`
--

DROP TABLE IF EXISTS `beeit_email_submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `beeit_email_submissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `status` enum('new','processed','archived') CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT 'new',
  `submitted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `processed_at` timestamp NULL DEFAULT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  PRIMARY KEY (`id`),
  KEY `idx_email` (`email`),
  KEY `idx_status` (`status`),
  KEY `idx_submitted` (`submitted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `beeit_email_submissions`
--

LOCK TABLES `beeit_email_submissions` WRITE;
/*!40000 ALTER TABLE `beeit_email_submissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `beeit_email_submissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `beeit_footer_settings`
--

DROP TABLE IF EXISTS `beeit_footer_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `beeit_footer_settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `terminal_prompt` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT 'guest@beeit-terminal:~',
  `heading_text` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT '# Kết nối với chúng tôi',
  `subheading_text` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT 'Sẵn sàng kích hoạt tiềm năng của bạn?',
  `command_prompt` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT 'guest@beeit:~$',
  `command_text` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT 'join --email',
  `placeholder_text` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT 'nhập_email_của_bạn',
  `button_text` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT '[GỬI_LỆNH]',
  `contact_email` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT 'contact@beeit.club',
  `location_text` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT 'TP.HCM, Việt Nam',
  `github_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `facebook_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `instagram_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `copyright_text` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT '© {year} BEE IT CLUB. MỌI HỆ THỐNG ĐANG HOẠT ĐỘNG.',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `beeit_footer_settings`
--

LOCK TABLES `beeit_footer_settings` WRITE;
/*!40000 ALTER TABLE `beeit_footer_settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `beeit_footer_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `beeit_hall_of_fame`
--

DROP TABLE IF EXISTS `beeit_hall_of_fame`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `beeit_hall_of_fame` (
  `id` int NOT NULL AUTO_INCREMENT,
  `section_number` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT '03',
  `section_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT 'Đại_Sảnh_Vinh_Quang',
  `section_title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT 'HALL OF FAME',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `beeit_hall_of_fame`
--

LOCK TABLES `beeit_hall_of_fame` WRITE;
/*!40000 ALTER TABLE `beeit_hall_of_fame` DISABLE KEYS */;
/*!40000 ALTER TABLE `beeit_hall_of_fame` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `beeit_hero`
--

DROP TABLE IF EXISTS `beeit_hero`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `beeit_hero` (
  `id` int NOT NULL AUTO_INCREMENT,
  `background_image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `background_image_alt` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT 'BEE IT Club',
  `overlay_opacity` decimal(3,2) DEFAULT '0.50',
  `title_line1` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT 'BUILDING THE',
  `title_line2` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT 'DIGITAL HIVE',
  `subtitle` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `beeit_hero`
--

LOCK TABLES `beeit_hero` WRITE;
/*!40000 ALTER TABLE `beeit_hero` DISABLE KEYS */;
INSERT INTO `beeit_hero` VALUES (1,'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop','BEE IT Club',0.50,'BUILDING THE','DIGITAL HIVE','Cộng đồng lập trình viên đam mê công nghệ. Nơi kết nối tri thức, chia sẻ kinh nghiệm và kiến tạo những sản phẩm đột phá.',1,'2026-01-07 14:42:03','2026-01-07 14:42:03');
/*!40000 ALTER TABLE `beeit_hero` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `beeit_leaders`
--

DROP TABLE IF EXISTS `beeit_leaders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `beeit_leaders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `role` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `bio` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `github_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `linkedin_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `facebook_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `email` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `status` enum('active','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `beeit_leaders`
--

LOCK TABLES `beeit_leaders` WRITE;
/*!40000 ALTER TABLE `beeit_leaders` DISABLE KEYS */;
/*!40000 ALTER TABLE `beeit_leaders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `beeit_stats`
--

DROP TABLE IF EXISTS `beeit_stats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `beeit_stats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `stat_key` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL COMMENT 'members, events, projects, partners',
  `label` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `value` int NOT NULL DEFAULT '0',
  `suffix` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT '',
  `display_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `stat_key` (`stat_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `beeit_stats`
--

LOCK TABLES `beeit_stats` WRITE;
/*!40000 ALTER TABLE `beeit_stats` DISABLE KEYS */;
/*!40000 ALTER TABLE `beeit_stats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `beeit_timeline_events`
--

DROP TABLE IF EXISTS `beeit_timeline_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `beeit_timeline_events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `year` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `status` enum('active','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `beeit_timeline_events`
--

LOCK TABLES `beeit_timeline_events` WRITE;
/*!40000 ALTER TABLE `beeit_timeline_events` DISABLE KEYS */;
/*!40000 ALTER TABLE `beeit_timeline_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `beeit_timeline_pillars`
--

DROP TABLE IF EXISTS `beeit_timeline_pillars`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `beeit_timeline_pillars` (
  `id` int NOT NULL AUTO_INCREMENT,
  `icon_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL COMMENT 'Target, Flag, Zap, Users',
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `color_theme` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT 'primary' COMMENT 'primary, accent, secondary, green-500',
  `display_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `beeit_timeline_pillars`
--

LOCK TABLES `beeit_timeline_pillars` WRITE;
/*!40000 ALTER TABLE `beeit_timeline_pillars` DISABLE KEYS */;
/*!40000 ALTER TABLE `beeit_timeline_pillars` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `document_categories`
--

DROP TABLE IF EXISTS `document_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `document_categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `slug` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `parent_id` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `parent_id` (`parent_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `document_categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `document_categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `document_categories_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `document_categories_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `document_categories`
--

LOCK TABLES `document_categories` WRITE;
/*!40000 ALTER TABLE `document_categories` DISABLE KEYS */;
INSERT INTO `document_categories` VALUES (1,'Lập trình Web','lap-trinh-web',NULL,NULL,NULL,'2026-01-03 13:40:34','2026-01-03 13:40:34',NULL),(2,'Lập trình Di động','lap-trinh-di-dong',NULL,NULL,NULL,'2026-01-03 13:40:34','2026-01-03 13:40:34',NULL),(3,'Thiết kế đồ họa','thiet-ke-do-hoa',NULL,NULL,NULL,'2026-01-03 13:40:34','2026-01-03 13:40:34',NULL),(4,'Kỹ năng mềm','ky-nang-mem',NULL,NULL,NULL,'2026-01-03 13:40:34','2026-01-03 13:40:34',NULL),(5,'Tài nguyên Nội bộ','tai-nguyen-noi-bo',NULL,NULL,NULL,'2026-01-03 13:40:34','2026-01-03 13:40:34',NULL);
/*!40000 ALTER TABLE `document_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `document_restricted_users`
--

DROP TABLE IF EXISTS `document_restricted_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `document_restricted_users` (
  `document_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `granted_by` bigint unsigned DEFAULT NULL,
  `granted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`document_id`,`user_id`),
  KEY `user_id` (`user_id`),
  KEY `granted_by` (`granted_by`),
  CONSTRAINT `document_restricted_users_ibfk_1` FOREIGN KEY (`document_id`) REFERENCES `documents` (`id`) ON DELETE CASCADE,
  CONSTRAINT `document_restricted_users_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `document_restricted_users_ibfk_3` FOREIGN KEY (`granted_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `document_restricted_users`
--

LOCK TABLES `document_restricted_users` WRITE;
/*!40000 ALTER TABLE `document_restricted_users` DISABLE KEYS */;
/*!40000 ALTER TABLE `document_restricted_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documents`
--

DROP TABLE IF EXISTS `documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `slug` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `file_url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `preview_url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `category_id` bigint unsigned DEFAULT NULL,
  `access_level` enum('public','member_only','restricted') CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT 'public',
  `status` int DEFAULT '0',
  `download_count` int DEFAULT '0',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `category_id` (`category_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `documents_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `document_categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `documents_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `documents_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documents`
--

LOCK TABLES `documents` WRITE;
/*!40000 ALTER TABLE `documents` DISABLE KEYS */;
INSERT INTO `documents` VALUES (1,'Fullstack Web Roadmap 2026','fullstack-web-roadmap-2026','Lộ trình học Web từ zero đến hero','https://roadmap.sh/full-stack','https://roadmap.sh/images/og-main.png',1,'public',1,150,NULL,NULL,'2026-01-03 13:40:34','2026-01-03 13:40:34',NULL),(2,'Next.js Documentation PDF','nextjs-documentation-pdf','Tài liệu chính thức Next.js offline','https://nextjs.org/docs','https://nextjs.org/static/blog/next-13/swc.png',1,'public',1,85,NULL,NULL,'2026-01-03 13:40:34','2026-01-03 13:40:34',NULL),(3,'Flutter Architecture Guide','flutter-architecture-guide','Hướng dẫn kiến trúc clean code trong Flutter','https://github.com/flutter/samples','https://storage.googleapis.com/cms-storage-bucket/7076035a051758a4f47c.png',2,'member_only',1,42,NULL,NULL,'2026-01-03 13:40:34','2026-01-03 13:40:34',NULL),(4,'Figma UI Kit cho Người mới','figma-ui-kit-beginner','Bộ UI kit cơ bản để thực hành thiết kế','https://www.figma.com/community/file/123456789','https://s3-alpha.figma.com/hub/file/2837492/2345.png',3,'public',1,210,NULL,NULL,'2026-01-03 13:40:34','2026-01-03 13:40:34',NULL),(5,'Kỹ năng thuyết trình chuyên nghiệp','ky-nang-thuyet-trinh-chuyen-nghiep','Slide hướng dẫn cách thuyết trình thu hút','https://docs.google.com/presentation/d/1abcxyz/edit','https://upload.wikimedia.org/wikipedia/commons/thumb/p/p4/Google_Presentations_icon_%282014-2020%29.svg/1200px-Google_Presentations_icon_%282014-2020%29.svg.png',4,'public',1,67,NULL,NULL,'2026-01-03 13:40:34','2026-01-03 13:40:34',NULL),(6,'Sổ tay Thành viên Bee IT','so-tay-thanh-vien-bee-it','Tất cả quy định và quyền lợi thành viên','https://docs.google.com/document/d/internal-link','https://cdn.dribbble.com/users/314275/screenshots/11075727/media/20265275e7a33c2a92286433602ce766.jpg',5,'member_only',1,300,NULL,NULL,'2026-01-03 13:40:34','2026-01-03 13:40:34',NULL);
/*!40000 ALTER TABLE `documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_batch_jobs`
--

DROP TABLE IF EXISTS `email_batch_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_batch_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `template_id` bigint unsigned DEFAULT NULL,
  `template_slug` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `job_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `status` enum('pending','processing','completed','failed','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT 'pending',
  `total_recipients` int unsigned NOT NULL,
  `sent_count` int unsigned DEFAULT '0',
  `failed_count` int unsigned DEFAULT '0',
  `progress_percent` decimal(5,2) DEFAULT '0.00',
  `started_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `error_message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `options` json DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `status` (`status`),
  KEY `created_by` (`created_by`),
  KEY `template_id` (`template_id`),
  KEY `created_at` (`created_at`),
  KEY `idx_batch_jobs_status_created` (`status`,`created_at`),
  CONSTRAINT `email_batch_jobs_ibfk_1` FOREIGN KEY (`template_id`) REFERENCES `email_templates` (`id`) ON DELETE SET NULL,
  CONSTRAINT `email_batch_jobs_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci COMMENT='Batch jobs cho gửi email hàng loạt';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_batch_jobs`
--

LOCK TABLES `email_batch_jobs` WRITE;
/*!40000 ALTER TABLE `email_batch_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `email_batch_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_batch_recipients`
--

DROP TABLE IF EXISTS `email_batch_recipients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_batch_recipients` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `batch_job_id` bigint unsigned NOT NULL,
  `recipient_email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `status` enum('pending','sent','failed') CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT 'pending',
  `variables` json DEFAULT NULL,
  `error_message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `retry_count` int unsigned DEFAULT '0',
  `sent_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `batch_job_id` (`batch_job_id`),
  KEY `status` (`status`),
  KEY `recipient_email` (`recipient_email`),
  KEY `idx_batch_recipients_job_status` (`batch_job_id`,`status`),
  CONSTRAINT `email_batch_recipients_ibfk_1` FOREIGN KEY (`batch_job_id`) REFERENCES `email_batch_jobs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci COMMENT='Danh sách recipients trong mỗi batch job';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_batch_recipients`
--

LOCK TABLES `email_batch_recipients` WRITE;
/*!40000 ALTER TABLE `email_batch_recipients` DISABLE KEYS */;
/*!40000 ALTER TABLE `email_batch_recipients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_campaigns`
--

DROP TABLE IF EXISTS `email_campaigns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_campaigns` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL COMMENT 'TÃªn chiáº¿n dá»‹ch, VD: Tuyá»ƒn dá»¥ng Ä‘á»£t 1',
  `template_id` bigint unsigned NOT NULL,
  `status` enum('pending','processing','completed','paused','failed') COLLATE utf8mb4_vietnamese_ci DEFAULT 'pending',
  `total_recipients` int DEFAULT '0',
  `success_count` int DEFAULT '0',
  `fail_count` int DEFAULT '0',
  `scheduled_at` datetime DEFAULT NULL COMMENT 'Gá»­i vÃ o lÃºc nÃ o (NULL = Gá»­i ngay)',
  `completed_at` datetime DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `template_id` (`template_id`),
  CONSTRAINT `email_campaigns_ibfk_1` FOREIGN KEY (`template_id`) REFERENCES `email_templates` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_campaigns`
--

LOCK TABLES `email_campaigns` WRITE;
/*!40000 ALTER TABLE `email_campaigns` DISABLE KEYS */;
INSERT INTO `email_campaigns` VALUES (1,'Thanh Hóa',6,'completed',2,2,0,NULL,'2026-01-07 17:09:23',3,'2026-01-07 17:09:16','2026-01-07 17:09:23'),(2,'tb phong van lan 1 nhac nho',3,'completed',2,2,0,NULL,'2026-01-07 17:23:11',3,'2026-01-07 17:23:04','2026-01-07 17:23:11');
/*!40000 ALTER TABLE `email_campaigns` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_custom_variables`
--

DROP TABLE IF EXISTS `email_custom_variables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_custom_variables` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `template_id` bigint unsigned DEFAULT NULL COMMENT 'NULL = global variable',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL COMMENT 'Tên biến',
  `type` enum('expression','helper','function') CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL DEFAULT 'expression',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci COMMENT 'Mô tả biến',
  `expression` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci COMMENT 'Expression để tính toán',
  `dependencies` json DEFAULT NULL,
  `helper_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `helper_params` json DEFAULT NULL,
  `function_code` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `return_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL DEFAULT 'string',
  `is_active` tinyint(1) DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_template_id_unique` (`name`,`template_id`),
  KEY `template_id` (`template_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  KEY `is_active` (`is_active`),
  CONSTRAINT `email_custom_variables_ibfk_1` FOREIGN KEY (`template_id`) REFERENCES `email_templates` (`id`) ON DELETE CASCADE,
  CONSTRAINT `email_custom_variables_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `email_custom_variables_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_custom_variables`
--

LOCK TABLES `email_custom_variables` WRITE;
/*!40000 ALTER TABLE `email_custom_variables` DISABLE KEYS */;
/*!40000 ALTER TABLE `email_custom_variables` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_logs`
--

DROP TABLE IF EXISTS `email_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `template_id` bigint unsigned DEFAULT NULL,
  `template_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `recipient_email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `subject` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `status` enum('pending','sent','failed') CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT 'pending',
  `error_message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `variables_used` json DEFAULT NULL,
  `sent_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `template_id` (`template_id`),
  KEY `recipient_email` (`recipient_email`),
  KEY `status` (`status`),
  KEY `created_at` (`created_at`),
  CONSTRAINT `email_logs_ibfk_1` FOREIGN KEY (`template_id`) REFERENCES `email_templates` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci COMMENT='Log các email đã gửi';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_logs`
--

LOCK TABLES `email_logs` WRITE;
/*!40000 ALTER TABLE `email_logs` DISABLE KEYS */;
INSERT INTO `email_logs` VALUES (1,1,'Mã OTP đăng nhập','hairobet15092005@gmail.com','Mã OTP đăng nhập - Bee IT Club','sent',NULL,'{}','2026-01-07 23:26:07','2026-01-07 16:26:06'),(2,1,'Mã OTP đăng nhập','hikarituisui1@gmail.com','Mã OTP đăng nhập - Bee IT Club','sent',NULL,'{\"otp\": \"659991\"}','2026-01-07 23:35:09','2026-01-07 16:35:08'),(3,6,'Xác nhận đăng ký sự kiện','hikarituisui1@gmail.com','✅ Đăng ký thành công: ','sent',NULL,'{\"email\": \"hikarituisui1@gmail.com\", \"fullname\": \"Nguyễn Đức Kiên\"}','2026-01-08 00:09:23','2026-01-07 17:09:23'),(4,6,'Xác nhận đăng ký sự kiện','hairobet15092005@gmail.com','✅ Đăng ký thành công: ','sent',NULL,'{\"email\": \"hairobet15092005@gmail.com\", \"fullname\": \"Trần Văn Hải P H 5 5 6 5 3\"}','2026-01-08 00:09:23','2026-01-07 17:09:23'),(5,3,'Thông báo lịch phỏng vấn','hikarituisui1@gmail.com','Mời phỏng vấn: ','sent',NULL,'{\"email\": \"hikarituisui1@gmail.com\", \"phone\": \"\", \"fullname\": \"Nguyễn Đức Kiên\", \"role_name\": \"\", \"student_id\": \"\"}','2026-01-08 00:23:12','2026-01-07 17:23:11'),(6,3,'Thông báo lịch phỏng vấn','hairobet15092005@gmail.com','Mời phỏng vấn: ','sent',NULL,'{\"email\": \"hairobet15092005@gmail.com\", \"phone\": \"\", \"fullname\": \"Trần Văn Hải P H 5 5 6 5 3\", \"role_name\": \"\", \"student_id\": \"\"}','2026-01-08 00:23:12','2026-01-07 17:23:11'),(7,1,'Mã OTP đăng nhập','hairobet15092005@gmail.com','Mã OTP đăng nhập - Bee IT Club','sent',NULL,'{\"otp\": \"297966\"}','2026-01-08 13:25:13','2026-01-08 06:25:12'),(8,1,'Mã OTP đăng nhập','hikarituisui1@gmail.com','Mã OTP đăng nhập - Bee IT Club','sent',NULL,'{\"otp\": \"669304\"}','2026-01-08 16:49:12','2026-01-08 09:49:12');
/*!40000 ALTER TABLE `email_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_queue`
--

DROP TABLE IF EXISTS `email_queue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_queue` (
  `id` int NOT NULL AUTO_INCREMENT,
  `campaign_id` int NOT NULL,
  `recipient_email` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `recipient_name` varchar(255) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `variables` json DEFAULT NULL COMMENT 'Snapshot cÃ¡c biáº¿n táº¡i thá»i Ä‘iá»ƒm táº¡o (VD: {name: "A", time: "9h"})',
  `status` enum('pending','processing','sent','failed') COLLATE utf8mb4_vietnamese_ci DEFAULT 'pending',
  `attempts` int DEFAULT '0' COMMENT 'Sá»‘ láº§n thá»­ láº¡i',
  `error_message` text COLLATE utf8mb4_vietnamese_ci,
  `sent_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_campaign` (`campaign_id`),
  CONSTRAINT `email_queue_ibfk_1` FOREIGN KEY (`campaign_id`) REFERENCES `email_campaigns` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_queue`
--

LOCK TABLES `email_queue` WRITE;
/*!40000 ALTER TABLE `email_queue` DISABLE KEYS */;
INSERT INTO `email_queue` VALUES (1,1,'hairobet15092005@gmail.com','Trần Văn Hải P H 5 5 6 5 3','{\"email\": \"hairobet15092005@gmail.com\", \"fullname\": \"Trần Văn Hải P H 5 5 6 5 3\"}','sent',0,NULL,'2026-01-08 00:09:23','2026-01-07 17:09:16','2026-01-07 17:09:23'),(2,1,'hikarituisui1@gmail.com','Nguyễn Đức Kiên','{\"email\": \"hikarituisui1@gmail.com\", \"fullname\": \"Nguyễn Đức Kiên\"}','sent',0,NULL,'2026-01-08 00:09:23','2026-01-07 17:09:16','2026-01-07 17:09:23'),(3,2,'hairobet15092005@gmail.com','Trần Văn Hải P H 5 5 6 5 3','{\"email\": \"hairobet15092005@gmail.com\", \"phone\": \"\", \"fullname\": \"Trần Văn Hải P H 5 5 6 5 3\", \"role_name\": \"\", \"student_id\": \"\"}','sent',0,NULL,'2026-01-08 00:23:12','2026-01-07 17:23:04','2026-01-07 17:23:11'),(4,2,'hikarituisui1@gmail.com','Nguyễn Đức Kiên','{\"email\": \"hikarituisui1@gmail.com\", \"phone\": \"\", \"fullname\": \"Nguyễn Đức Kiên\", \"role_name\": \"\", \"student_id\": \"\"}','sent',0,NULL,'2026-01-08 00:23:12','2026-01-07 17:23:04','2026-01-07 17:23:11');
/*!40000 ALTER TABLE `email_queue` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_template_categories`
--

DROP TABLE IF EXISTS `email_template_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_template_categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL COMMENT 'Tên danh mục',
  `slug` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL COMMENT 'Slug danh mục',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci COMMENT 'Mô tả danh mục',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci COMMENT='Danh mục email templates';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_template_categories`
--

LOCK TABLES `email_template_categories` WRITE;
/*!40000 ALTER TABLE `email_template_categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `email_template_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_templates`
--

DROP TABLE IF EXISTS `email_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_templates` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL COMMENT 'Tên template (unique)',
  `subject` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL COMMENT 'Subject của email (có thể dùng variables)',
  `header` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `body` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL COMMENT 'Ná»™i dung Body HTML',
  `footer` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `text_content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci COMMENT 'Nội dung text thuần (optional)',
  `category` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT NULL COMMENT 'Danh mục: authentication, application, event, document, system, custom',
  `variables` json DEFAULT NULL COMMENT 'Danh sách variables và mô tả',
  `default_variables` json DEFAULT NULL COMMENT 'Giá trị mặc định cho variables',
  `is_active` tinyint(1) DEFAULT '1' COMMENT 'Template có đang active không',
  `is_system` tinyint(1) DEFAULT '0' COMMENT 'Template hệ thống (không thể xóa)',
  `created_by` bigint unsigned DEFAULT NULL COMMENT 'User tạo template',
  `updated_by` bigint unsigned DEFAULT NULL COMMENT 'User cập nhật template',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `category` (`category`),
  KEY `is_active` (`is_active`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  KEY `deleted_at` (`deleted_at`),
  CONSTRAINT `email_templates_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `email_templates_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci COMMENT='Email templates động';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_templates`
--

LOCK TABLES `email_templates` WRITE;
/*!40000 ALTER TABLE `email_templates` DISABLE KEYS */;
INSERT INTO `email_templates` VALUES (1,'Mã OTP đăng nhập','Mã OTP đăng nhập - Bee IT Club',NULL,'\n      <p>Xin chào,</p>\n      <p>Mã xác thực (OTP) của bạn là: <b style=\"font-size: 18px;\">{{otp}}</b></p>\n      <p>Mã này có hiệu lực trong thời gian ngắn. Tuyệt đối không chia sẻ mã này cho bất kỳ ai.</p>\n    ',NULL,NULL,'Authentication','[{\"name\": \"otp\", \"type\": \"string\", \"required\": true}]',NULL,1,1,NULL,NULL,'2026-01-07 15:12:44','2026-01-07 16:27:40',NULL),(2,'Xác nhận nộp đơn thành công','Xác nhận nộp đơn - Bee IT Club',NULL,'\n      <p>Chào <b>{{fullname}}</b>,</p>\n      <p>Chúng tôi đã nhận được đơn đăng ký của bạn với thông tin sau:</p>\n      <ul>\n        <li>Email: {{email}}</li>\n        <li>MSSV: {{student_id}}</li>\n      </ul>\n      <p>Kết quả sẽ được thông báo qua email trong thời gian sớm nhất.</p>\n    ',NULL,NULL,'Recruitment','[{\"name\": \"fullname\", \"type\": \"string\", \"required\": true}, {\"name\": \"email\", \"type\": \"string\", \"required\": true}, {\"name\": \"student_id\", \"type\": \"string\", \"required\": true}]',NULL,1,1,NULL,NULL,'2026-01-07 15:12:44','2026-01-07 16:27:40',NULL),(3,'Thông báo lịch phỏng vấn','Mời phỏng vấn: {{schedule_title}}',NULL,'\n      <p>Chào <b>{{fullname}}</b>,</p>\n      <p>Chúc mừng bạn đã vượt qua vòng đơn. Chúng tôi trân trọng mời bạn tham gia phỏng vấn:</p>\n      <ul>\n        <li><b>Thời gian:</b> {{start_time}} - {{end_time}}, ngày {{interview_date}}</li>\n        <li><b>Địa điểm:</b> {{location}}</li>\n      </ul>\n      <p>Ghi chú: {{description}}</p>\n      <p>Vui lòng có mặt đúng giờ và chuẩn bị kỹ lưỡng.</p>\n    ',NULL,NULL,'Recruitment','[{\"name\": \"fullname\", \"type\": \"string\", \"required\": true}, {\"name\": \"schedule_title\", \"type\": \"string\", \"required\": true}, {\"name\": \"start_time\", \"type\": \"string\", \"required\": true}, {\"name\": \"end_time\", \"type\": \"string\", \"required\": true}, {\"name\": \"interview_date\", \"type\": \"string\", \"required\": true}, {\"name\": \"location\", \"type\": \"string\", \"required\": true}, {\"name\": \"description\", \"type\": \"string\", \"required\": true}]',NULL,1,1,NULL,NULL,'2026-01-07 15:12:44','2026-01-07 16:27:40',NULL),(4,'Đơn đăng ký được phê duyệt','🎉 Chúc mừng! Bạn đã trúng tuyển',NULL,'\n      <p>Chào <b>{{fullname}}</b>,</p>\n      <p>Chúc mừng bạn! Bạn đã chính thức trở thành thành viên của Bee IT Club.</p>\n      <p><b>Bước tiếp theo:</b></p>\n      <ul>\n        <li>Đăng nhập hệ thống bằng email: {{email}}</li>\n        <li>Cập nhật hồ sơ cá nhân.</li>\n        <li>Tham gia Group chat của CLB.</li>\n      </ul>\n      <p>Lời nhắn từ ban phỏng vấn: \"{{interview_notes}}\"</p>\n    ',NULL,NULL,'Recruitment','[{\"name\": \"fullname\", \"type\": \"string\", \"required\": true}, {\"name\": \"email\", \"type\": \"string\", \"required\": true}, {\"name\": \"interview_notes\", \"type\": \"string\", \"required\": true}]',NULL,1,1,NULL,NULL,'2026-01-07 15:12:44','2026-01-07 16:27:40',NULL),(5,'Đơn đăng ký bị từ chối','Thông báo kết quả tuyển thành viên',NULL,'\n      <p>Chào <b>{{fullname}}</b>,</p>\n      <p>Cảm ơn bạn đã quan tâm đến Bee IT Club. Sau khi cân nhắc kỹ, chúng tôi rất tiếc chưa thể đồng hành cùng bạn trong đợt tuyển này.</p>\n      <p>Lý do/Góp ý: \"{{interview_notes}}\"</p>\n      <p>Hy vọng sẽ được gặp lại bạn ở các đợt tuyển sau khi bạn đã sẵn sàng hơn.</p>\n    ',NULL,NULL,'Recruitment','[{\"name\": \"fullname\", \"type\": \"string\", \"required\": true}, {\"name\": \"interview_notes\", \"type\": \"string\", \"required\": true}]',NULL,1,1,NULL,NULL,'2026-01-07 15:12:44','2026-01-07 16:27:40',NULL),(6,'Xác nhận đăng ký sự kiện','✅ Đăng ký thành công: {{event_title}}',NULL,'\n      <p>Chào <b>{{fullname}}</b>,</p>\n      <p>Bạn đã đăng ký thành công sự kiện <b>{{event_title}}</b>.</p>\n      <ul>\n        <li>Thời gian: {{start_time}}</li>\n        <li>Địa điểm: {{location}}</li>\n      </ul>\n      <p>Ghi chú của bạn: {{notes}}</p>\n      <p>Vui lòng mang theo email này khi đến check-in.</p>\n    ',NULL,NULL,'Events','[{\"name\": \"fullname\", \"type\": \"string\", \"required\": true}, {\"name\": \"event_title\", \"type\": \"string\", \"required\": true}, {\"name\": \"start_time\", \"type\": \"string\", \"required\": true}, {\"name\": \"location\", \"type\": \"string\", \"required\": true}, {\"name\": \"notes\", \"type\": \"string\", \"required\": true}]',NULL,1,1,NULL,NULL,'2026-01-07 15:12:44','2026-01-07 16:27:40',NULL),(7,'Nhắc nhở sự kiện','⏰ Nhắc nhở: {{event_title}} sắp diễn ra',NULL,'\n      <p>Chào <b>{{fullname}}</b>,</p>\n      <p>Sự kiện <b>{{event_title}}</b> sẽ diễn ra trong <b>{{time_until}}</b> nữa.</p>\n      <ul>\n        <li>Thời gian: {{start_time}}</li>\n        <li>Địa điểm: {{location}}</li>\n      </ul>\n      <p>Hẹn gặp bạn tại sự kiện!</p>\n    ',NULL,NULL,'Events','[{\"name\": \"fullname\", \"type\": \"string\", \"required\": true}, {\"name\": \"event_title\", \"type\": \"string\", \"required\": true}, {\"name\": \"time_until\", \"type\": \"string\", \"required\": true}, {\"name\": \"start_time\", \"type\": \"string\", \"required\": true}, {\"name\": \"location\", \"type\": \"string\", \"required\": true}]',NULL,1,1,NULL,NULL,'2026-01-07 15:12:44','2026-01-07 16:27:40',NULL),(8,'Xác nhận điểm danh sự kiện','✅ Đã điểm danh: {{event_title}}',NULL,'\n      <p>Chào <b>{{fullname}}</b>,</p>\n      <p>Xác nhận bạn đã có mặt tại sự kiện <b>{{event_title}}</b>.</p>\n      <p>Thời gian check-in: {{check_in_time}}</p>\n    ',NULL,NULL,'Events','[{\"name\": \"fullname\", \"type\": \"string\", \"required\": true}, {\"name\": \"event_title\", \"type\": \"string\", \"required\": true}, {\"name\": \"check_in_time\", \"type\": \"string\", \"required\": true}]',NULL,1,1,NULL,NULL,'2026-01-07 15:12:44','2026-01-07 16:27:40',NULL),(9,'Thông báo hủy/thay đổi sự kiện','⚠️ Thông báo quan trọng về sự kiện {{event_title}}',NULL,'\n      <p>Chào <b>{{fullname}}</b>,</p>\n      {{#if is_cancelled}}\n        <p>Chúng tôi rất tiếc phải thông báo sự kiện <b>{{event_title}}</b> đã bị HỦY.</p>\n      {{else}}\n        <p>Sự kiện <b>{{event_title}}</b> có thay đổi thông tin:</p>\n        <ul>\n          <li>Thời gian mới: {{new_start_time}}</li>\n          <li>Địa điểm mới: {{new_location}}</li>\n        </ul>\n      {{/if}}\n      <p>Lý do: {{reason}}</p>\n      <p>Mong bạn thông cảm cho sự bất tiện này.</p>\n    ',NULL,NULL,'Events','[{\"name\": \"fullname\", \"type\": \"string\", \"required\": true}, {\"name\": \"event_title\", \"type\": \"string\", \"required\": true}, {\"name\": \"is_cancelled\", \"type\": \"boolean\", \"required\": true}, {\"name\": \"new_start_time\", \"type\": \"string\", \"required\": true}, {\"name\": \"new_location\", \"type\": \"string\", \"required\": true}, {\"name\": \"reason\", \"type\": \"string\", \"required\": true}]',NULL,1,1,NULL,NULL,'2026-01-07 15:12:44','2026-01-07 16:27:40',NULL),(10,'Cấp quyền truy cập tài liệu','📄 Chia sẻ tài liệu: {{document_title}}',NULL,'\n      <p>Chào <b>{{fullname}}</b>,</p>\n      <p>Bạn đã được cấp quyền xem tài liệu: <b>{{document_title}}</b>.</p>\n      <p>Mô tả: {{document_description}}</p>\n      <p>Vui lòng đăng nhập vào hệ thống để xem chi tiết.</p>\n    ',NULL,NULL,'Documents','[{\"name\": \"fullname\", \"type\": \"string\", \"required\": true}, {\"name\": \"document_title\", \"type\": \"string\", \"required\": true}, {\"name\": \"document_description\", \"type\": \"string\", \"required\": true}]',NULL,1,1,NULL,NULL,'2026-01-07 15:12:44','2026-01-07 16:27:40',NULL),(11,'Đặt lại mật khẩu','Yêu cầu đặt lại mật khẩu',NULL,'\n      <p>Chào bạn,</p>\n      <p>Mã OTP đặt lại mật khẩu của bạn là: <b style=\"font-size: 18px;\">{{reset_code}}</b></p>\n      <p>Mã này hết hạn sau {{expires_in}} phút.</p>\n      {{#if reset_link}}\n        <p>Hoặc bấm vào đây: <a href=\"{{reset_link}}\">Đặt lại mật khẩu</a></p>\n      {{/if}}\n    ',NULL,NULL,'Authentication','[{\"name\": \"reset_code\", \"type\": \"string\", \"required\": true}, {\"name\": \"expires_in\", \"type\": \"number\", \"required\": true}, {\"name\": \"reset_link\", \"type\": \"string\", \"required\": true}]',NULL,1,1,NULL,NULL,'2026-01-07 15:12:44','2026-01-07 16:27:40',NULL),(12,'Chào mừng thành viên mới','Chào mừng đến với Bee IT Club!',NULL,'\n      <p>Xin chào <b>{{fullname}}</b>,</p>\n      <p>Chào mừng bạn gia nhập Bee IT Club!</p>\n      <p>Tài khoản của bạn đã được kích hoạt với email: <b>{{email}}</b>.</p>\n      <p>Hãy bắt đầu khám phá và kết nối cùng mọi người nhé.</p>\n    ',NULL,NULL,'System','[{\"name\": \"fullname\", \"type\": \"string\", \"required\": true}, {\"name\": \"email\", \"type\": \"string\", \"required\": true}]',NULL,1,1,NULL,NULL,'2026-01-07 15:12:44','2026-01-07 16:27:40',NULL),(13,'Nhắc nhở đóng phí','🔔 Nhắc đóng phí thành viên',NULL,'\n      <p>Chào <b>{{name}}</b>,</p>\n      <p>Vui lòng hoàn thành đóng phí thành viên trước ngày: <b>{{deadline}}</b>.</p>\n      <ul>\n        <li>Số tiền: {{amount}} VNĐ</li>\n        <li>Trạng thái: Còn {{days_remaining}}</li>\n      </ul>\n      <p>Nếu bạn đã đóng, vui lòng bỏ qua email này.</p>\n    ',NULL,NULL,'Finance','[{\"name\": \"name\", \"type\": \"string\", \"required\": true}, {\"name\": \"deadline\", \"type\": \"string\", \"required\": true}, {\"name\": \"amount\", \"type\": \"number\", \"required\": true}, {\"name\": \"days_remaining\", \"type\": \"string\", \"required\": true}]',NULL,1,1,NULL,NULL,'2026-01-07 15:12:44','2026-01-07 16:27:40',NULL),(14,'BeeIT - Login OTP','[BeeIT] MÃ£ xÃ¡c thá»±c Ä‘Äƒng nháº­p cá»§a báº¡n',NULL,'<p>MÃ£ OTP Ä‘á»ƒ Ä‘Äƒng nháº­p vÃ o tÃ i khoáº£n cá»§a báº¡n lÃ : <strong>{{otp}}</strong></p><p>MÃ£ nÃ y sáº½ háº¿t háº¡n sau 5 phÃºt.</p>',NULL,NULL,NULL,NULL,NULL,1,1,NULL,NULL,'2026-01-08 09:54:24','2026-01-08 09:54:24',NULL),(15,'BeeIT - Welcome Email','ChÃ o má»«ng báº¡n Ä‘áº¿n vá»›i BeeIT!',NULL,'<p>ChÃ o má»«ng {{fullname}},</p><p>Cáº£m Æ¡n báº¡n Ä‘Ã£ Ä‘Äƒng kÃ½ tÃ i khoáº£n táº¡i website cá»§a BeeIT Club.</p>',NULL,NULL,NULL,NULL,NULL,1,1,NULL,NULL,'2026-01-08 09:54:24','2026-01-08 09:54:24',NULL),(16,'BeeIT - Application Received','XÃ¡c nháº­n: ChÃºng tÃ´i Ä‘Ã£ nháº­n Ä‘Æ°á»£c Ä‘Æ¡n á»©ng tuyá»ƒn cá»§a báº¡n',NULL,'<p>ChÃ o {{fullname}},</p><p>ChÃºng tÃ´i xÃ¡c nháº­n Ä‘Ã£ nháº­n Ä‘Æ°á»£c Ä‘Æ¡n á»©ng tuyá»ƒn cá»§a báº¡n cho CÃ¢u láº¡c bá»™ cá»§a chÃºng tÃ´i. ChÃºng tÃ´i sáº½ xem xÃ©t vÃ  liÃªn há»‡ láº¡i vá»›i báº¡n sá»›m nháº¥t cÃ³ thá»ƒ.</p><p>TrÃ¢n trá»ng,<br>BeeIT Club</p>',NULL,NULL,NULL,NULL,NULL,1,1,NULL,NULL,'2026-01-08 09:54:24','2026-01-08 09:54:24',NULL);
/*!40000 ALTER TABLE `email_templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_variables`
--

DROP TABLE IF EXISTS `email_variables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_variables` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_vietnamese_ci NOT NULL COMMENT 'TÃªn biáº¿n trong template (VD: fullname)',
  `description` varchar(255) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL COMMENT 'MÃ´ táº£ (VD: Há» tÃªn Ä‘áº§y Ä‘á»§ cá»§a ngÆ°á»i nháº­n)',
  `mapping_key` varchar(100) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL COMMENT 'TrÆ°á»ng tÆ°Æ¡ng á»©ng trong báº£ng Users (VD: fullname, email)',
  `is_system` tinyint(1) DEFAULT '0' COMMENT 'Biáº¿n há»‡ thá»‘ng, khÃ´ng cho xÃ³a',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_variables`
--

LOCK TABLES `email_variables` WRITE;
/*!40000 ALTER TABLE `email_variables` DISABLE KEYS */;
INSERT INTO `email_variables` VALUES (1,'fullname','Há» vÃ  tÃªn ngÆ°á»i nháº­n','fullname',1,'2026-01-07 17:13:09'),(2,'email','Email ngÆ°á»i nháº­n','email',1,'2026-01-07 17:13:09'),(3,'phone','Sá»‘ Ä‘iá»‡n thoáº¡i','phone',1,'2026-01-07 17:13:09'),(4,'role_name','Vai trÃ² (Role)','role_name',1,'2026-01-07 17:13:09'),(5,'student_id','MÃ£ sá»‘ sinh viÃªn','student_id',1,'2026-01-07 17:13:09'),(6,'academic_year','KhÃ³a há»c (VD: K17)','academic_year',1,'2026-01-07 17:13:09'),(7,'otp','MÃ£ xÃ¡c thá»±c OTP',NULL,1,'2026-01-07 17:13:09'),(8,'reset_link','Link Ä‘áº·t láº¡i máº­t kháº©u',NULL,1,'2026-01-07 17:13:09'),(9,'event_title','TÃªn sá»± kiá»‡n',NULL,0,'2026-01-07 17:13:09'),(10,'start_time','Thá»i gian báº¯t Ä‘áº§u',NULL,0,'2026-01-07 17:13:09'),(11,'location','Äá»‹a Ä‘iá»ƒm',NULL,0,'2026-01-07 17:13:09');
/*!40000 ALTER TABLE `email_variables` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_attendances`
--

DROP TABLE IF EXISTS `event_attendances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_attendances` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `event_id` bigint unsigned DEFAULT NULL,
  `registration_id` bigint unsigned DEFAULT NULL,
  `checked_in` tinyint(1) DEFAULT '0',
  `check_in_time` timestamp NULL DEFAULT NULL,
  `checked_in_by` bigint unsigned DEFAULT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `event_id` (`event_id`),
  KEY `registration_id` (`registration_id`),
  KEY `checked_in_by` (`checked_in_by`),
  CONSTRAINT `event_attendances_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `event_attendances_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  CONSTRAINT `event_attendances_ibfk_3` FOREIGN KEY (`registration_id`) REFERENCES `event_registrations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `event_attendances_ibfk_4` FOREIGN KEY (`checked_in_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_attendances`
--

LOCK TABLES `event_attendances` WRITE;
/*!40000 ALTER TABLE `event_attendances` DISABLE KEYS */;
/*!40000 ALTER TABLE `event_attendances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_registrations`
--

DROP TABLE IF EXISTS `event_registrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_registrations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `event_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `registration_type` enum('private','public') CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `guest_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `guest_email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `guest_phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `registered_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `event_id` (`event_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `event_registrations_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  CONSTRAINT `event_registrations_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_registrations`
--

LOCK TABLES `event_registrations` WRITE;
/*!40000 ALTER TABLE `event_registrations` DISABLE KEYS */;
/*!40000 ALTER TABLE `event_registrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `slug` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `featured_image` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `meta_description` varchar(160) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `start_time` timestamp NOT NULL,
  `end_time` timestamp NOT NULL,
  `location` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `max_participants` int DEFAULT NULL,
  `registration_deadline` timestamp NULL DEFAULT NULL,
  `status` int DEFAULT '0',
  `is_public` tinyint(1) DEFAULT '1',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `events_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `founders`
--

DROP TABLE IF EXISTS `founders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `founders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL COMMENT 'Họ và tên',
  `role` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL COMMENT 'Vai trò',
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT NULL COMMENT 'URL ảnh đại diện',
  `bio` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci COMMENT 'Tiểu sử',
  `achievements` json DEFAULT NULL COMMENT 'Danh sách thành tựu (JSON array)',
  `social_email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT NULL COMMENT 'Email liên hệ',
  `social_linkedin` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT NULL COMMENT 'LinkedIn URL',
  `social_github` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT NULL COMMENT 'GitHub URL',
  `display_order` int unsigned DEFAULT '0' COMMENT 'Thứ tự hiển thị',
  `is_active` tinyint(1) DEFAULT '1' COMMENT '1 = hiển thị, 0 = ẩn',
  `is_founder` tinyint(1) DEFAULT '0' COMMENT '1 = Người sáng lập, 0 = Thành viên ban chủ nhiệm',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `is_founder` (`is_founder`),
  KEY `display_order` (`display_order`),
  KEY `is_active` (`is_active`),
  KEY `created_by` (`created_by`),
  KEY `deleted_at` (`deleted_at`),
  KEY `founders_ibfk_2` (`updated_by`),
  CONSTRAINT `founders_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `founders_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci COMMENT='Quản lý Người sáng lập và Ban Chủ Nhiệm';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `founders`
--

LOCK TABLES `founders` WRITE;
/*!40000 ALTER TABLE `founders` DISABLE KEYS */;
/*!40000 ALTER TABLE `founders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `interview_schedules`
--

DROP TABLE IF EXISTS `interview_schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `interview_schedules` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `interview_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `location` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `created_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `interview_schedules_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `interview_schedules`
--

LOCK TABLES `interview_schedules` WRITE;
/*!40000 ALTER TABLE `interview_schedules` DISABLE KEYS */;
INSERT INTO `interview_schedules` VALUES (1,'phong van don 20/11','2026-01-09','14:00:00','16:23:00','p405','khong co gi',3,'2026-01-07 10:21:48','2026-01-07 10:21:48');
/*!40000 ALTER TABLE `interview_schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_edit_requests`
--

DROP TABLE IF EXISTS `member_edit_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_edit_requests` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `student_id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `academic_year` date DEFAULT NULL,
  `reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `status` enum('pending','approved','rejected') COLLATE utf8mb4_vietnamese_ci DEFAULT 'pending',
  `admin_note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `processed_by` bigint unsigned DEFAULT NULL,
  `processed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `processed_by` (`processed_by`),
  CONSTRAINT `member_edit_requests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `member_edit_requests_ibfk_2` FOREIGN KEY (`processed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_edit_requests`
--

LOCK TABLES `member_edit_requests` WRITE;
/*!40000 ALTER TABLE `member_edit_requests` DISABLE KEYS */;
INSERT INTO `member_edit_requests` VALUES (1,4,'PH55653','2022-09-07','','rejected','ma sinh vien da ton tai roi ',3,'2026-01-08 07:48:33','2026-01-08 07:18:08','2026-01-08 07:48:33');
/*!40000 ALTER TABLE `member_edit_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_profiles`
--

DROP TABLE IF EXISTS `member_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_profiles` (
  `user_id` bigint unsigned NOT NULL,
  `student_id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `academic_year` date DEFAULT NULL,
  `join_date` date DEFAULT (curdate()),
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `student_id` (`student_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `member_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `member_profiles_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `member_profiles_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_profiles`
--

LOCK TABLES `member_profiles` WRITE;
/*!40000 ALTER TABLE `member_profiles` DISABLE KEYS */;
INSERT INTO `member_profiles` VALUES (3,'PH55653','2022-09-10','2023-02-01',3,NULL,'2026-01-07 07:55:53','2026-01-07 07:55:53',NULL),(4,'PH676776','2022-09-08','2026-01-07',3,NULL,'2026-01-07 10:23:39','2026-01-07 10:23:39',NULL);
/*!40000 ALTER TABLE `member_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `membership_applications`
--

DROP TABLE IF EXISTS `membership_applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `membership_applications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `fullname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `student_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `student_year` date DEFAULT NULL,
  `major` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `schedule_id` bigint unsigned DEFAULT NULL,
  `interview_notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `status` tinyint DEFAULT '2',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_id` (`student_id`),
  KEY `fk_app_schedule` (`schedule_id`),
  CONSTRAINT `fk_app_schedule` FOREIGN KEY (`schedule_id`) REFERENCES `interview_schedules` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `membership_applications`
--

LOCK TABLES `membership_applications` WRITE;
/*!40000 ALTER TABLE `membership_applications` DISABLE KEYS */;
INSERT INTO `membership_applications` VALUES (1,'hikarituisui1@gmail.com','0965932120','pham duc kien','PH676776','2022-09-08','CNTT',1,'y thuc tot co chuyen mon cao',3,'2026-01-07 09:22:29','2026-01-07 10:23:39');
/*!40000 ALTER TABLE `membership_applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `memory_flow_items`
--

DROP TABLE IF EXISTS `memory_flow_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `memory_flow_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL COMMENT 'Tiêu đề ảnh',
  `caption` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL COMMENT 'Mô tả ảnh',
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL COMMENT 'URL ảnh',
  `display_order` int unsigned DEFAULT '0' COMMENT 'Thứ tự hiển thị',
  `is_active` tinyint(1) DEFAULT '1' COMMENT '1 = hiển thị, 0 = ẩn',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `display_order` (`display_order`),
  KEY `is_active` (`is_active`),
  KEY `created_by` (`created_by`),
  KEY `deleted_at` (`deleted_at`),
  KEY `memory_flow_items_ibfk_2` (`updated_by`),
  CONSTRAINT `memory_flow_items_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `memory_flow_items_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci COMMENT='Quản lý ảnh Memory Flow';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `memory_flow_items`
--

LOCK TABLES `memory_flow_items` WRITE;
/*!40000 ALTER TABLE `memory_flow_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `memory_flow_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `module` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_categories`
--

DROP TABLE IF EXISTS `post_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `slug` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `parent_id` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `parent_id` (`parent_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `post_categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `post_categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `post_categories_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `post_categories_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_categories`
--

LOCK TABLES `post_categories` WRITE;
/*!40000 ALTER TABLE `post_categories` DISABLE KEYS */;
INSERT INTO `post_categories` VALUES (1,'beeit','beeit',NULL,NULL,NULL,'2026-01-07 07:24:36','2026-01-07 07:24:36',NULL);
/*!40000 ALTER TABLE `post_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_comments`
--

DROP TABLE IF EXISTS `post_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_comments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `author_id` bigint unsigned DEFAULT NULL,
  `post_id` bigint unsigned DEFAULT NULL,
  `parent_id` bigint unsigned DEFAULT NULL,
  `status` int DEFAULT '1',
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `author_id` (`author_id`),
  KEY `post_id` (`post_id`),
  KEY `parent_id` (`parent_id`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `post_comments_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `post_comments_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `post_comments_ibfk_3` FOREIGN KEY (`parent_id`) REFERENCES `post_comments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `post_comments_ibfk_4` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_comments`
--

LOCK TABLES `post_comments` WRITE;
/*!40000 ALTER TABLE `post_comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `post_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_tags`
--

DROP TABLE IF EXISTS `post_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_tags` (
  `post_id` bigint unsigned NOT NULL,
  `tag_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`post_id`,`tag_id`),
  KEY `tag_id` (`tag_id`),
  CONSTRAINT `post_tags_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `post_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_tags`
--

LOCK TABLES `post_tags` WRITE;
/*!40000 ALTER TABLE `post_tags` DISABLE KEYS */;
INSERT INTO `post_tags` VALUES (1,1);
/*!40000 ALTER TABLE `post_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `slug` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `featured_image` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `meta_description` varchar(160) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `category_id` bigint unsigned DEFAULT NULL,
  `status` int DEFAULT '0',
  `view_count` int DEFAULT '0',
  `published_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `category_id` (`category_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `post_categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `posts_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `posts_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,'CHÚC MỪNG NĂM MỚI 2026 – NHÌN LẠI HÀNH TRÌNH 2025 CỦA CLB BEE IT','chuc-mung-nam-moi-2026-nhin-lai-hanh-trinh-2025-cua-clb-bee-it','<div class=\"xdj266r x14z9mp xat24cr x1lziwak x1vvkbs x126k92a\">\r\n<div>CH&Uacute;C MỪNG NĂM MỚI 2026 &ndash; NH&Igrave;N LẠI H&Agrave;NH TR&Igrave;NH 2025 CỦA CLB BEE IT <span class=\"html-span xexx8yu xyri2b x18d9i69 x1c1uobl x1hl2dhg x16tdsg8 x1vvkbs x3nfvp2 x1j61x8r x1fcty0u xdj266r xat24cr xm2jcoa x1mpyi22 xxymvpz xlup9mm x1kky2od\"><img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/t8c/1/16/1f389.png\" alt=\"🎉\" width=\"16\" height=\"16\"></span></div>\r\n</div>\r\n<div class=\"x14z9mp xat24cr x1lziwak x1vvkbs xtlvy1s x126k92a\">\r\n<div>Một năm nữa lại kh&eacute;p lại, mang theo thật nhiều kỷ niệm, trải nghiệm v&agrave; dấu ấn đ&aacute;ng nhớ.</div>\r\n<div>Nh&acirc;n dịp năm mới 2026, CLB Bee IT xin gửi lời cảm ơn ch&acirc;n th&agrave;nh v&agrave; lời ch&uacute;c tốt đẹp nhất đến tất cả c&aacute;c th&agrave;nh vi&ecirc;n, cộng t&aacute;c vi&ecirc;n v&agrave; những người đ&atilde; lu&ocirc;n đồng h&agrave;nh c&ugrave;ng CLB trong suốt thời gian qua <span class=\"html-span xexx8yu xyri2b x18d9i69 x1c1uobl x1hl2dhg x16tdsg8 x1vvkbs x3nfvp2 x1j61x8r x1fcty0u xdj266r xat24cr xm2jcoa x1mpyi22 xxymvpz xlup9mm x1kky2od\"><img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/t15/1/16/1f49b.png\" alt=\"💛\" width=\"16\" height=\"16\"></span></div>\r\n</div>\r\n<div class=\"x14z9mp xat24cr x1lziwak x1vvkbs xtlvy1s x126k92a\">\r\n<div><span class=\"html-span xexx8yu xyri2b x18d9i69 x1c1uobl x1hl2dhg x16tdsg8 x1vvkbs x3nfvp2 x1j61x8r x1fcty0u xdj266r xat24cr xm2jcoa x1mpyi22 xxymvpz xlup9mm x1kky2od\"><img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/t69/1/16/1f331.png\" alt=\"🌱\" width=\"16\" height=\"16\"></span> 2025 l&agrave; một năm Bee IT kh&ocirc;ng ngừng học hỏi, thử th&aacute;ch bản th&acirc;n v&agrave; mở rộng giới hạn qua h&agrave;ng loạt hoạt động học thuật &ndash; c&ocirc;ng nghệ &ndash; kỹ năng:</div>\r\n</div>\r\n<div class=\"x14z9mp xat24cr x1lziwak x1vvkbs xtlvy1s x126k92a\">\r\n<div><span class=\"html-span xexx8yu xyri2b x18d9i69 x1c1uobl x1hl2dhg x16tdsg8 x1vvkbs x3nfvp2 x1j61x8r x1fcty0u xdj266r xat24cr xm2jcoa x1mpyi22 xxymvpz xlup9mm x1kky2od\"><img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/tac/1/16/1f4cc.png\" alt=\"📌\" width=\"16\" height=\"16\"></span> 15/01 &ndash; Cuộc thi Rung Chu&ocirc;ng Đỏ: Khởi động năm mới đầy năng lượng v&agrave; tinh thần chinh phục tri thức.</div>\r\n<div><span class=\"html-span xexx8yu xyri2b x18d9i69 x1c1uobl x1hl2dhg x16tdsg8 x1vvkbs x3nfvp2 x1j61x8r x1fcty0u xdj266r xat24cr xm2jcoa x1mpyi22 xxymvpz xlup9mm x1kky2od\"><img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/tac/1/16/1f4cc.png\" alt=\"📌\" width=\"16\" height=\"16\"></span> 24/02 &ndash; Cuộc thi Bug Slayer: S&acirc;n chơi cho tư duy logic v&agrave; kỹ năng debug thực tế.</div>\r\n<div><span class=\"html-span xexx8yu xyri2b x18d9i69 x1c1uobl x1hl2dhg x16tdsg8 x1vvkbs x3nfvp2 x1j61x8r x1fcty0u xdj266r xat24cr xm2jcoa x1mpyi22 xxymvpz xlup9mm x1kky2od\"><img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/tac/1/16/1f4cc.png\" alt=\"📌\" width=\"16\" height=\"16\"></span> 30/03 &ndash; Olympic Tin học 2025: Thử th&aacute;ch kiến thức nền tảng v&agrave; thuật to&aacute;n.</div>\r\n<div><span class=\"html-span xexx8yu xyri2b x18d9i69 x1c1uobl x1hl2dhg x16tdsg8 x1vvkbs x3nfvp2 x1j61x8r x1fcty0u xdj266r xat24cr xm2jcoa x1mpyi22 xxymvpz xlup9mm x1kky2od\"><img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/tac/1/16/1f4cc.png\" alt=\"📌\" width=\"16\" height=\"16\"></span> 15/04 &ndash; Cuộc thi AI Về Bản: Những bước đi đầu ti&ecirc;n trong h&agrave;nh tr&igrave;nh kh&aacute;m ph&aacute; tr&iacute; tuệ nh&acirc;n tạo.</div>\r\n<div><span class=\"html-span xexx8yu xyri2b x18d9i69 x1c1uobl x1hl2dhg x16tdsg8 x1vvkbs x3nfvp2 x1j61x8r x1fcty0u xdj266r xat24cr xm2jcoa x1mpyi22 xxymvpz xlup9mm x1kky2od\"><img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/tac/1/16/1f4cc.png\" alt=\"📌\" width=\"16\" height=\"16\"></span> 24/05 &ndash; Seminar Chatbot RAG: Cập nhật xu hướng AI hiện đại v&agrave; ứng dụng thực tiễn.</div>\r\n<div><span class=\"html-span xexx8yu xyri2b x18d9i69 x1c1uobl x1hl2dhg x16tdsg8 x1vvkbs x3nfvp2 x1j61x8r x1fcty0u xdj266r xat24cr xm2jcoa x1mpyi22 xxymvpz xlup9mm x1kky2od\"><img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/tac/1/16/1f4cc.png\" alt=\"📌\" width=\"16\" height=\"16\"></span> 29&ndash;30/06 &ndash; Poly Leader Camp: Trau dồi kỹ năng l&atilde;nh đạo v&agrave; l&agrave;m việc nh&oacute;m cho c&aacute;c Bee n&ograve;ng cốt.</div>\r\n<div><span class=\"html-span xexx8yu xyri2b x18d9i69 x1c1uobl x1hl2dhg x16tdsg8 x1vvkbs x3nfvp2 x1j61x8r x1fcty0u xdj266r xat24cr xm2jcoa x1mpyi22 xxymvpz xlup9mm x1kky2od\"><img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/tac/1/16/1f4cc.png\" alt=\"📌\" width=\"16\" height=\"16\"></span> 27/07 &ndash; FPTU Secathon 2025: Cọ x&aacute;t m&ocirc;i trường an to&agrave;n th&ocirc;ng tin v&agrave; bảo mật.</div>\r\n<div><span class=\"html-span xexx8yu xyri2b x18d9i69 x1c1uobl x1hl2dhg x16tdsg8 x1vvkbs x3nfvp2 x1j61x8r x1fcty0u xdj266r xat24cr xm2jcoa x1mpyi22 xxymvpz xlup9mm x1kky2od\"><img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/tac/1/16/1f4cc.png\" alt=\"📌\" width=\"16\" height=\"16\"></span> 06/08 &ndash; Club Day: Mang h&igrave;nh ảnh Bee IT đến gần hơn với cộng đồng sinh vi&ecirc;n.</div>\r\n<div><span class=\"html-span xexx8yu xyri2b x18d9i69 x1c1uobl x1hl2dhg x16tdsg8 x1vvkbs x3nfvp2 x1j61x8r x1fcty0u xdj266r xat24cr xm2jcoa x1mpyi22 xxymvpz xlup9mm x1kky2od\"><img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/tac/1/16/1f4cc.png\" alt=\"📌\" width=\"16\" height=\"16\"></span> 11/09 &ndash; Ng&agrave;y hội C&acirc;u lạc bộ: Giao lưu, kết nối v&agrave; lan tỏa tinh thần CLB.</div>\r\n<div><span class=\"html-span xexx8yu xyri2b x18d9i69 x1c1uobl x1hl2dhg x16tdsg8 x1vvkbs x3nfvp2 x1j61x8r x1fcty0u xdj266r xat24cr xm2jcoa x1mpyi22 xxymvpz xlup9mm x1kky2od\"><img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/tac/1/16/1f4cc.png\" alt=\"📌\" width=\"16\" height=\"16\"></span> 13/10 &ndash; Talkshow BA Journey: Định hướng nghề nghiệp, chia sẻ h&agrave;nh tr&igrave;nh thực tế ng&agrave;nh BA.</div>\r\n<div><span class=\"html-span xexx8yu xyri2b x18d9i69 x1c1uobl x1hl2dhg x16tdsg8 x1vvkbs x3nfvp2 x1j61x8r x1fcty0u xdj266r xat24cr xm2jcoa x1mpyi22 xxymvpz xlup9mm x1kky2od\"><img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/tac/1/16/1f4cc.png\" alt=\"📌\" width=\"16\" height=\"16\"></span> 29/11 &ndash; Workshop Cardano #4: Tiếp cận Blockchain v&agrave; Web3.</div>\r\n<div><span class=\"html-span xexx8yu xyri2b x18d9i69 x1c1uobl x1hl2dhg x16tdsg8 x1vvkbs x3nfvp2 x1j61x8r x1fcty0u xdj266r xat24cr xm2jcoa x1mpyi22 xxymvpz xlup9mm x1kky2od\"><img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/tac/1/16/1f4cc.png\" alt=\"📌\" width=\"16\" height=\"16\"></span> 19/12 &ndash; Li&ecirc;n hoan cuối năm: Gắn kết, nh&igrave;n lại v&agrave; kh&eacute;p lại một năm đầy cảm x&uacute;c <span class=\"html-span xexx8yu xyri2b x18d9i69 x1c1uobl x1hl2dhg x16tdsg8 x1vvkbs x3nfvp2 x1j61x8r x1fcty0u xdj266r xat24cr xm2jcoa x1mpyi22 xxymvpz xlup9mm x1kky2od\"><img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/tb4/1/16/1f38a.png\" alt=\"🎊\" width=\"16\" height=\"16\"></span></div>\r\n</div>\r\n<div class=\"x14z9mp xat24cr x1lziwak x1vvkbs xtlvy1s x126k92a\">\r\n<div><span class=\"html-span xexx8yu xyri2b x18d9i69 x1c1uobl x1hl2dhg x16tdsg8 x1vvkbs x3nfvp2 x1j61x8r x1fcty0u xdj266r xat24cr xm2jcoa x1mpyi22 xxymvpz xlup9mm x1kky2od\"><img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/tf4/1/16/2728.png\" alt=\"✨\" width=\"16\" height=\"16\"></span> Mỗi sự kiện l&agrave; một cột mốc, mỗi hoạt động l&agrave; một bước trưởng th&agrave;nh. Bee IT kh&ocirc;ng chỉ l&agrave; nơi học tập kiến thức IT, m&agrave; c&ograve;n l&agrave; nơi kết nối đam m&ecirc; &ndash; chia sẻ gi&aacute; trị &ndash; c&ugrave;ng nhau ph&aacute;t triển.</div>\r\n</div>\r\n<div class=\"x14z9mp xat24cr x1lziwak x1vvkbs xtlvy1s x126k92a\">\r\n<div><span class=\"html-span xexx8yu xyri2b x18d9i69 x1c1uobl x1hl2dhg x16tdsg8 x1vvkbs x3nfvp2 x1j61x8r x1fcty0u xdj266r xat24cr xm2jcoa x1mpyi22 xxymvpz xlup9mm x1kky2od\"><img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/tc6/1/16/1f680.png\" alt=\"🚀\" width=\"16\" height=\"16\"></span> Bước sang năm 2026, Bee IT hứa hẹn sẽ tiếp tục đổi mới, s&aacute;ng tạo v&agrave; mang đến nhiều hoạt động chất lượng hơn nữa.</div>\r\n<div>Ch&uacute;c tất cả c&aacute;c Bee một năm mới sức khỏe dồi d&agrave;o &ndash; học tập hiệu quả &ndash; code mượt, bug &iacute;t, th&agrave;nh c&ocirc;ng nhiều <span class=\"html-span xexx8yu xyri2b x18d9i69 x1c1uobl x1hl2dhg x16tdsg8 x1vvkbs x3nfvp2 x1j61x8r x1fcty0u xdj266r xat24cr xm2jcoa x1mpyi22 xxymvpz xlup9mm x1kky2od\"><img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/te0/1/16/1f31f.png\" alt=\"🌟\" width=\"16\" height=\"16\"></span></div>\r\n</div>\r\n<div class=\"x14z9mp xat24cr x1lziwak x1vvkbs xtlvy1s x126k92a\">\r\n<div><span class=\"html-span xexx8yu xyri2b x18d9i69 x1c1uobl x1hl2dhg x16tdsg8 x1vvkbs x3nfvp2 x1j61x8r x1fcty0u xdj266r xat24cr xm2jcoa x1mpyi22 xxymvpz xlup9mm x1kky2od\"><img src=\"https://static.xx.fbcdn.net/images/emoji.php/v9/t9/1/16/1f386.png\" alt=\"🎆\" width=\"16\" height=\"16\"></span> Happy New Year 2026!</div>\r\n</div>\r\n<div class=\"x14z9mp xat24cr x1lziwak x1vvkbs xtlvy1s x126k92a\">\r\n<div>&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;</div>\r\n<div>Bee IT Club - Code hard, play harder</div>\r\n<div>Facebook: <span class=\"html-span xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x1hl2dhg x16tdsg8 x1vvkbs\"><a href=\"https://www.facebook.com/BeeIT.Club?__cft__[0]=AZbGduehiNLYNQ2UJEeaVMPk_HizlXmZhVT2PxajlQBY3gzx6RjTnXAZKj9B7W1Sd_NT-RmefdfEKbJlc5j9NA0-K_7FM7KfYbnPNchU0DA-3gEUxLLpjCaPPr0iPF7sFtAy_-XOsDVn-TGt6uYeAbaO_RzRT92mBwSEtzCA-LXOyXlt3synAXPkRLlV8bRI8g0&amp;__tn__=-]K-R\"><span class=\"xjp7ctv\">https://www.facebook.com/BeeIT.Club/</span></a></span></div>\r\n<div>Website: <span class=\"html-span xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x1hl2dhg x16tdsg8 x1vvkbs\"><a href=\"https://l.facebook.com/l.php?u=https%3A%2F%2Fbeeit.club%2F%3Ffbclid%3DIwZXh0bgNhZW0CMTAAYnJpZBExVlVJM2FtRTkwNVZZTGk4Q3NydGMGYXBwX2lkEDIyMjAzOTE3ODgyMDA4OTIAAR6r8-bd9a7sGj-jOuhJ23wMSnR0XM50DZt0tp_SiW0IS_bQXzF4RaXI0HaMHw_aem_CeGodA5t5YJi5qzTd2TtHg&amp;h=AT03OK85gJv0xiL-p-RDrSA7-U1vYF6ojPOyWYff6f20QxypWA7RybiCF0GdPQyrbGDDOta4UPiY7KflLtcKJB7gidN41LJJ2ugHnSCUhmeCjvHdps9R0VG1k5ZNwgzeqSSsYYWP&amp;__tn__=-UK-R&amp;c[0]=AT37o5RGd5roh_zHx1vAfha_kOicf_SXLRjHrsTzxhi2fkHXKHaIzE3Vr-p5WHFPlQJkGV3Emn5fkPdlNuW_yURLqYc-m_iNDLUTARr_-m4Ty0nmPL51h2qJ5Zvd9KoKQDO04fM30FGb27Lw9mj4_3hsZ48VwN8mCItBhTzXBS26ULGFAg-I1EepJVz2qVyQzbJHHdLmhusxEwPz_agSIefz\" target=\"_blank\">https://beeit.club</a></span></div>\r\n<div>Email: support@beeit.club</div>\r\n<div>Đăng k&iacute;: <span class=\"html-span xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x1hl2dhg x16tdsg8 x1vvkbs\"><a href=\"https://l.facebook.com/l.php?u=https%3A%2F%2Fform.beeit.club%2F%3Ffbclid%3DIwZXh0bgNhZW0CMTAAYnJpZBExVlVJM2FtRTkwNVZZTGk4Q3NydGMGYXBwX2lkEDIyMjAzOTE3ODgyMDA4OTIAAR5PJJNVU2UgnDGzahUHlBvNV4Fw5u3ypGc292j4p9fzC-05xidJrDEej1MqsQ_aem_YqXoF_VuKzEbGJ945PTp_A&amp;h=AT16PkzW7PUJqL2n4ioybHsXNolXZmn-7idA6CO26TSmpeGeG74tspcrMHsoQUusf3AcZ48ZJNxFoPj91behmOoswpT-nH-xS0T4iTtBlCMJ8a7PY5CeLbikjuaIxOmTuHztKoDT&amp;__tn__=-UK-R&amp;c[0]=AT37o5RGd5roh_zHx1vAfha_kOicf_SXLRjHrsTzxhi2fkHXKHaIzE3Vr-p5WHFPlQJkGV3Emn5fkPdlNuW_yURLqYc-m_iNDLUTARr_-m4Ty0nmPL51h2qJ5Zvd9KoKQDO04fM30FGb27Lw9mj4_3hsZ48VwN8mCItBhTzXBS26ULGFAg-I1EepJVz2qVyQzbJHHdLmhusxEwPz_agSIefz\" target=\"_blank\">https://form.beeit.club</a></span></div>\r\n<div>&nbsp;</div>\r\n<div>&nbsp;</div>\r\n<div>&nbsp;</div>\r\n<div><span class=\"html-span xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x1hl2dhg x16tdsg8 x1vvkbs\"><img src=\"https://scontent.fhan17-1.fna.fbcdn.net/v/t39.30808-6/605183519_740072082476358_9135459316378945044_n.jpg?_nc_cat=111&amp;ccb=1-7&amp;_nc_sid=127cfc&amp;_nc_ohc=TCOZ6RcABOQQ7kNvwHPB4J4&amp;_nc_oc=AdnStZFhi6Nhtqm0-AhYc3Q0OxCwugIY4zjJuDbK4_6K7R8DOraKYWeVguO_KiCX3V0&amp;_nc_zt=23&amp;_nc_ht=scontent.fhan17-1.fna&amp;_nc_gid=Gmg14SJ7e7P3xoUznl0DGA&amp;oh=00_AfppaH-BdXP1gQDV-oVYWgtArtKDzHw-qU7p5exTBAJP0g&amp;oe=6963F70D\" alt=\"Cuộc thi Rung Chu&ocirc;ng Đỏ: Khởi động năm mới đầy năng lượng v&agrave; tinh thần chinh phục tri thức\" width=\"700\"></span></div>\r\n</div>','http://localhost:8000/uploads/posts/605183519_740072082476358_9135459316378945044_n-1767771536079-706654242.jpg','CLB Bee IT xin gửi lời cảm ơn chân thành và lời chúc tốt đẹp nhất đến tất cả các thành viên, những người đã luôn đồng hành cùng CLB trong suốt thời gian qua',1,1,1,NULL,3,3,'2026-01-07 07:38:56','2026-01-07 07:40:26',NULL);
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `slug` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `meta_description` varchar(160) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `status` int DEFAULT '0',
  `view_count` int DEFAULT '0',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `questions_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
INSERT INTO `questions` VALUES (1,'lam sao de truy van sql toi hon ','lam-sao-de-truy-van-sql-toi-hon','<p>\"Chiến dịch n&agrave;y được thực hiện phối hợp với c&aacute;c cơ quan thực thi ph&aacute;p luật của Mỹ. Th&ocirc;ng tin chi tiết sẽ được cập nhật sau. Sẽ c&oacute; một cuộc họp b&aacute;o h&ocirc;m nay l&uacute;c 11 giờ s&aacute;ng tại Mar-a-Lago\", &ocirc;ng Trump cho hay th&ecirc;m.</p>\n<p>Tổng thống Venezuela Nicolas Maduro đ&atilde; bị lực lượng đặc nhiệm tinh nhuệ của Mỹ bắt giữ, một quan chức Mỹ cho biết ng&agrave;y 3.1.</p>\n\n<div><a title=\"Kh&oacute;i bốc l&ecirc;n tại s&acirc;n bay La Carlota ở Caracas, Venezuela ng&agrave;y 3.1.2026\" href=\"https://images2.thanhnien.vn/528068263637045248/2026/1/3/ap26003237866896-17674326348001251594912.jpg\" target=\"_blank\"><img title src=\"https://images2.thanhnien.vn/thumb_w/640/528068263637045248/2026/1/3/ap26003237866896-17674326348001251594912.jpg\" alt=\"&Ocirc;ng Trump n&oacute;i bắt được Tổng thống Venezuela  - Ảnh 1.\" width=\"2560\" height=\"1706\"></a></div>\n\n<p>Kh&oacute;i bốc l&ecirc;n tại s&acirc;n bay La Carlota ở Caracas, Venezuela ng&agrave;y 3.1.2026</p>\n\n<div class=\"PhotoCMS_Author\">\n<p>ẢNH: AP</p>\n</div>\n\n<p>Chưa c&oacute; th&ocirc;ng tin ch&iacute;nh thức từ Caracas về việc &ocirc;ng Maduro bị bắt giữ.</p>\n<p>Th&ocirc;ng tin được &ocirc;ng Trump đưa ra sau khi Venezuela chấn động v&igrave; một loạt</p>',NULL,1,0,NULL,NULL,'2026-01-03 10:46:46','2026-01-03 10:46:46',NULL),(2,'hello ban ban co the giup gi cho chung toi ','hello-ban-ban-co-the-giup-gi-cho-chung-toi','<p>\"Chiến dịch n&agrave;y được thực hiện phối hợp với c&aacute;c cơ quan thực thi ph&aacute;p luật của Mỹ. Th&ocirc;ng tin chi tiết sẽ được cập nhật sau. Sẽ c&oacute; một cuộc họp b&aacute;o h&ocirc;m nay l&uacute;c 11 giờ s&aacute;ng tại Mar-a-Lago\", &ocirc;ng Trump cho hay th&ecirc;m.</p>\n<p>Tổng thống Venezuela Nicolas Maduro đ&atilde; bị lực lượng đặc nhiệm tinh nhuệ của Mỹ bắt giữ, một quan chức Mỹ cho biết ng&agrave;y 3.1.</p>\n\n<div><a title=\"Kh&oacute;i bốc l&ecirc;n tại s&acirc;n bay La Carlota ở Caracas, Venezuela ng&agrave;y 3.1.2026\" href=\"https://images2.thanhnien.vn/528068263637045248/2026/1/3/ap26003237866896-17674326348001251594912.jpg\" target=\"_blank\"><img title src=\"https://images2.thanhnien.vn/thumb_w/640/528068263637045248/2026/1/3/ap26003237866896-17674326348001251594912.jpg\" alt=\"&Ocirc;ng Trump n&oacute;i bắt được Tổng thống Venezuela  - Ảnh 1.\" width=\"621\" height=\"414\"></a></div>\n\n<p>Kh&oacute;i bốc l&ecirc;n tại s&acirc;n bay La Carlota ở Caracas, Venezuela ng&agrave;y 3.1.2026</p>\n\n<div class=\"PhotoCMS_Author\">\n<p>ẢNH: AP</p>\n</div>\n\n<p>Chưa c&oacute; th&ocirc;ng tin ch&iacute;nh thức từ Caracas về việc &ocirc;ng Maduro bị bắt giữ.</p>\n<p>Th&ocirc;ng tin được &ocirc;ng Trump đưa ra sau khi Venezuela chấn động v&igrave; một loạt</p>',NULL,1,13,NULL,NULL,'2026-01-03 12:21:33','2026-01-03 13:06:04',NULL),(3,'ukm ha toi khong biet nua ','ukm-ha-toi-khong-biet-nua','<p>mot con vit con xoa ra 2 cai canh&nbsp;</p>',NULL,1,6,NULL,NULL,'2026-01-03 19:43:12','2026-01-08 06:22:29',NULL),(4,'ssssssssssssssss','ssssssssssssssss','<p><img src=\"http://localhost:8000/uploads/posts/mceclip0-1767765766646-304698696.png\"></p>',NULL,1,4,NULL,NULL,'2026-01-07 13:02:55','2026-01-07 06:03:16',NULL),(5,'ksdjfhaksdfhkasdhfkasdhfkjasdhfkjasd','ksdjfhaksdfhkasdhfkasdhfkjasdhfkjasd','<p>ifdhasdkfhiasdhfuiasdhfuiahsdufhasdufhaisudfhiashdfiuadhfiahdifhasidfhaihdfiuadhfiuahdifhasifhafaiusdfhiuasdhfiasdhifhadi<img src=\"http://localhost:8000/uploads/posts/mceclip0-1767853420449-501752998.png\"></p>',NULL,1,2,4,NULL,'2026-01-08 13:23:48','2026-01-08 06:24:09',NULL),(6,'hello banj ban dang lam gi day ','hello-banj-ban-dang-lam-gi-day','<p>toi khong biet ban co tot hay khong nhung toi ko tot lam&nbsp;</p>',NULL,1,0,NULL,NULL,'2026-01-08 13:24:54','2026-01-08 06:24:54',NULL);
/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Super Admin','Quản trị viên cấp cao nhất, có tất cả quyền trong hệ thống','2025-12-10 08:11:32','2025-12-10 08:11:32'),(2,'Admin','Quản trị viên, quản lý hầu hết các chức năng','2025-12-10 08:11:32','2025-12-10 08:11:32'),(3,'Moderator','Người điều hành, quản lý nội dung và sự kiện','2025-12-10 08:11:32','2025-12-10 08:11:32'),(4,'Member','Thành viên câu lạc bộ, có quyền truy cập cơ bản','2025-12-10 08:11:32','2025-12-10 08:11:32'),(5,'Guest','Khách, chỉ có thể xem nội dung công khai','2025-12-10 08:11:32','2025-12-10 08:11:32');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `system_email_mappings`
--

DROP TABLE IF EXISTS `system_email_mappings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_email_mappings` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `action_key` varchar(100) NOT NULL COMMENT 'Unique key for the system action, e.g., AUTH_SEND_OTP',
  `template_id` bigint unsigned DEFAULT NULL COMMENT 'FK to email_templates.id',
  `description` text COMMENT 'Description of what this action does',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `action_key_UNIQUE` (`action_key`),
  KEY `fk_mapping_template_idx` (`template_id`),
  CONSTRAINT `fk_mapping_template` FOREIGN KEY (`template_id`) REFERENCES `email_templates` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Maps system email actions to specific email templates.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_email_mappings`
--

LOCK TABLES `system_email_mappings` WRITE;
/*!40000 ALTER TABLE `system_email_mappings` DISABLE KEYS */;
INSERT INTO `system_email_mappings` VALUES (1,'AUTH_LOGIN_OTP',14,'Gá»­i mÃ£ OTP khi ngÆ°á»i dÃ¹ng Ä‘Äƒng nháº­p','2026-01-08 09:54:24','2026-01-08 09:54:24'),(2,'AUTH_WELCOME_EMAIL',15,'Gá»­i email chÃ o má»«ng khi Ä‘Äƒng kÃ½','2026-01-08 09:54:24','2026-01-08 09:54:24'),(3,'RECRUITMENT_APPLICATION_RECEIVED',16,'XÃ¡c nháº­n nháº­n Ä‘Æ¡n á»©ng tuyá»ƒn','2026-01-08 09:54:24','2026-01-08 09:54:24');
/*!40000 ALTER TABLE `system_email_mappings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tags` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `slug` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `meta_description` varchar(160) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `slug` (`slug`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `tags_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `tags_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
INSERT INTO `tags` VALUES (1,'haha','haha','haha','2026-01-07 07:35:21','2026-01-07 07:35:21',3,NULL,NULL);
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `amount` decimal(15,0) NOT NULL,
  `type` tinyint NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `attachment_url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_permissions`
--

DROP TABLE IF EXISTS `user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_permissions` (
  `user_id` bigint unsigned NOT NULL,
  `permission_id` bigint unsigned NOT NULL,
  `granted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `granted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`user_id`,`permission_id`),
  KEY `permission_id` (`permission_id`),
  KEY `granted_by` (`granted_by`),
  CONSTRAINT `user_permissions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_permissions_ibfk_3` FOREIGN KEY (`granted_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_permissions`
--

LOCK TABLES `user_permissions` WRITE;
/*!40000 ALTER TABLE `user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_sessions`
--

DROP TABLE IF EXISTS `user_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_sessions` (
  `session_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `refresh_token` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`session_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_sessions`
--

LOCK TABLES `user_sessions` WRITE;
/*!40000 ALTER TABLE `user_sessions` DISABLE KEYS */;
INSERT INTO `user_sessions` VALUES (16,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJoaWthcml0dWlzdWkxQGdtYWlsLmNvbSIsImlhdCI6MTc2Nzg2NTc3MSwiZXhwIjoxNzY4NDcwNTcxfQ.VOI781e4NagbF0DP3A8JF3AmqUbETIEro2hNfHS3BxY','2026-01-15 16:49:32','2026-01-08 09:49:31','2026-01-08 09:49:31'),(17,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJoYWlyb2JldDE1MDkyMDA1QGdtYWlsLmNvbSIsImlhdCI6MTc2Nzk3Njg4MSwiZXhwIjoxNzY4NTgxNjgxfQ.z-kP66g2T38n45XZo--DKysqMYTtOCPO6LxRooWvoLI','2026-01-16 23:41:21','2026-01-09 16:41:21','2026-01-09 16:41:21');
/*!40000 ALTER TABLE `user_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `fullname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `google_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `otp_code` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `otp_expires_at` timestamp NULL DEFAULT NULL,
  `otp_attempts` int unsigned DEFAULT '0',
  `avatar_url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `bio` text CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci,
  `role_id` bigint unsigned DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `google_id` (`google_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (3,'Trần Văn Hải P H 5 5 6 5 3','hairobet15092005@gmail.com',NULL,'103148408815358401274',NULL,NULL,0,'https://lh3.googleusercontent.com/a/ACg8ocJXjMy5oYqCusiTPkHCV-3e3-M21z7VcPbGlCJOIhkEHZEHnCr1=s96-c',NULL,1,1,'2026-01-07 13:23:47','2026-01-07 06:23:47','2026-01-08 06:25:32',NULL),(4,'Nguyễn Đức Kiên','hikarituisui1@gmail.com','0965932120','102615920434400234136',NULL,NULL,0,'https://lh3.googleusercontent.com/a/ACg8ocIE1UWMVU_ySCGNKNWI8OatvnX8JGJIMOseszXXcqDT7XmJiA=s96-c','toi yeu em',4,1,'2026-01-07 14:58:39','2026-01-07 07:58:39','2026-01-08 09:49:31',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-09 16:48:53

