# 📧 Kế Hoạch Xây Dựng Hệ Thống Email Động (Database-Driven)

## 🎯 Mục Tiêu

Xây dựng hệ thống email templates động có thể:
- Lưu trữ templates trong database
- Quản lý qua admin panel
- Tùy biến nội dung với variables động
- Tích hợp với hệ thống email hiện tại
- Hỗ trợ preview và test email

---

## 📊 Phân Tích Yêu Cầu

### 1. Tính Năng Cần Có

#### A. Quản Lý Templates
- ✅ Tạo mới template
- ✅ Chỉnh sửa template
- ✅ Xóa template (soft delete)
- ✅ Xem danh sách templates
- ✅ Xem chi tiết template
- ✅ Preview template với dữ liệu mẫu
- ✅ Test gửi email với template

#### B. Variables & Dynamic Content
- ✅ Định nghĩa danh sách variables có thể dùng
- ✅ Validate variables khi render
- ✅ Hỗ trợ Handlebars syntax
- ✅ Default values cho variables
- ✅ Variables documentation

#### C. Categories & Organization
- ✅ Phân loại templates theo category
- ✅ Tag templates
- ✅ Tìm kiếm templates
- ✅ Filter theo category/status

#### D. Integration
- ✅ Tích hợp với emailService hiện tại
- ✅ Fallback về file templates nếu không tìm thấy trong DB
- ✅ Cache templates để tăng performance
- ✅ Log email sending history

---

## 🗄️ Database Schema Design

### 1. Bảng `email_templates`

```sql
CREATE TABLE IF NOT EXISTS `email_templates` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL COMMENT 'Tên template (unique)',
  `slug` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL COMMENT 'Slug cho template',
  `subject` varchar(500) COLLATE utf8mb4_vietnamese_ci NOT NULL COMMENT 'Subject của email',
  `html_content` longtext COLLATE utf8mb4_vietnamese_ci NOT NULL COMMENT 'Nội dung HTML (Handlebars)',
  `text_content` text COLLATE utf8mb4_vietnamese_ci DEFAULT NULL COMMENT 'Nội dung text (optional)',
  `category` varchar(100) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL COMMENT 'Danh mục: authentication, application, event, document, system, custom',
  `description` text COLLATE utf8mb4_vietnamese_ci DEFAULT NULL COMMENT 'Mô tả template',
  `variables` json DEFAULT NULL COMMENT 'Danh sách variables và mô tả: [{"name": "fullname", "type": "string", "required": true, "description": "Họ và tên"}],
  `default_variables` json DEFAULT NULL COMMENT 'Giá trị mặc định cho variables: {"fullname": "Nguyễn Văn A"}',
  `is_active` tinyint(1) DEFAULT '1' COMMENT 'Template có đang active không',
  `is_system` tinyint(1) DEFAULT '0' COMMENT 'Template hệ thống (không thể xóa)',
  `created_by` bigint unsigned DEFAULT NULL COMMENT 'User tạo template',
  `updated_by` bigint unsigned DEFAULT NULL COMMENT 'User cập nhật template',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `name` (`name`),
  KEY `category` (`category`),
  KEY `is_active` (`is_active`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `email_templates_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `email_templates_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
```

### 2. Bảng `email_template_categories` (Optional - có thể dùng enum)

```sql
CREATE TABLE IF NOT EXISTS `email_template_categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `slug` varchar(100) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `description` text COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- Insert default categories
INSERT INTO `email_template_categories` (`name`, `slug`, `description`) VALUES
('Authentication', 'authentication', 'Email liên quan đến xác thực: OTP, reset password'),
('Application', 'application', 'Email về đơn đăng ký thành viên'),
('Event', 'event', 'Email về sự kiện'),
('Document', 'document', 'Email về tài liệu'),
('System', 'system', 'Email hệ thống: welcome, notification'),
('Custom', 'custom', 'Email tùy biến');
```

### 3. Bảng `email_logs` (Để tracking và analytics)

```sql
CREATE TABLE IF NOT EXISTS `email_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `template_id` bigint unsigned DEFAULT NULL COMMENT 'ID của template được sử dụng',
  `template_name` varchar(255) COLLATE utf8mb4_vietnamese_ci DEFAULT NULL COMMENT 'Tên template (backup nếu template bị xóa)',
  `recipient_email` varchar(255) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `subject` varchar(500) COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `status` enum('pending','sent','failed') COLLATE utf8mb4_vietnamese_ci DEFAULT 'pending',
  `error_message` text COLLATE utf8mb4_vietnamese_ci DEFAULT NULL,
  `variables_used` json DEFAULT NULL COMMENT 'Variables đã sử dụng khi gửi',
  `sent_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `template_id` (`template_id`),
  KEY `recipient_email` (`recipient_email`),
  KEY `status` (`status`),
  KEY `created_at` (`created_at`),
  CONSTRAINT `email_logs_ibfk_1` FOREIGN KEY (`template_id`) REFERENCES `email_templates` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
