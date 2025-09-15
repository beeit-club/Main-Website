-- ================================================================
-- CLUB MANAGEMENT SYSTEM DATABASE SCHEMA
-- Hệ thống Quản lý Câu lạc bộ - Database thiết kế tối ưu
-- ================================================================

-- ================================================================
-- MODULE 1: QUẢN LÝ NGƯỜI DÙNG & PHÂN QUYỀN (Authentication & Authorization)
-- ================================================================

-- Bảng vai trò - Định nghĩa các vai trò trong hệ thống (Guest, Member, Board, Admin)
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,                    -- Tên vai trò (ví dụ: 'Thành viên', 'Ban chủ nhiệm', 'Quản trị viên')
    description TEXT,                              -- Mô tả chi tiết về vai trò
    created_at TIMESTAMPTZ DEFAULT NOW(),         -- Thời gian tạo bản ghi
    updated_at TIMESTAMPTZ DEFAULT NOW()          -- Thời gian cập nhật cuối
);

-- Bảng người dùng chính - Lưu thông tin tài khoản cơ bản của người dùng
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    fullname VARCHAR(255) NOT NULL,               -- Họ và tên đầy đủ
    email VARCHAR(255) UNIQUE NOT NULL,           -- Email đăng nhập (duy nhất)
    phone VARCHAR(20),                            -- Số điện thoại
    password_hash VARCHAR(255),                   -- Mật khẩu đã mã hóa (dùng cho đăng nhập email)
    google_id VARCHAR(255) UNIQUE,                -- ID Google (dùng cho OAuth)
    avatar_url TEXT,                              -- Link ảnh đại diện
    bio TEXT,                                     -- Giới thiệu bản thân
    role_id BIGINT REFERENCES roles(id),          -- Khóa ngoại tham chiếu đến vai trò
    is_active BOOLEAN DEFAULT true,               -- Trạng thái tài khoản (true=hoạt động, false=khóa)
    email_verified_at TIMESTAMPTZ,               -- Thời gian xác thực email
    created_at TIMESTAMPTZ DEFAULT NOW(),         -- Thời gian đăng ký tài khoản
    updated_at TIMESTAMPTZ DEFAULT NOW(),         -- Thời gian cập nhật cuối
    deleted_at TIMESTAMPTZ                        -- Thời gian xóa (hỗ trợ soft delete)
);

-- Bảng quyền hạn - Định nghĩa các quyền cụ thể trong hệ thống
CREATE TABLE permissions (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,            -- Tên quyền (ví dụ: 'post:create', 'event:approve')
    description TEXT NOT NULL,                    -- Mô tả chi tiết quyền hạn
    module VARCHAR(50),                           -- Module liên quan (ví dụ: 'posts', 'events', 'users')
    created_at TIMESTAMPTZ DEFAULT NOW()          -- Thời gian tạo bản ghi
);

-- Bảng phân quyền người dùng - Gán quyền cụ thể cho từng người dùng
CREATE TABLE user_permissions (
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,      -- ID người dùng
    permission_id BIGINT REFERENCES permissions(id) ON DELETE CASCADE,  -- ID quyền hạn
    granted_at TIMESTAMPTZ DEFAULT NOW(),                       -- Thời gian cấp quyền
    granted_by BIGINT REFERENCES users(id),                     -- Người cấp quyền
    PRIMARY KEY (user_id, permission_id)                        -- Khóa chính kép đảm bảo không trùng quyền
);

-- Bảng đơn xin gia nhập - Lưu thông tin đăng ký thành viên CLB
CREATE TABLE membership_applications (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,                  -- Email của người đăng ký
    phone VARCHAR(20),                            -- Số điện thoại
    fullname VARCHAR(255) NOT NULL,               -- Họ và tên
    student_year VARCHAR(10),                     -- Khóa học (ví dụ: K17, K18...)
    major VARCHAR(100),                           -- Chuyên ngành
    interview_notes TEXT,                         -- Ghi chú phỏng vấn
    status INTEGER DEFAULT 2,                     -- Trạng thái: 0=rejected, 1=approved, 2=pending
    created_at TIMESTAMPTZ DEFAULT NOW(),         -- Thời gian nộp đơn
    updated_at TIMESTAMPTZ DEFAULT NOW()          -- Thời gian cập nhật cuối
);

