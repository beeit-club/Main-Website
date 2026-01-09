# Forum (Q&A) Module Description (As-Is)

## 1. Overview
Hệ thống cho phép người dùng đặt câu hỏi và thảo luận. Admin quản lý các câu hỏi này.

## 2. Features
- **Questions**: Người dùng đặt câu hỏi (Title, Content). Admin duyệt/xóa.
- **Answers**: Người dùng/Admin trả lời câu hỏi. Hỗ trợ Nested Comments (Trả lời của trả lời) qua `parent_id`.
- **Voting**: Người dùng có thể Vote up/down cho câu trả lời.

## 3. Data Flow
- Frontend hiện tại đang gọi API `/admin/questions` cho các thao tác của người dùng.
- Backend sử dụng `slugify` để tạo slug cho câu hỏi.
- Xử lý XSS tốt qua `sanitizeHtml`.
