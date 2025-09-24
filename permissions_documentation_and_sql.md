# TÀI LIỆU QUYỀN HẠN VÀ SCRIPT SQL
## Hệ thống Quản lý Câu lạc bộ (Club Management System)

---

## PHẦN 1: GIẢI THÍCH CHI TIẾT CÁC QUYỀN

### 1. NGUYÊN TẮC PHÂN QUYỀN

#### 1.1 Cấu trúc Quyền
```
[module].[action].[scope]
```
- **module**: Tên module (users, posts, events, documents, transactions)
- **action**: Hành động (view, create, edit, delete, publish, approve)
- **scope**: Phạm vi (all, own, public, private, restricted)

#### 1.2 Phân Cấp Quyền
```
Super Admin > Admin > Moderator > Member > Guest
```

---

### 2. CHI TIẾT QUYỀN THEO MODULE

#### MODULE 1: QUẢN LÝ NGƯỜI DÙNG & PHÂN QUYỀN

##### 2.1 Quyền Quản lý Vai trò (Roles)
| Quyền | Mô tả | Ai có quyền |
|-------|-------|-------------|
| `roles.view` | Xem danh sách vai trò | Admin, Super Admin |
| `roles.create` | Tạo vai trò mới | Super Admin |
| `roles.edit` | Chỉnh sửa vai trò | Super Admin |
| `roles.delete` | Xóa vai trò | Super Admin |
| `roles.assign` | Gán vai trò cho user | Super Admin |

##### 2.2 Quyền Quản lý Người dùng (Users)
| Quyền | Mô tả | Ai có quyền |
|-------|-------|-------------|
| `users.view_all` | Xem tất cả người dùng | Admin, Super Admin |
| `users.view` | Xem thông tin người dùng cụ thể | Admin, Moderator |
| `users.create` | Tạo tài khoản mới | Admin, Super Admin |
| `users.edit` | Chỉnh sửa thông tin user | Admin, Super Admin |
| `users.edit_own` | Chỉnh sửa thông tin cá nhân | Tất cả user đã đăng nhập |
| `users.delete` | Xóa tài khoản | Super Admin |
| `users.activate` | Kích hoạt tài khoản | Admin, Super Admin |
| `users.deactivate` | Vô hiệu hóa tài khoản | Admin, Super Admin |
| `users.verify_email` | Xác thực email | System/Admin |
| `users.reset_password` | Reset mật khẩu | Admin, Super Admin |

##### 2.3 Quyền Quản lý Phân quyền (Permissions)
| Quyền | Mô tả | Ai có quyền |
|-------|-------|-------------|
| `permissions.view` | Xem danh sách quyền | Admin, Super Admin |
| `permissions.create` | Tạo quyền mới | Super Admin |
| `permissions.grant` | Cấp quyền cho user | Super Admin |
| `permissions.revoke` | Thu hồi quyền | Super Admin |
| `permissions.view_user` | Xem quyền của user | Admin, Super Admin |

##### 2.4 Quyền Quản lý Đơn xin gia nhập
| Quyền | Mô tả | Ai có quyền |
|-------|-------|-------------|
| `applications.view` | Xem đơn xin gia nhập | Admin, Moderator |
| `applications.create` | Tạo đơn (cho guest) | Guest, Public |
| `applications.review` | Xem xét đơn | Admin, Moderator |
| `applications.approve` | Phê duyệt đơn | Admin |
| `applications.reject` | Từ chối đơn | Admin |
| `applications.interview` | Ghi chú phỏng vấn | Admin, Moderator |

#### MODULE 2: QUẢN LÝ NỘI DUNG

##### 2.5 Quyền Quản lý Bài viết (Posts)
| Quyền | Mô tả | Ai có quyền |
|-------|-------|-------------|
| `posts.view_all` | Xem tất cả bài viết | Admin, Moderator |
| `posts.view_published` | Xem bài viết đã xuất bản | Tất cả |
| `posts.view_draft` | Xem bài viết nháp | Admin, Moderator, Author |
| `posts.create` | Tạo bài viết mới | Member, Moderator, Admin |
| `posts.edit` | Chỉnh sửa bài viết bất kỳ | Admin, Moderator |
| `posts.edit_own` | Chỉnh sửa bài viết của mình | Member (author) |
| `posts.delete` | Xóa bài viết | Admin, Moderator |
| `posts.publish` | Xuất bản bài viết | Moderator, Admin |
| `posts.unpublish` | Hủy xuất bản | Moderator, Admin |

##### 2.6 Quyền Quản lý Bình luận (Comments)
| Quyền | Mô tả | Ai có quyền |
|-------|-------|-------------|
| `comments.view` | Xem bình luận | Tất cả |
| `comments.create` | Tạo bình luận | Member |
| `comments.edit_own` | Sửa bình luận của mình | Member (author) |
| `comments.edit` | Sửa bình luận bất kỳ | Moderator, Admin |
| `comments.delete` | Xóa bình luận | Moderator, Admin |
| `comments.moderate` | Kiểm duyệt bình luận | Moderator, Admin |

#### MODULE 3: QUẢN LÝ SỰ KIỆN

##### 2.7 Quyền Quản lý Sự kiện (Events)
| Quyền | Mô tả | Ai có quyền |
|-------|-------|-------------|
| `events.view_public` | Xem sự kiện công khai | Tất cả |
| `events.view_private` | Xem sự kiện riêng tư | Member |
| `events.view_all` | Xem tất cả sự kiện | Admin, Moderator |
| `events.create` | Tạo sự kiện | Moderator, Admin |
| `events.edit` | Chỉnh sửa sự kiện | Admin, Moderator |
| `events.edit_own` | Sửa sự kiện của mình | Moderator (creator) |
| `events.delete` | Xóa sự kiện | Admin |
| `events.publish` | Xuất bản sự kiện | Moderator, Admin |

