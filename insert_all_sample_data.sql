-- =====================================================
-- SQL Script: Insert TẤT CẢ Sample Data
-- Database: beeit
-- Ngày tạo: $(date)
-- 
-- Bao gồm:
-- 1. Roles và Permissions
-- 2. Tags và Post Categories
-- =====================================================

USE `beeit`;

-- =====================================================
-- PART 1: ROLES VÀ PERMISSIONS
-- =====================================================

-- 1.1. Insert Roles
INSERT INTO `roles` (`id`, `name`, `description`, `created_at`) VALUES
(1, 'Super Admin', 'Quản trị viên cấp cao nhất, có tất cả quyền trong hệ thống', NOW()),
(2, 'Admin', 'Quản trị viên, quản lý hầu hết các chức năng', NOW()),
(3, 'Moderator', 'Người điều hành, quản lý nội dung và sự kiện', NOW()),
(4, 'Member', 'Thành viên câu lạc bộ, có quyền truy cập cơ bản', NOW()),
(5, 'Guest', 'Khách, chỉ có thể xem nội dung công khai', NOW())
ON DUPLICATE KEY UPDATE 
    `name` = VALUES(`name`),
    `description` = VALUES(`description`),
    `updated_at` = NOW();

-- 1.2. Insert Permissions (Module 1: User Management)
INSERT INTO `permissions` (`name`, `description`, `module`, `created_at`) VALUES
-- Roles Management
('roles.view', 'Xem danh sách vai trò', 'user_management', NOW()),
('roles.create', 'Tạo vai trò mới', 'user_management', NOW()),
('roles.edit', 'Chỉnh sửa vai trò', 'user_management', NOW()),
('roles.delete', 'Xóa vai trò', 'user_management', NOW()),
('roles.assign', 'Gán vai trò cho người dùng', 'user_management', NOW()),

-- Users Management
('users.view_all', 'Xem danh sách tất cả người dùng', 'user_management', NOW()),
('users.view', 'Xem thông tin người dùng', 'user_management', NOW()),
('users.create', 'Tạo tài khoản người dùng mới', 'user_management', NOW()),
('users.edit', 'Chỉnh sửa thông tin người dùng', 'user_management', NOW()),
('users.edit_own', 'Chỉnh sửa thông tin cá nhân', 'user_management', NOW()),
('users.delete', 'Xóa tài khoản người dùng', 'user_management', NOW()),
('users.activate', 'Kích hoạt tài khoản', 'user_management', NOW()),
('users.deactivate', 'Vô hiệu hóa tài khoản', 'user_management', NOW()),
('users.verify_email', 'Xác thực email', 'user_management', NOW()),
('users.reset_password', 'Đặt lại mật khẩu', 'user_management', NOW()),
('users.manage_sessions', 'Quản lý phiên đăng nhập', 'user_management', NOW()),

-- Permissions Management
('permissions.view', 'Xem danh sách quyền', 'user_management', NOW()),
('permissions.create', 'Tạo quyền mới', 'user_management', NOW()),
('permissions.edit', 'Chỉnh sửa quyền', 'user_management', NOW()),
('permissions.delete', 'Xóa quyền', 'user_management', NOW()),
('permissions.grant', 'Cấp quyền cho người dùng', 'user_management', NOW()),
('permissions.revoke', 'Thu hồi quyền từ người dùng', 'user_management', NOW()),
('permissions.view_user_permissions', 'Xem quyền của người dùng', 'user_management', NOW()),

-- Membership Applications
('applications.view', 'Xem đơn xin gia nhập', 'user_management', NOW()),
('applications.create', 'Tạo đơn xin gia nhập', 'user_management', NOW()),
('applications.review', 'Xem xét đơn xin gia nhập', 'user_management', NOW()),
('applications.approve', 'Phê duyệt đơn', 'user_management', NOW()),
('applications.reject', 'Từ chối đơn', 'user_management', NOW()),
('applications.interview', 'Thêm ghi chú phỏng vấn', 'user_management', NOW()),
('applications.delete', 'Xóa đơn xin gia nhập', 'user_management', NOW()),

