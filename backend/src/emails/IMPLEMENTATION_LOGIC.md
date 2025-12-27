# 🛠️ Logic & Kế Hoạch Implementation Email Động

## 📋 Tổng Quan

Tài liệu này mô tả chi tiết logic và kế hoạch implement hệ thống email động, bao gồm cả chức năng gửi hàng loạt (bulk email).

---

## 🎯 Phase 1: Core Logic - Template Management

### 1.1. Model Layer

#### `emailTemplate.model.js`

**Các methods cần có:**

```javascript
class EmailTemplateModel {
  // Lấy danh sách templates (có pagination, filter)
  static async getAllTemplates(options = {}) {
    // Filter: category, is_active, search (name, slug)
    // Pagination: page, limit
    // Sort: created_at, name
  }

  // Lấy template theo ID
  static async getTemplateById(id) {
    // Include: created_by, updated_by info
  }

  // Lấy template theo slug
  static async getTemplateBySlug(slug) {
    // Dùng để gửi email: sendDynamicEmail('template-slug', ...)
  }

  // Tạo template mới
  static async createTemplate(data) {
    // Validate: name, slug unique
    // Auto-generate slug từ name nếu không có
  }

  // Cập nhật template
  static async updateTemplate(id, data) {
    // Validate: slug unique (trừ chính nó)
    // Không cho update is_system = true
  }

  // Xóa mềm template
  static async deleteTemplate(id) {
    // Check is_system - không cho xóa
    // Soft delete: set deleted_at
  }

  // Kiểm tra slug tồn tại
  static async checkSlugExists(slug, excludeId = null) {
    // Dùng khi create/update
  }
}
```

#### `emailLog.model.js`

```javascript
class EmailLogModel {
  // Tạo log mới
  static async createLog(data) {
    // template_id, recipient_email, subject, status, variables_used
  }

  // Cập nhật log (khi gửi thành công/thất bại)
  static async updateLog(id, data) {
    // status, sent_at, error_message
  }

  // Lấy danh sách logs
  static async getAllLogs(options = {}) {
    // Filter: template_id, status, recipient_email, date_from, date_to
    // Pagination
  }

  // Lấy log theo ID
  static async getLogById(id) {}

  // Thống kê
  static async getStats(options = {}) {
    // Tổng số email đã gửi
    // Số email thành công/thất bại
    // Theo template
    // Theo thời gian
  }
}
```

---

### 1.2. Service Layer

#### `emailTemplate.service.js`

**Business Logic:**

```javascript
class EmailTemplateService {
  // Lấy danh sách templates
  async getAllTemplates(options) {
    // 1. Validate options
    // 2. Call model
    // 3. Format response
  }

  // Lấy template theo ID
  async getTemplateById(id) {
    // 1. Check exists
    // 2. Return template
    // 3. Throw error nếu không tìm thấy
  }

  // Tạo template mới
  async createTemplate(data, userId) {
    // 1. Validate data
    // 2. Generate slug nếu không có
    // 3. Validate slug unique
    // 4. Validate variables JSON format
    // 5. Validate default_variables JSON format
    // 6. Parse và validate HTML content
    // 7. Create template
    // 8. Return created template
  }

  // Cập nhật template
  async updateTemplate(id, data, userId) {
    // 1. Check template exists
    // 2. Check is_system - không cho update
    // 3. Validate data (tương tự create)
    // 4. Update template
    // 5. Return updated template
  }

  // Xóa template
  async deleteTemplate(id) {
    // 1. Check template exists
    // 2. Check is_system - không cho xóa
    // 3. Check có đang được sử dụng không (email_logs)
    // 4. Soft delete
  }

  // Preview template
  async previewTemplate(id, variables = null) {
    // 1. Get template
    // 2. Merge variables với default_variables
    // 3. Render template
    // 4. Return HTML rendered
  }

  // Test gửi email
  async testSendTemplate(id, recipientEmail, variables = null) {
    // 1. Get template
    // 2. Preview template với variables
    // 3. Gửi email thật
    // 4. Log vào email_logs
    // 5. Return result
  }

  // Validate variables
  validateVariables(template, variables) {
    // 1. Check required variables
    // 2. Check variable types
    // 3. Return errors nếu có
  }
}
```

#### `templateRenderer.service.js` (NEW)

**Core rendering logic:**