##### 2.8 Quyền Điểm danh (Attendances)
| Quyền | Mô tả | Ai có quyền |
|-------|-------|-------------|
| `attendances.view` | Xem danh sách điểm danh | Moderator, Admin |
| `attendances.check_in` | Điểm danh | Moderator, Admin |
| `attendances.export` | Xuất báo cáo điểm danh | Admin |

#### MODULE 4: QUẢN LÝ TÀI LIỆU

##### 2.9 Quyền Quản lý Tài liệu (Documents)
| Quyền | Mô tả | Ai có quyền |
|-------|-------|-------------|
| `documents.view_public` | Xem tài liệu công khai | Tất cả |
| `documents.view_member` | Xem tài liệu thành viên | Member |
| `documents.view_restricted` | Xem tài liệu hạn chế | Được cấp quyền cụ thể |
| `documents.create` | Tải lên tài liệu | Moderator, Admin |
| `documents.edit` | Chỉnh sửa tài liệu | Admin, Moderator |
| `documents.delete` | Xóa tài liệu | Admin |
| `documents.download` | Tải xuống | Theo mức độ truy cập |
| `documents.set_access` | Đặt mức độ truy cập | Admin |

#### MODULE 5: QUẢN LÝ TÀI CHÍNH

##### 2.10 Quyền Quản lý Giao dịch (Transactions)
| Quyền | Mô tả | Ai có quyền |
|-------|-------|-------------|
| `transactions.view` | Xem giao dịch | Admin |
| `transactions.create` | Tạo giao dịch | Admin |
| `transactions.edit` | Sửa giao dịch | Admin |
| `transactions.delete` | Xóa giao dịch | Admin |
| `transactions.export` | Xuất báo cáo | Admin |

---

## PHẦN 2: SCRIPT SQL THÊM DỮ LIỆU

### 1. THÊM DỮ LIỆU VAI TRÒ (ROLES)

```sql
-- Thêm các vai trò cơ bản
INSERT INTO `roles` (`name`, `description`) VALUES
('Super Admin', 'Quản trị viên cấp cao nhất, có tất cả quyền trong hệ thống'),
('Admin', 'Quản trị viên, quản lý hầu hết các chức năng'),
('Moderator', 'Người điều hành, quản lý nội dung và sự kiện'),
('Member', 'Thành viên câu lạc bộ, có quyền truy cập cơ bản'),
('Guest', 'Khách, chỉ có thể xem nội dung công khai');
```

### 2. THÊM DỮ LIỆU QUYỀN (PERMISSIONS)

