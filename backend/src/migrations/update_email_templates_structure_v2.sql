ALTER TABLE email_templates ADD COLUMN header longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL AFTER subject;
ALTER TABLE email_templates ADD COLUMN footer longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NULL AFTER html_content;
ALTER TABLE email_templates CHANGE COLUMN html_content body longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL COMMENT 'Nội dung Body HTML';
