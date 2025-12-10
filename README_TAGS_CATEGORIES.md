# HƯỚNG DẪN INSERT TAGS VÀ POST CATEGORIES

**Files:**
- `insert_tags_and_post_categories.sql` - Chỉ tags và categories
- `insert_all_sample_data.sql` - TẤT CẢ (roles, permissions, tags, categories) ⭐ RECOMMENDED

---

## 📋 MÔ TẢ

Script SQL để insert dữ liệu mẫu cho:
1. **Tags** (Thẻ) - 25 tags phổ biến
2. **Post Categories** (Danh mục bài viết) - 5 parent categories và 17 sub-categories

---

## 🚀 CÁCH SỬ DỤNG

### **Option 1: Insert TẤT CẢ (RECOMMENDED)** ⭐

```bash
# Insert roles, permissions, tags, và categories cùng lúc
mysql -u root -p beeit < insert_all_sample_data.sql
```

### **Option 2: Chỉ Tags và Categories**

```bash
# Chỉ insert tags và categories
mysql -u root -p beeit < insert_tags_and_post_categories.sql
```

### **Option 3: Chạy trực tiếp trong MySQL**

```bash
# Kết nối MySQL
mysql -u root -p

# Chạy script
source /path/to/insert_all_sample_data.sql
# hoặc
source /path/to/insert_tags_and_post_categories.sql
```

### **Option 4: Sử dụng MySQL Workbench / HeidiSQL**

1. Mở file SQL
2. Chọn database `beeit`
3. Execute script

---

## 📊 DỮ LIỆU SẼ ĐƯỢC INSERT

### **1. Tags (25 tags)**

#### **Programming Languages:**
- JavaScript
- Python
- Java
- C++
- PHP

#### **Web Development:**
- Frontend
- Backend
- Full Stack

#### **Technologies & Frameworks:**
- React
- Next.js
- Node.js
- Vue.js

#### **Database:**
- MySQL
- MongoDB
- PostgreSQL

#### **DevOps & Tools:**
- Docker
- Git
- Linux

#### **Mobile Development:**
- React Native
- Flutter

#### **Other Topics:**
- Algorithm
- System Design
- Career
- Tutorial

---

### **2. Post Categories (5 parent + 17 sub)**

#### **Parent Categories:**
1. **Lập trình**
   - Web Development
   - Mobile Development
   - Backend Development
   - Frontend Development
   - Full Stack

2. **Công nghệ**
   - AI & Machine Learning
   - Cloud Computing
   - DevOps
   - Database
   - Security

3. **Hướng dẫn**
   - Tutorial cho người mới
   - Best Practices
   - Tips & Tricks
   - Code Review

4. **Tin tức**
   - Công nghệ mới
   - Sự kiện CLB
   - Thông báo

5. **Chia sẻ kinh nghiệm**
   - Interview Experience
   - Project Review
   - Career Path

---

## ⚠️ LƯU Ý

### **1. User ID (created_by)**

Script sử dụng `created_by = 1` (giả định là admin user).

**Nếu chưa có user ID = 1:**
- Tạo user admin trước
- Hoặc thay `1` bằng ID user thực tế
- Hoặc set `NULL` (nếu cho phép)

### **2. Reset Data**

Nếu muốn xóa dữ liệu cũ trước khi insert:
```sql
-- Uncomment các dòng DELETE trong script
DELETE FROM `post_tags` WHERE tag_id IN (SELECT id FROM `tags`);
DELETE FROM `tags` WHERE deleted_at IS NULL;
DELETE FROM `post_categories` WHERE deleted_at IS NULL;
```

### **3. Slug Duplicate**

Nếu slug bị trùng, sẽ báo lỗi:
```
Error: Duplicate entry 'xxx' for key 'slug'
```

**Fix:** Đổi slug trong script hoặc xóa record cũ.

---

## ✅ VERIFY

Sau khi chạy script, kiểm tra:

```sql
-- Đếm số tags
SELECT COUNT(*) as total_tags FROM `tags` WHERE deleted_at IS NULL;

-- Đếm số categories
SELECT COUNT(*) as total_categories FROM `post_categories` WHERE deleted_at IS NULL;

-- Xem danh sách tags
SELECT id, name, slug FROM `tags` WHERE deleted_at IS NULL ORDER BY name;

-- Xem danh sách categories với parent
SELECT 
    pc.id,
    pc.name,
    pc.slug,
    parent.name as parent_name
FROM `post_categories` pc
LEFT JOIN `post_categories` parent ON pc.parent_id = parent.id
WHERE pc.deleted_at IS NULL
ORDER BY parent.name, pc.name;
```

---

## 📝 CUSTOMIZE

### **Thêm Tags mới:**

```sql
INSERT INTO `tags` (`name`, `slug`, `meta_description`, `created_by`, `created_at`) VALUES
('Tên Tag', 'slug-tag', 'Mô tả tag', 1, NOW());
```

### **Thêm Categories mới:**

```sql
-- Parent category
INSERT INTO `post_categories` (`name`, `slug`, `parent_id`, `created_by`, `created_at`) VALUES
('Tên Category', 'slug-category', NULL, 1, NOW());

-- Sub-category (cần parent_id)
SET @parent_id = (SELECT id FROM `post_categories` WHERE slug = 'slug-category' LIMIT 1);
INSERT INTO `post_categories` (`name`, `slug`, `parent_id`, `created_by`, `created_at`) VALUES
('Tên Sub-category', 'slug-sub-category', @parent_id, 1, NOW());
```

---

## 🎯 KẾT QUẢ MONG ĐỢI

- ✅ 25 tags được insert
- ✅ 5 parent categories được insert
- ✅ 17 sub-categories được insert
- ✅ Tất cả có slug unique
- ✅ Parent-child relationship đúng

---

**Ngày tạo:** $(date)  
**Phiên bản:** 1.0

