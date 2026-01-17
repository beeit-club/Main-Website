-- =========================================================
-- FILE: SEED DATA V2 (COMPLETE SYSTEM)
-- Compatible with complete_schema.sql
-- Contains: Roles, Variables, Templates, Mappings, Initial User, Basic Categories
-- =========================================================

SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;

-- 1. ROLES
TRUNCATE TABLE `roles`;
INSERT INTO `roles` (`id`, `name`, `description`) VALUES
(1, 'SuperAdmin', 'Toàn quyền hệ thống'),
(2, 'Admin', 'Quản trị viên'),
(3, 'QuanLy', 'Quản lý mảng'),
(4, 'Member', 'Thành viên'),
(5, 'NguoiDung', 'Người dùng vãng lai');

-- 2. USERS (Initial SuperAdmin)
-- Note: Authentication is via Google, so google_id is usually required for login.
-- This user is for database reference or manual token generation.
TRUNCATE TABLE `users`;
INSERT INTO `users` (`id`, `fullname`, `email`, `role_id`, `is_active`) VALUES
(1, 'Super Admin', 'admin@beeit.club', 1, 1);

-- 3. CATEGORIES (Basic Setup)
TRUNCATE TABLE `post_categories`;
INSERT INTO `post_categories` (`id`, `name`, `slug`, `created_by`) VALUES
(1, 'Tin tức', 'tin-tuc', 1),
(2, 'Hoạt động', 'hoat-dong', 1),
(3, 'Thông báo', 'thong-bao', 1);

TRUNCATE TABLE `document_categories`;
INSERT INTO `document_categories` (`id`, `name`, `slug`, `created_by`) VALUES
(1, 'Tài liệu học tập', 'tai-lieu-hoc-tap', 1),
(2, 'Biểu mẫu', 'bieu-mau', 1),
(3, 'Quy định', 'quy-dinh', 1);

TRUNCATE TABLE `email_template_categories`;
INSERT INTO `email_template_categories` (`id`, `name`, `slug`, `description`) VALUES
(1, 'Xác thực', 'authentication', 'Email liên quan đến đăng nhập, mật khẩu'),
(2, 'Tuyển dụng', 'application', 'Email quy trình tuyển thành viên'),
(3, 'Sự kiện', 'event', 'Email quản lý sự kiện'),
(4, 'Tài liệu', 'document', 'Email chia sẻ tài liệu'),
(5, 'Hệ thống', 'system', 'Email thông báo hệ thống');

-- 4. VARIABLE DEFINITIONS
TRUNCATE TABLE `email_variable_definitions`;
INSERT INTO `email_variable_definitions` (`key`, `label`, `type`, `description`, `is_system`) VALUES
-- User Info
('fullname', 'Họ tên', 'text', 'Tên người nhận', 1),
('email', 'Email', 'text', 'Email người nhận', 1),
('student_id', 'MSSV', 'text', 'Mã số sinh viên', 1),

-- Auth
('otp', 'Mã OTP', 'text', 'Mã xác thực đăng nhập', 1),
('reset_code', 'Mã Reset', 'text', 'Mã lấy lại mật khẩu', 1),
('reset_link', 'Link Reset', 'url', 'Đường dẫn đặt lại mật khẩu', 1),
('expires_in', 'Hết hạn sau', 'number', 'Thời gian hết hạn mã (phút)', 1),

-- Event
('event_title', 'Tên sự kiện', 'text', 'Tiêu đề sự kiện', 0),
('start_time', 'Thời gian bắt đầu', 'text', 'Giờ bắt đầu sự kiện', 0),
('end_time', 'Thời gian kết thúc', 'text', 'Giờ kết thúc sự kiện', 0),
('location', 'Địa điểm', 'text', 'Nơi tổ chức', 0),
('check_in_time', 'Giờ check-in', 'text', 'Thời điểm điểm danh', 0),
('time_until', 'Còn lại', 'text', 'Thời gian đếm ngược đến sự kiện', 0),
('new_start_time', 'Giờ mới', 'text', 'Giờ bắt đầu mới (khi đổi lịch)', 0),
('new_location', 'Địa điểm mới', 'text', 'Nơi tổ chức mới (khi đổi)', 0),
('reason', 'Lý do', 'text', 'Lý do hủy/đổi lịch', 0),

-- Application / Interview
('schedule_title', 'Tên lịch PV', 'text', 'Tiêu đề đợt phỏng vấn', 0),
('interview_date', 'Ngày PV', 'text', 'Ngày phỏng vấn', 0),
('description', 'Mô tả', 'richtext', 'Mô tả chi tiết', 0),
('interview_notes', 'Ghi chú PV', 'text', 'Nhận xét của người phỏng vấn', 0),

