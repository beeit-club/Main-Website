CREATE TABLE IF NOT EXISTS `system_email_mappings` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `action_key` VARCHAR(100) NOT NULL COMMENT 'Unique key for the system action, e.g., AUTH_SEND_OTP',
  `template_id` BIGINT UNSIGNED NULL COMMENT 'FK to email_templates.id',
  `description` TEXT NULL COMMENT 'Description of what this action does',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `action_key_UNIQUE` (`action_key` ASC),
  INDEX `fk_mapping_template_idx` (`template_id` ASC),
  CONSTRAINT `fk_mapping_template`
    FOREIGN KEY (`template_id`)
    REFERENCES `email_templates` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE = InnoDB
COMMENT = 'Maps system email actions to specific email templates.';