```sql
-- Module 1: User Management & Permissions
INSERT INTO `permissions` (`name`, `description`, `module`) VALUES
-- Roles Management
('roles.view', 'Xem danh sách vai trò', 'user_management'),
('roles.create', 'Tạo vai trò mới', 'user_management'),
('roles.edit', 'Chỉnh sửa vai trò', 'user_management'),
('roles.delete', 'Xóa vai trò', 'user_management'),
('roles.assign', 'Gán vai trò cho người dùng', 'user_management'),

-- Users Management
('users.view_all', 'Xem danh sách tất cả người dùng', 'user_management'),
('users.view', 'Xem thông tin người dùng', 'user_management'),
('users.create', 'Tạo tài khoản người dùng mới', 'user_management'),
('users.edit', 'Chỉnh sửa thông tin người dùng', 'user_management'),
('users.edit_own', 'Chỉnh sửa thông tin cá nhân', 'user_management'),
('users.delete', 'Xóa tài khoản người dùng', 'user_management'),
('users.activate', 'Kích hoạt tài khoản', 'user_management'),
('users.deactivate', 'Vô hiệu hóa tài khoản', 'user_management'),
('users.verify_email', 'Xác thực email', 'user_management'),
('users.reset_password', 'Đặt lại mật khẩu', 'user_management'),
('users.manage_sessions', 'Quản lý phiên đăng nhập', 'user_management'),

-- Permissions Management
('permissions.view', 'Xem danh sách quyền', 'user_management'),
('permissions.create', 'Tạo quyền mới', 'user_management'),
('permissions.edit', 'Chỉnh sửa quyền', 'user_management'),
('permissions.delete', 'Xóa quyền', 'user_management'),
('permissions.grant', 'Cấp quyền cho người dùng', 'user_management'),
('permissions.revoke', 'Thu hồi quyền từ người dùng', 'user_management'),
('permissions.view_user_permissions', 'Xem quyền của người dùng', 'user_management'),

-- Membership Applications
('applications.view', 'Xem đơn xin gia nhập', 'user_management'),
('applications.create', 'Tạo đơn xin gia nhập', 'user_management'),
('applications.review', 'Xem xét đơn xin gia nhập', 'user_management'),
('applications.approve', 'Phê duyệt đơn', 'user_management'),
('applications.reject', 'Từ chối đơn', 'user_management'),
('applications.interview', 'Thêm ghi chú phỏng vấn', 'user_management'),
('applications.delete', 'Xóa đơn xin gia nhập', 'user_management'),

-- Member Profiles
('members.view', 'Xem hồ sơ thành viên', 'user_management'),
('members.view_all', 'Xem tất cả hồ sơ thành viên', 'user_management'),
('members.create', 'Tạo hồ sơ thành viên mới', 'user_management'),
('members.edit', 'Chỉnh sửa hồ sơ thành viên', 'user_management'),
('members.edit_own', 'Chỉnh sửa hồ sơ cá nhân', 'user_management'),
('members.delete', 'Xóa hồ sơ thành viên', 'user_management'),
('members.restore', 'Khôi phục hồ sơ đã xóa', 'user_management'),

-- Module 2: Content Management
-- Post Categories
('post_categories.view', 'Xem danh mục bài viết', 'content_management'),
('post_categories.create', 'Tạo danh mục mới', 'content_management'),
('post_categories.edit', 'Chỉnh sửa danh mục', 'content_management'),
('post_categories.delete', 'Xóa danh mục', 'content_management'),
('post_categories.restore', 'Khôi phục danh mục đã xóa', 'content_management'),

-- Posts Management
('posts.view', 'Xem bài viết', 'content_management'),
('posts.view_all', 'Xem tất cả bài viết', 'content_management'),
('posts.view_draft', 'Xem bài viết nháp', 'content_management'),
('posts.view_published', 'Xem bài viết đã xuất bản', 'content_management'),
('posts.create', 'Tạo bài viết mới', 'content_management'),
('posts.edit', 'Chỉnh sửa bài viết', 'content_management'),
('posts.edit_own', 'Chỉnh sửa bài viết của mình', 'content_management'),
('posts.delete', 'Xóa bài viết', 'content_management'),
('posts.restore', 'Khôi phục bài viết đã xóa', 'content_management'),
('posts.publish', 'Xuất bản bài viết', 'content_management'),
('posts.unpublish', 'Hủy xuất bản', 'content_management'),
('posts.feature', 'Đặt ảnh nổi bật', 'content_management'),
('posts.seo', 'Quản lý meta description và SEO', 'content_management'),

-- Comments Management
('comments.view', 'Xem bình luận', 'content_management'),
('comments.create', 'Tạo bình luận', 'content_management'),
('comments.edit', 'Chỉnh sửa bình luận', 'content_management'),
('comments.edit_own', 'Chỉnh sửa bình luận của mình', 'content_management'),
('comments.delete', 'Xóa bình luận', 'content_management'),
('comments.moderate', 'Kiểm duyệt bình luận', 'content_management'),
('comments.approve', 'Phê duyệt bình luận', 'content_management'),
('comments.reject', 'Từ chối bình luận', 'content_management'),

-- Tags Management
('tags.view', 'Xem thẻ tag', 'content_management'),
('tags.create', 'Tạo thẻ tag mới', 'content_management'),
('tags.edit', 'Chỉnh sửa thẻ tag', 'content_management'),
('tags.delete', 'Xóa thẻ tag', 'content_management'),
('tags.assign', 'Gán tag cho bài viết', 'content_management'),
('tags.remove', 'Gỡ tag khỏi bài viết', 'content_management'),

-- Questions & Answers
('questions.view', 'Xem câu hỏi', 'content_management'),
('questions.create', 'Tạo câu hỏi mới', 'content_management'),
('questions.edit', 'Chỉnh sửa câu hỏi', 'content_management'),
('questions.edit_own', 'Chỉnh sửa câu hỏi của mình', 'content_management'),
('questions.delete', 'Xóa câu hỏi', 'content_management'),
('questions.publish', 'Xuất bản câu hỏi', 'content_management'),
('questions.moderate', 'Kiểm duyệt câu hỏi', 'content_management'),

('answers.view', 'Xem câu trả lời', 'content_management'),
('answers.create', 'Tạo câu trả lời', 'content_management'),
('answers.edit', 'Chỉnh sửa câu trả lời', 'content_management'),
('answers.edit_own', 'Chỉnh sửa câu trả lời của mình', 'content_management'),
('answers.delete', 'Xóa câu trả lời', 'content_management'),
('answers.vote', 'Vote cho câu trả lời', 'content_management'),
('answers.accept', 'Chấp nhận câu trả lời', 'content_management'),
('answers.moderate', 'Kiểm duyệt câu trả lời', 'content_management'),

-- Module 3: Events Management
('events.view', 'Xem sự kiện', 'event_management'),
('events.view_all', 'Xem tất cả sự kiện', 'event_management'),
('events.view_private', 'Xem sự kiện riêng tư', 'event_management'),
('events.view_public', 'Xem sự kiện công khai', 'event_management'),
('events.create', 'Tạo sự kiện mới', 'event_management'),
('events.edit', 'Chỉnh sửa sự kiện', 'event_management'),
('events.edit_own', 'Chỉnh sửa sự kiện của mình', 'event_management'),
('events.delete', 'Xóa sự kiện', 'event_management'),
('events.publish', 'Xuất bản sự kiện', 'event_management'),
('events.set_private', 'Đặt sự kiện ở chế độ riêng tư', 'event_management'),
('events.manage_registration', 'Quản lý đăng ký tham gia', 'event_management'),

-- Event Registrations
('event_registrations.view', 'Xem danh sách đăng ký', 'event_management'),
('event_registrations.create', 'Tạo đăng ký mới', 'event_management'),
('event_registrations.edit', 'Chỉnh sửa thông tin đăng ký', 'event_management'),
('event_registrations.delete', 'Xóa đăng ký', 'event_management'),
('event_registrations.register_guest', 'Đăng ký cho khách', 'event_management'),
('event_registrations.register_member', 'Đăng ký cho thành viên', 'event_management'),
('event_registrations.export', 'Xuất danh sách đăng ký', 'event_management'),

-- Event Attendances
('attendances.view', 'Xem danh sách điểm danh', 'event_management'),
('attendances.create', 'Tạo bản ghi điểm danh', 'event_management'),
('attendances.edit', 'Chỉnh sửa thông tin điểm danh', 'event_management'),
('attendances.check_in', 'Điểm danh người tham gia', 'event_management'),
('attendances.check_out', 'Điểm danh ra về', 'event_management'),
('attendances.bulk_check_in', 'Điểm danh hàng loạt', 'event_management'),
('attendances.export', 'Xuất báo cáo điểm danh', 'event_management'),

-- Module 4: Document Management
-- Document Categories
('document_categories.view', 'Xem danh mục tài liệu', 'document_management'),
('document_categories.create', 'Tạo danh mục mới', 'document_management'),
('document_categories.edit', 'Chỉnh sửa danh mục', 'document_management'),
('document_categories.delete', 'Xóa danh mục', 'document_management'),
('document_categories.restore', 'Khôi phục danh mục đã xóa', 'document_management'),

-- Documents Management
('documents.view_public', 'Xem tài liệu công khai', 'document_management'),
('documents.view_member', 'Xem tài liệu dành cho thành viên', 'document_management'),
('documents.view_restricted', 'Xem tài liệu hạn chế', 'document_management'),
('documents.view_all', 'Xem tất cả tài liệu', 'document_management'),
('documents.create', 'Tải lên tài liệu mới', 'document_management'),
('documents.edit', 'Chỉnh sửa thông tin tài liệu', 'document_management'),
('documents.edit_own', 'Chỉnh sửa tài liệu của mình', 'document_management'),
('documents.delete', 'Xóa tài liệu', 'document_management'),
('documents.download', 'Tải xuống tài liệu', 'document_management'),
('documents.set_access_level', 'Đặt mức độ truy cập', 'document_management'),
('documents.grant_restricted_access', 'Cấp quyền truy cập hạn chế', 'document_management'),
('documents.revoke_restricted_access', 'Thu hồi quyền truy cập hạn chế', 'document_management'),

-- Module 5: Financial Management
('transactions.view', 'Xem giao dịch', 'financial_management'),
('transactions.view_all', 'Xem tất cả giao dịch', 'financial_management'),
('transactions.create', 'Tạo giao dịch mới', 'financial_management'),
('transactions.edit', 'Chỉnh sửa giao dịch', 'financial_management'),
('transactions.delete', 'Xóa giao dịch', 'financial_management'),
('transactions.export', 'Xuất báo cáo tài chính', 'financial_management'),
('transactions.upload_receipt', 'Tải lên chứng từ', 'financial_management'),
('transactions.approve', 'Phê duyệt giao dịch', 'financial_management');
```

