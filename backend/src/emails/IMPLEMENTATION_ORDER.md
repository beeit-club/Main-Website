# 📋 Thứ Tự Implementation Email Động

## 🎯 Tổng Quan

Tài liệu này liệt kê thứ tự chi tiết để implement hệ thống email động, từ database đến API.

---

## 📅 Thứ Tự Thực Hiện

### ✅ BƯỚC 1: Database Setup (Đã hoàn thành)

**Files:**
- ✅ `backend/src/migrations/create_email_templates_tables.sql`
- ✅ `backend/src/migrations/create_bulk_email_tables.sql`

**Các bảng:**
- ✅ `email_template_categories`
- ✅ `email_templates`
- ✅ `email_logs`
- ✅ `email_batch_jobs`
- ✅ `email_batch_recipients`

**Action:** Chạy 2 file SQL migration trên

---

### 🔨 BƯỚC 2: Models Layer

#### 2.1. `emailTemplate.model.js`

**File:** `backend/src/models/admin/emailTemplate.model.js`

**Methods cần implement:**

```javascript
class EmailTemplateModel {
  // 1. Lấy danh sách templates
  static async getAllTemplates(options = {}) {
    // Filter: category, is_active, search (name, slug)
    // Pagination: page, limit
    // Sort: created_at, name
  }

  // 2. Lấy template theo ID
  static async getTemplateById(id) {
    // Include: created_by, updated_by user info
  }

  // 3. Lấy template theo slug
  static async getTemplateBySlug(slug) {
    // Dùng để gửi email
  }

  // 4. Tạo template mới
  static async createTemplate(data) {
    // Validate: name, slug unique
  }

  // 5. Cập nhật template
  static async updateTemplate(id, data) {
    // Validate: slug unique (trừ chính nó)
  }

  // 6. Xóa mềm template
  static async deleteTemplate(id) {
    // Soft delete: set deleted_at
  }

  // 7. Kiểm tra slug tồn tại
  static async checkSlugExists(slug, excludeId = null) {}
}
```

**Thứ tự implement:**
1. `getAllTemplates()` - Cơ bản nhất
2. `getTemplateById()` - Đơn giản
3. `getTemplateBySlug()` - Tương tự getById
4. `checkSlugExists()` - Dùng cho validation
5. `createTemplate()` - Cần checkSlugExists
6. `updateTemplate()` - Cần checkSlugExists
7. `deleteTemplate()` - Soft delete

---

#### 2.2. `emailLog.model.js`

**File:** `backend/src/models/admin/emailLog.model.js`

**Methods:**

```javascript
class EmailLogModel {
  // 1. Tạo log mới
  static async createLog(data) {}

  // 2. Cập nhật log
  static async updateLog(id, data) {}

  // 3. Lấy danh sách logs
  static async getAllLogs(options = {}) {
    // Filter: template_id, status, recipient_email, date_from, date_to
  }

  // 4. Lấy log theo ID
  static async getLogById(id) {}

  // 5. Thống kê
  static async getStats(options = {}) {}
}
```

**Thứ tự implement:**
1. `createLog()` - Đơn giản
2. `updateLog()` - Đơn giản
3. `getLogById()` - Đơn giản
4. `getAllLogs()` - Có filter, pagination
5. `getStats()` - Phức tạp nhất

---

#### 2.3. `emailBatchJob.model.js`

**File:** `backend/src/models/admin/emailBatchJob.model.js`

**Methods:**

```javascript
class EmailBatchJobModel {
  // 1. Tạo batch job
  static async createJob(data) {}

  // 2. Lấy job theo ID
  static async getJobById(id) {}

  // 3. Lấy danh sách jobs
  static async getAllJobs(options = {}) {}

  // 4. Cập nhật job
  static async updateJob(id, data) {}

  // 5. Lấy jobs theo status
  static async getJobsByStatus(status) {}
}
```

**Thứ tự implement:**
1. `createJob()` - Đơn giản
2. `getJobById()` - Đơn giản
3. `updateJob()` - Đơn giản
4. `getAllJobs()` - Có filter, pagination
5. `getJobsByStatus()` - Đơn giản

---

#### 2.4. `emailBatchRecipient.model.js`

**File:** `backend/src/models/admin/emailBatchRecipient.model.js`

**Methods:**

```javascript
class EmailBatchRecipientModel {
  // 1. Tạo recipient
  static async createRecipient(data) {}

  // 2. Bulk create recipients
  static async bulkCreate(recipients) {}

  // 3. Lấy recipients theo job ID
  static async getRecipientsByJobId(jobId, options = {}) {}

  // 4. Lấy pending recipients
  static async getPendingByJobId(jobId) {}

  // 5. Lấy failed recipients
  static async getFailedByJobId(jobId) {}

  // 6. Cập nhật recipient
  static async updateRecipient(id, data) {}

  // 7. Reset status (cho retry)
  static async resetStatus(recipientIds) {}

  // 8. Thống kê theo job
  static async getStatsByJobId(jobId) {}
}
```

