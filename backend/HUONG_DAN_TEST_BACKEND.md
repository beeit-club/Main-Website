# 🔍 HƯỚNG DẪN TEST BACKEND - KIỂM TRA DỮ LIỆU

## 📋 MỤC ĐÍCH

Kiểm tra xem backend đã lấy được đúng dữ liệu từ database chưa trước khi hiển thị trên frontend.

---

## 🚀 CÁCH KIỂM TRA

### Bước 1: Chạy SQL để thêm dữ liệu mẫu

```bash
# Nếu chưa chạy, chạy file SQL này:
mysql -u root -p beeit < backend/src/migrations/insert_beeit_achievements_photos.sql
```

Hoặc qua Laragon:
1. Mở Laragon → Database → Chọn database `beeit`
2. Tab SQL → Copy nội dung file `insert_beeit_achievements_photos.sql`
3. Paste và chạy

### Bước 2: Khởi động Backend Server

```bash
cd backend
npm start
# hoặc
npm run dev
```

### Bước 3: Test API Endpoint

#### Option 1: Dùng Browser/Postman
```
GET http://localhost:YOUR_PORT/api/client/beeit
```

#### Option 2: Dùng curl
```bash
curl http://localhost:YOUR_PORT/api/client/beeit
```

#### Option 3: Test trực tiếp trong code
Truy cập: `http://localhost:YOUR_PORT/api/client/beeit` trong browser

---

## 📊 LOG SẼ HIỂN THỊ

Khi gọi API `/api/client/beeit`, bạn sẽ thấy log chi tiết trong console backend:

### 1. Model Layer Logs
```
🏆 [ACHIEVEMENT MODEL] ===== BẮT ĐẦU LẤY ACHIEVEMENTS =====
📝 [ACHIEVEMENT MODEL] SQL: SELECT * FROM beeit_achievements WHERE 1=1 AND status = 'active' ORDER BY...
📊 [ACHIEVEMENT MODEL] Result count: 16
✅ [ACHIEVEMENT MODEL] Achievements found:
  🏅 Achievement 1: { id: 1, title: 'HACKATHON 2023', ... }
  ...
```

```
📸 [PHOTO MODEL] ===== BẮT ĐẦU LẤY PHOTOS =====
📝 [PHOTO MODEL] SQL: SELECT * FROM beeit_behind_scenes WHERE 1=1 AND status = 'active' ORDER BY...
📊 [PHOTO MODEL] Result count: 30
✅ [PHOTO MODEL] Photos found:
  📷 Photo 1: { id: 1, image_url: 'https://...', ... }
  ...
```

### 2. Service Layer Logs
```
🔄 [ACHIEVEMENT SERVICE] Calling Model.getAllAchievements...
✅ [ACHIEVEMENT SERVICE] Model returned:
  📊 Data count: 16
```

### 3. Controller Layer Logs
```
🔍 [BEEIT API] ===== BẮT ĐẦU FETCH DỮ LIỆU BEEIT =====
🔄 [BEEIT API] Bắt đầu fetch song song: Hero, Stats, Footer, Leaders, Achievements, Photos...
✅ [BEEIT API] Đã fetch xong tất cả data

🏆 [BEEIT API] === ACHIEVEMENTS ===
  🏅 Count: 16
  ✅ Achievements found! Full list:
    🏅 Achievement 1: { id: 1, title: 'HACKATHON 2023', year: '2023', ... }
    ...

📸 [BEEIT API] === PHOTOS ===
  📷 Count: 30
  ✅ Photos found! Full list:
    📷 Photo 1: { id: 1, image_url: 'https://...', ... }
    ...
```

---

## ✅ KẾT QUẢ MONG ĐỢI

### Nếu có dữ liệu trong database:
- ✅ Model log: `Result count: 16` (achievements) và `30` (photos)
- ✅ Service log: `Data count: 16` và `30`
- ✅ Controller log: `Count: 16` và `30`
- ✅ Response JSON có `achievements: [...]` và `photos: [...]`

### Nếu chưa có dữ liệu:
- ⚠️ Model log: `No achievements found in database`
- ⚠️ Controller log: `Achievements: Empty array`
- ⚠️ Response JSON: `achievements: []` và `photos: []`
- ➡️ **Cần chạy SQL insert data trước**

---

## 🔧 DEBUG NẾU CÓ LỖI

### Lỗi: "Table doesn't exist"
➡️ Chạy migration: `create_beeit_tables.sql`

### Lỗi: "Empty array"
➡️ Chạy insert data: `insert_beeit_achievements_photos.sql`

### Lỗi: SQL Syntax Error
➡️ Đã sửa trong `database.js` - kiểm tra lại

### Không thấy log
➡️ Kiểm tra:
1. Backend server đã chạy chưa?
2. Console log có được bật không?
3. API endpoint đúng chưa?

---

## 📝 CHECKLIST KIỂM TRA

- [ ] Đã chạy SQL migration (`create_beeit_tables.sql`)
- [ ] Đã chạy SQL insert data (`insert_beeit_achievements_photos.sql`)
- [ ] Backend server đang chạy
- [ ] Gọi API `/api/client/beeit`
- [ ] Kiểm tra log trong console backend
- [ ] Xác nhận có data trong response JSON
- [ ] Kiểm tra frontend hiển thị đúng

---

## 🎯 SAU KHI XÁC NHẬN BACKEND OK

1. ✅ Backend đã lấy được data → Frontend sẽ tự động hiển thị
2. ✅ Kiểm tra frontend console log
3. ✅ Kiểm tra trang `/beeit` hiển thị achievements và photos