### 3. THÊM NGƯỜI DÙNG MẪU

```sql
-- Thêm người dùng mẫu
INSERT INTO `users` (`fullname`, `email`, `phone`, `password_hash`, `role_id`, `is_active`, `email_verified_at`) VALUES
('Super Admin', 'superadmin@club.com', '0901234567', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, TRUE, NOW()),
('Admin User', 'admin@club.com', '0901234568', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2, TRUE, NOW()),
('Moderator User', 'mod@club.com', '0901234569', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 3, TRUE, NOW()),
('Nguyễn Văn A', 'member1@club.com', '0901234570', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 4, TRUE, NOW()),
('Trần Thị B', 'member2@club.com', '0901234571', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 4, TRUE, NOW()),
('Guest User', 'guest@club.com', '0901234572', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 5, TRUE, NOW());
```

### 4. THÊM HỒ SƠ THÀNH VIÊN

```sql
-- Thêm hồ sơ thành viên cho member
INSERT INTO `member_profiles` (`user_id`, `student_id`, `academic_year`, `course`, `join_date`, `created_by`) VALUES
(4, 'SV001', '2023-09-01', 3, '2024-01-15', 2),
(5, 'SV002', '2022-09-01', 4, '2023-09-10', 2);
```

### 5. THÊM DANH MỤC BÀI VIẾT

```sql
-- Thêm danh mục bài viết
INSERT INTO `post_categories` (`name`, `slug`, `parent_id`, `created_by`) VALUES
('Tin tức', 'tin-tuc', NULL, 2),
('Hoạt động', 'hoat-dong', NULL, 2),
('Thông báo', 'thong-bao', NULL, 2),
('Tin tức câu lạc bộ', 'tin-tuc-clb', 1, 2),
('Tin tức trường', 'tin-tuc-truong', 1, 2),
('Hoạt động ngoại khóa', 'hoat-dong-ngoai-khoa', 2, 2),
('Workshop', 'workshop', 2, 2);
```

### 6. THÊM BÀI VIẾT MẪU

```sql
-- Thêm bài viết mẫu
INSERT INTO `posts` (`title`, `slug`, `content`, `meta_description`, `category_id`, `status`, `published_at`, `created_by`) VALUES
('Chào mừng bạn đến với câu lạc bộ', 'chao-mung-ban-den-voi-cau-lac-bo', 
'<p>Chúng tôi rất vui mừng chào đón các bạn đến với câu lạc bộ. Đây là nơi các bạn có thể học hỏi, giao lưu và phát triển kỹ năng.</p>', 
'Bài viết chào mừng thành viên mới', 1, 1, NOW(), 3),

('Workshop lập trình web sắp tới', 'workshop-lap-trinh-web-sap-toi',
'<p>Câu lạc bộ sẽ tổ chức workshop lập trình web vào cuối tuần này. Các bạn quan tâm hãy đăng ký tham gia.</p>',
'Thông tin workshop lập trình web', 7, 1, NOW(), 3),

('Thông báo nghỉ lễ', 'thong-bao-nghi-le',
'<p>Câu lạc bộ sẽ nghỉ hoạt động trong dịp lễ 30/4 - 1/5. Chúc các bạn nghỉ lễ vui vẻ!</p>',
'Thông báo lịch nghỉ lễ', 3, 1, NOW(), 2);
```