-- Member Profiles
('members.view', 'Xem hồ sơ thành viên', 'user_management', NOW()),
('members.view_all', 'Xem tất cả hồ sơ thành viên', 'user_management', NOW()),
('members.create', 'Tạo hồ sơ thành viên mới', 'user_management', NOW()),
('members.edit', 'Chỉnh sửa hồ sơ thành viên', 'user_management', NOW()),
('members.edit_own', 'Chỉnh sửa hồ sơ cá nhân', 'user_management', NOW()),
('members.delete', 'Xóa hồ sơ thành viên', 'user_management', NOW()),
('members.restore', 'Khôi phục hồ sơ đã xóa', 'user_management', NOW())

ON DUPLICATE KEY UPDATE 
    `description` = VALUES(`description`),
    `module` = VALUES(`module`);

-- 1.3. Insert Permissions (Module 2: Content Management)
INSERT INTO `permissions` (`name`, `description`, `module`, `created_at`) VALUES
-- Post Categories
('post_categories.view', 'Xem danh mục bài viết', 'content_management', NOW()),
('post_categories.create', 'Tạo danh mục mới', 'content_management', NOW()),
('post_categories.edit', 'Chỉnh sửa danh mục', 'content_management', NOW()),
('post_categories.delete', 'Xóa danh mục', 'content_management', NOW()),
('post_categories.restore', 'Khôi phục danh mục đã xóa', 'content_management', NOW()),

-- Posts Management
('posts.view', 'Xem bài viết', 'content_management', NOW()),
('posts.view_all', 'Xem tất cả bài viết', 'content_management', NOW()),
('posts.view_draft', 'Xem bài viết nháp', 'content_management', NOW()),
('posts.view_published', 'Xem bài viết đã xuất bản', 'content_management', NOW()),
('posts.create', 'Tạo bài viết mới', 'content_management', NOW()),
('posts.edit', 'Chỉnh sửa bài viết', 'content_management', NOW()),
('posts.edit_own', 'Chỉnh sửa bài viết của mình', 'content_management', NOW()),
('posts.delete', 'Xóa bài viết', 'content_management', NOW()),
('posts.restore', 'Khôi phục bài viết đã xóa', 'content_management', NOW()),
('posts.publish', 'Xuất bản bài viết', 'content_management', NOW()),
('posts.unpublish', 'Hủy xuất bản', 'content_management', NOW()),
('posts.feature', 'Đặt ảnh nổi bật', 'content_management', NOW()),
('posts.seo', 'Quản lý meta description và SEO', 'content_management', NOW()),

-- Comments Management
('comments.view', 'Xem bình luận', 'content_management', NOW()),
('comments.create', 'Tạo bình luận', 'content_management', NOW()),
('comments.edit', 'Chỉnh sửa bình luận', 'content_management', NOW()),
('comments.edit_own', 'Chỉnh sửa bình luận của mình', 'content_management', NOW()),
('comments.delete', 'Xóa bình luận', 'content_management', NOW()),
('comments.moderate', 'Kiểm duyệt bình luận', 'content_management', NOW()),
('comments.approve', 'Phê duyệt bình luận', 'content_management', NOW()),
('comments.reject', 'Từ chối bình luận', 'content_management', NOW()),

-- Tags Management
('tags.view', 'Xem thẻ tag', 'content_management', NOW()),
('tags.create', 'Tạo thẻ tag mới', 'content_management', NOW()),
('tags.edit', 'Chỉnh sửa thẻ tag', 'content_management', NOW()),
('tags.delete', 'Xóa thẻ tag', 'content_management', NOW()),
('tags.assign', 'Gán tag cho bài viết', 'content_management', NOW()),
('tags.remove', 'Gỡ tag khỏi bài viết', 'content_management', NOW()),

-- Questions & Answers
('questions.view', 'Xem câu hỏi', 'content_management', NOW()),
('questions.create', 'Tạo câu hỏi mới', 'content_management', NOW()),
('questions.edit', 'Chỉnh sửa câu hỏi', 'content_management', NOW()),
('questions.edit_own', 'Chỉnh sửa câu hỏi của mình', 'content_management', NOW()),
('questions.delete', 'Xóa câu hỏi', 'content_management', NOW()),
('questions.publish', 'Xuất bản câu hỏi', 'content_management', NOW()),
('questions.moderate', 'Kiểm duyệt câu hỏi', 'content_management', NOW()),

