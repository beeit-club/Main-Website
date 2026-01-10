# 🚀 Quick Start - Email Động

## ✅ Đã Hoàn Thành 100%

### ✅ Database
- 5 bảng đã tạo và sẵn sàng

### ✅ Backend Code
- ✅ 4 Models
- ✅ 3 Services  
- ✅ 3 Controllers
- ✅ 2 Validation
- ✅ 2 Routes (đã tích hợp)

### ✅ APIs
- Tất cả endpoints đã sẵn sàng sử dụng

---

## 🎯 Cách Sử Dụng NGAY

### Bước 1: Tạo Template Qua API (Postman/Thunder Client)

**POST** `http://localhost:3000/api/admin/email-templates`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Thông báo sự kiện",
  "slug": "event-notification",
  "subject": "Thông báo: {{event_title}}",
  "html_content": "<html><body style='font-family: Arial; padding: 20px;'><h1 style='color: #667eea;'>Xin chào {{fullname}}!</h1><p>Sự kiện <strong>{{event_title}}</strong> sẽ diễn ra vào <strong>{{start_time}}</strong></p><p>Địa điểm: {{location}}</p></body></html>",
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
      "description": "Thời gian"
    },
    {
      "name": "location",
      "type": "string",
      "required": false,
      "description": "Địa điểm"
    }
  ],
  "default_variables": {
    "fullname": "Nguyễn Văn A",
    "event_title": "Workshop ReactJS",
    "start_time": "Thứ Hai, 15/1/2024, 09:00",
    "location": "Phòng 101"
  }
}
```

**Sau khi tạo xong, lưu lại `id` hoặc `slug` của template!**

---

### Bước 2: Test Gửi Email

**POST** `http://localhost:3000/api/admin/email-templates/1/test-send`

**Body:**
```json
{
  "recipient_email": "your-email@example.com",
  "variables": {
    "fullname": "Nguyễn Văn A",
    "event_title": "Workshop ReactJS",
    "start_time": "Thứ Hai, 15/1/2024, 09:00",
    "location": "Phòng 101"
  }
}
```

**Kiểm tra email inbox!** 📧

---

### Bước 3: Sử Dụng Trong Code

#### Ví dụ: Gửi email khi có event mới

**File:** `backend/src/services/admin/event.service.js`

Thêm vào method `createEvent`:

```javascript
import bulkEmailService from './bulkEmail.service.js';
import { AuthModel } from '../../models/auth/index.js';

async createEvent(data) {
  // ... existing code tạo event ...
  const event = await eventModel.createEvent(data);
  
  // ✅ THÊM CODE NÀY: Gửi email thông báo
  if (event.is_public && event.status === 1) {
    try {
      // Lấy danh sách active users (hoặc members)
      // Giả sử bạn có method getAllActiveUsers()
      const users = await AuthModel.getAllActiveUsers(); // Hoặc method tương tự
      
      if (users && users.length > 0) {
        // Tạo batch job
        const job = await bulkEmailService.createBatchJob(
          'event-notification',  // Template slug bạn vừa tạo
          users.map(user => ({
            email: user.email,
            variables: {
              fullname: user.fullname,
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
        
        // Process async (không block)
        bulkEmailService.processBatchJob(job.id, {
          batchSize: 20,
          delay: 1000
        }).catch(error => {
          console.error('Lỗi khi gửi email thông báo sự kiện:', error);
        });
      }
    } catch (error) {
      console.error('Lỗi khi gửi email:', error);
      // Không throw để không ảnh hưởng đến việc tạo event
    }
  }
  
  return event;
}
```

---

### Bước 4: Gửi Email Đơn Trong Code

```javascript
import { emailService } from '../services/email/emailService.js';

// Gửi email với template từ database
await emailService.sendDynamicEmail(
  'event-notification',  // Template slug
  'user@example.com',
  {
    fullname: 'Nguyễn Văn A',
    event_title: 'Workshop ReactJS',
    start_time: 'Thứ Hai, 15/1/2024, 09:00',
    location: 'Phòng 101'
  }
);
```

---

## 📊 Check Status Bulk Email

**GET** `http://localhost:3000/api/admin/email-templates/bulk-jobs/:id`

Xem progress của batch job:
- `status`: pending/processing/completed/failed
- `progress_percent`: 0-100
- `sent_count`: Số email đã gửi
- `failed_count`: Số email thất bại

---

## 🧪 Test Checklist

- [ ] Tạo template qua API
- [ ] Test preview template
- [ ] Test gửi email đơn
- [ ] Test gửi bulk email
- [ ] Check batch job status
- [ ] Tích hợp vào existing code

---

## 💡 Tips

1. **Template Slug**: Dùng slug thay vì ID để dễ nhớ
2. **Variables**: Luôn validate variables trước khi gửi
3. **Bulk Email**: Process async để không block main thread
4. **Error Handling**: Đã có sẵn, nhưng nên log để debug

---

## 🎯 Tóm Tắt

✅ **Đã làm xong:**
- Database ✅
- Backend code ✅
- APIs ✅

🚀 **Cần làm:**
1. Tạo template qua API
2. Test gửi email
3. Tích hợp vào code của bạn

**Bạn đã sẵn sàng sử dụng!** 🎉