### 7. THÊM TAGS

```sql
-- Thêm tags
INSERT INTO `tags` (`name`, `slug`, `meta_description`, `created_by`) VALUES
('Lập trình', 'lap-trinh', 'Các bài viết về lập trình và công nghệ', 2),
('Workshop', 'workshop', 'Các workshop và buổi đào tạo', 2),
('Sự kiện', 'su-kien', 'Các sự kiện của câu lạc bộ', 2),
('Thông báo', 'thong-bao', 'Các thông báo quan trọng', 2),
('Web Development', 'web-development', 'Phát triển ứng dụng web', 2),
('Mobile App', 'mobile-app', 'Phát triển ứng dụng di động', 2),
('AI/ML', 'ai-ml', 'Trí tuệ nhân tạo và Machine Learning', 2),
('Blockchain', 'blockchain', 'Công nghệ Blockchain', 2);

-- Gán tags cho bài viết
INSERT INTO `post_tags` (`post_id`, `tag_id`) VALUES
(1, 4), -- Bài chào mừng - tag Thông báo
(2, 1), -- Workshop lập trình - tag Lập trình
(2, 2), -- Workshop lập trình - tag Workshop
(2, 5), -- Workshop lập trình - tag Web Development
(3, 4); -- Thông báo nghỉ lễ - tag Thông báo
```

### 8. THÊM SỰ KIỆN MẪU

```sql
-- Thêm sự kiện mẫu
INSERT INTO `events` (`title`, `slug`, `content`, `featured_image`, `meta_description`, `start_time`, `end_time`, `location`, `max_participants`, `registration_deadline`, `status`, `is_public`, `created_by`) VALUES
('Workshop Lập trình Web với React', 'workshop-lap-trinh-web-react', 
'<p>Khóa học cơ bản về React.js dành cho người mới bắt đầu. Các bạn sẽ học cách tạo component, quản lý state và tích hợp API.</p>',
'/images/events/react-workshop.jpg',
'Workshop học React.js cơ bản', 
'2024-12-15 14:00:00', '2024-12-15 17:00:00', 
'Phòng Lab A101, Tòa nhà Công nghệ thông tin', 30, '2024-12-13 23:59:59', 1, TRUE, 3),

('Hackathon 2024', 'hackathon-2024',
'<p>Cuộc thi lập trình 48 giờ với chủ đề "Công nghệ vì cộng đồng". Giải thưởng hấp dẫn cho các đội thắng cuộc.</p>',
'/images/events/hackathon-2024.jpg',
'Hackathon lập trình 2024',
'2024-12-20 18:00:00', '2024-12-22 18:00:00',
'Hội trường lớn, Tòa nhà chính', 100, '2024-12-18 23:59:59', 1, TRUE, 2),

('Họp câu lạc bộ tháng 12', 'hop-cau-lac-bo-thang-12',
'<p>Họp định kỳ tháng 12, báo cáo hoạt động và kế hoạch cho năm mới.</p>',
NULL, 'Họp câu lạc bộ định kỳ',
'2024-12-10 19:00:00', '2024-12-10 21:00:00',
'Phòng họp B205', 50, '2024-12-08 23:59:59', 1, FALSE, 3);
```

### 9. THÊM ĐĂNG KÝ SỰ KIỆN

```sql
-- Thêm đăng ký sự kiện
INSERT INTO `event_registrations` (`event_id`, `user_id`, `registration_type`, `notes`) VALUES
(1, 4, 'private', 'Rất mong được tham gia workshop React'),
(1, 5, 'private', 'Muốn học thêm về frontend development'),
(2, 4, 'private', 'Đã có kinh nghiệm lập trình 2 năm'),
(2, 5, 'private', 'Lần đầu tham gia hackathon'),
(3, 4, 'private', NULL),
(3, 5, 'private', NULL);

-- Thêm đăng ký khách (guest registration)
INSERT INTO `event_registrations` (`event_id`, `user_id`, `registration_type`, `guest_name`, `guest_email`, `guest_phone`, `notes`) VALUES
(1, NULL, 'public', 'Nguyễn Văn C', 'nguyenvanc@gmail.com', '0901234573', 'Sinh viên IT K65'),
(2, NULL, 'public', 'Trần Thị D', 'tranthid@gmail.com', '0901234574', 'Freelancer developer');
```

### 10. THÊM ĐIỂM DANH

```sql
-- Thêm điểm danh cho sự kiện
INSERT INTO `event_attendances` (`user_id`, `event_id`, `registration_id`, `checked_in`, `check_in_time`, `checked_in_by`, `notes`) VALUES
(4, 1, 1, TRUE, '2024-12-15 13:45:00', 3, 'Đến đúng giờ'),
(5, 1, 2, TRUE, '2024-12-15 14:10:00', 3, 'Đến muộn 10 phút'),
(4, 3, 5, TRUE, '2024-12-10 18:55:00', 2, 'Đến sớm'),
(5, 3, 6, FALSE, NULL, NULL, 'Vắng mặt không phép');
```

### 11. THÊM DANH MỤC TÀI LIỆU

```sql
-- Thêm danh mục tài liệu
INSERT INTO `document_categories` (`name`, `slug`, `parent_id`, `created_by`) VALUES
('Tài liệu học tập', 'tai-lieu-hoc-tap', NULL, 2),
('Slide bài giảng', 'slide-bai-giang', NULL, 2),
('Quy định', 'quy-dinh', NULL, 2),
('Báo cáo', 'bao-cao', NULL, 2),
('Lập trình Web', 'lap-trinh-web', 1, 2),
('Lập trình Mobile', 'lap-trinh-mobile', 1, 2),
('Data Science', 'data-science', 1, 2),
('Workshop Slides', 'workshop-slides', 2, 2);
```