```

---

## 🏗️ Kiến Trúc Hệ Thống

### 1. Cấu Trúc Thư Mục

```
backend/src/
├── models/
│   └── admin/
│       ├── emailTemplate.model.js      # Model cho email_templates
│       └── emailLog.model.js           # Model cho email_logs
├── services/
│   └── admin/
│       └── emailTemplate.service.js    # Business logic
├── controllers/
│   └── admin/
│       └── emailTemplate.controller.js  # API endpoints
├── validation/
│   └── admin/
│       └── emailTemplate.validation.js # Validation schema
├── services/
│   └── email/
│       ├── emailService.js             # Update để hỗ trợ DB templates
│       └── templateRenderer.js         # Render template từ DB
└── routers/
    └── admin/
        └── emailTemplate.router.js     # Routes
```

### 2. Flow Hoạt Động

```
1. Admin tạo/chỉnh sửa template qua API
   ↓
2. Template được lưu vào database
   ↓
3. Khi cần gửi email:
   - emailService.checkTemplate() → Tìm trong DB trước
   - Nếu có → Render từ DB
   - Nếu không → Fallback về file .hbs
   ↓
4. Render template với variables
   ↓
5. Gửi email và log vào email_logs
```

---

## 📝 API Endpoints

### 1. Email Templates Management

#### GET `/api/admin/email-templates`
- Lấy danh sách templates (có pagination, filter, search)
- Query params: `page`, `limit`, `category`, `is_active`, `q` (search)

#### GET `/api/admin/email-templates/:id`
- Lấy chi tiết 1 template

#### POST `/api/admin/email-templates`
- Tạo template mới
- Body: `name`, `subject`, `html_content`, `category`, `variables`, `default_variables`, etc.

#### PUT `/api/admin/email-templates/:id`
- Cập nhật template
- Body: tương tự POST

#### DELETE `/api/admin/email-templates/:id`
- Xóa mềm template (soft delete)
- Không cho phép xóa `is_system = true`

#### POST `/api/admin/email-templates/:id/preview`
- Preview template với dữ liệu mẫu
- Body: `variables` (optional - dùng default nếu không có)

#### POST `/api/admin/email-templates/:id/test-send`
- Test gửi email với template
- Body: `recipient_email`, `variables` (optional)

#### GET `/api/admin/email-templates/categories`
- Lấy danh sách categories

### 2. Email Logs

#### GET `/api/admin/email-logs`
- Lấy danh sách email logs (có pagination, filter)
- Query params: `page`, `limit`, `template_id`, `status`, `recipient_email`, `date_from`, `date_to`

#### GET `/api/admin/email-logs/:id`
- Lấy chi tiết 1 email log

---

## 🔧 Implementation Plan

### Phase 1: Database & Models (Tuần 1)

#### Task 1.1: Tạo Database Schema
- [ ] Tạo bảng `email_templates`
- [ ] Tạo bảng `email_template_categories` (optional)
- [ ] Tạo bảng `email_logs`
- [ ] Insert default categories
- [ ] Migration script

#### Task 1.2: Tạo Models
- [ ] `emailTemplate.model.js`
  - `getAllTemplates(options)`
  - `getTemplateById(id)`
  - `getTemplateBySlug(slug)`
  - `createTemplate(data)`
  - `updateTemplate(id, data)`
  - `deleteTemplate(id)` (soft delete)
- [ ] `emailLog.model.js`
  - `createLog(data)`
  - `getAllLogs(options)`
  - `getLogById(id)`

### Phase 2: Services & Core Logic (Tuần 1-2)

#### Task 2.1: Email Template Service
- [ ] `emailTemplate.service.js`
  - `getAllTemplates(options)`
  - `getTemplateById(id)`
  - `createTemplate(data, userId)`
  - `updateTemplate(id, data, userId)`
  - `deleteTemplate(id)`
  - `previewTemplate(id, variables)`
  - `testSendTemplate(id, recipientEmail, variables)`
  - `validateVariables(template, variables)`

#### Task 2.2: Template Renderer
- [ ] `templateRenderer.js`
  - `renderFromDatabase(templateId, variables)`
  - `renderFromFile(templateName, variables)`
  - `compileTemplate(htmlContent, variables)`
  - `validateVariables(template, variables)`

#### Task 2.3: Update Email Service
- [ ] Update `emailService.js`
  - Thêm method `sendDynamicEmail(templateId, recipientEmail, variables)`
  - Update `renderTemplate()` để check DB trước, fallback file
  - Thêm logging vào `email_logs`

### Phase 3: Controllers & Validation (Tuần 2)

#### Task 3.1: Validation Schema
- [ ] `emailTemplate.validation.js`
  - Schema cho create/update
  - Validate HTML content
  - Validate variables structure

#### Task 3.2: Controllers
- [ ] `emailTemplate.controller.js`
  - CRUD operations
  - Preview endpoint
  - Test send endpoint
- [ ] `emailLog.controller.js`
  - Get logs
  - Get log detail

### Phase 4: Routes & Integration (Tuần 2-3)

#### Task 4.1: Routes
- [ ] `emailTemplate.router.js`
- [ ] `emailLog.router.js`
- [ ] Thêm vào `admin/index.js`

#### Task 4.2: Integration Testing
- [ ] Test tạo template
- [ ] Test gửi email với template từ DB
- [ ] Test fallback về file
- [ ] Test preview
- [ ] Test logging

### Phase 5: Advanced Features (Tuần 3-4)

#### Task 5.1: Caching
- [ ] Cache templates trong memory/Redis
- [ ] Cache invalidation khi update

#### Task 5.2: Variables Documentation
- [ ] Auto-generate variables list từ template
- [ ] Variables helper trong admin panel

#### Task 5.3: Template Import/Export
- [ ] Export template to JSON
- [ ] Import template from JSON
- [ ] Bulk operations

---

## 📋 Variables System

### 1. Variables Definition

Mỗi template có field `variables` (JSON):

```json
[
  {
    "name": "fullname",
    "type": "string",
    "required": true,
    "description": "Họ và tên người nhận",
    "example": "Nguyễn Văn A"
  },
  {
    "name": "event_title",
    "type": "string",
    "required": true,
    "description": "Tên sự kiện",
    "example": "Workshop ReactJS"
  },
  {
    "name": "start_time",
    "type": "string",
    "required": false,
    "description": "Thời gian bắt đầu (đã format)",
    "example": "Thứ Hai, 15 tháng 1, 2024, 09:00"
  }
]
```

### 2. Default Variables

Field `default_variables` (JSON):

```json
{
  "fullname": "Nguyễn Văn A",
  "email": "user@example.com",
  "event_title": "Sự kiện mẫu",
  "start_time": "Thứ Hai, 15 tháng 1, 2024, 09:00"
}
```

### 3. Variables Validation

Khi render template:
1. Check required variables
2. Merge với default_variables
3. Validate types
4. Render template

---

## 🔄 Migration Strategy

### 1. Migrate Existing Templates

Tạo script để migrate templates từ file → database:

```javascript
// scripts/migrateTemplates.js
const templates = [
  { name: 'loginOTP', category: 'authentication', ... },
  { name: 'applicationReceived', category: 'application', ... },
  // ...
];

