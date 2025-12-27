# 🔍 Cách Hệ Thống Email Động Hoạt Động

## 💡 Hiểu Đơn Giản

### Hiện Tại (Email Cố Định):

```
File: loginOTP.hbs
Nội dung: "Mã OTP của bạn là: {{otp}}"
→ Code gọi: emailService.sendLoginOtp({ otp: "123456" })
→ Kết quả: "Mã OTP của bạn là: 123456"
```

### Tương Lai (Email Động):

```
Database: email_templates
Template: "Custom Welcome"
Nội dung: "Xin chào {{fullname}}, email của bạn là {{email}}"
→ Admin có thể sửa nội dung này qua web
→ Code gọi: emailService.sendDynamicEmail('custom-welcome', 'user@example.com', { fullname: "Nguyễn Văn A", email: "user@example.com" })
→ Kết quả: "Xin chào Nguyễn Văn A, email của bạn là user@example.com"
```

---

## 🎯 Dữ Liệu Động Là Gì?

### 1. **Variables (Biến)** - Dữ Liệu Thay Đổi Mỗi Lần Gửi

Ví dụ: Khi gửi email cho 100 người, mỗi người có:

- Tên khác nhau: "Nguyễn Văn A", "Trần Thị B", ...
- Email khác nhau: "a@example.com", "b@example.com", ...
- Mã OTP khác nhau: "123456", "789012", ...

→ Đây là **dữ liệu động** - thay đổi mỗi lần gửi

### 2. **Template (Mẫu)** - Cấu Trúc Cố Định

Ví dụ: Cấu trúc email luôn giống nhau:

```
"Xin chào {{fullname}},
Mã OTP của bạn là: {{otp}}"
```

→ Đây là **template** - cấu trúc cố định, chỉ thay {{fullname}} và {{otp}}

---

## 📝 Quy Trình Hoạt Động

### Bước 1: Admin Tạo Template (1 Lần)

**Admin vào web, tạo template mới:**

```
Tên template: "Thông báo sự kiện"
Subject: "Thông báo: {{event_title}}"

Nội dung HTML:
<html>
  <body>
    <h1>Xin chào {{fullname}}!</h1>
    <p>Sự kiện {{event_title}} sẽ diễn ra vào {{start_time}}</p>
    <p>Địa điểm: {{location}}</p>
  </body>
</html>
```

**Định nghĩa Variables (Admin phải khai báo):**

```json
[
  {
    "name": "fullname",
    "type": "string",
    "required": true,
    "description": "Họ và tên người nhận"
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
  },
  {
    "name": "location",
    "type": "string",
    "required": false,
    "description": "Địa điểm"
  }
]
```

**Giá trị mặc định (Optional - để preview):**

```json
{
  "fullname": "Nguyễn Văn A",
  "event_title": "Workshop ReactJS",
  "start_time": "Thứ Hai, 15/1/2024, 09:00",
  "location": "Phòng 101"
}
```

→ **Lưu vào database**

---

### Bước 2: Developer/Code Sử Dụng Template (Nhiều Lần)

**Khi có sự kiện mới, code gọi:**

```javascript
// Trong event.service.js
await emailService.sendDynamicEmail(
  'thong-bao-su-kien', // Tên template (slug)
  'user@example.com', // Email người nhận
  {
    // Dữ liệu động - truyền vào mỗi lần gửi
    fullname: 'Nguyễn Văn A',
    event_title: 'Workshop ReactJS',
    start_time: 'Thứ Hai, 15/1/2024, 09:00',
    location: 'Phòng 101',
  },
);
```

**Hệ thống sẽ:**

1. Lấy template từ database
2. Thay thế {{fullname}} → "Nguyễn Văn A"
3. Thay thế {{event_title}} → "Workshop ReactJS"
4. Thay thế {{start_time}} → "Thứ Hai, 15/1/2024, 09:00"
5. Thay thế {{location}} → "Phòng 101"
6. Gửi email

**Kết quả email:**

```
Subject: Thông báo: Workshop ReactJS

Xin chào Nguyễn Văn A!
Sự kiện Workshop ReactJS sẽ diễn ra vào Thứ Hai, 15/1/2024, 09:00
Địa điểm: Phòng 101
```

---

## 🔄 So Sánh 2 Cách

### Cách 1: Email Cố Định (Hiện Tại)

**Tạo template:**

- Developer viết file `.hbs`
- Lưu trong thư mục `backend/src/emails/`
- Phải deploy code mới để thay đổi

