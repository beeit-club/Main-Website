-- This migration will create new templates and map them.

-- Step 1: Create new templates
INSERT INTO `email_templates` (`name`, `subject`, `body`, `is_system`) VALUES
('BeeIT - Login OTP', '[BeeIT] Mã xác thực đăng nhập của bạn', '<p>Mã OTP để đăng nhập vào tài khoản của bạn là: <strong>{{otp}}</strong></p><p>Mã này sẽ hết hạn sau 5 phút.</p>', 1),
('BeeIT - Welcome Email', 'Chào mừng bạn đến với BeeIT!', '<p>Chào mừng {{fullname}},</p><p>Cảm ơn bạn đã đăng ký tài khoản tại website của BeeIT Club.</p>', 1),
('BeeIT - Application Received', 'Xác nhận: Chúng tôi đã nhận được đơn ứng tuyển của bạn', '<p>Chào {{fullname}},</p><p>Chúng tôi xác nhận đã nhận được đơn ứng tuyển của bạn cho Câu lạc bộ của chúng tôi. Chúng tôi sẽ xem xét và liên hệ lại với bạn sớm nhất có thể.</p><p>Trân trọng,<br>BeeIT Club</p>', 1);

-- Step 2: Create new actions and map them immediately
INSERT INTO `system_email_mappings` (`action_key`, `description`, `template_id`) VALUES
('AUTH_LOGIN_OTP', 'Gửi mã OTP khi người dùng đăng nhập', (SELECT id FROM `email_templates` WHERE `name` = 'BeeIT - Login OTP')),
('AUTH_WELCOME_EMAIL', 'Gửi email chào mừng khi đăng ký', (SELECT id FROM `email_templates` WHERE `name` = 'BeeIT - Welcome Email')),
('RECRUITMENT_APPLICATION_RECEIVED', 'Xác nhận nhận đơn ứng tuyển', (SELECT id FROM `email_templates` WHERE `name` = 'BeeIT - Application Received'));