```javascript
class TemplateRenderer {
  // Render template từ database
  async renderFromDatabase(templateIdOrSlug, variables) {
    // 1. Get template từ DB (by ID or slug)
    // 2. Validate variables
    // 3. Merge với default_variables
    // 4. Compile Handlebars template
    // 5. Render với variables
    // 6. Return HTML
  }

  // Render template từ file (fallback)
  renderFromFile(templateName, variables) {
    // 1. Load file .hbs
    // 2. Compile Handlebars
    // 3. Render
    // 4. Return HTML
  }

  // Render subject (có thể có variables)
  renderSubject(template, variables) {
    // 1. Compile subject string
    // 2. Replace variables
    // 3. Return subject
  }

  // Validate template syntax
  validateTemplateSyntax(htmlContent) {
    // 1. Check Handlebars syntax
    // 2. Return errors nếu có
  }
}
```

---

### 1.3. Update Email Service

#### `emailService.js` - Thêm methods mới

```javascript
export const emailService = {
  // ... existing methods ...

  // Gửi email với template động
  async sendDynamicEmail(templateIdOrSlug, recipientEmail, variables = {}) {
    // 1. Try get template từ database
    // 2. Nếu không có → fallback về file
    // 3. Validate variables
    // 4. Render template
    // 5. Render subject
    // 6. Gửi email
    // 7. Log vào email_logs
    // 8. Return result
  },

  // Gửi email hàng loạt (bulk)
  async sendBulkEmail(templateIdOrSlug, recipients, variablesProvider) {
    // recipients: Array of { email, variables }
    // variablesProvider: Function để generate variables cho mỗi recipient
    //
    // Logic:
    // 1. Get template
    // 2. Loop qua recipients
    // 3. Generate variables cho mỗi recipient
    // 4. Gửi email (async, không block)
    // 5. Log từng email
    // 6. Return summary: { sent, failed, errors }
  },

  // Gửi email hàng loạt với queue (cho số lượng lớn)
  async sendBulkEmailWithQueue(
    templateIdOrSlug,
    recipients,
    variablesProvider,
    options = {},
  ) {
    // options: { batchSize, delay, concurrency }
    //
    // Logic:
    // 1. Chia recipients thành batches
    // 2. Process từng batch với delay
    // 3. Limit concurrency
    // 4. Track progress
    // 5. Return job ID để track
  },
};
```

---

## 🚀 Phase 2: Bulk Email System

### 2.1. Phân Tích Chức Năng Gửi Hàng Loạt

#### Use Cases:

1. **Gửi thông báo sự kiện cho tất cả người đăng ký**

   - Template: event-notification
   - Recipients: Tất cả registrations của event
   - Variables: fullname, event_title, start_time, location (khác nhau mỗi người)

2. **Gửi reminder đóng phí cho nhiều thành viên**

   - Template: payment-reminder
   - Recipients: Members sắp đến hạn
   - Variables: name, deadline, amount, days_remaining

3. **Gửi newsletter cho tất cả thành viên**

   - Template: newsletter
   - Recipients: Tất cả active members
   - Variables: fullname, content (giống nhau cho tất cả)

4. **Gửi thông báo hệ thống**
   - Template: system-announcement
   - Recipients: Tất cả users
   - Variables: fullname, message

#### Requirements:

1. **Performance**

   - Không block main thread
   - Xử lý async
   - Batch processing
   - Rate limiting (tránh spam)

2. **Reliability**

   - Retry failed emails
   - Log chi tiết
   - Progress tracking
   - Error handling

3. **User Experience**
   - Progress bar/status
   - Notification khi hoàn thành
   - Error report

---

### 2.2. Database Schema cho Bulk Email

#### Bảng `email_batch_jobs`