**Sử dụng:**

```javascript
// Code cố định
await emailService.sendLoginOtp({ otp: '123456' });
```

**Thay đổi nội dung:**

- Phải sửa file code
- Phải deploy lại
- Developer mới làm được

---

### Cách 2: Email Động (Mới)

**Tạo template:**

- Admin tạo qua web interface
- Lưu trong database
- Có thể sửa bất cứ lúc nào, không cần deploy

**Sử dụng:**

```javascript
// Code linh hoạt
await emailService.sendDynamicEmail(
  'custom-notification', // Tên template
  'user@example.com',
  {
    // Dữ liệu động
    fullname: user.fullname,
    event_title: event.title,
    // ... các biến khác
  },
);
```

**Thay đổi nội dung:**

- Admin vào web, sửa template
- Lưu → Áp dụng ngay
- Không cần developer

---

## 📋 Ví Dụ Thực Tế

### Scenario: Gửi email thông báo sự kiện cho 100 người

#### Với Email Cố Định:

```javascript
// Phải viết code cho từng loại email
for (const user of users) {
  await emailService.sendEventRegistrationConfirmed(registration, event, user);
}
```

→ Nếu muốn thay đổi nội dung email → Sửa code → Deploy

#### Với Email Động:

```javascript
// Code chung, template linh hoạt
for (const user of users) {
  await emailService.sendDynamicEmail(
    'event-notification', // Admin có thể đổi template này
    user.email,
    {
      fullname: user.fullname,
      event_title: event.title,
      start_time: formatDate(event.start_time),
      location: event.location,
    },
  );
}
```

→ Muốn thay đổi nội dung → Admin sửa template trong web → Xong!

---

## 🎨 Admin Panel - Giao Diện Quản Lý

### 1. Danh Sách Templates

```
┌─────────────────────────────────────────┐
│ Email Templates                         │
├─────────────────────────────────────────┤
│ [Tìm kiếm...] [Category ▼] [Status ▼] │
├─────────────────────────────────────────┤
│ ✅ Login OTP          [Edit] [Preview] │
│ ✅ Welcome Email      [Edit] [Preview] │
│ ✅ Event Notification [Edit] [Preview] │
│ ⚠️  Custom Template   [Edit] [Preview] │
└─────────────────────────────────────────┘
```

### 2. Tạo/Chỉnh Sửa Template

```
┌─────────────────────────────────────────┐
│ Tên template: [Thông báo sự kiện    ] │
│ Subject:      [Thông báo: {{event_title}}] │
│ Category:     [Event ▼]                │
├─────────────────────────────────────────┤
│ Nội dung HTML:                          │
│ ┌─────────────────────────────────────┐ │
│ │ <html>                              │ │
│ │   <body>                            │ │
│ │     <h1>Xin chào {{fullname}}!</h1>│ │
│ │     ...                              │ │
│ │   </body>                            │ │
│ │ </html>                              │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ Variables:                               │
│ • fullname (string, required)          │
│ • event_title (string, required)        │
│ • start_time (string, optional)         │
│ [+ Thêm variable]                       │
├─────────────────────────────────────────┤
│ [Preview] [Test Send] [Save] [Cancel]   │
└─────────────────────────────────────────┘
```

### 3. Preview Template

```
┌─────────────────────────────────────────┐
│ Preview: Thông báo sự kiện              │
├─────────────────────────────────────────┤
│ Subject: Thông báo: Workshop ReactJS    │
│                                          │
│ ┌─────────────────────────────────────┐ │
│ │ Xin chào Nguyễn Văn A!              │ │
│ │                                      │ │
│ │ Sự kiện Workshop ReactJS sẽ diễn ra │ │
│ │ vào Thứ Hai, 15/1/2024, 09:00       │ │
│ │                                      │ │
│ │ Địa điểm: Phòng 101                 │ │
│ └─────────────────────────────────────┘ │
│                                          │
│ [Dùng dữ liệu mẫu] [Test gửi email]     │
└─────────────────────────────────────────┘
```

---

## ❓ Câu Hỏi Thường Gặp

### Q1: Variables có phải định nghĩa khi tạo template không?

**A:** Có! Khi admin tạo template, phải khai báo:

- Tên variable: `fullname`, `event_title`, ...
- Loại: `string`, `number`, `date`, ...
- Bắt buộc: `required: true/false`
- Mô tả: Giải thích variable này dùng để làm gì

→ Giúp:

- Developer biết cần truyền gì vào
- System validate trước khi gửi
- Admin hiểu template cần gì

