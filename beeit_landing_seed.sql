-- =========================================================
-- BEEIT LANDING PAGE SEED DATA
-- Generated from frontend/src/mock/landingData.js
-- =========================================================

-- 1. Hero
INSERT INTO `bee_hero_section` (title_line1, title_line2, subtitle, background_image_url, background_image_alt, overlay_opacity) 
VALUES (
    'BUILDING THE', 
    'DIGITAL HIVE', 
    'Cộng đồng lập trình viên đam mê công nghệ. Nơi kết nối tri thức, chia sẻ kinh nghiệm và kiến tạo những sản phẩm đột phá.',
    'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop',
    'BeeIT Club Digital Hive',
    0.6
);

-- 2. Stats
INSERT INTO `bee_stats` (label, value, suffix, display_order) VALUES 
('THÀNH VIÊN', 350, '+', 1),
('SỰ KIỆN TỔ CHỨC', 42, '', 2),
('DỰ ÁN', 150, '+', 3),
('ĐỐI TÁC', 12, '', 4);

-- 3. Leaders
INSERT INTO `bee_leaders` (name, role, image_url, bio, email, linkedin_url, github_url, facebook_url, display_order) VALUES 
('Nguyễn Văn A', 'FOUNDER / CỐ VẤN', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop', 'Người đặt viên gạch đầu tiên cho BEE IT. Với tầm nhìn kiến tạo một "tổ ong" kỹ thuật số, anh đã dẫn dắt CLB từ nhóm học tập nhỏ thành cộng đồng công nghệ lớn mạnh.', 'founder@beeit.club', 'https://linkedin.com', 'https://github.com', NULL, 1),
('Trần Thị B', 'CHỦ NHIỆM CLB', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop', 'Chủ nhiệm năng động với 3 năm kinh nghiệm tổ chức sự kiện tech. Cô là người đứng sau thành công của chuỗi workshop "Code for Future".', 'b.tran@beeit.club', NULL, NULL, 'https://facebook.com', 2),
('Lê Văn C', 'TECH LEAD', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1000&auto=format&fit=crop', 'Fullstack Developer với niềm đam mê mã nguồn mở. Anh chịu trách nhiệm định hướng kỹ thuật và đào tạo chuyên môn cho các thành viên.', 'c.le@beeit.club', NULL, 'https://github.com', NULL, 3);

-- 4. Achievements
INSERT INTO `bee_achievements` (title, `year`, description, image, `row_number`, display_order) VALUES
('HACKATHON 2023', '2023', 'Vô địch Quốc gia AI', 'https://images.unsplash.com/photo-1504384308090-c54be3855833?q=80&w=800&auto=format&fit=crop', 1, 1),
('TECH TALK S1', '2023', '1000+ Sinh viên tham dự', 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=800&auto=format&fit=crop', 1, 2),
('BEST PROJECT', '2022', 'Giải pháp Smart City', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop', 1, 3),
('CODE CAMP', '2022', 'Trại hè lập trình', 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop', 1, 4),
('OPEN DAY', '2021', 'Ngày hội tuyển thành viên', 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=800&auto=format&fit=crop', 1, 5),
('WEB SUMMIT', '2021', 'Hội thảo chuyên đề', 'https://images.unsplash.com/photo-1505373877841-8d43f703fb8f?q=80&w=800&auto=format&fit=crop', 1, 6),
('AI CHALLENGE', '2023', 'Giải nhì toàn thành', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop', 2, 7),
('CHARITY CODE', '2023', 'Dạy code cho trẻ em', 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop', 2, 8),
('MENTORSHIP', '2022', 'Khóa đào tạo F1', 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop', 2, 9),
('ROBOTICS', '2022', 'Triển lãm IoT', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop', 2, 10),
('DESIGN THON', '2021', 'Sáng tạo UI/UX', 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop', 2, 11),
('DATA SCIENCE', '2021', 'Workshop Big Data', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop', 2, 12);

-- 5. Timeline Events
INSERT INTO `bee_timeline_events` (`year`, title, description, image, display_order) VALUES
('2018', 'Khởi Tạo (Beta)', 'Ý tưởng về một sân chơi công nghệ tại FPT Polytechnic được hình thành.', 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop', 1),
('01/07/2023', 'Chính Thức Ra Mắt', 'BEE IT Club chính thức thành lập (Version 1.0). Đặt nền móng đầu tiên cho hệ sinh thái.', 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=800&auto=format&fit=crop', 2),
('2023', 'Hackathon Đầu Tiên', 'Tổ chức thành công "Code Battle S1" - Thu hút 50+ đội thi tham gia.', 'https://images.unsplash.com/photo-1504384308090-c54be3855833?q=80&w=800&auto=format&fit=crop', 3),
('2024', 'Kỷ Nguyên Mới', 'Mở rộng hợp tác với 10+ Doanh nghiệp công nghệ. Ra mắt hệ thống Mentor F1.', 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop', 4);

-- 6. Activities
INSERT INTO `bee_activities` (icon, title, description, image, display_order) VALUES
('Terminal', 'Workshop & Training', 'Các buổi training chuyên sâu về lập trình (Web, Mobile, AI) và cập nhật công nghệ mới nhất.', 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop', 1),
('Mic', 'Sự kiện & Hội thảo', 'Tổ chức Job Fair, Tech Talk với diễn giả từ các công ty công nghệ hàng đầu.', 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=800&auto=format&fit=crop', 2),
('Share2', 'Networking', 'Kết nối thành viên với cựu sinh viên và doanh nghiệp, mở rộng cơ hội nghề nghiệp.', 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=800&auto=format&fit=crop', 3),
('BookOpen', 'Chia sẻ kiến thức', 'Hệ thống Blog, Wiki và các buổi seminar chia sẻ kinh nghiệm thực chiến.', 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop', 4),
('Swords', 'Bug Slayer & Hackathon', 'Sân chơi thi đấu lập trình đỉnh cao, nơi kỹ năng được rèn giũa qua áp lực thời gian.', 'https://images.unsplash.com/photo-1504384308090-c54be3855833?q=80&w=800&auto=format&fit=crop', 5),
('Rocket', 'Dự án thực tế', 'Tham gia các team Product, xây dựng sản phẩm thực tế để làm đẹp Portfolio.', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop', 6);

-- 7. Projects
INSERT INTO `bee_projects` (title, category, description, tech_stack, image, demo_url, github_url, display_order) VALUES
('BeeLearning JS', 'Education Platform', 'Nền tảng học tập trực tuyến dành cho thành viên BeeIT, tích hợp hệ thống bài tập, chấm code tự động và lộ trình học cá nhân hóa.', '["ReactJS", "NodeJS", "MongoDB", "Docker"]', 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1000&auto=format&fit=crop', '#', '#', 1),
('Smart Check-in', 'IoT System', 'Hệ thống điểm danh khuôn mặt tự động cho các sự kiện của CLB, giảm thời gian check-in từ 30p xuống còn 5p.', '["Python", "OpenCV", "Firebase", "Raspberry Pi"]', 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=1000&auto=format&fit=crop', '#', '#', 2),
('BeeIT Landing Page', 'Web Application', 'Website chính thức giới thiệu hoạt động, thành viên và blog công nghệ. Thiết kế hiện đại với hiệu ứng tương tác cao.', '["Next.js 14", "TailwindCSS", "GSAP", "PostgreSQL"]', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop', '#', '#', 3);

-- 8. Gallery
INSERT INTO `bee_gallery` (image_url, caption, height_class, display_order) VALUES
('https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=800&auto=format&fit=crop', 'Team brainstorm hăng say', 'h-64', 1),
('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop', 'Hackathon 2023 - Coding all night', 'h-96', 2),
('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop', 'Buổi offline chia sẻ kiến thức', 'h-72', 3),
('https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop', 'Workshop Mobile Dev', 'h-64', 4),
('https://images.unsplash.com/photo-1531545514256-b1400bc00f31?q=80&w=800&auto=format&fit=crop', 'Best Project Award', 'h-80', 5),
('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop', 'Sinh hoạt câu lạc bộ', 'h-64', 6);

-- 9. Testimonials
INSERT INTO `bee_testimonials` (content, author, role, avatar_url, year_info, display_order) VALUES
('Tham gia BeeIT là quyết định đúng đắn nhất thời sinh viên của mình. Tại đây, mình không chỉ học được code mà còn học cách làm việc nhóm, cách quản lý dự án.', 'Nguyễn Thành Long', 'Senior Developer @ VNG', 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop', 'Cựu thành viên K14', 1),
('Môi trường ở đây cực kỳ năng động. Các anh chị đi trước luôn nhiệt tình support đàn em. Những dự án thực tế tại BeeIT giúp mình tự tin hơn hẳn khi đi phỏng vấn.', 'Trần Thị Mai Anh', 'Frontend Engineer @ Shopee', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop', 'Cựu thành viên K15', 2),
('BeeIT không chỉ là một CLB, đó là một gia đình. Những đêm thức trắng code hackathon cùng đồng đội là những kỷ niệm mình sẽ không bao giờ quên.', 'Lê Văn Hùng', 'Tech Lead @ FPT Software', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop', 'Cựu chủ nhiệm K13', 3);

-- 10. Join Process
INSERT INTO `bee_join_process` (icon, title, date_range, `description`, display_order) VALUES
('FileText', 'Đăng ký Form', '01/08 - 15/08', 'Điền đơn đăng ký trực tuyến. Hãy cho chúng mình biết về đam mê và kỹ năng của bạn.', 1),
('Code', 'Vòng Test CQ', '20/08', 'Bài kiểm tra tư duy logic và kiến thức lập trình cơ bản (C/C++, Python...).', 2),
('Users', 'Phỏng vấn', '25/08 - 30/08', 'Trò chuyện trực tiếp cùng Ban Chủ Nhiệm để hiểu rõ hơn về văn hóa và định hướng.', 3),
('UserPlus', 'Onboarding', '05/09', 'Chính thức trở thành Bee-ers và tham gia chuỗi hoạt động training tân binh.', 4);
