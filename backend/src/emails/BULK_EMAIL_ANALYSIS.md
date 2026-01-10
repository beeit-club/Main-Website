# 📧 Phân Tích Chi Tiết: Chức Năng Gửi Email Hàng Loạt

## 🎯 Mục Đích

Gửi email cho nhiều người cùng lúc với:
- Template giống nhau
- Variables khác nhau cho mỗi người
- Tracking progress
- Error handling
- Retry mechanism

---

## 📊 Use Cases Cụ Thể

### 1. Gửi Thông Báo Sự Kiện

**Scenario:**
- Event có 500 người đăng ký
- Cần gửi email thông báo thay đổi thời gian

**Requirements:**
- Gửi cho tất cả 500 người
- Mỗi người có tên khác nhau
- Thông tin sự kiện giống nhau
- Track: ai đã nhận, ai chưa nhận

**Implementation:**
```javascript
// Lấy tất cả registrations
const registrations = await eventModel.getAllRegistrationsForEvent(eventId);

// Tạo batch job
const job = await bulkEmailService.createBatchJob(
  'event-notification',
  registrations.map(reg => ({
    email: reg.user_id ? user.email : reg.guest_email,
    variables: {
      fullname: reg.user_id ? user.fullname : reg.guest_name,
      event_title: event.title,
      start_time: formatDate(event.start_time),
      location: event.location
    }
  })),
  { jobName: `Event Notification - ${event.title}` }
);

// Process
await bulkEmailService.processBatchJobWithBatching(job.id, {
  batchSize: 20,  // Gửi 20 email mỗi batch
  delay: 2000     // Delay 2s giữa các batch
});
```

---

### 2. Gửi Reminder Đóng Phí

**Scenario:**
- 200 thành viên sắp đến hạn đóng phí
- Gửi reminder 7 ngày trước hạn

**Requirements:**
- Gửi cho 200 người
- Mỗi người có deadline và số tiền khác nhau
- Tính số ngày còn lại

**Implementation:**
```javascript
// Lấy members sắp đến hạn
const members = await getMembersWithUpcomingDeadline(7); // 7 ngày

const job = await bulkEmailService.createBatchJob(
  'payment-reminder',
  members.map(member => ({
    email: member.email,
    variables: {
      name: member.fullname,
      deadline: formatDate(member.deadline),
      amount: formatCurrency(member.amount),
      days_remaining: calculateDaysRemaining(member.deadline)
    }
  })),
  { jobName: 'Payment Reminder - 7 days before deadline' }
);
```

---

### 3. Gửi Newsletter

**Scenario:**
- Gửi newsletter hàng tháng cho tất cả thành viên
- Nội dung giống nhau, chỉ tên khác

**Requirements:**
- Gửi cho tất cả active members (1000+ người)
- Nội dung newsletter giống nhau
- Chỉ fullname khác nhau

**Implementation:**
```javascript
// Lấy tất cả active members
const members = await getActiveMembers();

const job = await bulkEmailService.createBatchJob(
  'newsletter',
  members.map(member => ({
    email: member.email,
    variables: {
      fullname: member.fullname,
      newsletter_content: newsletterContent, // Giống nhau
      month: getCurrentMonth()
    }
  })),
  { jobName: `Newsletter - ${getCurrentMonth()}` }
);
```

---

### 4. Gửi Thông Báo Hệ Thống

**Scenario:**
- Thông báo bảo trì hệ thống
- Gửi cho tất cả users

**Requirements:**
- Gửi cho tất cả users (5000+ người)
- Nội dung giống nhau
- Cần gửi nhanh nhưng không spam

**Implementation:**
```javascript
const users = await getAllUsers();

const job = await bulkEmailService.createBatchJob(
  'system-announcement',
  users.map(user => ({
    email: user.email,
    variables: {
      fullname: user.fullname,
      message: 'Hệ thống sẽ bảo trì từ 2h-4h sáng ngày mai',
      maintenance_date: '15/1/2024'
    }
  })),
  { 
    jobName: 'System Maintenance Announcement',
    options: {
      batchSize: 50,  // Gửi nhiều hơn
      delay: 500      // Delay ngắn hơn
    }
  }
);
```

---

## 🔧 Technical Requirements

### 1. Performance

**Vấn đề:**
- Gửi 1000 email → Mất nhiều thời gian
- Block main thread → App chậm
- Timeout nếu quá lâu

**Giải pháp:**
- Async processing
- Batch processing (chia nhỏ)
- Queue system
- Background jobs

### 2. Rate Limiting

**Vấn đề:**
- Gửi quá nhiều email cùng lúc → Bị block bởi email provider
- Gmail: ~500 email/ngày
- SendGrid: ~100 email/giây

**Giải pháp:**
- Limit số email/giây
- Delay giữa các batch
- Spread over time

### 3. Error Handling

**Vấn đề:**
- Một số email fail → Không biết email nào
- Network error → Cần retry
- Invalid email → Skip

**Giải pháp:**
- Log từng email
- Retry failed emails
- Skip invalid emails
- Error report

### 4. Progress Tracking

