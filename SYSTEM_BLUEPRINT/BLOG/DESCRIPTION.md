# Blog Module Description (As-Is)

## 1. Overview
Hệ thống CMS cho phép Admin viết bài, quản lý danh mục và thẻ (tags). Hỗ trợ bài viết đa nội dung với trình soạn thảo Rich Text.

## 2. Features
- Quản lý bài viết: Create, Read, Update, Delete (CRUD).
- Xử lý Tag: Quan hệ n-n giữa Posts và Tags qua bảng trung gian `post_tags`.
- Trạng thái bài viết: Nháp, Xuất bản.
- SEO: Tự động slugify title, quản lý meta description.
- Upload ảnh: Tích hợp upload ảnh bìa (featured image).

## 3. Technology
- **Backend**: SQL query với JSON aggregation cho tags.
- **Frontend**: TanStack Table cho danh sách, TinyMCE/Shadcn cho soạn thảo.
