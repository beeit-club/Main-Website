# 📧 Hướng Dẫn Sử Dụng Email Động

## ✅ Đã Hoàn Thành

### 1. Database ✅
- Đã tạo 5 bảng trong database
- Đã có categories mặc định

### 2. Backend Code ✅
- ✅ Models (4 files)
- ✅ Services (3 files) 
- ✅ Controllers (3 files)
- ✅ Validation (2 files)
- ✅ Routes (đã tích hợp)

### 3. API Endpoints ✅
- Tất cả endpoints đã sẵn sàng

---

## 🚀 Cách Sử Dụng

### Bước 1: Tạo Template Qua API

**POST** `/api/admin/email-templates`

```json
{
  "name": "Thông báo sự kiện",
  "slug": "event-notification",
  "subject": "Thông báo: {{event_title}}",
  "html_content": "<html><body><h1>Xin chào {{fullname}}!</h1><p>Sự kiện {{event_title}} sẽ diễn ra vào {{start_time}}</p></body></html>",
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
    },
    {
      "name": "start_time",
      "type": "string",
      "required": false,
      "description": "Thời gian bắt đầu"
    }
  ],
  "default_variables": {
    "fullname": "Nguyễn Văn A",
    "event_title": "Workshop ReactJS"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tạo template thành công",
  "data": {
    "template": {
      "id": 1,
      "name": "Thông báo sự kiện",
      "slug": "event-notification",
      ...
    }
  }
}
```

---

### Bước 2: Sử Dụng Template Trong Code

#### Cách 1: Gửi Email Đơn

```javascript
// Trong service của bạn (ví dụ: event.service.js)
import { emailService } from '../services/email/emailService.js';

// Gửi email với template từ database
await emailService.sendDynamicEmail(
  'event-notification',  // Template slug hoặc ID
  'user@example.com',     // Email người nhận
  {
    fullname: 'Nguyễn Văn A',
    event_title: 'Workshop ReactJS',
    start_time: 'Thứ Hai, 15/1/2024, 09:00'
  }
);
```

#### Cách 2: Gửi Email Hàng Loạt

```javascript
// Trong service của bạn
import bulkEmailService from '../services/admin/bulkEmail.service.js';

// Lấy danh sách người cần gửi
const registrations = await eventModel.getAllRegistrationsForEvent(eventId);

// Tạo batch job
const job = await bulkEmailService.createBatchJob(
  'event-notification',  // Template slug
  registrations.map(reg => ({
    email: reg.user_id ? user.email : reg.guest_email,
    variables: {
      fullname: reg.user_id ? user.fullname : reg.guest_name,
      event_title: event.title,
      start_time: formatDate(event.start_time),
      location: event.location
    }
  })),
  {
    jobName: `Event Notification - ${event.title}`,
    batchSize: 20,  // Gửi 20 email mỗi batch
    delay: 1000,    // Delay 1s giữa các batch
    createdBy: req.user.id
  }
);

// Process job (async - không block)
bulkEmailService.processBatchJob(job.id, {
  batchSize: 20,
  delay: 1000
}).catch(error => {
  console.error('Lỗi khi process batch job:', error);
});

// Check status sau đó
const status = await bulkEmailService.getBatchJobStatus(job.id);
console.log(`Progress: ${status.progress_percent}%`);
```

---

### Bước 3: Tích Hợp Vào Existing Code

#### Ví dụ: Gửi email khi có event mới

**File:** `backend/src/services/admin/event.service.js`

```javascript
// Thêm vào method createEvent hoặc updateEvent
import { emailService } from '../email/emailService.js';

async createEvent(data) {
  // ... existing code ...
  
  // Sau khi tạo event thành công
  // Gửi email thông báo cho tất cả members (nếu cần)
  if (event.is_public) {
    try {
      // Lấy danh sách members
      const members = await getActiveMembers();
      
      // Gửi bulk email
      const job = await bulkEmailService.createBatchJob(
        'event-notification',
        members.map(member => ({
          email: member.email,
          variables: {
            fullname: member.fullname,
            event_title: event.title,
            start_time: formatDate(event.start_time),
            location: event.location
          }
        })),
        { jobName: `New Event: ${event.title}` }
      );
      
      // Process async
      bulkEmailService.processBatchJob(job.id).catch(console.error);
    } catch (error) {
      console.error('Lỗi khi gửi email thông báo sự kiện:', error);
      // Không throw error để không ảnh hưởng đến việc tạo event
    }
  }
  
  return event;
}
```

---

## 📋 Ví Dụ Thực Tế

### Ví Dụ 1: Gửi Email Khi Có Event Mới