**Vấn đề:**
- Không biết đã gửi bao nhiêu
- Không biết còn bao lâu
- Không biết có lỗi không

**Giải pháp:**
- Update progress real-time
- Status tracking
- Progress percentage
- Error count

---

## 📋 Database Schema Chi Tiết

### Bảng `email_batch_jobs`

```sql
CREATE TABLE IF NOT EXISTS `email_batch_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `template_id` bigint unsigned DEFAULT NULL,
  `template_slug` varchar(255) DEFAULT NULL,
  `job_name` varchar(255) NOT NULL COMMENT 'Tên job (mô tả)',
  `status` enum('pending','processing','completed','failed','cancelled') DEFAULT 'pending',
  `total_recipients` int unsigned NOT NULL,
  `sent_count` int unsigned DEFAULT 0,
  `failed_count` int unsigned DEFAULT 0,
  `progress_percent` decimal(5,2) DEFAULT 0.00,
  `started_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `error_message` text DEFAULT NULL,
  `options` json DEFAULT NULL COMMENT 'Options: batchSize, delay, etc.',
  `created_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `status` (`status`),
  KEY `created_by` (`created_by`),
  FOREIGN KEY (`template_id`) REFERENCES `email_templates` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Bảng `email_batch_recipients`

```sql
CREATE TABLE IF NOT EXISTS `email_batch_recipients` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `batch_job_id` bigint unsigned NOT NULL,
  `recipient_email` varchar(255) NOT NULL,
  `status` enum('pending','sent','failed') DEFAULT 'pending',
  `variables` json DEFAULT NULL COMMENT 'Variables cho recipient này',
  `error_message` text DEFAULT NULL,
  `retry_count` int unsigned DEFAULT 0,
  `sent_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `batch_job_id` (`batch_job_id`),
  KEY `status` (`status`),
  FOREIGN KEY (`batch_job_id`) REFERENCES `email_batch_jobs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 🔄 Flow Chi Tiết

### Flow: Gửi Email Hàng Loạt

```
1. User/Admin tạo batch job
   POST /api/admin/email-templates/:id/send-bulk
   {
     recipients: [
       { email: 'user1@example.com', variables: {...} },
       { email: 'user2@example.com', variables: {...} },
       ...
     ],
     options: {
       batchSize: 20,
       delay: 1000,
       jobName: 'Event Notification'
     }
   }
   ↓
2. Backend tạo batch_job record
   - status = 'pending'
   - total_recipients = recipients.length
   ↓
3. Backend tạo batch_recipients records
   - Mỗi recipient = 1 record
   - status = 'pending'
   ↓
4. Backend start processing (async)
   - Update batch_job status = 'processing'
   - started_at = NOW()
   ↓
5. Chia recipients thành batches
   - Batch 1: recipients[0-19]
   - Batch 2: recipients[20-39]
   - ...
   ↓
6. Process từng batch
   For each batch:
     For each recipient:
       a. Get template
       b. Render với variables
       c. Send email
       d. Update recipient status
       e. Log vào email_logs
     Update batch_job progress
     Delay (nếu có)
   ↓
7. Khi hoàn thành
   - Update batch_job:
     - status = 'completed'
     - completed_at = NOW()
     - progress_percent = 100
   - Return summary
```

---

## 💻 Code Implementation

### Service: `bulkEmail.service.js`

```javascript
class BulkEmailService {
  // Tạo batch job
  async createBatchJob(templateIdOrSlug, recipients, options = {}) {
    // Validate
    if (!recipients || recipients.length === 0) {
      throw new Error('Recipients không được rỗng');
    }

    // Get template
    const template = await this.getTemplate(templateIdOrSlug);

    // Create batch job
    const job = await emailBatchJobModel.create({
      template_id: template.id,
      template_slug: template.slug,
      job_name: options.jobName || `Bulk Email - ${template.name}`,
      total_recipients: recipients.length,
      status: 'pending',
      options: JSON.stringify(options)
    });

    // Create recipients
    const recipientRecords = recipients.map(rec => ({
      batch_job_id: job.id,
      recipient_email: rec.email,
      variables: JSON.stringify(rec.variables || {}),
      status: 'pending'
    }));

    await emailBatchRecipientModel.bulkCreate(recipientRecords);

    return job;
  }

  // Process batch job
  async processBatchJob(jobId, options = {}) {
    const job = await emailBatchJobModel.getById(jobId);
    if (!job) throw new Error('Job not found');

    // Update status
    await emailBatchJobModel.update(jobId, {
      status: 'processing',
      started_at: new Date()
    });

    const batchSize = options.batchSize || 20;
    const delay = options.delay || 1000;

    try {
      // Get all pending recipients
      let recipients = await emailBatchRecipientModel.getPendingByJobId(jobId);
      const total = recipients.length;

      // Process in batches
      for (let i = 0; i < recipients.length; i += batchSize) {
        const batch = recipients.slice(i, i + batchSize);
        
        // Process batch (parallel)
        await Promise.all(
          batch.map(recipient => this.processRecipient(job, recipient))
        );

        // Update progress
        const processed = Math.min(i + batchSize, total);
        const progress = (processed / total) * 100;
        
        await emailBatchJobModel.update(jobId, {
          sent_count: processed,
          progress_percent: progress
        });

        // Delay between batches
        if (i + batchSize < recipients.length) {
          await this.sleep(delay);
        }
      }

      // Get final counts
      const stats = await emailBatchRecipientModel.getStatsByJobId(jobId);

      // Update job status
      await emailBatchJobModel.update(jobId, {
        status: 'completed',
        completed_at: new Date(),
        sent_count: stats.sent,
        failed_count: stats.failed,
        progress_percent: 100
      });

      return { success: true, stats };
    } catch (error) {
      await emailBatchJobModel.update(jobId, {
        status: 'failed',
        error_message: error.message
      });
      throw error;
    }
  }

