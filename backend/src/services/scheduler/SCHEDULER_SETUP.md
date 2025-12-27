# 📅 Hướng Dẫn Setup Scheduled Jobs

## Tổng Quan

Hệ thống scheduled jobs được thiết kế để tự động gửi email reminder cho các sự kiện và đóng phí.

## Các Scheduled Jobs

### 1. Event Reminders
- **Mục đích**: Gửi nhắc nhở cho người đăng ký trước khi sự kiện diễn ra
- **Tần suất**: Nên chạy mỗi giờ
- **Logic**: Gửi reminder cho events diễn ra trong 24h tới

### 2. Payment Reminders
- **Mục đích**: Gửi nhắc nhở đóng phí cho thành viên
- **Tần suất**: Nên chạy mỗi ngày
- **Logic**: Gửi reminder cho members có deadline trong 7 ngày tới

## Cách Setup

### Option 1: Sử dụng Cron Job (Linux/Mac)

Tạo file cron job:

```bash
# Mở crontab
crontab -e

# Thêm các dòng sau:
# Chạy event reminders mỗi giờ
0 * * * * curl -X POST http://localhost:8080/api/scheduler/event-reminders -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Chạy payment reminders mỗi ngày lúc 9h sáng
0 9 * * * curl -X POST http://localhost:8080/api/scheduler/payment-reminders -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Option 2: Sử dụng node-cron (Trong code)

1. Cài đặt package:
```bash
npm install node-cron
```

2. Tạo file `backend/src/services/scheduler/cronJobs.js`:

```javascript
import cron from 'node-cron';
import { sendEventReminders, sendPaymentReminders } from './emailScheduler.service.js';

// Chạy event reminders mỗi giờ
cron.schedule('0 * * * *', async () => {
  console.log('🕐 Chạy event reminders...');
  try {
    const result = await sendEventReminders();
    console.log('✅ Event reminders:', result);
  } catch (error) {
    console.error('❌ Lỗi event reminders:', error);
  }
});

// Chạy payment reminders mỗi ngày lúc 9h sáng
cron.schedule('0 9 * * *', async () => {
  console.log('💰 Chạy payment reminders...');
  try {
    const result = await sendPaymentReminders();
    console.log('✅ Payment reminders:', result);
  } catch (error) {
    console.error('❌ Lỗi payment reminders:', error);
  }
});

console.log('📅 Scheduled jobs đã được khởi động');
```

3. Import vào `server.js`:

```javascript
// Thêm vào đầu file server.js
import './services/scheduler/cronJobs.js';
```

### Option 3: Gọi thủ công qua API

Có thể gọi API để chạy scheduled jobs:

```bash
# Chạy tất cả jobs
POST /api/scheduler/run-all
Headers: Authorization: Bearer <admin_token>

# Chạy riêng event reminders
POST /api/scheduler/event-reminders
Headers: Authorization: Bearer <admin_token>

# Chạy riêng payment reminders
POST /api/scheduler/payment-reminders
Headers: Authorization: Bearer <admin_token>
```

## Lưu Ý

1. **Event Reminders**: 
   - Chỉ gửi cho events đã published (status = 1)
   - Chỉ gửi cho events diễn ra trong 24h tới
   - Có thể cải thiện để tránh gửi trùng (lưu flag đã gửi)

2. **Payment Reminders**:
   - Cần có bảng lưu thông tin đóng phí của members
   - Hiện tại chưa implement đầy đủ, cần bổ sung sau

3. **Security**:
   - Tất cả API endpoints cần authentication
   - Nên thêm middleware `isAdmin` để chỉ admin mới gọi được

## Testing

Để test scheduled jobs:

```bash
# Test event reminders
curl -X POST http://localhost:8080/api/scheduler/event-reminders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

