-- ============================================
-- DỮ LIỆU MẪU CHO BẢNG document_categories
-- ============================================
-- File này chứa các câu lệnh INSERT để thêm dữ liệu mẫu vào bảng document_categories
-- Chạy file này sau khi đã tạo bảng và có ít nhất 1 user trong bảng users

-- LƯU Ý: 
-- - Đảm bảo đã có ít nhất 1 user trong bảng users (created_by = 1 hoặc thay đổi giá trị này)
-- - Nếu bảng đã có dữ liệu, có thể cần xóa trước hoặc điều chỉnh ID

-- ============================================
-- CÁCH 1: INSERT VỚI ID CỐ ĐỊNH (Đơn giản nhất)
-- ============================================
-- Xóa dữ liệu cũ nếu cần (CẨN THẬN!)
-- DELETE FROM document_categories;

-- Reset AUTO_INCREMENT
-- ALTER TABLE document_categories AUTO_INCREMENT = 1;

-- THÊM DANH MỤC CHA (PARENT CATEGORIES)
INSERT INTO `document_categories` (`id`, `name`, `slug`, `parent_id`, `created_by`) VALUES
(1, 'Lập trình Web', 'lap-trinh-web', NULL, 1),
(2, 'Thiết kế Giao diện', 'thiet-ke-giao-dien', NULL, 1),
(3, 'Quản trị Cơ sở dữ liệu', 'quan-tri-co-so-du-lieu', NULL, 1),
(4, 'Lập trình Mobile', 'lap-trinh-mobile', NULL, 1),
(5, 'DevOps & Cloud', 'devops-cloud', NULL, 1),
(6, 'Tài liệu học tập', 'tai-lieu-hoc-tap', NULL, 1),
(7, 'Slide bài giảng', 'slide-bai-giang', NULL, 1),
(8, 'Quy định & Hướng dẫn', 'quy-dinh-huong-dan', NULL, 1);

-- THÊM DANH MỤC CON (CHILD CATEGORIES)
-- Danh mục con của "Lập trình Web" (parent_id = 1)
INSERT INTO `document_categories` (`id`, `name`, `slug`, `parent_id`, `created_by`) VALUES
(9, 'ReactJS', 'reactjs', 1, 1),
(10, 'NodeJS', 'nodejs', 1, 1),
(11, 'VueJS', 'vuejs', 1, 1),
(12, 'Angular', 'angular', 1, 1),
(13, 'Next.js', 'nextjs', 1, 1),
(14, 'Express.js', 'expressjs', 1, 1);

-- Danh mục con của "Thiết kế Giao diện" (parent_id = 2)
INSERT INTO `document_categories` (`id`, `name`, `slug`, `parent_id`, `created_by`) VALUES
(15, 'Figma', 'figma', 2, 1),
(16, 'Adobe XD', 'adobe-xd', 2, 1),
(17, 'Sketch', 'sketch', 2, 1),
(18, 'UI/UX Design', 'ui-ux-design', 2, 1);

-- Danh mục con của "Quản trị Cơ sở dữ liệu" (parent_id = 3)
INSERT INTO `document_categories` (`id`, `name`, `slug`, `parent_id`, `created_by`) VALUES
(19, 'SQL Server', 'sql-server', 3, 1),
(20, 'MySQL', 'mysql', 3, 1),
(21, 'PostgreSQL', 'postgresql', 3, 1),
(22, 'MongoDB', 'mongodb', 3, 1),
(23, 'Redis', 'redis', 3, 1);

-- Danh mục con của "Lập trình Mobile" (parent_id = 4)
INSERT INTO `document_categories` (`id`, `name`, `slug`, `parent_id`, `created_by`) VALUES
(24, 'React Native', 'react-native', 4, 1),
(25, 'Flutter', 'flutter', 4, 1),
(26, 'iOS Development', 'ios-development', 4, 1),
(27, 'Android Development', 'android-development', 4, 1);

-- Danh mục con của "DevOps & Cloud" (parent_id = 5)
INSERT INTO `document_categories` (`id`, `name`, `slug`, `parent_id`, `created_by`) VALUES
(28, 'Docker', 'docker', 5, 1),
(29, 'Kubernetes', 'kubernetes', 5, 1),
(30, 'AWS', 'aws', 5, 1),
(31, 'Azure', 'azure', 5, 1),
(32, 'CI/CD', 'ci-cd', 5, 1);

