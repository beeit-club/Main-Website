-- =====================================================
-- SQL Script: Insert Sample Data cho Tags và Post Categories
-- Database: beeit
-- Ngày tạo: $(date)
-- 
-- Lưu ý: Nếu muốn insert TẤT CẢ (roles, permissions, tags, categories),
-- hãy dùng file: insert_all_sample_data.sql
-- =====================================================

USE `beeit`;

-- =====================================================
-- 1. INSERT TAGS (Thẻ)
-- =====================================================

-- Xóa dữ liệu cũ nếu cần (uncomment nếu muốn reset)
-- DELETE FROM `post_tags` WHERE tag_id IN (SELECT id FROM `tags`);
-- DELETE FROM `tags` WHERE deleted_at IS NULL;

-- Insert Tags
-- Lưu ý: created_by có thể NULL hoặc set ID của user admin (ví dụ: 1)
INSERT INTO `tags` (`name`, `slug`, `meta_description`, `created_by`, `created_at`) VALUES
-- Programming Languages
('JavaScript', 'javascript', 'Các bài viết về JavaScript, ES6+, Node.js, và các framework liên quan', 1, NOW()),
('Python', 'python', 'Hướng dẫn và chia sẻ về Python, Django, Flask và các thư viện Python', 1, NOW()),
('Java', 'java', 'Kiến thức về Java, Spring Boot, và các công nghệ Java ecosystem', 1, NOW()),
('C++', 'cpp', 'Lập trình C++, STL, và các kỹ thuật nâng cao', 1, NOW()),
('PHP', 'php', 'Laravel, Symfony, và các framework PHP hiện đại', 1, NOW()),

-- Web Development
('Frontend', 'frontend', 'React, Vue, Angular, và các công nghệ frontend', 1, NOW()),
('Backend', 'backend', 'API, Server-side development, và các công nghệ backend', 1, NOW()),
('Full Stack', 'full-stack', 'Phát triển ứng dụng full stack từ frontend đến backend', 1, NOW()),

-- Technologies & Frameworks
('React', 'react', 'React.js, hooks, context, và các best practices', 1, NOW()),
('Next.js', 'nextjs', 'Next.js framework, SSR, SSG, và App Router', 1, NOW()),
('Node.js', 'nodejs', 'Node.js, Express, và server-side JavaScript', 1, NOW()),
('Vue.js', 'vuejs', 'Vue.js framework và ecosystem', 1, NOW()),

-- Database
('MySQL', 'mysql', 'MySQL database, queries, optimization', 1, NOW()),
('MongoDB', 'mongodb', 'MongoDB NoSQL database và Mongoose', 1, NOW()),
('PostgreSQL', 'postgresql', 'PostgreSQL database và advanced features', 1, NOW()),

-- DevOps & Tools
('Docker', 'docker', 'Containerization với Docker và Docker Compose', 1, NOW()),
('Git', 'git', 'Version control với Git, GitHub, GitLab', 1, NOW()),
('Linux', 'linux', 'Hệ điều hành Linux, shell scripting, và server management', 1, NOW()),

-- Mobile Development
('React Native', 'react-native', 'Phát triển mobile app với React Native', 1, NOW()),
('Flutter', 'flutter', 'Flutter framework cho mobile development', 1, NOW()),

-- Other Topics
('Algorithm', 'algorithm', 'Thuật toán, cấu trúc dữ liệu, và problem solving', 1, NOW()),
('System Design', 'system-design', 'Thiết kế hệ thống, architecture patterns', 1, NOW()),
('Career', 'career', 'Định hướng nghề nghiệp, interview tips, và career advice', 1, NOW()),
('Tutorial', 'tutorial', 'Hướng dẫn từng bước cho người mới bắt đầu', 1, NOW());

-- =====================================================
-- 2. INSERT POST CATEGORIES (Danh mục bài viết)
-- =====================================================

-- Xóa dữ liệu cũ nếu cần (uncomment nếu muốn reset)
-- UPDATE `posts` SET category_id = NULL WHERE category_id IN (SELECT id FROM `post_categories`);
-- DELETE FROM `post_categories` WHERE deleted_at IS NULL;

-- Insert Post Categories (Parent categories - không có parent_id)
INSERT INTO `post_categories` (`name`, `slug`, `parent_id`, `created_by`, `created_at`) VALUES
-- Main Categories
('Lập trình', 'lap-trinh', NULL, 1, NOW()),
('Công nghệ', 'cong-nghe', NULL, 1, NOW()),
('Hướng dẫn', 'huong-dan', NULL, 1, NOW()),
('Tin tức', 'tin-tuc', NULL, 1, NOW()),
('Chia sẻ kinh nghiệm', 'chia-se-kinh-nghiem', NULL, 1, NOW());

