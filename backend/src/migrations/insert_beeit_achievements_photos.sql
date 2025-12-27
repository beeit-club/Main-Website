-- ============================================
-- INSERT SAMPLE DATA FOR BEEIT ACHIEVEMENTS & PHOTOS
-- ============================================
-- File: insert_beeit_achievements_photos.sql
-- Date: 2025-01-XX
-- Description: Thêm dữ liệu mẫu cho Achievements (Hall of Fame) và Photos (Behind The Code)

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================
-- 1. ACHIEVEMENTS (Hall of Fame)
-- ============================================
-- Xóa dữ liệu cũ nếu có (tùy chọn)
-- DELETE FROM `beeit_achievements`;

-- Row 1: Scroll Right (8 items)
INSERT INTO `beeit_achievements` (`title`, `year`, `description`, `image_url`, `row_number`, `display_order`, `status`) VALUES
('HACKATHON 2023', '2023', 'Vô địch Quốc gia AI', 'https://images.unsplash.com/photo-1504384308090-c54be3855833?q=80&w=800&auto=format&fit=crop', 1, 0, 'active'),
('TECH TALK S1', '2023', '1000+ Sinh viên tham dự', 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=800&auto=format&fit=crop', 1, 1, 'active'),
('BEST PROJECT', '2022', 'Giải pháp Smart City', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop', 1, 2, 'active'),
('CODE CAMP', '2022', 'Trại hè lập trình', 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop', 1, 3, 'active'),
('OPEN DAY', '2021', 'Ngày hội tuyển thành viên', 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=800&auto=format&fit=crop', 1, 4, 'active'),
('WEB SUMMIT', '2021', 'Hội thảo chuyên đề', 'https://images.unsplash.com/photo-1505373877841-8d43f703fb8f?q=80&w=800&auto=format&fit=crop', 1, 5, 'active'),
('GAME JAM', '2020', '48h Lập trình Game', 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=800&auto=format&fit=crop', 1, 6, 'active'),
('FOUNDING', '2019', 'Lễ ra mắt CLB', 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=800&auto=format&fit=crop', 1, 7, 'active');

-- Row 2: Scroll Left (8 items)
INSERT INTO `beeit_achievements` (`title`, `year`, `description`, `image_url`, `row_number`, `display_order`, `status`) VALUES
('AI CHALLENGE', '2023', 'Giải nhì toàn thành', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop', 2, 0, 'active'),
('CHARITY CODE', '2023', 'Dạy code cho trẻ em', 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop', 2, 1, 'active'),
('MENTORSHIP', '2022', 'Khóa đào tạo F1', 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop', 2, 2, 'active'),
('ROBOTICS', '2022', 'Triển lãm IoT', 'https://images.unsplash.com/photo-1581092921461-eab62e97a782?q=80&w=800&auto=format&fit=crop', 2, 3, 'active'),
('DESIGN THON', '2021', 'Sáng tạo UI/UX', 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop', 2, 4, 'active'),
('DATA SCIENCE', '2021', 'Workshop Big Data', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop', 2, 5, 'active'),
('CTF ARENA', '2020', 'An toàn thông tin', 'https://images.unsplash.com/photo-1563206767-5b1d972b9fb9?q=80&w=800&auto=format&fit=crop', 2, 6, 'active'),
('DEV NIGHT', '2019', 'Giao lưu Acoustic', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop', 2, 7, 'active');

-- ============================================
-- 2. PHOTOS (Behind The Code)
-- ============================================
-- Xóa dữ liệu cũ nếu có (tùy chọn)
-- DELETE FROM `beeit_behind_scenes`;

-- Insert 30 photos
INSERT INTO `beeit_behind_scenes` (`image_url`, `alt_text`, `display_order`, `status`) VALUES
('https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=600&auto=format&fit=crop', 'Meeting', 0, 'active'),
('https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop', 'Working', 1, 'active'),
('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop', 'Group High five', 2, 'active'),
('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=600&auto=format&fit=crop', 'Meeting 2', 3, 'active'),
('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600&auto=format&fit=crop', 'Friends', 4, 'active'),
('https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=600&auto=format&fit=crop', 'Conference', 5, 'active'),
('https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop', 'Workshop', 6, 'active'),
('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=600&auto=format&fit=crop', 'Office', 7, 'active'),
('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop', 'Team collaboration', 8, 'active'),
('https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=600&auto=format&fit=crop', 'Team discussion', 9, 'active'),
('https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop', 'Coding session', 10, 'active'),
('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=600&auto=format&fit=crop', 'Learning', 11, 'active'),
('https://images.unsplash.com/photo-1504384308090-c54be3855833?q=80&w=600&auto=format&fit=crop', 'Hackathon', 12, 'active'),
('https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=600&auto=format&fit=crop', 'Presentation', 13, 'active'),
('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop', 'Data analysis', 14, 'active'),
('https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=600&auto=format&fit=crop', 'Team work', 15, 'active'),
('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=600&auto=format&fit=crop', 'Brainstorming', 16, 'active'),
('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop', 'Group work', 17, 'active'),
('https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=600&auto=format&fit=crop', 'Planning', 18, 'active'),
('https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop', 'Development', 19, 'active'),
('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop', 'Team meeting', 20, 'active'),
('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=600&auto=format&fit=crop', 'Innovation', 21, 'active'),
('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=600&auto=format&fit=crop', 'Strategy', 22, 'active'),
('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop', 'Celebration', 23, 'active'),
('https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=600&auto=format&fit=crop', 'Workshop 2', 24, 'active'),
('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop', 'Tech talk', 25, 'active'),
('https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=600&auto=format&fit=crop', 'Collaboration', 26, 'active'),
('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop', 'Team building', 27, 'active'),
('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=600&auto=format&fit=crop', 'Networking', 28, 'active'),
('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=600&auto=format&fit=crop', 'Creative session', 29, 'active');

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- VERIFY DATA
-- ============================================
-- Kiểm tra số lượng records đã insert
-- SELECT COUNT(*) as total_achievements FROM `beeit_achievements`;
-- SELECT COUNT(*) as total_photos FROM `beeit_behind_scenes`;

-- Xem dữ liệu đã insert
-- SELECT * FROM `beeit_achievements` ORDER BY row_number, display_order;
-- SELECT * FROM `beeit_behind_scenes` ORDER BY display_order;


