-- Step 1: Delete all current mappings
TRUNCATE TABLE `system_email_mappings`;

-- Step 2: Delete all non-system email templates
DELETE FROM `email_templates` WHERE `is_system` = 0;