('answers.view', 'Xem câu trả lời', 'content_management', NOW()),
('answers.create', 'Tạo câu trả lời', 'content_management', NOW()),
('answers.edit', 'Chỉnh sửa câu trả lời', 'content_management', NOW()),
('answers.edit_own', 'Chỉnh sửa câu trả lời của mình', 'content_management', NOW()),
('answers.delete', 'Xóa câu trả lời', 'content_management', NOW()),
('answers.vote', 'Vote cho câu trả lời', 'content_management', NOW()),
('answers.accept', 'Chấp nhận câu trả lời', 'content_management', NOW()),
('answers.moderate', 'Kiểm duyệt câu trả lời', 'content_management', NOW())

ON DUPLICATE KEY UPDATE 
    `description` = VALUES(`description`),
    `module` = VALUES(`module`);

-- 1.4. Insert Permissions (Module 3: Events Management)
INSERT INTO `permissions` (`name`, `description`, `module`, `created_at`) VALUES
('events.view', 'Xem sự kiện', 'event_management', NOW()),
('events.view_all', 'Xem tất cả sự kiện', 'event_management', NOW()),
('events.view_private', 'Xem sự kiện riêng tư', 'event_management', NOW()),
('events.view_public', 'Xem sự kiện công khai', 'event_management', NOW()),
('events.create', 'Tạo sự kiện mới', 'event_management', NOW()),
('events.edit', 'Chỉnh sửa sự kiện', 'event_management', NOW()),
('events.edit_own', 'Chỉnh sửa sự kiện của mình', 'event_management', NOW()),
('events.delete', 'Xóa sự kiện', 'event_management', NOW()),
('events.publish', 'Xuất bản sự kiện', 'event_management', NOW()),
('events.set_private', 'Đặt sự kiện ở chế độ riêng tư', 'event_management', NOW()),
('events.manage_registration', 'Quản lý đăng ký tham gia', 'event_management', NOW()),

-- Event Registrations
('event_registrations.view', 'Xem danh sách đăng ký', 'event_management', NOW()),
('event_registrations.create', 'Tạo đăng ký mới', 'event_management', NOW()),
('event_registrations.edit', 'Chỉnh sửa thông tin đăng ký', 'event_management', NOW()),
('event_registrations.delete', 'Xóa đăng ký', 'event_management', NOW()),
('event_registrations.register_guest', 'Đăng ký cho khách', 'event_management', NOW()),
('event_registrations.register_member', 'Đăng ký cho thành viên', 'event_management', NOW()),
('event_registrations.export', 'Xuất danh sách đăng ký', 'event_management', NOW()),

-- Event Attendances
('attendances.view', 'Xem danh sách điểm danh', 'event_management', NOW()),
('attendances.create', 'Tạo bản ghi điểm danh', 'event_management', NOW()),
('attendances.edit', 'Chỉnh sửa thông tin điểm danh', 'event_management', NOW()),
('attendances.check_in', 'Điểm danh người tham gia', 'event_management', NOW()),
('attendances.check_out', 'Điểm danh ra về', 'event_management', NOW()),
('attendances.bulk_check_in', 'Điểm danh hàng loạt', 'event_management', NOW()),
('attendances.export', 'Xuất báo cáo điểm danh', 'event_management', NOW())

ON DUPLICATE KEY UPDATE 
    `description` = VALUES(`description`),
    `module` = VALUES(`module`);

-- 1.5. Insert Permissions (Module 4: Document Management)
INSERT INTO `permissions` (`name`, `description`, `module`, `created_at`) VALUES
-- Document Categories
('document_categories.view', 'Xem danh mục tài liệu', 'document_management', NOW()),
('document_categories.create', 'Tạo danh mục mới', 'document_management', NOW()),
('document_categories.edit', 'Chỉnh sửa danh mục', 'document_management', NOW()),
('document_categories.delete', 'Xóa danh mục', 'document_management', NOW()),
('document_categories.restore', 'Khôi phục danh mục đã xóa', 'document_management', NOW()),