-- Document
('document_title', 'Tên tài liệu', 'text', 'Tiêu đề tài liệu được chia sẻ', 0),
('document_description', 'Mô tả tài liệu', 'text', 'Giới thiệu về tài liệu', 0),

-- Fee
('amount', 'Số tiền', 'number', 'Số tiền cần đóng', 0),
('deadline', 'Hạn chót', 'date', 'Hạn đóng phí', 0),
('days_remaining', 'Còn lại (ngày)', 'number', 'Số ngày còn lại', 0);

-- 5. EMAIL TEMPLATES
TRUNCATE TABLE `email_templates`;
INSERT INTO `email_templates` (`id`, `slug`, `name`, `subject`, `category`, `is_system`, `created_by`, `mjml_content`, `html_content`) VALUES

-- 1. Login OTP
(1, 'login-otp', 'Mã xác thực đăng nhập', 'Mã OTP đăng nhập của bạn: {{otp}}', 'authentication', 1, 1,
'<mjml><mj-body><mj-text>Mã OTP của bạn là: {{otp}}</mj-text></mj-body></mjml>',
'<!doctype html><html><body><p>Mã OTP của bạn là: <b>{{otp}}</b></p></body></html>'),

-- 2. Application Received
(2, 'application-received', 'Xác nhận nhận đơn ứng tuyển', 'Đã nhận đơn ứng tuyển của {{fullname}}', 'application', 1, 1,
'<mjml><mj-body><mj-text>Chào {{fullname}}, chúng tôi đã nhận được đơn của bạn (MSSV: {{student_id}}).</mj-text></mj-body></mjml>',
'<!doctype html><html><body><p>Chào {{fullname}}, chúng tôi đã nhận được đơn của bạn (MSSV: {{student_id}}).</p></body></html>'),

-- 3. Interview Scheduled
(3, 'interview-scheduled', 'Lịch phỏng vấn mới', 'Lịch phỏng vấn: {{schedule_title}}', 'application', 1, 1,
'<mjml><mj-body><mj-text>Chào {{fullname}}, lịch phỏng vấn của bạn vào ngày {{interview_date}} lúc {{start_time}} tại {{location}}.</mj-text></mj-body></mjml>',
'<!doctype html><html><body><p>Chào {{fullname}}, lịch phỏng vấn của bạn vào ngày {{interview_date}} lúc {{start_time}} tại {{location}}.</p></body></html>'),

-- 4. Application Approved
(4, 'application-approved', 'Thông báo Trúng tuyển', 'Chúc mừng {{fullname}} đã trúng tuyển!', 'application', 1, 1,
'<mjml><mj-body><mj-text>Chúc mừng {{fullname}}! Bạn đã trúng tuyển.</mj-text></mj-body></mjml>',
'<!doctype html><html><body><p>Chúc mừng {{fullname}}! Bạn đã trúng tuyển.</p></body></html>'),

-- 5. Application Rejected
(5, 'application-rejected', 'Thông báo Kết quả', 'Thông báo về đơn ứng tuyển của {{fullname}}', 'application', 1, 1,
'<mjml><mj-body><mj-text>Chào {{fullname}}, rất tiếc chúng tôi chưa thể đồng hành cùng bạn lần này.</mj-text></mj-body></mjml>',
'<!doctype html><html><body><p>Chào {{fullname}}, rất tiếc chúng tôi chưa thể đồng hành cùng bạn lần này.</p></body></html>'),

-- 6. Event Registration Confirmed
(6, 'event-registration-confirmed', 'Xác nhận đăng ký sự kiện', 'Vé tham dự sự kiện: {{event_title}}', 'event', 1, 1,
'<mjml><mj-body><mj-text>Chào {{fullname}}, bạn đã đăng ký thành công sự kiện {{event_title}} diễn ra tại {{location}}.</mj-text></mj-body></mjml>',
'<!doctype html><html><body><p>Chào {{fullname}}, bạn đã đăng ký thành công sự kiện {{event_title}} diễn ra tại {{location}}.</p></body></html>'),