### 12. THÊM TÀI LIỆU

```sql
-- Thêm tài liệu
INSERT INTO `documents` (`title`, `slug`, `description`, `file_url`, `preview_url`, `category_id`, `access_level`, `status`, `created_by`) VALUES
('Quy định câu lạc bộ', 'quy-dinh-cau-lac-bo', 
'Quy định chung về hoạt động và quyền lợi thành viên câu lạc bộ',
'/documents/quy-dinh-clb.pdf', '/documents/preview/quy-dinh-clb.jpg',
3, 'public', 1, 2),

('Slide Workshop React Cơ bản', 'slide-workshop-react-co-ban',
'Slide bài giảng workshop React.js cơ bản cho người mới bắt đầu',
'/documents/react-basic-workshop.pdf', '/documents/preview/react-basic-workshop.jpg',
8, 'member_only', 1, 3),

('Hướng dẫn lập trình Node.js', 'huong-dan-lap-trinh-nodejs',
'Tài liệu chi tiết về lập trình backend với Node.js và Express',
'/documents/nodejs-guide.pdf', '/documents/preview/nodejs-guide.jpg',
5, 'member_only', 1, 3),

('Báo cáo hoạt động Q3/2024', 'bao-cao-hoat-dong-q3-2024',
'Báo cáo tổng kết các hoạt động câu lạc bộ trong quý 3 năm 2024',
'/documents/report-q3-2024.pdf', '/documents/preview/report-q3-2024.jpg',
4, 'restricted', 1, 2),

('Tài liệu Machine Learning nâng cao', 'tai-lieu-machine-learning-nang-cao',
'Tài liệu chuyên sâu về các thuật toán Machine Learning',
'/documents/ml-advanced.pdf', '/documents/preview/ml-advanced.jpg',
7, 'restricted', 1, 2);
```

### 13. CẤP QUYỀN TRUY CẬP TÀI LIỆU HẠN CHẾ

```sql
-- Cấp quyền truy cập tài liệu hạn chế
INSERT INTO `document_restricted_users` (`document_id`, `user_id`, `granted_by`) VALUES
(4, 1, 2), -- Super Admin có thể xem báo cáo Q3
(4, 3, 2), -- Moderator có thể xem báo cáo Q3
(5, 1, 2), -- Super Admin có thể xem tài liệu ML nâng cao
(5, 4, 2); -- Member 1 được cấp quyền xem tài liệu ML nâng cao
```

### 14. THÊM GIAO DỊCH TÀI CHÍNH

```sql
-- Thêm giao dịch tài chính (1: Thu, 0: Chi)
INSERT INTO `transactions` (`amount`, `type`, `description`, `attachment_url`, `created_by`) VALUES
(500000, 1, 'Thu phí thành viên tháng 12/2024 - Nguyễn Văn A', '/receipts/fee-member-a-dec2024.jpg', 2),
(500000, 1, 'Thu phí thành viên tháng 12/2024 - Trần Thị B', '/receipts/fee-member-b-dec2024.jpg', 2),
(300000, 0, 'Mua thiết bị workshop - Webcam và micro', '/receipts/equipment-purchase-dec2024.jpg', 2),
(150000, 0, 'Chi phí in ấn tài liệu workshop React', '/receipts/printing-react-materials.jpg', 3),
(2000000, 1, 'Tài trợ từ công ty ABC cho Hackathon 2024', '/receipts/sponsor-abc-hackathon2024.jpg', 2),
(800000, 0, 'Chi phí tổ chức Hackathon 2024 - Giải thưởng', '/receipts/hackathon-prizes-2024.jpg', 2),
(200000, 0, 'Chi phí refreshment cho workshop', '/receipts/refreshment-workshop.jpg', 3);
```

### 15. THÊM CÂU HỎI VÀ TRẢ LỜI

