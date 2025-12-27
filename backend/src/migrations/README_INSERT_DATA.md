# 📝 HƯỚNG DẪN INSERT DỮ LIỆU MẪU

## 🗄️ File SQL

**File:** `insert_beeit_achievements_photos.sql`

## 📋 Nội dung

File SQL này chứa:
- **16 Achievements** (8 cho Row 1, 8 cho Row 2)
- **30 Photos** cho Behind The Code

## 🚀 Cách chạy

### Option 1: Sử dụng MySQL Command Line
```bash
mysql -u your_username -p your_database_name < backend/src/migrations/insert_beeit_achievements_photos.sql
```

### Option 2: Sử dụng phpMyAdmin / MySQL Workbench
1. Mở phpMyAdmin hoặc MySQL Workbench
2. Chọn database `beeit`
3. Vào tab **SQL**
4. Copy toàn bộ nội dung file `insert_beeit_achievements_photos.sql`
5. Paste và chạy (Execute)

### Option 3: Sử dụng Laragon (Windows)
1. Mở Laragon
2. Click **Database** → Chọn database `beeit`
3. Vào tab **SQL**
4. Copy và paste nội dung file SQL
5. Click **Go** hoặc nhấn `Ctrl + Enter`

## ⚠️ Lưu ý

1. **Xóa dữ liệu cũ**: Nếu muốn xóa dữ liệu cũ trước khi insert, uncomment 2 dòng:
   ```sql
   DELETE FROM `beeit_achievements`;
   DELETE FROM `beeit_behind_scenes`;
   ```

2. **Kiểm tra dữ liệu**: Sau khi chạy, có thể verify bằng:
   ```sql
   SELECT COUNT(*) as total_achievements FROM `beeit_achievements`;
   SELECT COUNT(*) as total_photos FROM `beeit_behind_scenes`;
   ```

3. **Xem dữ liệu**:
   ```sql
   SELECT * FROM `beeit_achievements` ORDER BY row_number, display_order;
   SELECT * FROM `beeit_behind_scenes` ORDER BY display_order;
   ```

## 📊 Dữ liệu sẽ được insert

### Achievements (16 items)
- **Row 1** (8 items): HACKATHON 2023, TECH TALK S1, BEST PROJECT, CODE CAMP, OPEN DAY, WEB SUMMIT, GAME JAM, FOUNDING
- **Row 2** (8 items): AI CHALLENGE, CHARITY CODE, MENTORSHIP, ROBOTICS, DESIGN THON, DATA SCIENCE, CTF ARENA, DEV NIGHT

### Photos (30 items)
- 30 hình ảnh với alt text mô tả: Meeting, Working, Conference, Workshop, Team collaboration, etc.

## ✅ Sau khi chạy

1. Frontend sẽ tự động hiển thị data từ API
2. Admin có thể quản lý qua:
   - `/admin/beeit/achievements`
   - `/admin/beeit/photos`
3. Có thể thêm/sửa/xóa qua giao diện admin


