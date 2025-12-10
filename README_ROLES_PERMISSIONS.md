# HƯỚNG DẪN INSERT ROLES VÀ PERMISSIONS

**Files:**
- `insert_roles_and_permissions.sql` - Insert roles và permissions
- `assign_permissions_to_roles.sql` - Assign permissions cho users dựa trên role

---

## 📋 MÔ TẢ

Script SQL để:
1. **Insert Roles** - 5 roles cơ bản (Super Admin, Admin, Moderator, Member, Guest)
2. **Insert Permissions** - ~135 permissions theo 5 modules
3. **Assign Permissions** - Gán permissions cho users dựa trên role_id

---

## 🚀 CÁCH SỬ DỤNG

### **Bước 1: Insert Roles và Permissions**

```bash
mysql -u root -p beeit < insert_roles_and_permissions.sql
```

**Hoặc trong MySQL client:**
```sql
source /path/to/insert_roles_and_permissions.sql
```

### **Bước 2: Assign Permissions cho Users**

**Lưu ý:** Cần có users trong database trước!

```bash
mysql -u root -p beeit < assign_permissions_to_roles.sql
```

**Hoặc trong MySQL client:**
```sql
source /path/to/assign_permissions_to_roles.sql
```

---

## 📊 DỮ LIỆU SẼ ĐƯỢC INSERT

### **1. Roles (5 roles)**

| ID | Name | Description |
|----|------|-------------|
| 1 | Super Admin | Quản trị viên cấp cao nhất, có tất cả quyền |
| 2 | Admin | Quản trị viên, quản lý hầu hết các chức năng |
| 3 | Moderator | Người điều hành, quản lý nội dung và sự kiện |
| 4 | Member | Thành viên câu lạc bộ, có quyền truy cập cơ bản |
| 5 | Guest | Khách, chỉ có thể xem nội dung công khai |

**Lưu ý:** IDs này phải khớp với enum trong code:
```javascript
// backend/src/common/enum.js
export const ROLE = {
  SUPER_ADMIN: 1,
  ADMIN: 2,
  MODERATOR: 3,
  MEMBER: 4,
  GUEST: 5,
};
```

---

### **2. Permissions (~135 permissions)**

#### **Module 1: User Management (37 permissions)**
- Roles Management (5)
- Users Management (11)
- Permissions Management (7)
- Membership Applications (7)
- Member Profiles (7)

#### **Module 2: Content Management (47 permissions)**
- Post Categories (5)
- Posts Management (13)
- Comments Management (8)
- Tags Management (6)
- Questions & Answers (15)

#### **Module 3: Events Management (20 permissions)**
- Events (11)
- Event Registrations (7)
- Event Attendances (7)

#### **Module 4: Document Management (16 permissions)**
- Document Categories (5)
- Documents Management (11)

#### **Module 5: Financial Management (8 permissions)**
- Transactions (8)

---

### **3. Permission Assignment**

#### **Super Admin (role_id = 1)**
- ✅ Tất cả permissions (~135)

#### **Admin (role_id = 2)**
- ✅ Hầu hết permissions
- ❌ Không có: `roles.create`, `roles.edit`, `roles.delete`, `roles.assign`
- ✅ Có: `roles.view`

#### **Moderator (role_id = 3)**
- ✅ Content Management (posts, comments, tags, questions)
- ✅ Event Management (events, registrations, attendances)
- ✅ Document Management (documents, categories)
- ⚠️ User Management (limited: view, edit_own, applications.review)

#### **Member (role_id = 4)**
- ✅ Xem nội dung công khai
- ✅ Tạo và edit nội dung của mình (posts, comments, questions, answers)
- ✅ Đăng ký sự kiện
- ✅ Tải tài liệu
- ✅ Edit profile của mình

#### **Guest (role_id = 5)**
- ✅ Chỉ xem nội dung công khai
- ✅ Đăng ký thành viên (applications.create)

---

## ⚠️ LƯU Ý QUAN TRỌNG

### **1. Role IDs**

**PHẢI khớp với code:**
- Super Admin: **1**
- Admin: **2**
- Moderator: **3**
- Member: **4**
- Guest: **5**

Nếu không khớp, hệ thống sẽ không hoạt động đúng!

---

### **2. Users phải tồn tại trước**

Script `assign_permissions_to_roles.sql` cần có users trong database.

**Nếu chưa có users:**
1. Tạo users trước
2. Assign role_id cho users
3. Sau đó chạy script assign permissions

---

### **3. Permission Structure**

**Format:** `[module].[action].[scope]`

**Ví dụ:**
- `posts.view_all` - Xem tất cả posts
- `posts.edit_own` - Edit posts của mình
- `users.create` - Tạo user mới

---

### **4. Reset Data**

Nếu muốn reset:
```sql
-- Xóa user_permissions trước
DELETE FROM `user_permissions`;

-- Xóa permissions
DELETE FROM `permissions`;

-- Xóa roles (cẩn thận, có thể ảnh hưởng đến users)
-- DELETE FROM `roles` WHERE id IN (1, 2, 3, 4, 5);
```

---

## ✅ VERIFY

Sau khi chạy script, kiểm tra:

```sql
-- Đếm roles
SELECT COUNT(*) as total_roles FROM roles;

-- Đếm permissions
SELECT COUNT(*) as total_permissions FROM permissions;

-- Đếm permissions theo module
SELECT module, COUNT(*) as count 
FROM permissions 
GROUP BY module 
ORDER BY module;

-- Kiểm tra permissions của từng role
SELECT 
    r.name as role_name,
    COUNT(DISTINCT u.id) as user_count,
    COUNT(DISTINCT up.permission_id) as permission_count
FROM roles r
LEFT JOIN users u ON r.id = u.role_id AND u.deleted_at IS NULL
LEFT JOIN user_permissions up ON u.id = up.user_id
GROUP BY r.id, r.name
ORDER BY r.id;
```

---

## 🔧 CUSTOMIZE

### **Thêm Permission mới:**

```sql
INSERT INTO `permissions` (`name`, `description`, `module`, `created_at`) VALUES
('new_permission.name', 'Mô tả permission', 'module_name', NOW());
```

### **Assign Permission cho user cụ thể:**

```sql
INSERT INTO `user_permissions` (`user_id`, `permission_id`, `granted_by`) 
SELECT [user_id], p.id, 1 
FROM `permissions` p
WHERE p.name = 'permission.name';
```

### **Revoke Permission:**

```sql
DELETE FROM `user_permissions` 
WHERE user_id = [user_id] 
AND permission_id = (SELECT id FROM permissions WHERE name = 'permission.name');
```

---

## 📝 PERMISSION LIST SUMMARY

### **User Management (37)**
- roles.* (5)
- users.* (11)
- permissions.* (7)
- applications.* (7)
- members.* (7)

### **Content Management (47)**
- post_categories.* (5)
- posts.* (13)
- comments.* (8)
- tags.* (6)
- questions.* (8)
- answers.* (7)

### **Event Management (20)**
- events.* (11)
- event_registrations.* (7)
- attendances.* (7)

### **Document Management (16)**
- document_categories.* (5)
- documents.* (11)

### **Financial Management (8)**
- transactions.* (8)

**Tổng:** ~135 permissions

---

## 🎯 KẾT QUẢ MONG ĐỢI

- ✅ 5 roles được insert
- ✅ ~135 permissions được insert
- ✅ Permissions được assign cho users dựa trên role_id
- ✅ Super Admin có tất cả permissions
- ✅ Các roles khác có permissions phù hợp

---

**Ngày tạo:** $(date)  
**Phiên bản:** 1.0

