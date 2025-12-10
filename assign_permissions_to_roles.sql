-- =====================================================
-- SQL Script: Assign Permissions to Roles
-- Database: beeit
-- Ngày tạo: $(date)
-- 
-- Lưu ý: Hệ thống dùng user_permissions để assign permissions
-- Script này sẽ assign permissions cho tất cả users dựa trên role_id
-- =====================================================

USE `beeit`;

-- =====================================================
-- 1. ASSIGN PERMISSIONS CHO SUPER ADMIN (role_id = 1)
-- =====================================================

-- Assign TẤT CẢ permissions cho tất cả users có role_id = 1 (Super Admin)
INSERT INTO `user_permissions` (`user_id`, `permission_id`, `granted_by`) 
SELECT u.id, p.id, 1 
FROM `users` u
CROSS JOIN `permissions` p
WHERE u.role_id = 1
  AND NOT EXISTS (
    SELECT 1 FROM `user_permissions` up 
    WHERE up.user_id = u.id AND up.permission_id = p.id
  );

-- =====================================================
-- 2. ASSIGN PERMISSIONS CHO ADMIN (role_id = 2)
-- =====================================================

-- Admin có hầu hết quyền, TRỪ quản lý roles (chỉ có roles.view)
INSERT INTO `user_permissions` (`user_id`, `permission_id`, `granted_by`) 
SELECT u.id, p.id, 1 
FROM `users` u
CROSS JOIN `permissions` p
WHERE u.role_id = 2
  AND (p.name NOT LIKE 'roles.%' OR p.name = 'roles.view')
  AND NOT EXISTS (
    SELECT 1 FROM `user_permissions` up 
    WHERE up.user_id = u.id AND up.permission_id = p.id
  );

-- =====================================================
-- 3. ASSIGN PERMISSIONS CHO MODERATOR (role_id = 3)
-- =====================================================

-- Moderator: Quản lý nội dung, sự kiện, tài liệu (không có quyền user management cao)
INSERT INTO `user_permissions` (`user_id`, `permission_id`, `granted_by`) 
SELECT u.id, p.id, 1 
FROM `users` u
CROSS JOIN `permissions` p
WHERE u.role_id = 3
  AND p.name IN (
    -- Content Management
    'posts.view_all', 'posts.create', 'posts.edit', 'posts.edit_own', 
    'posts.publish', 'posts.unpublish', 'posts.view', 'posts.view_published', 'posts.view_draft',
    'comments.view', 'comments.create', 'comments.edit', 'comments.edit_own', 'comments.moderate',
    'tags.view', 'tags.create', 'tags.edit', 'tags.assign',
    'post_categories.view', 'post_categories.create', 'post_categories.edit',
    'questions.view', 'questions.create', 'questions.edit_own', 'questions.moderate',
    'answers.view', 'answers.create', 'answers.edit_own', 'answers.moderate',
    
    -- Event Management
    'events.view_all', 'events.create', 'events.edit', 'events.edit_own', 
    'events.publish', 'events.view', 'events.view_public', 'events.view_private',
    'event_registrations.view', 'event_registrations.create', 'event_registrations.edit',
    'attendances.view', 'attendances.check_in', 'attendances.export',
    
    -- Document Management
    'documents.view_all', 'documents.create', 'documents.edit', 'documents.edit_own',
    'document_categories.view', 'document_categories.create', 'document_categories.edit',
    
    -- User Management (limited)
    'users.view', 'users.edit_own', 
    'applications.view', 'applications.review', 
    'members.view_all', 'members.view'
  )
  AND NOT EXISTS (
    SELECT 1 FROM `user_permissions` up 
    WHERE up.user_id = u.id AND up.permission_id = p.id
  );

-- =====================================================
-- 4. ASSIGN PERMISSIONS CHO MEMBER (role_id = 4)
-- =====================================================