-- Bảng hồ sơ thành viên chính thức - Thông tin chi tiết của thành viên CLB
CREATE TABLE member_profiles (
    user_id BIGINT PRIMARY KEY REFERENCES users(id),           -- ID người dùng (khóa chính, tham chiếu bảng users)
    student_id VARCHAR(20) UNIQUE NOT NULL,                    -- Mã số sinh viên (duy nhất)
    academic_year DATE,                                        -- Năm học nhập trường
    course INTEGER,                                            -- Khóa học (17, 18, 19...)
    join_date DATE DEFAULT CURRENT_DATE,                       -- Ngày gia nhập CLB
    created_by BIGINT REFERENCES users(id),                    -- Người tạo hồ sơ
    updated_by BIGINT REFERENCES users(id),                    -- Người cập nhật cuối
    created_at TIMESTAMPTZ DEFAULT NOW(),                      -- Thời gian tạo
    updated_at TIMESTAMPTZ DEFAULT NOW(),                      -- Thời gian cập nhật cuối
    deleted_at TIMESTAMPTZ                                     -- Thời gian xóa (hỗ trợ soft delete)
);

-- ================================================================
-- MODULE 2: QUẢN LÝ NỘI DUNG & TƯƠNG TÁC (Content Management)
-- ================================================================

-- Bảng danh mục bài viết - Phân loại nội dung bài viết
CREATE TABLE post_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,                   -- Tên danh mục (ví dụ: 'Tin tức', 'Hướng dẫn')
    slug VARCHAR(255) UNIQUE NOT NULL,            -- URL slug (SEO friendly)
    parent_id BIGINT REFERENCES post_categories(id), -- Danh mục cha (hỗ trợ phân cấp)
    created_by BIGINT REFERENCES users(id),       -- Người tạo danh mục
    updated_by BIGINT REFERENCES users(id),       -- Người cập nhật cuối
    created_at TIMESTAMPTZ DEFAULT NOW(),         -- Thời gian tạo
    updated_at TIMESTAMPTZ DEFAULT NOW(),         -- Thời gian cập nhật cuối
    deleted_at TIMESTAMPTZ                        -- Thời gian xóa (hỗ trợ soft delete)
);

-- Bảng bài viết chính - Lưu nội dung bài đăng
CREATE TABLE posts (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,                  -- Tiêu đề bài viết
    slug VARCHAR(500) UNIQUE NOT NULL,            -- URL slug (SEO friendly)
    content TEXT NOT NULL,                        -- Nội dung bài viết (HTML từ trình soạn thảo WYSIWYG)
    featured_image TEXT,                          -- Link ảnh đại diện bài viết
    meta_description VARCHAR(160),                -- Mô tả SEO (meta description)
    category_id BIGINT REFERENCES post_categories(id), -- Danh mục bài viết
    status INTEGER DEFAULT 0,                     -- Trạng thái: 0=archived, 1=published
    view_count INTEGER DEFAULT 0,                -- Số lượt xem
    published_at TIMESTAMPTZ,                     -- Thời gian xuất bản
    created_by BIGINT REFERENCES users(id),       -- Tác giả bài viết
    updated_by BIGINT REFERENCES users(id),       -- Người cập nhật cuối
    created_at TIMESTAMPTZ DEFAULT NOW(),         -- Thời gian tạo
    updated_at TIMESTAMPTZ DEFAULT NOW(),         -- Thời gian cập nhật cuối
    deleted_at TIMESTAMPTZ                        -- Thời gian xóa (hỗ trợ soft delete)
);