-- 7. Event Reminder
(7, 'event-reminder', 'Nhắc nhở sự kiện', 'Sắp diễn ra: {{event_title}}', 'event', 1, 1,
'<mjml><mj-body><mj-text>Chào {{fullname}}, sự kiện {{event_title}} sẽ bắt đầu trong {{time_until}} nữa tại {{location}}.</mj-text></mj-body></mjml>',
'<!doctype html><html><body><p>Chào {{fullname}}, sự kiện {{event_title}} sẽ bắt đầu trong {{time_until}} nữa tại {{location}}.</p></body></html>'),

-- 8. Event Check-in
(8, 'event-check-in-confirmation', 'Xác nhận Check-in', 'Bạn đã check-in thành công: {{event_title}}', 'event', 1, 1,
'<mjml><mj-body><mj-text>Chào {{fullname}}, bạn đã check-in lúc {{check_in_time}}.</mj-text></mj-body></mjml>',
'<!doctype html><html><body><p>Chào {{fullname}}, bạn đã check-in lúc {{check_in_time}}.</p></body></html>'),

-- 9. Event Cancellation
(9, 'event-cancellation', 'Thông báo Hủy/Thay đổi lịch', 'Thay đổi quan trọng về sự kiện {{event_title}}', 'event', 1, 1,
'<mjml><mj-body><mj-text>Chào {{fullname}}, sự kiện {{event_title}} có thay đổi. Lý do: {{reason}}.</mj-text></mj-body></mjml>',
'<!doctype html><html><body><p>Chào {{fullname}}, sự kiện {{event_title}} có thay đổi. Lý do: {{reason}}.</p></body></html>'),

-- 10. Document Access
(11, 'document-access-granted', 'Chia sẻ tài liệu', 'Bạn được chia sẻ tài liệu: {{document_title}}', 'document', 1, 1,
'<mjml><mj-body><mj-text>Chào {{fullname}}, bạn được quyền truy cập tài liệu {{document_title}}.</mj-text></mj-body></mjml>',
'<!doctype html><html><body><p>Chào {{fullname}}, bạn được quyền truy cập tài liệu {{document_title}}.</p></body></html>'),

-- 11. Password Reset
(12, 'password-reset', 'Khôi phục mật khẩu', 'Mã khôi phục mật khẩu Bee IT', 'authentication', 1, 1,
'<mjml><mj-body><mj-text>Mã reset của bạn là: {{reset_code}}. Hết hạn sau {{expires_in}} phút.</mj-text></mj-body></mjml>',
'<!doctype html><html><body><p>Mã reset của bạn là: <b>{{reset_code}}</b>. Hết hạn sau {{expires_in}} phút.</p></body></html>'),

-- 12. Welcome Email
(13, 'welcome-email', 'Chào mừng gia nhập', 'Welcome to Bee IT Club!', 'system', 1, 1,
'<mjml><mj-body><mj-text>Chào mừng {{fullname}} gia nhập hệ thống.</mj-text></mj-body></mjml>',
'<!doctype html><html><body><p>Chào mừng {{fullname}} gia nhập hệ thống.</p></body></html>'),

-- 13. Fee Reminder
(14, 'fee-reminder', 'Nhắc đóng phí', 'Nhắc nhở đóng phí thành viên', 'system', 0, 1,
'<mjml><mj-body><mj-text>Chào {{fullname}}, hạn đóng phí {{amount}} là ngày {{deadline}}.</mj-text></mj-body></mjml>',
'<!doctype html><html><body><p>Chào {{fullname}}, hạn đóng phí {{amount}} là ngày {{deadline}}.</p></body></html>');

-- 6. SYSTEM MAPPINGS
TRUNCATE TABLE `system_email_mappings`;
INSERT INTO `system_email_mappings` (`action_key`, `template_id`, `description`) VALUES
('AUTH_LOGIN_OTP', 1, 'OTP Đăng nhập'),
('APP_RECEIVED', 2, 'Nhận đơn'),
('APP_INTERVIEW', 3, 'Mời phỏng vấn'),
('APP_APPROVED', 4, 'Trúng tuyển'),
('APP_REJECTED', 5, 'Từ chối'),
('EVENT_REGISTER', 6, 'Đăng ký sự kiện'),
('EVENT_REMINDER', 7, 'Nhắc sự kiện'),
('EVENT_CHECKIN', 8, 'Checkin sự kiện'),
('EVENT_CANCEL', 9, 'Hủy sự kiện'),
('DOC_ACCESS', 11, 'Chia sẻ tài liệu'),
('AUTH_RESET_PASS', 12, 'Quên mật khẩu'),
('AUTH_WELCOME', 13, 'Welcome'),
('FEE_REMINDER', 14, 'Nhắc phí');

SET FOREIGN_KEY_CHECKS = 1;