```sql
CREATE TABLE IF NOT EXISTS `email_batch_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `template_id` bigint unsigned DEFAULT NULL,
  `template_slug` varchar(255) DEFAULT NULL,
  `job_name` varchar(255) NOT NULL COMMENT 'Tên job (mô tả)',
  `status` enum('pending','processing','completed','failed','cancelled') DEFAULT 'pending',
  `total_recipients` int unsigned NOT NULL COMMENT 'Tổng số người nhận',
  `sent_count` int unsigned DEFAULT 0,
  `failed_count` int unsigned DEFAULT 0,
  `progress_percent` decimal(5,2) DEFAULT 0.00,
  `started_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `error_message` text DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `status` (`status`),
  KEY `created_by` (`created_by`),
  FOREIGN KEY (`template_id`) REFERENCES `email_templates` (`id`) ON DELETE SET NULL,
  FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

#### Bảng `email_batch_recipients`

```sql
CREATE TABLE IF NOT EXISTS `email_batch_recipients` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `batch_job_id` bigint unsigned NOT NULL,
  `recipient_email` varchar(255) NOT NULL,
  `status` enum('pending','sent','failed') DEFAULT 'pending',
  `variables` json DEFAULT NULL COMMENT 'Variables cho recipient này',
  `error_message` text DEFAULT NULL,
  `sent_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `batch_job_id` (`batch_job_id`),
  KEY `status` (`status`),
  FOREIGN KEY (`batch_job_id`) REFERENCES `email_batch_jobs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

### 2.3. Bulk Email Service Logic

#### `bulkEmail.service.js` (NEW)

```javascript
class BulkEmailService {
  // Tạo batch job mới
  async createBatchJob(templateIdOrSlug, recipients, options = {}) {
    // recipients: Array of { email, variables }
    // options: { jobName, createdBy }
    //
    // Logic:
    // 1. Validate template
    // 2. Validate recipients
    // 3. Create batch_job record
    // 4. Create batch_recipients records
    // 5. Return job ID
  }

  // Process batch job (gửi emails)
  async processBatchJob(jobId) {
    // Logic:
    // 1. Get batch job
    // 2. Update status = 'processing'
    // 3. Get pending recipients
    // 4. Process từng recipient (async)
    // 5. Update progress
    // 6. Update status khi hoàn thành
  }

  // Process batch với batching (chia nhỏ)
  async processBatchJobWithBatching(jobId, batchSize = 10, delay = 1000) {
    // Logic:
    // 1. Get all pending recipients
    // 2. Chia thành batches (mỗi batch batchSize recipients)
    // 3. Process từng batch
    // 4. Delay giữa các batch
    // 5. Update progress sau mỗi batch
  }

  // Retry failed emails
  async retryFailedEmails(jobId) {
    // 1. Get failed recipients
    // 2. Reset status = 'pending'
    // 3. Re-process
  }

  // Get batch job status
  async getBatchJobStatus(jobId) {
    // Return: status, progress, sent_count, failed_count, etc.
  }

  // Cancel batch job
  async cancelBatchJob(jobId) {
    // 1. Check status
    // 2. Update status = 'cancelled'
    // 3. Stop processing
  }
}
```

---

### 2.4. Queue System (Optional - cho số lượng lớn)

#### Sử dụng Queue để xử lý async

**Option 1: In-memory Queue (đơn giản)**

```javascript
// Sử dụng array và setTimeout
class SimpleEmailQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
  }

  async add(job) {
    this.queue.push(job);
    this.process();
  }

  async process() {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const job = this.queue.shift();
      await this.executeJob(job);
    }

    this.processing = false;
  }
}
```

**Option 2: Database Queue (persistent)**

- Lưu jobs vào database
- Worker process xử lý
- Có thể restart mà không mất jobs

**Option 3: Redis Queue (production)**

- Sử dụng Bull hoặc BullMQ
- Persistent, scalable
- Có dashboard

---

## 📊 Phase 3: API Endpoints

### 3.1. Template Management APIs

```
GET    /api/admin/email-templates
GET    /api/admin/email-templates/:id
POST   /api/admin/email-templates
PUT    /api/admin/email-templates/:id
DELETE /api/admin/email-templates/:id
POST   /api/admin/email-templates/:id/preview
POST   /api/admin/email-templates/:id/test-send
GET    /api/admin/email-templates/categories
```

### 3.2. Bulk Email APIs

```
POST   /api/admin/email-templates/:id/send-bulk
POST   /api/admin/email-templates/bulk-jobs
GET    /api/admin/email-templates/bulk-jobs/:id
GET    /api/admin/email-templates/bulk-jobs/:id/recipients
POST   /api/admin/email-templates/bulk-jobs/:id/retry
POST   /api/admin/email-templates/bulk-jobs/:id/cancel
```

### 3.3. Email Logs APIs

