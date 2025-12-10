-- ============================================
-- SCRIPT KIỂM TRA DỮ LIỆU document_categories
-- ============================================

-- 1. Kiểm tra xem bảng có tồn tại không
SHOW TABLES LIKE 'document_categories';

-- 2. Kiểm tra cấu trúc bảng
DESCRIBE document_categories;

-- 3. Đếm số lượng bản ghi
SELECT COUNT(*) AS total_records FROM document_categories;

-- 4. Xem tất cả dữ liệu (không có deleted_at)
SELECT id, name, slug, parent_id, created_by, deleted_at 
FROM document_categories 
ORDER BY parent_id, id;

-- 5. Xem chỉ các bản ghi chưa bị xóa
SELECT id, name, slug, parent_id, created_by 
FROM document_categories 
WHERE deleted_at IS NULL 
ORDER BY parent_id, id;

-- 6. Kiểm tra xem có user với id = 1 không (cần cho created_by)
SELECT id, fullname, email FROM users WHERE id = 1;

-- 7. Xem danh mục cha và số lượng con
SELECT 
    dc.id,
    dc.name,
    dc.slug,
    dc.parent_id,
    COUNT(dc2.id) AS child_count
FROM document_categories dc
LEFT JOIN document_categories dc2 ON dc.id = dc2.parent_id AND dc2.deleted_at IS NULL
WHERE dc.parent_id IS NULL AND dc.deleted_at IS NULL
GROUP BY dc.id, dc.name, dc.slug, dc.parent_id
ORDER BY dc.id;