-- Bảng bình luận bài viết - Hệ thống bình luận cho bài viết
CREATE TABLE post_comments (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,                        -- Nội dung bình luận
    author_id BIGINT REFERENCES users(id),        -- Tác giả bình luận
    post_id BIGINT REFERENCES posts(id),          -- Bài viết được bình luận
    parent_id BIGINT REFERENCES post_comments(id), -- Bình luận cha (hỗ trợ reply đa cấp)
    status INTEGER DEFAULT 1,                     -- Trạng thái: 0=hidden, 1=active
    updated_by BIGINT REFERENCES users(id),       -- Người cập nhật cuối
    created_at TIMESTAMPTZ DEFAULT NOW(),         -- Thời gian tạo
    updated_at TIMESTAMPTZ DEFAULT NOW(),         -- Thời gian cập nhật cuối
    deleted_at TIMESTAMPTZ                        -- Thời gian xóa (hỗ trợ soft delete)
);

-- Bảng thẻ tag - Gắn thẻ cho bài viết
CREATE TABLE tags (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,            -- Tên thẻ (ví dụ: 'sự kiện', 'tài liệu')
    slug VARCHAR(100) UNIQUE NOT NULL,            -- URL slug
    meta_description VARCHAR(160) NOT NULL,       -- Mô tả SEO của thẻ
    created_at TIMESTAMPTZ DEFAULT NOW(),         -- Thời gian tạo
    updated_at TIMESTAMPTZ DEFAULT NOW(),         -- Thời gian cập nhật cuối
    created_by BIGINT REFERENCES users(id),       -- Người tạo thẻ
    updated_by BIGINT REFERENCES users(id),       -- Người cập nhật cuối
    deleted_at TIMESTAMPTZ                        -- Thời gian xóa (hỗ trợ soft delete)
);

-- Bảng liên kết bài viết - thẻ tag (Many-to-Many)
CREATE TABLE post_tags (
    post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,     -- ID bài viết
    tag_id BIGINT REFERENCES tags(id) ON DELETE CASCADE,       -- ID thẻ tag
    PRIMARY KEY (post_id, tag_id)                              -- Khóa chính kép
);

-- Bảng câu hỏi - Hệ thống hỏi đáp (Q&A) kiểu Stack Overflow
CREATE TABLE questions (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,                  -- Tiêu đề câu hỏi
    slug VARCHAR(500) UNIQUE NOT NULL,            -- URL slug
    content TEXT NOT NULL,                        -- Nội dung câu hỏi
    meta_description VARCHAR(160),                -- Mô tả SEO
    status INTEGER DEFAULT 0,                     -- Trạng thái: 0=open, 1=closed, 2=resolved
    view_count INTEGER DEFAULT 0,                -- Số lượt xem
    created_by BIGINT REFERENCES users(id),       -- Người đặt câu hỏi
    updated_by BIGINT REFERENCES users(id),       -- Người cập nhật cuối
    created_at TIMESTAMPTZ DEFAULT NOW(),         -- Thời gian tạo
    updated_at TIMESTAMPTZ DEFAULT NOW(),         -- Thời gian cập nhật cuối
    deleted_at TIMESTAMPTZ                        -- Thời gian xóa (hỗ trợ soft delete)
);

-- Bảng câu trả lời - Trả lời cho các câu hỏi trong hệ thống Q&A
CREATE TABLE answers (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,                        -- Nội dung câu trả lời
    question_id BIGINT REFERENCES questions(id),  -- Câu hỏi được trả lời
    status INTEGER DEFAULT 1,                     -- Trạng thái: 0=hidden, 1=active
    vote_score INTEGER DEFAULT 0,                -- Điểm vote (upvote/downvote)
    is_accepted BOOLEAN DEFAULT false,            -- Được chọn là câu trả lời tốt nhất
    parent_id BIGINT REFERENCES answers(id),      -- Trả lời cha (hỗ trợ reply)
    created_by BIGINT REFERENCES users(id),       -- Tác giả câu trả lời
    updated_by BIGINT REFERENCES users(id),       -- Người cập nhật cuối
    created_at TIMESTAMPTZ DEFAULT NOW(),         -- Thời gian tạo
    updated_at TIMESTAMPTZ DEFAULT NOW(),         -- Thời gian cập nhật cuối
    deleted_at TIMESTAMPTZ                        -- Thời gian xóa (hỗ trợ soft delete)
);