-- Danh mục con của "Tài liệu học tập" (parent_id = 6)
INSERT INTO `document_categories` (`id`, `name`, `slug`, `parent_id`, `created_by`) VALUES
(33, 'Tài liệu lý thuyết', 'tai-lieu-ly-thuyet', 6, 1),
(34, 'Bài tập thực hành', 'bai-tap-thuc-hanh', 6, 1),
(35, 'Đề thi mẫu', 'de-thi-mau', 6, 1);

-- Danh mục con của "Slide bài giảng" (parent_id = 7)
INSERT INTO `document_categories` (`id`, `name`, `slug`, `parent_id`, `created_by`) VALUES
(36, 'Workshop Slides', 'workshop-slides', 7, 1),
(37, 'Seminar Slides', 'seminar-slides', 7, 1),
(38, 'Training Materials', 'training-materials', 7, 1);

-- Danh mục con của "Quy định & Hướng dẫn" (parent_id = 8)
INSERT INTO `document_categories` (`id`, `name`, `slug`, `parent_id`, `created_by`) VALUES
(39, 'Quy định CLB', 'quy-dinh-clb', 8, 1),
(40, 'Hướng dẫn sử dụng', 'huong-dan-su-dung', 8, 1),
(41, 'FAQ', 'faq', 8, 1);

-- ============================================
-- CÁCH 2: INSERT KHÔNG CHỈ ĐỊNH ID (Tự động tăng)
-- ============================================
-- Nếu bạn muốn để MySQL tự động tăng ID, sử dụng cách này:

/*
-- THÊM DANH MỤC CHA
INSERT INTO `document_categories` (`name`, `slug`, `parent_id`, `created_by`) VALUES
('Lập trình Web', 'lap-trinh-web', NULL, 1),
('Thiết kế Giao diện', 'thiet-ke-giao-dien', NULL, 1),
('Quản trị Cơ sở dữ liệu', 'quan-tri-co-so-du-lieu', NULL, 1),
('Lập trình Mobile', 'lap-trinh-mobile', NULL, 1),
('DevOps & Cloud', 'devops-cloud', NULL, 1),
('Tài liệu học tập', 'tai-lieu-hoc-tap', NULL, 1),
('Slide bài giảng', 'slide-bai-giang', NULL, 1),
('Quy định & Hướng dẫn', 'quy-dinh-huong-dan', NULL, 1);

-- THÊM DANH MỤC CON (sử dụng LAST_INSERT_ID() hoặc biết ID trước)
-- Lưu ý: Cách này phức tạp hơn, nên dùng CÁCH 1 với ID cố định
*/

-- ============================================
-- KIỂM TRA DỮ LIỆU ĐÃ THÊM
-- ============================================

-- Xem tất cả danh mục
-- SELECT * FROM document_categories ORDER BY parent_id, id;

-- Xem danh mục cha và số lượng con
-- SELECT 
--     dc.id,
--     dc.name,
--     dc.slug,
--     dc.parent_id,
--     COUNT(dc2.id) AS child_count
-- FROM document_categories dc
-- LEFT JOIN document_categories dc2 ON dc.id = dc2.parent_id
-- WHERE dc.parent_id IS NULL AND dc.deleted_at IS NULL
-- GROUP BY dc.id, dc.name, dc.slug, dc.parent_id
-- ORDER BY dc.id;

-- Xem cấu trúc cây (tree structure)
-- SELECT 
--     COALESCE(p.name, 'ROOT') AS parent_name,
--     c.name AS child_name,
--     c.slug,
--     c.id
-- FROM document_categories c
-- LEFT JOIN document_categories p ON c.parent_id = p.id
-- WHERE c.deleted_at IS NULL
-- ORDER BY p.id, c.id;

-- Xem danh sách danh mục cha
-- SELECT id, name, slug FROM document_categories WHERE parent_id IS NULL AND deleted_at IS NULL ORDER BY id;

-- Xem danh sách danh mục con của một danh mục cụ thể (ví dụ: Lập trình Web - id = 1)
-- SELECT id, name, slug FROM document_categories WHERE parent_id = 1 AND deleted_at IS NULL ORDER BY id;