```javascript
// backend/src/services/admin/event.service.js

import bulkEmailService from './bulkEmail.service.js';
import { getActiveMembers } from '../member.service.js'; // Giả sử có service này

async notifyNewEvent(event) {
  // Chỉ gửi nếu event là public
  if (!event.is_public) return;

  // Lấy danh sách active members
  const members = await getActiveMembers();
  
  if (members.length === 0) return;

  // Tạo batch job
  const job = await bulkEmailService.createBatchJob(
    'event-notification',  // Template slug
    members.map(member => ({
      email: member.email,
      variables: {
        fullname: member.fullname,
        event_title: event.title,
        start_time: new Date(event.start_time).toLocaleString('vi-VN', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        location: event.location || 'Chưa có địa điểm'
      }
    })),
    {
      jobName: `Thông báo sự kiện mới: ${event.title}`,
      batchSize: 20,
      delay: 1000
    }
  );

  // Process async
  bulkEmailService.processBatchJob(job.id, {
    batchSize: 20,
    delay: 1000
  }).catch(error => {
    console.error('Lỗi khi gửi email thông báo sự kiện:', error);
  });

  return job;
}
```

### Ví Dụ 2: Gửi Email Reminder

```javascript
// backend/src/services/scheduler/emailScheduler.service.js

import { emailService } from '../email/emailService.js';

async sendEventReminders() {
  // Lấy events sắp diễn ra trong 24h
  const events = await eventModel.getUpcomingEvents(24); // 24 hours

  for (const event of events) {
    const registrations = await eventModel.getAllRegistrationsForEvent(event.id);
    
    for (const reg of registrations.data) {
      const user = reg.user_id ? await AuthModel.getUserById(reg.user_id) : null;
      
      try {
        await emailService.sendDynamicEmail(
          'event-reminder',  // Template slug
          user ? user.email : reg.guest_email,
          {
            fullname: user ? user.fullname : reg.guest_name,
            event_title: event.title,
            start_time: formatDate(event.start_time),
            location: event.location,
            time_until: calculateTimeUntil(event.start_time)
          }
        );
      } catch (error) {
        console.error(`Lỗi khi gửi reminder cho ${reg.guest_email}:`, error);
      }
    }
  }
}
```

---

## 🧪 Test APIs

### 1. Test Tạo Template

```bash
curl -X POST http://localhost:3000/api/admin/email-templates \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Template",
    "slug": "test-template",
    "subject": "Test: {{fullname}}",
    "html_content": "<html><body><h1>Xin chào {{fullname}}!</h1></body></html>",
    "category": "custom",
    "variables": [{"name": "fullname", "type": "string", "required": true}],
    "default_variables": {"fullname": "Nguyễn Văn A"}
  }'
```

### 2. Test Preview Template

```bash
curl -X POST http://localhost:3000/api/admin/email-templates/1/preview \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "variables": {
      "fullname": "Trần Thị B"
    }
  }'
```

### 3. Test Gửi Email

```bash
curl -X POST http://localhost:3000/api/admin/email-templates/1/test-send \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "recipient_email": "your-email@example.com",
    "variables": {
      "fullname": "Nguyễn Văn A"
    }
  }'
```

---

## 📊 Check Status

### Xem Batch Job Status

```bash
GET /api/admin/email-templates/bulk-jobs/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "job": {
      "id": 1,
      "job_name": "Event Notification",
      "status": "processing",
      "total_recipients": 100,
      "sent_count": 45,
      "failed_count": 2,
      "progress_percent": 45.5,
      "started_at": "2024-01-15T10:00:00Z"
    }
  }
}
```

---

## 🔄 So Sánh: Cũ vs Mới

### Cách Cũ (File Templates)

```javascript
// Phải có file loginOTP.hbs
await emailService.sendLoginOtp({ 
  email: 'user@example.com',
  otp: '123456' 
});
```

### Cách Mới (Database Templates)

```javascript
// Template lưu trong database, có thể sửa qua admin panel
await emailService.sendDynamicEmail(
  'custom-login-otp',  // Template slug
  'user@example.com',
  { otp: '123456' }
);
```

**Lợi ích:**
- ✅ Admin có thể sửa template không cần deploy
- ✅ Có thể tạo nhiều template khác nhau
- ✅ Có thể preview và test trước khi gửi
- ✅ Tracking và analytics

---

## ⚠️ Lưu Ý

1. **Authentication**: Tất cả APIs cần token
2. **Permissions**: Cần có permission phù hợp
3. **Rate Limiting**: Bulk email có thể mất thời gian
4. **Error Handling**: Đã có, nhưng cần test kỹ

---

## 🎯 Next Steps

1. **Tạo Template Mẫu**: Tạo một vài template mẫu qua API
2. **Test**: Test gửi email với template mới
3. **Tích Hợp**: Tích hợp vào existing services
4. **Frontend**: Tạo admin panel để quản lý (optional)

---

## 📝 Checklist

- [x] Database đã tạo
- [x] Backend code đã hoàn thành
- [x] APIs đã sẵn sàng
- [ ] Tạo template mẫu qua API
- [ ] Test gửi email
- [ ] Tích hợp vào existing code
- [ ] Frontend admin panel (optional)

---

Bạn đã sẵn sàng sử dụng! 🚀

