-- Step 1: Delete the system email mappings for the actions we want to remove.
DELETE FROM `system_email_mappings` WHERE `action_key` IN ('AUTH_PASSWORD_RESET', 'FINANCE_FEE_REMINDER');

-- Step 2: Delete the email templates associated with these actions.
-- It's safer to delete by name to ensure we're removing the correct ones.
DELETE FROM `email_templates` WHERE `name` IN ('BeeIT - Password Reset', 'BeeIT - Fee Reminder');