**Thứ tự implement:**
1. `createRecipient()` - Đơn giản
2. `bulkCreate()` - Dùng cho batch insert
3. `getRecipientsByJobId()` - Cơ bản
4. `getPendingByJobId()` - Filter
5. `getFailedByJobId()` - Filter
6. `updateRecipient()` - Đơn giản
7. `resetStatus()` - Cho retry
8. `getStatsByJobId()` - Thống kê

---

### 🔧 BƯỚC 3: Services Layer

#### 3.1. `templateRenderer.service.js` (NEW - Ưu tiên cao)

**File:** `backend/src/services/email/templateRenderer.service.js`

**Lý do ưu tiên:** Core logic, các service khác sẽ dùng

**Methods:**

```javascript
class TemplateRenderer {
  // 1. Render từ database
  async renderFromDatabase(templateIdOrSlug, variables) {}

  // 2. Render từ file (fallback)
  renderFromFile(templateName, variables) {}

  // 3. Render subject
  renderSubject(template, variables) {}

  // 4. Validate template syntax
  validateTemplateSyntax(htmlContent) {}
}
```

**Thứ tự implement:**
1. `renderFromFile()` - Đơn giản, dùng code hiện tại
2. `renderSubject()` - Đơn giản
3. `renderFromDatabase()` - Cần getTemplate
4. `validateTemplateSyntax()` - Optional

---

#### 3.2. `emailTemplate.service.js`

**File:** `backend/src/services/admin/emailTemplate.service.js`

**Methods:**

```javascript
class EmailTemplateService {
  // 1. getAllTemplates()
  // 2. getTemplateById()
  // 3. createTemplate()
  // 4. updateTemplate()
  // 5. deleteTemplate()
  // 6. previewTemplate()
  // 7. testSendTemplate()
  // 8. validateVariables()
}
```

**Thứ tự implement:**
1. `getAllTemplates()` - Cơ bản
2. `getTemplateById()` - Cơ bản
3. `validateVariables()` - Dùng cho các method khác
4. `createTemplate()` - Cần validateVariables
5. `updateTemplate()` - Tương tự create
6. `deleteTemplate()` - Đơn giản
7. `previewTemplate()` - Cần templateRenderer
8. `testSendTemplate()` - Cần previewTemplate + emailService

---

#### 3.3. Update `emailService.js`

**File:** `backend/src/services/email/emailService.js`

**Thêm methods:**

```javascript
export const emailService = {
  // ... existing methods ...

  // 1. sendDynamicEmail() - Ưu tiên cao
  async sendDynamicEmail(templateIdOrSlug, recipientEmail, variables = {}) {}

  // 2. sendBulkEmail() - Sau khi có sendDynamicEmail
  async sendBulkEmail(templateIdOrSlug, recipients, options = {}) {}
};
```

**Thứ tự implement:**
1. `sendDynamicEmail()` - Core method
2. `sendBulkEmail()` - Dùng sendDynamicEmail

---

#### 3.4. `bulkEmail.service.js` (NEW)

**File:** `backend/src/services/admin/bulkEmail.service.js`

**Methods:**

```javascript
class BulkEmailService {
  // 1. createBatchJob()
  // 2. processBatchJob()
  // 3. processBatchJobWithBatching()
  // 4. getBatchJobStatus()
  // 5. retryFailedEmails()
  // 6. cancelBatchJob()
}
```

**Thứ tự implement:**
1. `createBatchJob()` - Tạo job và recipients
2. `getBatchJobStatus()` - Đơn giản, dùng để check
3. `processBatchJob()` - Basic processing
4. `processBatchJobWithBatching()` - Advanced với batching
5. `retryFailedEmails()` - Dùng processBatchJob
6. `cancelBatchJob()` - Đơn giản

---

### 📝 BƯỚC 4: Validation Schemas

#### 4.1. `emailTemplate.validation.js`

**File:** `backend/src/validation/admin/emailTemplate.validation.js`

**Schemas:**

```javascript
const EmailTemplateSchema = {
  create: yup.object({
    name: yup.string().required().max(255),
    slug: yup.string().max(255),
    subject: yup.string().required().max(500),
    html_content: yup.string().required(),
    category: yup.string(),
    variables: yup.array(),
    default_variables: yup.object(),
    // ...
  }),

  update: yup.object({
    // Tương tự create, nhưng tất cả optional
  }),

  preview: yup.object({
    variables: yup.object().optional()
  }),

  testSend: yup.object({
    recipient_email: yup.string().email().required(),
    variables: yup.object().optional()
  })
};
```

**Thứ tự implement:**
1. `create` schema
2. `update` schema (tương tự create)
3. `preview` schema
4. `testSend` schema