-- Documents Management
('documents.view_public', 'Xem tài liệu công khai', 'document_management', NOW()),
('documents.view_member', 'Xem tài liệu dành cho thành viên', 'document_management', NOW()),
('documents.view_restricted', 'Xem tài liệu hạn chế', 'document_management', NOW()),
('documents.view_all', 'Xem tất cả tài liệu', 'document_management', NOW()),
('documents.create', 'Tải lên tài liệu mới', 'document_management', NOW()),
('documents.edit', 'Chỉnh sửa thông tin tài liệu', 'document_management', NOW()),
('documents.edit_own', 'Chỉnh sửa tài liệu của mình', 'document_management', NOW()),
('documents.delete', 'Xóa tài liệu', 'document_management', NOW()),
('documents.download', 'Tải xuống tài liệu', 'document_management', NOW()),
('documents.set_access_level', 'Đặt mức độ truy cập', 'document_management', NOW()),
('documents.grant_restricted_access', 'Cấp quyền truy cập hạn chế', 'document_management', NOW()),
('documents.revoke_restricted_access', 'Thu hồi quyền truy cập hạn chế', 'document_management', NOW())

ON DUPLICATE KEY UPDATE 
    `description` = VALUES(`description`),
    `module` = VALUES(`module`);

-- 1.6. Insert Permissions (Module 5: Financial Management)
INSERT INTO `permissions` (`name`, `description`, `module`, `created_at`) VALUES
('transactions.view', 'Xem giao dịch', 'financial_management', NOW()),
('transactions.view_all', 'Xem tất cả giao dịch', 'financial_management', NOW()),
('transactions.create', 'Tạo giao dịch mới', 'financial_management', NOW()),
('transactions.edit', 'Chỉnh sửa giao dịch', 'financial_management', NOW()),
('transactions.delete', 'Xóa giao dịch', 'financial_management', NOW()),
('transactions.export', 'Xuất báo cáo tài chính', 'financial_management', NOW()),
('transactions.upload_receipt', 'Tải lên chứng từ', 'financial_management', NOW()),
('transactions.approve', 'Phê duyệt giao dịch', 'financial_management', NOW())

ON DUPLICATE KEY UPDATE 
    `description` = VALUES(`description`),
    `module` = VALUES(`module`);

-- =====================================================
-- PART 2: TAGS
-- =====================================================

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
('Tutorial', 'tutorial', 'Hướng dẫn từng bước cho người mới bắt đầu', 1, NOW())

ON DUPLICATE KEY UPDATE 
    `meta_description` = VALUES(`meta_description`),
    `updated_at` = NOW();

-- =====================================================
-- PART 3: POST CATEGORIES
-- =====================================================

-- 3.1. Insert Parent Categories
INSERT INTO `post_categories` (`name`, `slug`, `parent_id`, `created_by`, `created_at`) VALUES
('Lập trình', 'lap-trinh', NULL, 1, NOW()),
('Công nghệ', 'cong-nghe', NULL, 1, NOW()),
('Hướng dẫn', 'huong-dan', NULL, 1, NOW()),
('Tin tức', 'tin-tuc', NULL, 1, NOW()),
('Chia sẻ kinh nghiệm', 'chia-se-kinh-nghiem', NULL, 1, NOW())

ON DUPLICATE KEY UPDATE 
    `name` = VALUES(`name`),
    `updated_at` = NOW();

-- 3.2. Insert Sub-categories
-- Lấy ID của parent categories
SET @parent_lap_trinh = (SELECT id FROM `post_categories` WHERE slug = 'lap-trinh' LIMIT 1);
SET @parent_cong_nghe = (SELECT id FROM `post_categories` WHERE slug = 'cong-nghe' LIMIT 1);
SET @parent_huong_dan = (SELECT id FROM `post_categories` WHERE slug = 'huong-dan' LIMIT 1);
SET @parent_tin_tuc = (SELECT id FROM `post_categories` WHERE slug = 'tin-tuc' LIMIT 1);
SET @parent_chia_se = (SELECT id FROM `post_categories` WHERE slug = 'chia-se-kinh-nghiem' LIMIT 1);

-- Sub-categories cho "Lập trình"
INSERT INTO `post_categories` (`name`, `slug`, `parent_id`, `created_by`, `created_at`) VALUES
('Web Development', 'web-development', @parent_lap_trinh, 1, NOW()),
('Mobile Development', 'mobile-development', @parent_lap_trinh, 1, NOW()),
('Backend Development', 'backend-development', @parent_lap_trinh, 1, NOW()),
('Frontend Development', 'frontend-development', @parent_lap_trinh, 1, NOW()),
('Full Stack', 'full-stack', @parent_lap_trinh, 1, NOW())