-- ================================================================
-- MODULE 3: QUẢN LÝ SỰ KIỆN & CÔNG VIỆC (Event & Task Management)
-- ================================================================

-- Bảng sự kiện CLB - Quản lý các hoạt động/sự kiện của CLB
CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,                  -- Tên sự kiện
    slug VARCHAR(500) UNIQUE NOT NULL,            -- URL slug
    content TEXT,                                 -- Mô tả chi tiết sự kiện
    featured_image TEXT,                          -- Link ảnh đại diện
    meta_description VARCHAR(160),                -- Mô tả SEO
    start_time TIMESTAMPTZ NOT NULL,              -- Thời gian bắt đầu
    end_time TIMESTAMPTZ NOT NULL,                -- Thời gian kết thúc
    location TEXT,                                -- Địa điểm tổ chức
    max_participants INTEGER,                     -- Giới hạn số người tham gia
    registration_deadline TIMESTAMPTZ,           -- Hạn đăng ký
    status INTEGER DEFAULT 0,                     -- Trạng thái: 0=draft, 1=published, 2=cancelled, 3=completed
    is_public BOOLEAN DEFAULT true,               -- Có hiển thị công khai không
    created_by BIGINT REFERENCES users(id),       -- Người tạo sự kiện
    updated_by BIGINT REFERENCES users(id),       -- Người cập nhật cuối
    created_at TIMESTAMPTZ DEFAULT NOW(),         -- Thời gian tạo
    updated_at TIMESTAMPTZ DEFAULT NOW(),         -- Thời gian cập nhật cuối
    deleted_at TIMESTAMPTZ                        -- Thời gian xóa (hỗ trợ soft delete)
);

-- Bảng đăng ký sự kiện - Hợp nhất đăng ký của thành viên và khách mời
CREATE TABLE event_registrations (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT REFERENCES events(id) ON DELETE CASCADE, -- Sự kiện được đăng ký
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,   -- ID thành viên (NULL nếu là khách mời)
    registration_type VARCHAR(20) NOT NULL,                  -- Loại đăng ký: 'private' (thành viên) hoặc 'public' (khách mời)
    guest_name VARCHAR(255),                                -- Tên khách mời (dùng cho public)
    guest_email VARCHAR(255),                               -- Email khách mời (dùng cho public)
    guest_phone VARCHAR(255),                               -- Số điện thoại khách mời (dùng cho public)
    notes TEXT,                                             -- Ghi chú từ người đăng ký
    registered_at TIMESTAMPTZ DEFAULT NOW(),               -- Thời gian đăng ký
    deleted_at TIMESTAMPTZ                                 -- Thời gian hủy đăng ký (hỗ trợ soft delete)
);

-- Bảng điểm danh sự kiện - Theo dõi tham gia thực tế của người đăng ký
CREATE TABLE event_attendances (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),          -- ID thành viên tham gia (NULL nếu là khách mời)
    event_id BIGINT REFERENCES events(id),        -- Sự kiện được tham gia
    registration_id BIGINT REFERENCES event_registrations(id), -- ID đăng ký (tham chiếu bảng event_registrations)
    checked_in BOOLEAN DEFAULT false,             -- Đã điểm danh chưa
    check_in_time TIMESTAMPTZ,                    -- Thời gian điểm danh
    checked_in_by BIGINT REFERENCES users(id),    -- Người thực hiện điểm danh (BCN)
    notes TEXT,                                   -- Ghi chú điểm danh
    created_at TIMESTAMPTZ DEFAULT NOW()          -- Thời gian tạo bản ghi
);