```sql
-- Thêm câu hỏi
INSERT INTO `questions` (`title`, `slug`, `content`, `meta_description`, `status`, `created_by`) VALUES
('Làm thế nào để tham gia câu lạc bộ?', 'lam-the-nao-de-tham-gia-cau-lac-bo',
'<p>Em là sinh viên năm 2, muốn tham gia câu lạc bộ. Em cần làm gì và có điều kiện gì không ạ?</p>',
'Hướng dẫn tham gia câu lạc bộ', 1, 4),

('React hooks khác gì so với class component?', 'react-hooks-khac-gi-so-voi-class-component',
'<p>Em mới học React và thấy có 2 cách viết component. Cho em hỏi hooks khác gì so với class component và nên dùng cái nào ạ?</p>',
'So sánh React hooks và class component', 1, 5),

('Câu lạc bộ có tổ chức khóa học nào không?', 'cau-lac-bo-co-to-chuc-khoa-hoc-nao-khong',
'<p>Em muốn học thêm về lập trình web. Câu lạc bộ có tổ chức khóa học hay workshop nào không ạ?</p>',
'Thông tin khóa học của câu lạc bộ', 1, 4);

-- Thêm câu trả lời
INSERT INTO `answers` (`content`, `question_id`, `status`, `vote_score`, `is_accepted`, `created_by`) VALUES
('<p>Chào bạn! Để tham gia câu lạc bộ, bạn chỉ cần:</p>
<ol>
<li>Điền form đăng ký trên website</li>
<li>Tham gia buổi phỏng vấn ngắn (15-20 phút)</li>
<li>Có tinh thần học hỏi và nhiệt tình</li>
</ol>
<p>Không có điều kiện gì đặc biệt, chỉ cần bạn yêu thích công nghệ!</p>', 1, 1, 5, TRUE, 3),

('<p>React Hooks được giới thiệu từ phiên bản 16.8 với nhiều ưu điểm:</p>
<h3>Hooks:</h3>
<ul>
<li>Code ngắn gọn hơn</li>
<li>Dễ test và tái sử dụng logic</li>
<li>Không cần bind this</li>
<li>useState, useEffect rất tiện dụng</li>
</ul>
<h3>Class Component:</h3>
<ul>
<li>Cách viết truyền thống</li>
<li>Lifecycle methods rõ ràng</li>
<li>Phù hợp với logic phức tạp</li>
</ul>
<p>Hiện tại khuyến khích dùng Hooks cho dự án mới.</p>', 2, 1, 8, TRUE, 3),

('<p>Câu lạc bộ thường xuyên tổ chức:</p>
<ul>
<li>Workshop hàng tuần (React, Node.js, Python...)</li>
<li>Hackathon mỗi quý</li>
<li>Bootcamp trong hè</li>
<li>Sharing session từ các thành viên</li>
</ul>
<p>Bạn có thể theo dõi lịch sự kiện trên website hoặc tham gia group Telegram của club nhé!</p>', 3, 1, 3, TRUE, 2);

-- Thêm một số câu trả lời thêm (không được chấp nhận)
INSERT INTO `answers` (`content`, `question_id`, `status`, `vote_score`, `is_accepted`, `created_by`) VALUES
('<p>Ngoài cách trên, bạn cũng có thể liên hệ trực tiếp qua fanpage Facebook hoặc email của câu lạc bộ.</p>', 1, 1, 2, FALSE, 4),
('<p>Theo mình thì nên học Class component trước để hiểu rõ lifecycle, sau đó chuyển sang Hooks.</p>', 2, 1, 1, FALSE, 5);
```

### 16. THÊM BÌNH LUẬN

```sql
-- Thêm bình luận cho bài viết
INSERT INTO `post_comments` (`content`, `author_id`, `post_id`, `parent_id`, `status`) VALUES
('Cảm ơn câu lạc bộ đã chào đón! Em rất mong được tham gia các hoạt động.', 4, 1, NULL, 1),
('Workshop này có phù hợp cho người mới bắt đầu không ạ?', 5, 2, NULL, 1),
('Có phù hợp bạn nhé! Workshop sẽ bắt đầu từ cơ bản.', 3, 2, 2, 1),
('Câu lạc bộ nghỉ lễ từ ngày nào đến ngày nào vậy ạ?', 4, 3, NULL, 1),
('Từ 30/4 đến hết 1/5 bạn nhé. Sau đó hoạt động bình thường.', 2, 3, 4, 1);
```

### 17. THÊM ĐƠN XIN GIA NHẬP

```sql
-- Thêm đơn xin gia nhập mẫu (status: 0-Pending, 1-Approved, 2-Rejected)
INSERT INTO `membership_applications` (`email`, `phone`, `fullname`, `student_year`, `major`, `interview_notes`, `status`) VALUES
('newmember1@student.hust.edu.vn', '0987654321', 'Lê Văn E', 'K66', 'Công nghệ thông tin', 'Có kinh nghiệm lập trình Java, rất nhiệt tình', 0),
('newmember2@student.hust.edu.vn', '0987654322', 'Phạm Thị F', 'K67', 'Khoa học máy tính', 'Mới học lập trình nhưng rất có động lực', 0),
('approved@student.hust.edu.vn', '0987654323', 'Hoàng Văn G', 'K65', 'An toàn thông tin', 'Đã approved và tạo tài khoản', 1),
('rejected@student.hust.edu.vn', '0987654324', 'Ngô Thị H', 'K68', 'Điện tử viễn thông', 'Không đủ thời gian tham gia hoạt động', 2);
```

### 18. PHÂN QUYỀN CHO NGƯỜI DÙNG

```sql
-- Cấp quyền cho Super Admin (tất cả quyền)
INSERT INTO `user_permissions` (`user_id`, `permission_id`, `granted_by`) 
SELECT 1, p.id, 1 FROM `permissions` p;

-- Cấp quyền cho Admin (hầu hết quyền, trừ quản lý vai trò)
INSERT INTO `user_permissions` (`user_id`, `permission_id`, `granted_by`) 
SELECT 2, p.id, 1 FROM `permissions` p 
WHERE p.name NOT LIKE 'roles.%' OR p.name = 'roles.view';

-- Cấp quyền cho Moderator
INSERT INTO `user_permissions` (`user_id`, `permission_id`, `granted_by`) 
SELECT 3, p.id, 1 FROM `permissions` p 
WHERE p.name IN (
    -- Content Management
    'posts.view_all', 'posts.create', 'posts.edit', 'posts.edit_own', 'posts.publish', 'posts.unpublish',
    'comments.view', 'comments.create', 'comments.edit', 'comments.edit_own', 'comments.moderate',
    'tags.view', 'tags.create', 'tags.edit', 'tags.assign',
    'questions.view', 'questions.create', 'questions.edit_own', 'questions.moderate',
    'answers.view', 'answers.create', 'answers.edit_own', 'answers.moderate',
    
    -- Event Management
    'events.view_all', 'events.create', 'events.edit', 'events.edit_own', 'events.publish',
    'event_registrations.view', 'event_registrations.create',
    'attendances.view', 'attendances.check_in', 'attendances.export',
    
    -- Document Management
    'documents.view_all', 'documents.create', 'documents.edit', 'documents.edit_own',
    'document_categories.view', 'document_categories.create', 'document_categories.edit',
    
    -- User Management (limited)
    'users.view', 'users.edit_own', 'applications.view', 'applications.review', 'members.view_all'
);

-- Cấp quyền cho Member
INSERT INTO `user_permissions` (`user_id`, `permission_id`, `granted_by`) 
SELECT u.id, p.id, 1 FROM `users` u, `permissions` p 
WHERE u.role_id = 4 AND p.name IN (
    -- Basic content permissions
    'posts.view_published', 'posts.create', 'posts.edit_own',
    'comments.view', 'comments.create', 'comments.edit_own',
    'questions.view', 'questions.create', 'questions.edit_own',
    'answers.view', 'answers.create', 'answers.edit_own', 'answers.vote', 'answers.accept',
    
    -- Event permissions
    'events.view_public', 'events.view_private',
    'event_registrations.create', 'event_registrations.register_member',
    
    -- Document permissions
    'documents.view_public', 'documents.view_member', 'documents.download',
    
    -- User permissions
    'users.edit_own', 'members.edit_own'
);
```