  // Process single recipient
  async processRecipient(job, recipient) {
    try {
      const variables = JSON.parse(recipient.variables || '{}');
      
      // Send email
      await emailService.sendDynamicEmail(
        job.template_slug,
        recipient.recipient_email,
        variables
      );

      // Update recipient
      await emailBatchRecipientModel.update(recipient.id, {
        status: 'sent',
        sent_at: new Date()
      });
    } catch (error) {
      // Update recipient as failed
      await emailBatchRecipientModel.update(recipient.id, {
        status: 'failed',
        error_message: error.message,
        retry_count: recipient.retry_count + 1
      });
    }
  }

  // Retry failed emails
  async retryFailedEmails(jobId) {
    const job = await emailBatchJobModel.getById(jobId);
    const failedRecipients = await emailBatchRecipientModel.getFailedByJobId(jobId);

    // Reset status
    await emailBatchRecipientModel.resetStatus(failedRecipients.map(r => r.id));

    // Re-process
    return this.processBatchJob(jobId);
  }

  // Get job status
  async getBatchJobStatus(jobId) {
    const job = await emailBatchJobModel.getById(jobId);
    const stats = await emailBatchRecipientModel.getStatsByJobId(jobId);

    return {
      id: job.id,
      job_name: job.job_name,
      status: job.status,
      total_recipients: job.total_recipients,
      sent_count: stats.sent,
      failed_count: stats.failed,
      progress_percent: job.progress_percent,
      started_at: job.started_at,
      completed_at: job.completed_at
    };
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

---

## 📊 API Endpoints

### 1. Tạo và Gửi Bulk Email

```
POST /api/admin/email-templates/:id/send-bulk
Body: {
  recipients: [
    { email: 'user1@example.com', variables: {...} },
    { email: 'user2@example.com', variables: {...} }
  ],
  options: {
    batchSize: 20,
    delay: 1000,
    jobName: 'Custom Job Name'
  }
}
Response: {
  job_id: 123,
  status: 'pending',
  total_recipients: 100
}
```

### 2. Lấy Danh Sách Batch Jobs

```
GET /api/admin/email-templates/bulk-jobs
Query: page, limit, status, template_id
Response: {
  data: [...],
  pagination: {...}
}
```

### 3. Lấy Chi Tiết Batch Job

```
GET /api/admin/email-templates/bulk-jobs/:id
Response: {
  id: 123,
  job_name: 'Event Notification',
  status: 'processing',
  progress_percent: 45.5,
  sent_count: 45,
  failed_count: 2,
  total_recipients: 100,
  ...
}
```

### 4. Lấy Danh Sách Recipients

```
GET /api/admin/email-templates/bulk-jobs/:id/recipients
Query: page, limit, status
Response: {
  data: [
    { email: 'user1@example.com', status: 'sent', sent_at: '...' },
    { email: 'user2@example.com', status: 'failed', error_message: '...' }
  ]
}
```

### 5. Retry Failed Emails

```
POST /api/admin/email-templates/bulk-jobs/:id/retry
Response: {
  success: true,
  retried_count: 5
}
```

### 6. Cancel Job

```
POST /api/admin/email-templates/bulk-jobs/:id/cancel
Response: {
  success: true
}
```

---

## 🎯 Tối Ưu Hóa

### 1. Batch Size

- **Nhỏ (10-20)**: An toàn, ít lỗi, chậm
- **Vừa (50-100)**: Cân bằng
- **Lớn (200+)**: Nhanh, nhưng dễ bị rate limit

### 2. Delay

- **Không delay**: Nhanh nhất, nhưng dễ bị block
- **Delay 500ms-1s**: Cân bằng
- **Delay 2s+**: An toàn nhất

### 3. Concurrency

- **Sequential**: An toàn, chậm
- **Parallel (10-20)**: Cân bằng
- **Parallel (50+)**: Nhanh, nhưng cần rate limiting

---

## 🚨 Lưu Ý

1. **Rate Limiting**: Không gửi quá nhiều email/giây
2. **Error Handling**: Xử lý lỗi từng email, không crash toàn bộ
3. **Progress Tracking**: Update progress thường xuyên
4. **Retry Logic**: Retry failed emails với limit
5. **Monitoring**: Monitor performance và errors

---

Bạn muốn tôi bắt đầu implement phần nào trước? 😊