-- ================================================================
-- MODULE 4: QUẢN LÝ TÀI LIỆU (Document Management)
-- ================================================================

-- Bảng danh mục tài liệu - Phân loại tài liệu
CREATE TABLE document_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,                   -- Tên danh mục (ví dụ: 'Tài liệu học tập', 'Hướng dẫn')
    slug VARCHAR(255) UNIQUE NOT NULL,            -- URL slug
    parent_id BIGINT REFERENCES document_categories(id), -- Danh mục cha (hỗ trợ phân cấp)
    created_by BIGINT REFERENCES users(id),       -- Người tạo
    updated_by BIGINT REFERENCES users(id),       -- Người cập nhật cuối
    created_at TIMESTAMPTZ DEFAULT NOW(),         -- Thời gian tạo
    updated_at TIMESTAMPTZ DEFAULT NOW(),         -- Thời gian cập nhật cuối
    deleted_at TIMESTAMPTZ                        -- Thời gian xóa (hỗ trợ soft delete)
);

-- Bảng tài liệu - Lưu thông tin file tài liệu
CREATE TABLE documents (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,                  -- Tên tài liệu
    slug VARCHAR(500) UNIQUE NOT NULL,            -- URL slug
    description TEXT,                             -- Mô tả tài liệu
    file_url TEXT,                                -- Link file gốc
    preview_url TEXT,                             -- Link xem trước
    category_id BIGINT REFERENCES document_categories(id), -- Danh mục tài liệu
    access_level VARCHAR(20) DEFAULT 'public',    -- Mức độ truy cập: 'public', 'member_only', 'restricted'
    status INTEGER DEFAULT 0,                     -- Trạng thái: 0=draft, 1=published, 2=archived
    download_count INTEGER DEFAULT 0,            -- Số lượt tải xuống
    created_by BIGINT REFERENCES users(id),       -- Người tải lên
    updated_by BIGINT REFERENCES users(id),       -- Người cập nhật cuối
    created_at TIMESTAMPTZ DEFAULT NOW(),         -- Thời gian tạo
    updated_at TIMESTAMPTZ DEFAULT NOW(),         -- Thời gian cập nhật cuối
    deleted_at TIMESTAMPTZ                        -- Thời gian xóa (hỗ trợ soft delete)
);

-- Bảng phân quyền tài liệu - Cấp quyền truy cập cho tài liệu restricted
CREATE TABLE document_restricted_users (
    document_id BIGINT REFERENCES documents(id) ON DELETE CASCADE,  -- ID tài liệu
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,         -- ID người dùng
    granted_by BIGINT REFERENCES users(id),                        -- Người cấp quyền
    granted_at TIMESTAMPTZ DEFAULT NOW(),                          -- Thời gian cấp quyền
    PRIMARY KEY (document_id, user_id)                             -- Khóa chính kép
);

-- ================================================================
-- MODULE 5: QUẢN LÝ TÀI CHÍNH (Financial Management)
-- ================================================================

-- Bảng giao dịch tài chính - Theo dõi thu chi của CLB
CREATE TABLE transactions (
    id BIGSERIAL PRIMARY KEY,
    amount DECIMAL(15,0) NOT NULL,                -- Số tiền giao dịch (số nguyên)
    type INTEGER NOT NULL,                        -- Loại giao dịch: 0=expense (chi), 1=income (thu)
    description TEXT NOT NULL,                    -- Mô tả giao dịch
    attachment_url TEXT,                          -- Link hóa đơn/chứng từ
    created_by BIGINT REFERENCES users(id),       -- Người tạo giao dịch
    updated_by BIGINT REFERENCES users(id),       -- Người cập nhật cuối
    created_at TIMESTAMPTZ DEFAULT NOW(),         -- Thời gian tạo
    updated_at TIMESTAMPTZ DEFAULT NOW()          -- Thời gian cập nhật cuối
);