-- Member: Quyền cơ bản để xem và tạo nội dung
INSERT INTO `user_permissions` (`user_id`, `permission_id`, `granted_by`) 
SELECT u.id, p.id, 1 
FROM `users` u
CROSS JOIN `permissions` p
WHERE u.role_id = 4
  AND p.name IN (
    -- Content permissions
    'posts.view_published', 'posts.create', 'posts.edit_own', 'posts.view',
    'comments.view', 'comments.create', 'comments.edit_own',
    'questions.view', 'questions.create', 'questions.edit_own',
    'answers.view', 'answers.create', 'answers.edit_own', 'answers.vote', 'answers.accept',
    'tags.view',
    
    -- Event permissions
    'events.view_public', 'events.view_private', 'events.view',
    'event_registrations.create', 'event_registrations.register_member',
    
    -- Document permissions
    'documents.view_public', 'documents.view_member', 'documents.download',
    
    -- User permissions
    'users.edit_own', 'members.edit_own', 'members.view',
    
    -- Application permissions
    'applications.create'
  )
  AND NOT EXISTS (
    SELECT 1 FROM `user_permissions` up 
    WHERE up.user_id = u.id AND up.permission_id = p.id
  );

-- =====================================================
-- 5. ASSIGN PERMISSIONS CHO GUEST (role_id = 5)
-- =====================================================

-- Guest: Chỉ xem nội dung công khai
INSERT INTO `user_permissions` (`user_id`, `permission_id`, `granted_by`) 
SELECT u.id, p.id, 1 
FROM `users` u
CROSS JOIN `permissions` p
WHERE u.role_id = 5
  AND p.name IN (
    -- Chỉ xem nội dung công khai
    'posts.view_published', 'posts.view',
    'comments.view',
    'questions.view',
    'answers.view',
    'events.view_public', 'events.view',
    'documents.view_public',
    'tags.view',
    
    -- Application permissions (để đăng ký thành viên)
    'applications.create'
  )
  AND NOT EXISTS (
    SELECT 1 FROM `user_permissions` up 
    WHERE up.user_id = u.id AND up.permission_id = p.id
  );

-- =====================================================
-- 6. VERIFY PERMISSIONS ASSIGNMENT
-- =====================================================

-- Kiểm tra số lượng permissions được assign cho mỗi role
SELECT 
    r.name as role_name,
    COUNT(DISTINCT u.id) as user_count,
    COUNT(DISTINCT up.permission_id) as permission_count
FROM `roles` r
LEFT JOIN `users` u ON r.id = u.role_id AND u.deleted_at IS NULL
LEFT JOIN `user_permissions` up ON u.id = up.user_id
GROUP BY r.id, r.name
ORDER BY r.id;

-- Xem chi tiết permissions của từng role
SELECT 
    r.name as role_name,
    u.fullname as user_name,
    u.email,
    COUNT(up.permission_id) as permission_count
FROM `roles` r
LEFT JOIN `users` u ON r.id = u.role_id AND u.deleted_at IS NULL
LEFT JOIN `user_permissions` up ON u.id = up.user_id
GROUP BY r.id, r.name, u.id, u.fullname, u.email
ORDER BY r.id, u.fullname;

-- Xem permissions theo module cho từng role
SELECT 
    r.name as role_name,
    p.module,
    COUNT(DISTINCT up.permission_id) as permission_count
FROM `roles` r
CROSS JOIN `permissions` p
LEFT JOIN `users` u ON r.id = u.role_id AND u.deleted_at IS NULL
LEFT JOIN `user_permissions` up ON u.id = up.user_id AND up.permission_id = p.id
WHERE r.id IN (1, 2, 3, 4, 5)
GROUP BY r.id, r.name, p.module
HAVING permission_count > 0
ORDER BY r.id, p.module;

-- =====================================================
-- 7. NOTES
-- =====================================================

/*
LƯU Ý:

1. Script này sẽ assign permissions cho TẤT CẢ users hiện có
   dựa trên role_id của họ.

2. Sử dụng NOT EXISTS để tránh duplicate entries.

3. granted_by = 1 giả định là Super Admin user ID.

4. Nếu muốn assign permissions cho user cụ thể:
   INSERT INTO `user_permissions` (`user_id`, `permission_id`, `granted_by`) 
   SELECT [user_id], p.id, 1 
   FROM `permissions` p
   WHERE p.name IN ('permission1', 'permission2', ...);

5. Để revoke permissions:
   DELETE FROM `user_permissions` 
   WHERE user_id = [user_id] 
   AND permission_id IN (SELECT id FROM permissions WHERE name IN (...));

6. Để xem permissions của user:
   SELECT p.name, p.description, p.module
   FROM user_permissions up
   JOIN permissions p ON up.permission_id = p.id
   WHERE up.user_id = [user_id]
   ORDER BY p.module, p.name;
*/

