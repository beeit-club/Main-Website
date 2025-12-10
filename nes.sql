-- -- --------------------------------------------------------
-- -- Host:                         127.0.0.1
-- -- Server version:               8.0.30 - MySQL Community Server - GPL
-- -- Server OS:                    Win64
-- -- HeidiSQL Version:             12.1.0.6537
-- -- --------------------------------------------------------

-- /*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
-- /*!40101 SET NAMES utf8 */;
-- /*!50503 SET NAMES utf8mb4 */;
-- /*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
-- /*!40103 SET TIME_ZONE='+00:00' */;
-- /*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
-- /*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
-- /*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- -- Dumping database structure for beeit
-- CREATE DATABASE IF NOT EXISTS `beeit` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
-- USE `beeit`;

-- -- Dumping structure for table beeit.permissions
-- CREATE TABLE IF NOT EXISTS `permissions` (
--   `id` bigint unsigned NOT NULL AUTO_INCREMENT,
--   `name` varchar(100) COLLATE utf8mb4_vietnamese_ci NOT NULL,
--   `description` text COLLATE utf8mb4_vietnamese_ci NOT NULL,
--   `module` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
--   `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
--   PRIMARY KEY (`id`),
--   UNIQUE KEY `name` (`name`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=135 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- -- Dumping structure for table beeit.roles
-- CREATE TABLE IF NOT EXISTS `roles` (
--   `id` bigint unsigned NOT NULL AUTO_INCREMENT,
--   `name` varchar(100) COLLATE utf8mb4_vietnamese_ci NOT NULL,
--   `description` text COLLATE utf8mb4_vietnamese_ci,
--   `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
--   `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   PRIMARY KEY (`id`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- -- Dumping structure for table beeit.users
-- CREATE TABLE IF NOT EXISTS `users` (
--   `id` bigint unsigned NOT NULL AUTO_INCREMENT,
--   `fullname` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL,
--   `email` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL,
--   `phone` varchar(20) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
--   `google_id` varchar(255) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
--   `otp_code` varchar(10) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
--   `otp_expires_at` timestamp NULL DEFAULT NULL,
--   `otp_attempts` int unsigned DEFAULT '0',
--   `avatar_url` text COLLATE utf8mb4_vietnamese_ci,
--   `bio` text COLLATE utf8mb4_vietnamese_ci,
--   `role_id` bigint unsigned DEFAULT NULL,
--   `is_active` tinyint(1) DEFAULT '1',
--   `email_verified_at` timestamp NULL DEFAULT NULL,
--   `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
--   `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   `deleted_at` timestamp NULL DEFAULT NULL,
--   PRIMARY KEY (`id`),
--   UNIQUE KEY `email` (`email`),
--   UNIQUE KEY `google_id` (`google_id`),
--   KEY `role_id` (`role_id`),
--   CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL
-- ) ENGINE=InnoDB AUTO_INCREMENT=113 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- -- Dumping structure for table beeit.document_categories
-- CREATE TABLE IF NOT EXISTS `document_categories` (
--   `id` bigint unsigned NOT NULL AUTO_INCREMENT,
--   `name` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL,
--   `slug` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL,
--   `parent_id` bigint unsigned DEFAULT NULL,
--   `created_by` bigint unsigned DEFAULT NULL,
--   `updated_by` bigint unsigned DEFAULT NULL,
--   `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
--   `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   `deleted_at` timestamp NULL DEFAULT NULL,
--   PRIMARY KEY (`id`),
--   UNIQUE KEY `slug` (`slug`),
--   KEY `parent_id` (`parent_id`),
--   KEY `created_by` (`created_by`),
--   KEY `updated_by` (`updated_by`),
--   CONSTRAINT `document_categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `document_categories` (`id`) ON DELETE SET NULL,
--   CONSTRAINT `document_categories_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
--   CONSTRAINT `document_categories_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
-- ) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- -- Dumping structure for table beeit.events
-- CREATE TABLE IF NOT EXISTS `events` (
--   `id` bigint unsigned NOT NULL AUTO_INCREMENT,
--   `title` varchar(500) COLLATE utf8mb4_vietnamese_ci NOT NULL,
--   `slug` varchar(500) COLLATE utf8mb4_vietnamese_ci NOT NULL,
--   `content` longtext COLLATE utf8mb4_vietnamese_ci,
--   `featured_image` text COLLATE utf8mb4_vietnamese_ci,
--   `meta_description` varchar(160) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
--   `start_time` timestamp NOT NULL,
--   `end_time` timestamp NOT NULL,
--   `location` text COLLATE utf8mb4_vietnamese_ci,
--   `max_participants` int DEFAULT NULL,
--   `registration_deadline` timestamp NULL DEFAULT NULL,
--   `status` int DEFAULT '0',
--   `is_public` tinyint(1) DEFAULT '1',
--   `created_by` bigint unsigned DEFAULT NULL,
--   `updated_by` bigint unsigned DEFAULT NULL,
--   `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
--   `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   `deleted_at` timestamp NULL DEFAULT NULL,
--   PRIMARY KEY (`id`),
--   UNIQUE KEY `slug` (`slug`),
--   KEY `created_by` (`created_by`),
--   KEY `updated_by` (`updated_by`),
--   CONSTRAINT `events_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
--   CONSTRAINT `events_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
-- ) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- -- Dumping structure for table beeit.interview_schedules
-- CREATE TABLE IF NOT EXISTS `interview_schedules` (
--   `id` bigint unsigned NOT NULL AUTO_INCREMENT,
--   `title` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL COMMENT 'VD: Đợt 1 - Online Google Meet',
--   `interview_date` date NOT NULL COMMENT 'Ngày phỏng vấn (YYYY-MM-DD)',
--   `start_time` time NOT NULL COMMENT 'Giờ bắt đầu (HH:MM:SS)',
--   `end_time` time NOT NULL COMMENT 'Giờ kết thúc (HH:MM:SS)',
--   `location` text COLLATE utf8mb4_vietnamese_ci COMMENT 'Link Meet hoặc Địa điểm',
--   `description` text COLLATE utf8mb4_vietnamese_ci COMMENT 'Mô tả thêm',
--   `created_by` bigint unsigned DEFAULT NULL,
--   `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
--   `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   PRIMARY KEY (`id`),
--   KEY `created_by` (`created_by`),
--   CONSTRAINT `interview_schedules_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
-- ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- -- Dumping structure for table beeit.member_profiles
-- CREATE TABLE IF NOT EXISTS `member_profiles` (
--   `user_id` bigint unsigned NOT NULL,
--   `student_id` varchar(20) COLLATE utf8mb4_vietnamese_ci NOT NULL,
--   `academic_year` date DEFAULT NULL,
--   `course` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
--   `join_date` date DEFAULT (curdate()),
--   `created_by` bigint unsigned DEFAULT NULL,
--   `updated_by` bigint unsigned DEFAULT NULL,
--   `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
--   `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   `deleted_at` timestamp NULL DEFAULT NULL,
--   PRIMARY KEY (`user_id`),
--   UNIQUE KEY `student_id` (`student_id`),
--   KEY `created_by` (`created_by`),
--   KEY `updated_by` (`updated_by`),
--   CONSTRAINT `member_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
--   CONSTRAINT `member_profiles_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
--   CONSTRAINT `member_profiles_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- -- Dumping structure for table beeit.post_categories
-- CREATE TABLE IF NOT EXISTS `post_categories` (
--   `id` bigint unsigned NOT NULL AUTO_INCREMENT,
--   `name` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL,
--   `slug` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL,
--   `parent_id` bigint unsigned DEFAULT NULL,
--   `created_by` bigint unsigned DEFAULT NULL,
--   `updated_by` bigint unsigned DEFAULT NULL,
--   `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
--   `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   `deleted_at` timestamp NULL DEFAULT NULL,
--   PRIMARY KEY (`id`),
--   UNIQUE KEY `slug` (`slug`),
--   KEY `parent_id` (`parent_id`),
--   KEY `created_by` (`created_by`),
--   KEY `updated_by` (`updated_by`),
--   CONSTRAINT `post_categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `post_categories` (`id`) ON DELETE SET NULL,
--   CONSTRAINT `post_categories_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
--   CONSTRAINT `post_categories_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
-- ) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- -- Dumping structure for table beeit.questions
-- CREATE TABLE IF NOT EXISTS `questions` (
--   `id` bigint unsigned NOT NULL AUTO_INCREMENT,
--   `title` varchar(500) COLLATE utf8mb4_vietnamese_ci NOT NULL,
--   `slug` varchar(500) COLLATE utf8mb4_vietnamese_ci NOT NULL,
--   `content` longtext COLLATE utf8mb4_vietnamese_ci NOT NULL,
--   `meta_description` varchar(160) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
--   `status` int DEFAULT '0',
--   `view_count` int DEFAULT '0',
--   `created_by` bigint unsigned DEFAULT NULL,
--   `updated_by` bigint unsigned DEFAULT NULL,
--   `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
--   `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   `deleted_at` timestamp NULL DEFAULT NULL,
--   PRIMARY KEY (`id`),
--   UNIQUE KEY `slug` (`slug`),
--   KEY `created_by` (`created_by`),
--   KEY `updated_by` (`updated_by`),
--   CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
--   CONSTRAINT `questions_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
-- ) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- -- Dumping structure for table beeit.tags
-- CREATE TABLE IF NOT EXISTS `tags` (
--   `id` bigint unsigned NOT NULL AUTO_INCREMENT,
--   `name` varchar(100) COLLATE utf8mb4_vietnamese_ci NOT NULL,
--   `slug` varchar(100) COLLATE utf8mb4_vietnamese_ci NOT NULL,
--   `meta_description` varchar(160) COLLATE utf8mb4_vietnamese_ci NOT NULL,
--   `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
--   `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   `created_by` bigint unsigned DEFAULT NULL,
--   `updated_by` bigint unsigned DEFAULT NULL,
--   `deleted_at` timestamp NULL DEFAULT NULL,
--   PRIMARY KEY (`id`),
--   UNIQUE KEY `name` (`name`),
--   UNIQUE KEY `slug` (`slug`),
--   KEY `created_by` (`created_by`),
--   KEY `updated_by` (`updated_by`),
--   CONSTRAINT `tags_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
--   CONSTRAINT `tags_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
-- ) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- -- Dumping structure for table beeit.transactions
-- CREATE TABLE IF NOT EXISTS `transactions` (
--   `id` bigint unsigned NOT NULL AUTO_INCREMENT,
--   `amount` decimal(15,0) NOT NULL,
--   `type` tinyint NOT NULL,
--   `description` text COLLATE utf8mb4_vietnamese_ci NOT NULL,
--   `attachment_url` text COLLATE utf8mb4_vietnamese_ci,
--   `created_by` bigint unsigned DEFAULT NULL,
--   `updated_by` bigint unsigned DEFAULT NULL,
--   `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
--   `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   PRIMARY KEY (`id`),
--   KEY `created_by` (`created_by`),
--   KEY `updated_by` (`updated_by`),
--   CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
--   CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
-- ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- -- Dumping structure for table beeit.user_permissions
-- CREATE TABLE IF NOT EXISTS `user_permissions` (
--   `user_id` bigint unsigned NOT NULL,
--   `permission_id` bigint unsigned NOT NULL,
--   `granted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
--   `granted_by` bigint unsigned DEFAULT NULL,
--   PRIMARY KEY (`user_id`,`permission_id`),
--   KEY `permission_id` (`permission_id`),
--   KEY `granted_by` (`granted_by`),
--   CONSTRAINT `user_permissions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
--   CONSTRAINT `user_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
--   CONSTRAINT `user_permissions_ibfk_3` FOREIGN KEY (`granted_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- -- Dumping structure for table beeit.user_sessions
-- CREATE TABLE IF NOT EXISTS `user_sessions` (
--   `session_id` bigint unsigned NOT NULL AUTO_INCREMENT,
--   `user_id` bigint unsigned NOT NULL,
--   `refresh_token` varchar(500) COLLATE utf8mb4_vietnamese_ci NOT NULL,
--   `expires_at` timestamp NOT NULL,
--   `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
--   `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   PRIMARY KEY (`session_id`),
--   KEY `user_id` (`user_id`),
--   CONSTRAINT `user_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
-- ) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- -- Dumping structure for table beeit.documents
-- CREATE TABLE IF NOT EXISTS `documents` (
--   `id` bigint unsigned NOT NULL AUTO_INCREMENT,
--   `title` varchar(500) COLLATE utf8mb4_vietnamese_ci NOT NULL,
--   `slug` varchar(500) COLLATE utf8mb4_vietnamese_ci NOT NULL,
--   `description` text COLLATE utf8mb4_vietnamese_ci,
--   `file_url` text COLLATE utf8mb4_vietnamese_ci,
--   `preview_url` text COLLATE utf8mb4_vietnamese_ci,
--   `category_id` bigint unsigned DEFAULT NULL,
--   `access_level` enum('public','member_only','restricted') COLLATE utf8mb4_vietnamese_ci DEFAULT 'public',
--   `status` int DEFAULT '0',
--   `download_count` int DEFAULT '0',
--   `created_by` bigint unsigned DEFAULT NULL,
--   `updated_by` bigint unsigned DEFAULT NULL,
--   `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
--   `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   `deleted_at` timestamp NULL DEFAULT NULL,
--   PRIMARY KEY (`id`),
--   UNIQUE KEY `slug` (`slug`),
--   KEY `category_id` (`category_id`),
--   KEY `created_by` (`created_by`),
--   KEY `updated_by` (`updated_by`),
--   CONSTRAINT `documents_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `document_categories` (`id`) ON DELETE SET NULL,
--   CONSTRAINT `documents_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
--   CONSTRAINT `documents_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
-- ) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- -- Dumping structure for table beeit.event_registrations
-- CREATE TABLE IF NOT EXISTS `event_registrations` (
--   `id` bigint unsigned NOT NULL AUTO_INCREMENT,
--   `event_id` bigint unsigned NOT NULL,
--   `user_id` bigint unsigned DEFAULT NULL,
--   `registration_type` enum('private','public') COLLATE utf8mb4_vietnamese_ci NOT NULL,
--   `guest_name` varchar(255) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
--   `guest_email` varchar(255) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
--   `guest_phone` varchar(255) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
--   `notes` text COLLATE utf8mb4_vietnamese_ci,
--   `registered_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
--   `deleted_at` timestamp NULL DEFAULT NULL,
--   PRIMARY KEY (`id`),
--   KEY `event_id` (`event_id`),
--   KEY `user_id` (`user_id`),
--   CONSTRAINT `event_registrations_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
--   CONSTRAINT `event_registrations_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
-- ) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- -- Dumping structure for table beeit.membership_applications
-- CREATE TABLE IF NOT EXISTS `membership_applications` (
--   `id` bigint unsigned NOT NULL AUTO_INCREMENT,
--   `email` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL,
--   `phone` varchar(20) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
--   `fullname` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL,
--   `student_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
--   `student_year` varchar(10) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
--   `major` varchar(100) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
--   `schedule_id` bigint unsigned DEFAULT NULL,
--   `interview_notes` text COLLATE utf8mb4_vietnamese_ci,
--   `status` tinyint DEFAULT '2',
--   `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
--   `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   PRIMARY KEY (`id`),
--   UNIQUE KEY `student_id` (`student_id`),
--   KEY `fk_app_schedule` (`schedule_id`),
--   CONSTRAINT `fk_app_schedule` FOREIGN KEY (`schedule_id`) REFERENCES `interview_schedules` (`id`) ON DELETE SET NULL
-- ) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- -- Dumping structure for table beeit.posts
-- CREATE TABLE IF NOT EXISTS `posts` (
--   `id` bigint unsigned NOT NULL AUTO_INCREMENT,
--   `title` varchar(500) COLLATE utf8mb4_vietnamese_ci NOT NULL,
--   `slug` varchar(500) COLLATE utf8mb4_vietnamese_ci NOT NULL,
--   `content` longtext COLLATE utf8mb4_vietnamese_ci NOT NULL,
--   `featured_image` text COLLATE utf8mb4_vietnamese_ci,
--   `meta_description` varchar(160) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
--   `category_id` bigint unsigned DEFAULT NULL,
--   `status` int DEFAULT '0',
--   `view_count` int DEFAULT '0',
--   `published_at` timestamp NULL DEFAULT NULL,
--   `created_by` bigint unsigned DEFAULT NULL,
--   `updated_by` bigint unsigned DEFAULT NULL,
--   `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
--   `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   `deleted_at` timestamp NULL DEFAULT NULL,
--   PRIMARY KEY (`id`),
--   UNIQUE KEY `slug` (`slug`),
--   KEY `category_id` (`category_id`),
--   KEY `created_by` (`created_by`),
--   KEY `updated_by` (`updated_by`),
--   CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `post_categories` (`id`) ON DELETE SET NULL,
--   CONSTRAINT `posts_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
--   CONSTRAINT `posts_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
-- ) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- -- Dumping structure for table beeit.answers
-- CREATE TABLE IF NOT EXISTS `answers` (
--   `id` bigint unsigned NOT NULL AUTO_INCREMENT,
--   `content` longtext COLLATE utf8mb4_vietnamese_ci NOT NULL,
--   `question_id` bigint unsigned DEFAULT NULL,
--   `status` tinyint DEFAULT '1',
--   `vote_score` int DEFAULT '0',
--   `is_accepted` tinyint(1) DEFAULT '0',
--   `parent_id` bigint unsigned DEFAULT NULL,
--   `created_by` bigint unsigned DEFAULT NULL,
--   `updated_by` bigint unsigned DEFAULT NULL,
--   `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
--   `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   `deleted_at` timestamp NULL DEFAULT NULL,
--   PRIMARY KEY (`id`),
--   KEY `question_id` (`question_id`),
--   KEY `parent_id` (`parent_id`),
--   KEY `created_by` (`created_by`),
--   KEY `updated_by` (`updated_by`),
--   CONSTRAINT `answers_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE,
--   CONSTRAINT `answers_ibfk_2` FOREIGN KEY (`parent_id`) REFERENCES `answers` (`id`) ON DELETE CASCADE,
--   CONSTRAINT `answers_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
--   CONSTRAINT `answers_ibfk_4` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
-- ) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- -- Dumping structure for table beeit.document_restricted_users
-- CREATE TABLE IF NOT EXISTS `document_restricted_users` (
--   `document_id` bigint unsigned NOT NULL,
--   `user_id` bigint unsigned NOT NULL,
--   `granted_by` bigint unsigned DEFAULT NULL,
--   `granted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
--   PRIMARY KEY (`document_id`,`user_id`),
--   KEY `user_id` (`user_id`),
--   KEY `granted_by` (`granted_by`),
--   CONSTRAINT `document_restricted_users_ibfk_1` FOREIGN KEY (`document_id`) REFERENCES `documents` (`id`) ON DELETE CASCADE,
--   CONSTRAINT `document_restricted_users_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
--   CONSTRAINT `document_restricted_users_ibfk_3` FOREIGN KEY (`granted_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- -- Dumping structure for table beeit.event_attendances
-- CREATE TABLE IF NOT EXISTS `event_attendances` (
--   `id` bigint unsigned NOT NULL AUTO_INCREMENT,
--   `user_id` bigint unsigned DEFAULT NULL,
--   `event_id` bigint unsigned DEFAULT NULL,
--   `registration_id` bigint unsigned DEFAULT NULL,
--   `checked_in` tinyint(1) DEFAULT '0',
--   `check_in_time` timestamp NULL DEFAULT NULL,
--   `checked_in_by` bigint unsigned DEFAULT NULL,
--   `notes` text COLLATE utf8mb4_vietnamese_ci,
--   `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
--   PRIMARY KEY (`id`),
--   KEY `user_id` (`user_id`),
--   KEY `event_id` (`event_id`),
--   KEY `registration_id` (`registration_id`),
--   KEY `checked_in_by` (`checked_in_by`),
--   CONSTRAINT `event_attendances_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
--   CONSTRAINT `event_attendances_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
--   CONSTRAINT `event_attendances_ibfk_3` FOREIGN KEY (`registration_id`) REFERENCES `event_registrations` (`id`) ON DELETE CASCADE,
--   CONSTRAINT `event_attendances_ibfk_4` FOREIGN KEY (`checked_in_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
-- ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- -- Dumping structure for table beeit.post_comments
-- CREATE TABLE IF NOT EXISTS `post_comments` (
--   `id` bigint unsigned NOT NULL AUTO_INCREMENT,
--   `content` text COLLATE utf8mb4_vietnamese_ci NOT NULL,
--   `author_id` bigint unsigned DEFAULT NULL,
--   `post_id` bigint unsigned DEFAULT NULL,
--   `parent_id` bigint unsigned DEFAULT NULL,
--   `status` int DEFAULT '1',
--   `updated_by` bigint unsigned DEFAULT NULL,
--   `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
--   `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   `deleted_at` timestamp NULL DEFAULT NULL,
--   PRIMARY KEY (`id`),
--   KEY `author_id` (`author_id`),
--   KEY `post_id` (`post_id`),
--   KEY `parent_id` (`parent_id`),
--   KEY `updated_by` (`updated_by`),
--   CONSTRAINT `post_comments_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
--   CONSTRAINT `post_comments_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
--   CONSTRAINT `post_comments_ibfk_3` FOREIGN KEY (`parent_id`) REFERENCES `post_comments` (`id`) ON DELETE CASCADE,
--   CONSTRAINT `post_comments_ibfk_4` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- -- Dumping structure for table beeit.post_tags
-- CREATE TABLE IF NOT EXISTS `post_tags` (
--   `post_id` bigint unsigned NOT NULL,
--   `tag_id` bigint unsigned NOT NULL,
--   PRIMARY KEY (`post_id`,`tag_id`),
--   KEY `tag_id` (`tag_id`),
--   CONSTRAINT `post_tags_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
--   CONSTRAINT `post_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;


-- /*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
-- /*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
-- /*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
-- /*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
-- /*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.30 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for beeit
CREATE DATABASE IF NOT EXISTS `beeit` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `beeit`;

-- Dumping structure for table beeit.permissions
CREATE TABLE IF NOT EXISTS `permissions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `description` text COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `module` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=135 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- Dumping structure for table beeit.roles
CREATE TABLE IF NOT EXISTS `roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `description` text COLLATE utf8mb4_vietnamese_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- Dumping structure for table beeit.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `fullname` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `google_id` varchar(255) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `otp_code` varchar(10) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `otp_expires_at` timestamp NULL DEFAULT NULL,
  `otp_attempts` int unsigned DEFAULT '0',
  `avatar_url` text COLLATE utf8mb4_vietnamese_ci,
  `bio` text COLLATE utf8mb4_vietnamese_ci,
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
) ENGINE=InnoDB AUTO_INCREMENT=113 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- Dumping structure for table beeit.document_categories
CREATE TABLE IF NOT EXISTS `document_categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- Dumping structure for table beeit.events
CREATE TABLE IF NOT EXISTS `events` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(500) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `slug` varchar(500) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `content` longtext COLLATE utf8mb4_vietnamese_ci,
  `featured_image` text COLLATE utf8mb4_vietnamese_ci,
  `meta_description` varchar(160) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `start_time` timestamp NOT NULL,
  `end_time` timestamp NOT NULL,
  `location` text COLLATE utf8mb4_vietnamese_ci,
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- Dumping structure for table beeit.interview_schedules
CREATE TABLE IF NOT EXISTS `interview_schedules` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL COMMENT 'VD: Đợt 1 - Online Google Meet',
  `interview_date` date NOT NULL COMMENT 'Ngày phỏng vấn (YYYY-MM-DD)',
  `start_time` time NOT NULL COMMENT 'Giờ bắt đầu (HH:MM:SS)',
  `end_time` time NOT NULL COMMENT 'Giờ kết thúc (HH:MM:SS)',
  `location` text COLLATE utf8mb4_vietnamese_ci COMMENT 'Link Meet hoặc Địa điểm',
  `description` text COLLATE utf8mb4_vietnamese_ci COMMENT 'Mô tả thêm',
  `created_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `interview_schedules_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- Dumping structure for table beeit.member_profiles
CREATE TABLE IF NOT EXISTS `member_profiles` (
  `user_id` bigint unsigned NOT NULL,
  `student_id` varchar(20) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `academic_year` date DEFAULT NULL,
  `course` varchar(50) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
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

-- Dumping structure for table beeit.post_categories
CREATE TABLE IF NOT EXISTS `post_categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- Dumping structure for table beeit.questions
CREATE TABLE IF NOT EXISTS `questions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(500) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `slug` varchar(500) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `content` longtext COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `meta_description` varchar(160) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
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

-- Dumping structure for table beeit.tags
CREATE TABLE IF NOT EXISTS `tags` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `slug` varchar(100) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `meta_description` varchar(160) COLLATE utf8mb4_vietnamese_ci NOT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- Dumping structure for table beeit.transactions
CREATE TABLE IF NOT EXISTS `transactions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `amount` decimal(15,0) NOT NULL,
  `type` tinyint NOT NULL,
  `description` text COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `attachment_url` text COLLATE utf8mb4_vietnamese_ci,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- Dumping structure for table beeit.user_permissions
CREATE TABLE IF NOT EXISTS `user_permissions` (
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

-- Dumping structure for table beeit.user_sessions
CREATE TABLE IF NOT EXISTS `user_sessions` (
  `session_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `refresh_token` varchar(500) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`session_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- Dumping structure for table beeit.documents
CREATE TABLE IF NOT EXISTS `documents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(500) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `slug` varchar(500) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `description` text COLLATE utf8mb4_vietnamese_ci,
  `file_url` text COLLATE utf8mb4_vietnamese_ci,
  `preview_url` text COLLATE utf8mb4_vietnamese_ci,
  `category_id` bigint unsigned DEFAULT NULL,
  `access_level` enum('public','member_only','restricted') COLLATE utf8mb4_vietnamese_ci DEFAULT 'public',
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- Dumping structure for table beeit.event_registrations
CREATE TABLE IF NOT EXISTS `event_registrations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `event_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `registration_type` enum('private','public') COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `guest_name` varchar(255) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `guest_email` varchar(255) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `guest_phone` varchar(255) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_vietnamese_ci,
  `registered_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `event_id` (`event_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `event_registrations_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  CONSTRAINT `event_registrations_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- Dumping structure for table beeit.membership_applications
CREATE TABLE IF NOT EXISTS `membership_applications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `fullname` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `student_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `student_year` varchar(10) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `major` varchar(100) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `schedule_id` bigint unsigned DEFAULT NULL,
  `interview_notes` text COLLATE utf8mb4_vietnamese_ci,
  `status` tinyint DEFAULT '2',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_id` (`student_id`),
  KEY `fk_app_schedule` (`schedule_id`),
  CONSTRAINT `fk_app_schedule` FOREIGN KEY (`schedule_id`) REFERENCES `interview_schedules` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- Dumping structure for table beeit.posts
CREATE TABLE IF NOT EXISTS `posts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(500) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `slug` varchar(500) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `content` longtext COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `featured_image` text COLLATE utf8mb4_vietnamese_ci,
  `meta_description` varchar(160) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- Dumping structure for table beeit.answers
CREATE TABLE IF NOT EXISTS `answers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `content` longtext COLLATE utf8mb4_vietnamese_ci NOT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- Dumping structure for table beeit.document_restricted_users
CREATE TABLE IF NOT EXISTS `document_restricted_users` (
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

-- Dumping structure for table beeit.event_attendances
CREATE TABLE IF NOT EXISTS `event_attendances` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `event_id` bigint unsigned DEFAULT NULL,
  `registration_id` bigint unsigned DEFAULT NULL,
  `checked_in` tinyint(1) DEFAULT '0',
  `check_in_time` timestamp NULL DEFAULT NULL,
  `checked_in_by` bigint unsigned DEFAULT NULL,
  `notes` text COLLATE utf8mb4_vietnamese_ci,
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- Dumping structure for table beeit.post_comments
CREATE TABLE IF NOT EXISTS `post_comments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `content` text COLLATE utf8mb4_vietnamese_ci NOT NULL,
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

-- Dumping structure for table beeit.post_tags
CREATE TABLE IF NOT EXISTS `post_tags` (
  `post_id` bigint unsigned NOT NULL,
  `tag_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`post_id`,`tag_id`),
  KEY `tag_id` (`tag_id`),
  CONSTRAINT `post_tags_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `post_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;


/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

-- =====================================================
-- Migration: Email Templates System
-- Description: Tạo các bảng cho hệ thống email động
-- Created: 2024
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


-- =====================================================

-- Comments cho các bảng
ALTER TABLE `email_template_categories` COMMENT = 'Danh mục email templates';
ALTER TABLE `email_templates` COMMENT = 'Email templates động - có thể quản lý qua admin panel';
ALTER TABLE `email_logs` COMMENT = 'Log các email đã gửi - dùng để tracking và analytics';

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



-- =====================================================

-- Comments cho các bảng
ALTER TABLE `email_batch_jobs` COMMENT = 'Batch jobs cho gửi email hàng loạt';
ALTER TABLE `email_batch_recipients` COMMENT = 'Danh sách recipients trong mỗi batch job';

