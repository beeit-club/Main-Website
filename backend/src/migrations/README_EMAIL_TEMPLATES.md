# 📧 Migration: Email Templates System

## Mô Tả

File migration này tạo các bảng cần thiết cho hệ thống email động:
- `email_template_categories`: Danh mục templates
- `email_templates`: Templates email (lưu trong database)
- `email_logs`: Log email đã gửi

## Cách Chạy Migration

### Option 1: Chạy trực tiếp trong MySQL

```bash
# Vào MySQL
mysql -u root -p beeit

# Chạy file SQL
source backend/src/migrations/create_email_templates_tables.sql;
```

### Option 2: Import qua phpMyAdmin/HeidiSQL

1. Mở phpMyAdmin/HeidiSQL
2. Chọn database `beeit`
3. Import file `create_email_templates_tables.sql`

### Option 3: Chạy qua Node.js script (nếu có)

```javascript
// scripts/runMigration.js
import pool from '../src/db.js';
import fs from 'fs';
import path from 'path';

const sql = fs.readFileSync(
  path.join(process.cwd(), 'src/migrations/create_email_templates_tables.sql'),
  'utf8'
);

// Chạy từng câu lệnh
const statements = sql.split(';').filter(s => s.trim());
for (const statement of statements) {
  if (statement.trim()) {
    await pool.query(statement);
  }
}
```

## Kiểm Tra

Sau khi chạy migration, kiểm tra:

```sql
-- Kiểm tra bảng đã tạo
SHOW TABLES LIKE 'email_%';

-- Kiểm tra categories
SELECT * FROM email_template_categories;

-- Kiểm tra templates (nếu có)
SELECT id, name, slug, category, is_active FROM email_templates;

-- Kiểm tra cấu trúc bảng
DESCRIBE email_templates;
DESCRIBE email_logs;
```

## Rollback (Nếu cần)

```sql
-- Xóa các bảng (CẨN THẬN - sẽ mất dữ liệu!)
DROP TABLE IF EXISTS `email_logs`;
DROP TABLE IF EXISTS `email_templates`;
DROP TABLE IF EXISTS `email_template_categories`;
```

## Lưu Ý

1. **Backup database** trước khi chạy migration
2. Kiểm tra foreign keys đã tồn tại (bảng `users`)
3. Template mẫu sẽ được tạo tự động (có thể xóa nếu không cần)

## Cấu Trúc Bảng

### email_template_categories
- `id`: Primary key
- `name`: Tên danh mục
- `slug`: Slug (unique)
- `description`: Mô tả

### email_templates
- `id`: Primary key
- `name`: Tên template (unique)
- `slug`: Slug (unique)
- `subject`: Subject email (có thể dùng variables)
- `html_content`: Nội dung HTML (Handlebars)
- `text_content`: Nội dung text (optional)
- `category`: Danh mục
- `variables`: JSON - Danh sách variables
- `default_variables`: JSON - Giá trị mặc định
- `is_active`: Template có active không
- `is_system`: Template hệ thống (không thể xóa)
- `created_by`, `updated_by`: User IDs
- `deleted_at`: Soft delete

### email_logs
- `id`: Primary key
- `template_id`: FK đến email_templates
- `template_name`, `template_slug`: Backup (nếu template bị xóa)
- `recipient_email`: Email người nhận
- `subject`: Subject đã render
- `status`: pending/sent/failed
- `error_message`: Lỗi nếu có
- `variables_used`: JSON - Variables đã dùng
- `sent_at`: Thời gian gửi thành công

