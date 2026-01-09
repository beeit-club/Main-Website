# Members Module Issues

## 1. Role Sync Issue
- Khi một User được thêm vào `member_profiles`, hệ thống chưa tự động cập nhật `role_id` trong bảng `users` sang Member role. Điều này dẫn đến việc user đã là member nhưng quyền hạn vẫn là Guest/User thường.

## 2. Validation & Security
- `academic_year` trong database là kiểu `DATE`, nhưng thường niên khóa chỉ cần lưu năm hoặc chuỗi (ví dụ: 2022-2026).
- Cần review lại `MemberService` để xem có validate MSSV (student_id) theo format trường không.

## 3. UX Issues (Frontend)
- Việc "Chọn User từ danh sách" để tạo Member có thể gây khó khăn nếu số lượng User quá lớn. Cần cơ chế search/autocomplete tốt.
- Mock data: Cần kiểm tra xem frontend đã dùng API thật chưa.