ON DUPLICATE KEY UPDATE 
    `name` = VALUES(`name`),
    `updated_at` = NOW();

-- Sub-categories cho "Công nghệ"
INSERT INTO `post_categories` (`name`, `slug`, `parent_id`, `created_by`, `created_at`) VALUES
('AI & Machine Learning', 'ai-machine-learning', @parent_cong_nghe, 1, NOW()),
('Cloud Computing', 'cloud-computing', @parent_cong_nghe, 1, NOW()),
('DevOps', 'devops', @parent_cong_nghe, 1, NOW()),
('Database', 'database', @parent_cong_nghe, 1, NOW()),
('Security', 'security', @parent_cong_nghe, 1, NOW())

ON DUPLICATE KEY UPDATE 
    `name` = VALUES(`name`),
    `updated_at` = NOW();

-- Sub-categories cho "Hướng dẫn"
INSERT INTO `post_categories` (`name`, `slug`, `parent_id`, `created_by`, `created_at`) VALUES
('Tutorial cho người mới', 'tutorial-cho-nguoi-moi', @parent_huong_dan, 1, NOW()),
('Best Practices', 'best-practices', @parent_huong_dan, 1, NOW()),
('Tips & Tricks', 'tips-tricks', @parent_huong_dan, 1, NOW()),
('Code Review', 'code-review', @parent_huong_dan, 1, NOW())

ON DUPLICATE KEY UPDATE 
    `name` = VALUES(`name`),
    `updated_at` = NOW();

-- Sub-categories cho "Tin tức"
INSERT INTO `post_categories` (`name`, `slug`, `parent_id`, `created_by`, `created_at`) VALUES
('Công nghệ mới', 'cong-nghe-moi', @parent_tin_tuc, 1, NOW()),
('Sự kiện CLB', 'su-kien-clb', @parent_tin_tuc, 1, NOW()),
('Thông báo', 'thong-bao', @parent_tin_tuc, 1, NOW())

ON DUPLICATE KEY UPDATE 
    `name` = VALUES(`name`),
    `updated_at` = NOW();

-- Sub-categories cho "Chia sẻ kinh nghiệm"
INSERT INTO `post_categories` (`name`, `slug`, `parent_id`, `created_by`, `created_at`) VALUES
('Interview Experience', 'interview-experience', @parent_chia_se, 1, NOW()),
('Project Review', 'project-review', @parent_chia_se, 1, NOW()),
('Career Path', 'career-path', @parent_chia_se, 1, NOW())

ON DUPLICATE KEY UPDATE 
    `name` = VALUES(`name`),
    `updated_at` = NOW();

-- =====================================================
-- PART 4: VERIFY DATA
-- =====================================================

-- Summary
SELECT 
    'Roles' as data_type,
    COUNT(*) as total_count
FROM `roles`

UNION ALL

SELECT 
    'Permissions',
    COUNT(*)
FROM `permissions`

UNION ALL

SELECT 
    'Tags',
    COUNT(*)
FROM `tags`
WHERE `deleted_at` IS NULL

UNION ALL

SELECT 
    'Post Categories',
    COUNT(*)
FROM `post_categories`
WHERE `deleted_at` IS NULL;

-- =====================================================
-- NOTES
-- =====================================================

/*
LƯU Ý:

1. Script này insert TẤT CẢ sample data:
   - 5 Roles
   - ~135 Permissions
   - 25 Tags
   - 5 Parent Categories + 17 Sub-categories

2. ON DUPLICATE KEY UPDATE:
   - Tránh lỗi khi chạy lại script
   - Chỉ update description/module, không thay đổi name/slug

3. created_by = 1:
   - Giả định là Super Admin user ID
   - Nếu chưa có, có thể set NULL hoặc thay bằng ID thực tế

4. Để assign permissions cho users:
   - Chạy script: assign_permissions_to_roles.sql
   - Hoặc assign thủ công cho từng user

5. Reset data:
   - Xóa user_permissions trước
   - Xóa permissions
   - Xóa roles (cẩn thận với foreign keys)
   - Xóa tags và categories
*/