---

#### 4.2. `bulkEmail.validation.js`

**File:** `backend/src/validation/admin/bulkEmail.validation.js`

**Schemas:**

```javascript
const BulkEmailSchema = {
  sendBulk: yup.object({
    recipients: yup.array().required().min(1),
    options: yup.object({
      batchSize: yup.number().min(1).max(100),
      delay: yup.number().min(0),
      jobName: yup.string().max(255)
    })
  })
};
```

---

### 🎮 BƯỚC 5: Controllers

#### 5.1. `emailTemplate.controller.js`

**File:** `backend/src/controllers/admin/emailTemplate.controller.js`

**Endpoints:**

```javascript
const emailTemplateController = {
  // 1. getAllTemplates
  // 2. getTemplateById
  // 3. createTemplate
  // 4. updateTemplate
  // 5. deleteTemplate
  // 6. previewTemplate
  // 7. testSendTemplate
  // 8. getCategories
};
```

**Thứ tự implement:**
1. `getAllTemplates` - Cơ bản
2. `getTemplateById` - Cơ bản
3. `getCategories` - Đơn giản
4. `createTemplate` - Cần validation
5. `updateTemplate` - Tương tự create
6. `deleteTemplate` - Đơn giản
7. `previewTemplate` - Cần service
8. `testSendTemplate` - Cần service

---

#### 5.2. `bulkEmail.controller.js`

**File:** `backend/src/controllers/admin/bulkEmail.controller.js`

**Endpoints:**

```javascript
const bulkEmailController = {
  // 1. sendBulkEmail
  // 2. getAllBatchJobs
  // 3. getBatchJobById
  // 4. getBatchJobRecipients
  // 5. retryFailedEmails
  // 6. cancelBatchJob
};
```

**Thứ tự implement:**
1. `getAllBatchJobs` - Cơ bản
2. `getBatchJobById` - Cơ bản
3. `getBatchJobRecipients` - Cơ bản
4. `sendBulkEmail` - Tạo job và process
5. `retryFailedEmails` - Dùng service
6. `cancelBatchJob` - Đơn giản

---

#### 5.3. `emailLog.controller.js`

**File:** `backend/src/controllers/admin/emailLog.controller.js`

**Endpoints:**

```javascript
const emailLogController = {
  // 1. getAllLogs
  // 2. getLogById
  // 3. getStats
};
```

**Thứ tự implement:**
1. `getAllLogs` - Cơ bản
2. `getLogById` - Cơ bản
3. `getStats` - Thống kê

---

### 🛣️ BƯỚC 6: Routes

#### 6.1. `emailTemplate.router.js`

**File:** `backend/src/routers/admin/emailTemplate.router.js`

**Routes:**

```javascript
Router.get('/', emailTemplateController.getAllTemplates);
Router.get('/categories', emailTemplateController.getCategories);
Router.get('/:id', emailTemplateController.getTemplateById);
Router.post('/', emailTemplateController.createTemplate);
Router.put('/:id', emailTemplateController.updateTemplate);
Router.delete('/:id', emailTemplateController.deleteTemplate);
Router.post('/:id/preview', emailTemplateController.previewTemplate);
Router.post('/:id/test-send', emailTemplateController.testSendTemplate);
Router.post('/:id/send-bulk', bulkEmailController.sendBulkEmail);
```

---

#### 6.2. `bulkEmail.router.js`

**File:** `backend/src/routers/admin/bulkEmail.router.js`

**Routes:**

```javascript
Router.get('/bulk-jobs', bulkEmailController.getAllBatchJobs);
Router.get('/bulk-jobs/:id', bulkEmailController.getBatchJobById);
Router.get('/bulk-jobs/:id/recipients', bulkEmailController.getBatchJobRecipients);
Router.post('/bulk-jobs/:id/retry', bulkEmailController.retryFailedEmails);
Router.post('/bulk-jobs/:id/cancel', bulkEmailController.cancelBatchJob);
```

---

#### 6.3. `emailLog.router.js`

**File:** `backend/src/routers/admin/emailLog.router.js`

**Routes:**

```javascript
Router.get('/email-logs', emailLogController.getAllLogs);
Router.get('/email-logs/:id', emailLogController.getLogById);
Router.get('/email-logs/stats', emailLogController.getStats);
```

---

#### 6.4. Tích hợp vào `admin/index.js`

**File:** `backend/src/routers/admin/index.js`

**Thêm routes:**

```javascript
import emailTemplateRouter from './emailTemplate.router.js';
import bulkEmailRouter from './bulkEmail.router.js';
import emailLogRouter from './emailLog.router.js';

router.use('/email-templates', emailTemplateRouter);
router.use('/email-templates', bulkEmailRouter); // Nested routes
router.use('/email-logs', emailLogRouter);
```