// Insert vào database
```

### 2. Backward Compatibility

- Giữ file templates làm backup
- Fallback về file nếu không tìm thấy trong DB
- Có thể disable file templates sau khi migrate xong

---

## 🎨 Admin Panel Features (Frontend - Optional)

### 1. Template Editor
- Rich text editor (hoặc code editor) cho HTML
- Preview pane
- Variables panel
- Syntax highlighting cho Handlebars

### 2. Template List
- Table view với filter/search
- Category filter
- Status filter
- Quick actions: preview, test, edit, delete

### 3. Template Detail
- View/edit template
- Variables documentation
- Preview với sample data
- Test send
- Usage statistics (số lần gửi)

---

## 📊 Example Usage

### 1. Tạo Template Mới

```javascript
POST /api/admin/email-templates
{
  "name": "Custom Event Notification",
  "slug": "custom-event-notification",
  "subject": "Thông báo sự kiện: {{event_title}}",
  "html_content": "<html>...{{fullname}}...{{event_title}}...</html>",
  "category": "event",
  "variables": [
    {
      "name": "fullname",
      "type": "string",
      "required": true,
      "description": "Họ và tên"
    },
    {
      "name": "event_title",
      "type": "string",
      "required": true,
      "description": "Tên sự kiện"
    }
  ],
  "default_variables": {
    "fullname": "Nguyễn Văn A"
  }
}
```

### 2. Gửi Email Với Template

```javascript
// Trong service
await emailService.sendDynamicEmail(
  'custom-event-notification', // template slug hoặc ID
  'user@example.com',
  {
    fullname: 'Nguyễn Văn A',
    event_title: 'Workshop ReactJS',
    start_time: 'Thứ Hai, 15 tháng 1, 2024, 09:00'
  }
);
```

---

## ⚠️ Lưu Ý & Best Practices

### 1. Security
- Sanitize HTML content để tránh XSS
- Validate variables trước khi render
- Không cho phép execute JavaScript trong email
- Rate limiting cho test send

### 2. Performance
- Cache templates
- Async email sending
- Queue system cho bulk emails

### 3. Error Handling
- Graceful fallback về file templates
- Log errors vào email_logs
- Notify admin khi template render fail

### 4. Testing
- Unit tests cho template rendering
- Integration tests cho API
- E2E tests cho email sending

---

## 📅 Timeline

- **Week 1**: Database schema, Models, Basic services
- **Week 2**: Controllers, Routes, Integration
- **Week 3**: Advanced features, Caching, Testing
- **Week 4**: Documentation, Migration, Deployment

---

## 🚀 Next Steps

1. Review và approve kế hoạch
2. Tạo database schema
3. Bắt đầu implement Phase 1
4. Test và iterate

