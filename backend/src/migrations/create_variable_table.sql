
-- Bảng quản lý định nghĩa các biến (Variable Definitions)
-- Giúp Admin biết biến này là gì, lấy dữ liệu từ đâu
CREATE TABLE IF NOT EXISTS `email_variables` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL UNIQUE COMMENT 'Tên biến trong template (VD: fullname)',
  `description` VARCHAR(255) COMMENT 'Mô tả (VD: Họ tên đầy đủ của người nhận)',
  `mapping_key` VARCHAR(100) COMMENT 'Trường tương ứng trong bảng Users (VD: fullname, email)',
  `is_system` BOOLEAN DEFAULT FALSE COMMENT 'Biến hệ thống, không cho xóa',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- Insert dữ liệu mẫu
INSERT INTO `email_variables` (`name`, `description`, `mapping_key`, `is_system`) VALUES 
('fullname', 'Họ và tên người nhận', 'fullname', TRUE),
('email', 'Email người nhận', 'email', TRUE),
('phone', 'Số điện thoại', 'phone', TRUE),
('role_name', 'Vai trò (Role)', 'role_name', TRUE),
('student_id', 'Mã số sinh viên', 'student_id', TRUE),
('academic_year', 'Khóa học (VD: K17)', 'academic_year', TRUE),
('otp', 'Mã xác thực OTP', NULL, TRUE),
('reset_link', 'Link đặt lại mật khẩu', NULL, TRUE),
('event_title', 'Tên sự kiện', NULL, FALSE),
('start_time', 'Thời gian bắt đầu', NULL, FALSE),
('location', 'Địa điểm', NULL, FALSE);