-- Lấy ID của parent categories để tạo sub-categories
SET @parent_lap_trinh = (SELECT id FROM `post_categories` WHERE slug = 'lap-trinh' LIMIT 1);
SET @parent_cong_nghe = (SELECT id FROM `post_categories` WHERE slug = 'cong-nghe' LIMIT 1);
SET @parent_huong_dan = (SELECT id FROM `post_categories` WHERE slug = 'huong-dan' LIMIT 1);
SET @parent_tin_tuc = (SELECT id FROM `post_categories` WHERE slug = 'tin-tuc' LIMIT 1);
SET @parent_chia_se = (SELECT id FROM `post_categories` WHERE slug = 'chia-se-kinh-nghiem' LIMIT 1);

-- Insert Sub-categories cho "Lập trình"
INSERT INTO `post_categories` (`name`, `slug`, `parent_id`, `created_by`, `created_at`) VALUES
('Web Development', 'web-development', @parent_lap_trinh, 1, NOW()),
('Mobile Development', 'mobile-development', @parent_lap_trinh, 1, NOW()),
('Backend Development', 'backend-development', @parent_lap_trinh, 1, NOW()),
('Frontend Development', 'frontend-development', @parent_lap_trinh, 1, NOW()),
('Full Stack', 'full-stack', @parent_lap_trinh, 1, NOW());

-- Insert Sub-categories cho "Công nghệ"
INSERT INTO `post_categories` (`name`, `slug`, `parent_id`, `created_by`, `created_at`) VALUES
('AI & Machine Learning', 'ai-machine-learning', @parent_cong_nghe, 1, NOW()),
('Cloud Computing', 'cloud-computing', @parent_cong_nghe, 1, NOW()),
('DevOps', 'devops', @parent_cong_nghe, 1, NOW()),
('Database', 'database', @parent_cong_nghe, 1, NOW()),
('Security', 'security', @parent_cong_nghe, 1, NOW());

-- Insert Sub-categories cho "Hướng dẫn"
INSERT INTO `post_categories` (`name`, `slug`, `parent_id`, `created_by`, `created_at`) VALUES
('Tutorial cho người mới', 'tutorial-cho-nguoi-moi', @parent_huong_dan, 1, NOW()),
('Best Practices', 'best-practices', @parent_huong_dan, 1, NOW()),
('Tips & Tricks', 'tips-tricks', @parent_huong_dan, 1, NOW()),
('Code Review', 'code-review', @parent_huong_dan, 1, NOW());

-- Insert Sub-categories cho "Tin tức"
INSERT INTO `post_categories` (`name`, `slug`, `parent_id`, `created_by`, `created_at`) VALUES
('Công nghệ mới', 'cong-nghe-moi', @parent_tin_tuc, 1, NOW()),
('Sự kiện CLB', 'su-kien-clb', @parent_tin_tuc, 1, NOW()),
('Thông báo', 'thong-bao', @parent_tin_tuc, 1, NOW());

-- Insert Sub-categories cho "Chia sẻ kinh nghiệm"
INSERT INTO `post_categories` (`name`, `slug`, `parent_id`, `created_by`, `created_at`) VALUES
('Interview Experience', 'interview-experience', @parent_chia_se, 1, NOW()),
('Project Review', 'project-review', @parent_chia_se, 1, NOW()),
('Career Path', 'career-path', @parent_chia_se, 1, NOW());

-- =====================================================
-- 3. VERIFY DATA
-- =====================================================

-- Kiểm tra số lượng tags đã insert
SELECT 
    COUNT(*) as total_tags,
    'Tags' as table_name
FROM `tags` 
WHERE `deleted_at` IS NULL

UNION ALL

-- Kiểm tra số lượng categories đã insert
SELECT 
    COUNT(*) as total_categories,
    'Post Categories' as table_name
FROM `post_categories` 
WHERE `deleted_at` IS NULL;

-- Xem danh sách tags
SELECT 
    id,
    name,
    slug,
    meta_description,
    created_at
FROM `tags`
WHERE `deleted_at` IS NULL
ORDER BY `name`;

-- Xem danh sách categories (với parent)
SELECT 
    pc.id,
    pc.name,
    pc.slug,
    parent.name as parent_name,
    pc.created_at
FROM `post_categories` pc
LEFT JOIN `post_categories` parent ON pc.parent_id = parent.id
WHERE pc.deleted_at IS NULL
ORDER BY parent.name, pc.name;

-- =====================================================
-- 4. NOTES
-- =====================================================

/*
LƯU Ý:
1. created_by = 1 giả định là ID của user admin
   - Nếu chưa có user admin, có thể set NULL hoặc tạo user trước
   - Hoặc thay bằng ID user thực tế trong database

2. Nếu muốn reset dữ liệu:
   - Uncomment các dòng DELETE ở đầu mỗi section
   - Chạy lại script

3. Slug được tạo tự động từ name (lowercase, thay space bằng dấu gạch ngang)
   - Nếu slug bị trùng, sẽ báo lỗi UNIQUE constraint
   - Cần kiểm tra và điều chỉnh slug nếu cần

4. Parent categories được tạo trước, sau đó mới tạo sub-categories
   - Sub-categories có parent_id trỏ đến parent category

5. Để thêm dữ liệu mới:
   - Chỉ cần thêm vào các INSERT statements
   - Đảm bảo slug không trùng với dữ liệu hiện có
*/