```
GET    /api/admin/email-logs
GET    /api/admin/email-logs/:id
GET    /api/admin/email-logs/stats
```

---

## 🔄 Flow Hoạt Động

### Flow 1: Gửi Email Đơn

```
1. Code gọi: emailService.sendDynamicEmail('template-slug', 'email', variables)
   ↓
2. emailService.getTemplate('template-slug')
   - Tìm trong DB
   - Nếu không có → fallback file
   ↓
3. templateRenderer.render(template, variables)
   - Validate variables
   - Merge với default_variables
   - Render Handlebars
   ↓
4. sendMail(recipient, subject, html)
   ↓
5. emailLog.create({ template_id, recipient, status, variables })
```

### Flow 2: Gửi Email Hàng Loạt

```
1. Admin/Code tạo batch job
   POST /api/admin/email-templates/:id/send-bulk
   Body: { recipients: [...], options: {...} }
   ↓
2. bulkEmailService.createBatchJob()
   - Create batch_job record
   - Create batch_recipients records
   ↓
3. bulkEmailService.processBatchJob(jobId)
   - Update status = 'processing'
   - Loop recipients
   - Gửi email cho mỗi recipient
   - Update progress
   ↓
4. Mỗi email:
   - emailService.sendDynamicEmail()
   - Update recipient status
   - Log vào email_logs
   ↓
5. Khi hoàn thành:
   - Update batch_job status = 'completed'
   - Return summary
```

---

## 🎯 Implementation Plan

### Week 1: Core Template System

- [ ] Database migration
- [ ] Models: emailTemplate, emailLog
- [ ] Services: emailTemplate, templateRenderer
- [ ] Update emailService với sendDynamicEmail
- [ ] Basic CRUD APIs

### Week 2: Bulk Email System

- [ ] Database migration cho batch jobs
- [ ] Models: emailBatchJob, emailBatchRecipient
- [ ] Service: bulkEmail
- [ ] Bulk email APIs
- [ ] Progress tracking

### Week 3: Advanced Features

- [ ] Queue system (optional)
- [ ] Retry mechanism
- [ ] Email logs & analytics
- [ ] Rate limiting
- [ ] Error handling & notifications

### Week 4: Testing & Optimization

- [ ] Unit tests
- [ ] Integration tests
- [ ] Performance testing
- [ ] Documentation
- [ ] Migration existing templates

---

## 💡 Best Practices

### 1. Performance

- Cache templates trong memory
- Batch processing cho số lượng lớn
- Async processing
- Rate limiting

### 2. Reliability

- Retry failed emails
- Log chi tiết
- Error handling
- Transaction cho batch jobs

### 3. Security

- Validate variables
- Sanitize HTML content
- Rate limiting
- Permission checks

### 4. User Experience

- Progress tracking
- Error reports
- Notifications
- Dashboard

---

## 📝 Example Usage

### Gửi Email Đơn

```javascript
// Trong service
await emailService.sendDynamicEmail('event-notification', 'user@example.com', {
  fullname: 'Nguyễn Văn A',
  event_title: 'Workshop ReactJS',
  start_time: 'Thứ Hai, 15/1/2024, 09:00',
});
```

### Gửi Email Hàng Loạt

```javascript
// Tạo batch job
const job = await bulkEmailService.createBatchJob(
  'event-notification',
  [
    { email: 'user1@example.com', variables: { fullname: 'User 1', ... } },
    { email: 'user2@example.com', variables: { fullname: 'User 2', ... } },
    // ... 100 recipients
  ],
  { jobName: 'Event Notification - Workshop ReactJS' }
);

// Process job (async)
bulkEmailService.processBatchJobWithBatching(job.id, {
  batchSize: 10,
  delay: 1000
});

// Check status
const status = await bulkEmailService.getBatchJobStatus(job.id);
// { status: 'processing', progress: 45.5, sent: 45, failed: 2 }
```

---

## 🚨 Lưu Ý Quan Trọng

1. **Rate Limiting**: Giới hạn số email/giờ để tránh bị block
2. **Error Handling**: Xử lý lỗi gracefully, không crash app
3. **Logging**: Log đầy đủ để debug
4. **Testing**: Test với số lượng nhỏ trước
5. **Monitoring**: Monitor performance và errors

---

Bạn muốn tôi bắt đầu implement phần nào trước? 😊