### Q2: Mỗi lần gửi email phải truyền variables không?

**A:** Có! Mỗi lần gửi email, code phải truyền dữ liệu thực tế:

```javascript
// Lần 1: Gửi cho Nguyễn Văn A
await emailService.sendDynamicEmail('template', 'a@example.com', {
  fullname: 'Nguyễn Văn A',
  event_title: 'Workshop ReactJS',
});

// Lần 2: Gửi cho Trần Thị B
await emailService.sendDynamicEmail('template', 'b@example.com', {
  fullname: 'Trần Thị B', // ← Khác nhau
  event_title: 'Workshop ReactJS',
});
```

### Q3: Default variables để làm gì?

**A:** Để preview và test:

- Khi admin xem preview → Dùng default values
- Khi test gửi email → Dùng default values (nếu không truyền)
- Khi gửi thật → Dùng dữ liệu thực tế từ code

### Q4: Có thể dùng template cũ (file .hbs) không?

**A:** Có! Hệ thống sẽ:

1. Tìm template trong database trước
2. Nếu không có → Tìm trong file `.hbs`
3. Nếu không có → Báo lỗi

→ **Backward compatible** - không ảnh hưởng code cũ

---

## 🎯 Tóm Tắt

1. **Admin tạo template** (1 lần) → Lưu vào database

   - Viết HTML với {{variables}}
   - Khai báo variables cần thiết
   - Set default values (để preview)

2. **Code sử dụng template** (nhiều lần)

   - Gọi `sendDynamicEmail(templateName, email, variables)`
   - Truyền dữ liệu thực tế mỗi lần gửi

3. **Hệ thống render**

   - Lấy template từ database
   - Thay thế {{variables}} bằng dữ liệu thực tế
   - Gửi email

4. **Admin có thể sửa template bất cứ lúc nào**
   - Không cần deploy code
   - Áp dụng ngay lập tức

---

## 💻 Code Example Đầy Đủ

### 1. Admin Tạo Template (Qua API hoặc Web)

```javascript
POST /api/admin/email-templates
{
  "name": "Thông báo sự kiện",
  "slug": "event-notification",
  "subject": "Thông báo: {{event_title}}",
  "html_content": `
    <html>
      <body>
        <h1>Xin chào {{fullname}}!</h1>
        <p>Sự kiện {{event_title}} sẽ diễn ra vào {{start_time}}</p>
        <p>Địa điểm: {{location}}</p>
      </body>
    </html>
  `,
  "variables": [
    { "name": "fullname", "type": "string", "required": true },
    { "name": "event_title", "type": "string", "required": true },
    { "name": "start_time", "type": "string", "required": false },
    { "name": "location", "type": "string", "required": false }
  ],
  "default_variables": {
    "fullname": "Nguyễn Văn A",
    "event_title": "Workshop ReactJS",
    "start_time": "Thứ Hai, 15/1/2024, 09:00",
    "location": "Phòng 101"
  }
}
```

### 2. Code Sử Dụng Template

```javascript
// Trong event.service.js
async notifyEventParticipants(eventId) {
  const event = await this.getEventById(eventId);
  const registrations = await eventModel.getAllRegistrationsForEvent(eventId);

  for (const reg of registrations) {
    const user = reg.user_id ? await AuthModel.getUserById(reg.user_id) : null;

    // Gửi email với template động
    await emailService.sendDynamicEmail(
      'event-notification',  // Template slug
      user ? user.email : reg.guest_email,
      {
        // Dữ liệu động - khác nhau mỗi người
        fullname: user ? user.fullname : reg.guest_name,
        event_title: event.title,
        start_time: formatDate(event.start_time),
        location: event.location
      }
    );
  }
}
```

### 3. Kết Quả

**Email gửi cho Nguyễn Văn A:**

```
Subject: Thông báo: Workshop ReactJS

Xin chào Nguyễn Văn A!
Sự kiện Workshop ReactJS sẽ diễn ra vào Thứ Hai, 15/1/2024, 09:00
Địa điểm: Phòng 101
```

**Email gửi cho Trần Thị B:**

```
Subject: Thông báo: Workshop ReactJS

Xin chào Trần Thị B!  ← Khác
Sự kiện Workshop ReactJS sẽ diễn ra vào Thứ Hai, 15/1/2024, 09:00
Địa điểm: Phòng 101
```

---

Bây giờ bạn đã hiểu rõ cách hoạt động chưa? 😊