### 19. SCRIPT KIỂM TRA DỮ LIỆU

```sql
-- Kiểm tra số lượng bản ghi trong các bảng chính
SELECT 
    'roles' as table_name, COUNT(*) as record_count FROM roles
UNION ALL SELECT 
    'users', COUNT(*) FROM users
UNION ALL SELECT 
    'permissions', COUNT(*) FROM permissions
UNION ALL SELECT 
    'user_permissions', COUNT(*) FROM user_permissions
UNION ALL SELECT 
    'posts', COUNT(*) FROM posts
UNION ALL SELECT 
    'events', COUNT(*) FROM events
UNION ALL SELECT 
    'documents', COUNT(*) FROM documents
UNION ALL SELECT 
    'transactions', COUNT(*) FROM transactions;

-- Kiểm tra quyền của từng vai trò
SELECT 
    r.name as role_name,
    u.fullname as user_name,
    COUNT(up.permission_id) as permission_count
FROM roles r
LEFT JOIN users u ON r.id = u.role_id
LEFT JOIN user_permissions up ON u.id = up.user_id
GROUP BY r.id, u.id
ORDER BY r.id, u.id;

-- Kiểm tra số lượng nội dung theo trạng thái
SELECT 
    'Posts' as content_type,
    CASE 
        WHEN status = 0 THEN 'Draft'
        WHEN status = 1 THEN 'Published'
        ELSE 'Other'
    END as status_name,
    COUNT(*) as count
FROM posts
GROUP BY status
UNION ALL
SELECT 
    'Events',
    CASE 
        WHEN status = 0 THEN 'Draft'
        WHEN status = 1 THEN 'Published'
        ELSE 'Other'
    END,
    COUNT(*)
FROM events
GROUP BY status
UNION ALL
SELECT 
    'Documents',
    CASE 
        WHEN status = 0 THEN 'Draft'
        WHEN status = 1 THEN 'Published'
        ELSE 'Other'
    END,
    COUNT(*)
FROM documents
GROUP BY status;
```

---

## PHẦN 3: HƯỚNG DẪN SỬ DỤNG

### 1. Cách chạy script

```bash
# 1. Chạy schema ban đầu
mysql -u username -p database_name < nes.sql

# 2. Chạy script thêm dữ liệu
mysql -u username -p database_name < insert_sample_data.sql
```

### 2. Kiểm tra quyền trong ứng dụng

```php
// Ví dụ function kiểm tra quyền
function hasPermission($userId, $permission) {
    $sql = "SELECT COUNT(*) as count 
            FROM user_permissions up 
            JOIN permissions p ON up.permission_id = p.id 
            WHERE up.user_id = ? AND p.name = ?";
    // Execute query and return boolean
}

// Sử dụng
if (hasPermission($userId, 'posts.create')) {
    // Cho phép tạo bài viết
}
```

### 3. Middleware phân quyền

```javascript
// Express.js middleware example
const checkPermission = (permission) => {
  return async (req, res, next) => {
    const userId = req.user.id;
    const hasAccess = await checkUserPermission(userId, permission);
    
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    next();
  };
};

// Sử dụng
app.post('/api/posts', checkPermission('posts.create'), createPost);
app.delete('/api/posts/:id', checkPermission('posts.delete'), deletePost);
```

---

## PHẦN 4: LƯU Ý BẢO MẬT

### 1. Nguyên tắc bảo mật
- **Principle of Least Privilege**: Chỉ cấp quyền tối thiểu cần thiết
- **Role-based Access Control**: Sử dụng vai trò làm cơ sở phân quyền
- **Audit Trail**: Theo dõi ai cấp quyền và khi nào
- **Regular Review**: Định kỳ review và thu hồi quyền không cần thiết

### 2. Xử lý lỗi bảo mật
- Không expose thông tin nhạy cảm trong error message
- Log các attempt truy cập trái phép
- Implement rate limiting cho các API quan trọng
- Validate input thoroughly

### 3. Monitoring và Logging
```sql
-- Bảng log hoạt động (nên thêm vào schema)
CREATE TABLE activity_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED,
    action VARCHAR(100),
    resource_type VARCHAR(50),
    resource_id BIGINT UNSIGNED,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

Hệ thống phân quyền này cung cấp sự linh hoạt cao và bảo mật tốt cho việc quản lý câu lạc bộ. Các quyền được thiết kế chi tiết theo từng module và chức năng cụ thể.