---

## 📊 Tổng Kết Thứ Tự

### Phase 1: Foundation (Week 1)

**Day 1-2: Database & Models**
1. ✅ Chạy SQL migrations
2. `emailTemplate.model.js` - Tất cả methods
3. `emailLog.model.js` - Tất cả methods

**Day 3-4: Core Services**
4. `templateRenderer.service.js` - Tất cả methods
5. `emailTemplate.service.js` - Basic methods (getAll, getById, create, update, delete)
6. Update `emailService.js` - Thêm `sendDynamicEmail()`

**Day 5: Validation & Basic APIs**
7. `emailTemplate.validation.js`
8. `emailTemplate.controller.js` - CRUD cơ bản
9. `emailTemplate.router.js`
10. Test basic CRUD

---

### Phase 2: Advanced Features (Week 2)

**Day 1-2: Template Features**
11. `emailTemplate.service.js` - Preview, testSend
12. `emailTemplate.controller.js` - Preview, testSend endpoints
13. Test preview & test send

**Day 3-4: Bulk Email Models & Services**
14. `emailBatchJob.model.js` - Tất cả methods
15. `emailBatchRecipient.model.js` - Tất cả methods
16. `bulkEmail.service.js` - createBatchJob, processBatchJob
17. Test bulk email service

**Day 5: Bulk Email APIs**
18. `bulkEmail.validation.js`
19. `bulkEmail.controller.js` - Basic endpoints
20. `bulkEmail.router.js`
21. Test bulk email APIs

---

### Phase 3: Advanced Bulk Features (Week 3)

**Day 1-2: Batch Processing**
22. `bulkEmail.service.js` - processBatchJobWithBatching
23. `bulkEmail.controller.js` - Advanced endpoints
24. Test batch processing với số lượng lớn

**Day 3-4: Email Logs & Analytics**
25. `emailLog.model.js` - getStats
26. `emailLog.controller.js` - Tất cả endpoints
27. `emailLog.router.js`
28. Test logs & stats

**Day 5: Integration & Testing**
29. Tích hợp vào existing services
30. End-to-end testing
31. Performance testing

---

### Phase 4: Polish & Optimization (Week 4)

**Day 1-2: Error Handling & Retry**
32. `bulkEmail.service.js` - retryFailedEmails
33. Error handling improvements
34. Retry mechanism testing

**Day 3-4: Optimization**
35. Caching templates
36. Rate limiting
37. Performance optimization

**Day 5: Documentation & Migration**
38. Migration script cho existing templates
39. Documentation
40. Final testing

---

## 🚀 Quick Start - Bắt Đầu Ngay

### Bước 1: Chạy SQL Migrations

```bash
# Chạy migration cho email templates
mysql -u root -p beeit < backend/src/migrations/create_email_templates_tables.sql

# Chạy migration cho bulk email
mysql -u root -p beeit < backend/src/migrations/create_bulk_email_tables.sql
```

### Bước 2: Tạo Models (Bắt đầu từ đây)

1. Tạo `emailTemplate.model.js`
2. Tạo `emailLog.model.js`
3. Test models với simple queries

### Bước 3: Tạo Services

1. Tạo `templateRenderer.service.js`
2. Update `emailService.js` với `sendDynamicEmail()`
3. Test render template

### Bước 4: Tạo APIs

1. Tạo `emailTemplate.controller.js`
2. Tạo `emailTemplate.router.js`
3. Test CRUD qua Postman

---

## 📝 Checklist

### Models
- [ ] emailTemplate.model.js
- [ ] emailLog.model.js
- [ ] emailBatchJob.model.js
- [ ] emailBatchRecipient.model.js

### Services
- [ ] templateRenderer.service.js
- [ ] emailTemplate.service.js
- [ ] bulkEmail.service.js
- [ ] Update emailService.js

### Validation
- [ ] emailTemplate.validation.js
- [ ] bulkEmail.validation.js

### Controllers
- [ ] emailTemplate.controller.js
- [ ] bulkEmail.controller.js
- [ ] emailLog.controller.js

### Routes
- [ ] emailTemplate.router.js
- [ ] bulkEmail.router.js
- [ ] emailLog.router.js
- [ ] Tích hợp vào admin/index.js

---

## 🎯 Ưu Tiên

**High Priority (Làm trước):**
1. Database migrations ✅
2. emailTemplate.model.js
3. templateRenderer.service.js
4. emailService.sendDynamicEmail()
5. Basic CRUD APIs

**Medium Priority:**
6. Preview & Test Send
7. Bulk email models
8. Bulk email service
9. Bulk email APIs

**Low Priority (Làm sau):**
10. Email logs & analytics
11. Retry mechanism
12. Caching & optimization

---

Bắt đầu từ đâu? Tôi khuyên bắt đầu với **emailTemplate.model.js**! 😊

