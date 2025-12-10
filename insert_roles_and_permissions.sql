-- =====================================================
-- SQL Script: Insert Roles và Permissions
-- Database: beeit
-- Ngày tạo: $(date)
-- =====================================================

USE `beeit`;

-- =====================================================
-- 1. INSERT ROLES (Vai trò)
-- =====================================================

-- Xóa dữ liệu cũ nếu cần (uncomment nếu muốn reset)
-- DELETE FROM `user_permissions` WHERE user_id IN (SELECT id FROM `users` WHERE role_id IN (SELECT id FROM `roles`));
-- DELETE FROM `roles` WHERE id IN (1, 2, 3, 4, 5);

-- Insert Roles (đảm bảo ID khớp với enum trong code)
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

-- =====================================================
-- 2. INSERT PERMISSIONS (Quyền)
-- =====================================================

-- Xóa dữ liệu cũ nếu cần (uncomment nếu muốn reset)
-- DELETE FROM `user_permissions` WHERE permission_id IN (SELECT id FROM `permissions`);
-- DELETE FROM `permissions` WHERE id > 0;

-- Module 1: User Management & Permissions
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
('members.restore', 'Khôi phục hồ sơ đã xóa', 'user_management', NOW()),

-- Module 2: Content Management
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
('answers.moderate', 'Kiểm duyệt câu trả lời', 'content_management', NOW()),

-- Module 3: Events Management
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
('attendances.export', 'Xuất báo cáo điểm danh', 'event_management', NOW()),

-- Module 4: Document Management
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
('documents.revoke_restricted_access', 'Thu hồi quyền truy cập hạn chế', 'document_management', NOW()),

-- Module 5: Financial Management
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
-- 3. ASSIGN PERMISSIONS TO ROLES (via user_permissions)
-- =====================================================

-- Lưu ý: Hệ thống này dùng user_permissions để assign permissions
-- Cần assign permissions cho users dựa trên role_id của họ
-- Script này sẽ tạo một helper để assign permissions cho tất cả users có role tương ứng

-- Function helper để assign permissions cho role
-- (Sẽ được gọi sau khi có users)

-- =====================================================
-- 4. VERIFY DATA
-- =====================================================

-- Kiểm tra số lượng roles
SELECT 
    COUNT(*) as total_roles,
    'Roles' as table_name
FROM `roles`

UNION ALL

-- Kiểm tra số lượng permissions
SELECT 
    COUNT(*) as total_permissions,
    'Permissions' as table_name
FROM `permissions`;

-- Xem danh sách roles
SELECT 
    id,
    name,
    description,
    created_at
FROM `roles`
ORDER BY `id`;

-- Xem danh sách permissions theo module
SELECT 
    module,
    COUNT(*) as permission_count
FROM `permissions`
GROUP BY module
ORDER BY module;

-- Xem tất cả permissions
SELECT 
    id,
    name,
    description,
    module
FROM `permissions`
ORDER BY module, name;

-- =====================================================
-- 5. NOTES
-- =====================================================

/*
LƯU Ý QUAN TRỌNG:

1. ROLE IDs:
   - Super Admin: 1
   - Admin: 2
   - Moderator: 3
   - Member: 4
   - Guest: 5
   
   IDs này phải khớp với enum trong code:
   backend/src/common/enum.js: ROLE = { SUPER_ADMIN: 1, ADMIN: 2, ... }

2. PERMISSIONS STRUCTURE:
   - Format: [module].[action].[scope]
   - Ví dụ: posts.view_all, users.edit_own
   - Tổng cộng: ~135 permissions

3. ASSIGN PERMISSIONS:
   - Hệ thống dùng bảng user_permissions để assign permissions cho users
   - Không có bảng role_permissions
   - Cần assign permissions cho từng user dựa trên role_id
   
   Ví dụ assign permissions cho Super Admin (user_id = 1):
   INSERT INTO `user_permissions` (`user_id`, `permission_id`, `granted_by`) 
   SELECT 1, p.id, 1 FROM `permissions` p;

4. RESET DATA:
   - Uncomment các dòng DELETE ở đầu mỗi section nếu muốn reset
   - Chú ý: Xóa user_permissions trước khi xóa permissions/roles

5. ON DUPLICATE KEY:
   - Script dùng ON DUPLICATE KEY UPDATE để tránh lỗi khi chạy lại
   - Nếu muốn force insert mới, cần xóa dữ liệu cũ trước
*/

