# Members Module Description (As-Is)

## 1. Overview
Quản lý hồ sơ chi tiết của thành viên CLB. Hệ thống phân biệt giữa **User** (người dùng hệ thống) và **Member** (thành viên chính thức của CLB có MSSV, khóa học).

## 2. Data Structure
- `users`: Thông tin định danh (Email, Họ tên, Avatar).
- `member_profiles`: Thông tin chuyên sâu (MSSV - `student_id`, Niên khóa - `academic_year`, Khóa học - `course`). Quan hệ 1-1 với `users`.

## 3. Workflow
### A. Danh sách thành viên
- Admin truy cập trang quản lý -> Backend thực hiện `INNER JOIN` giữa `member_profiles` và `users`.
- Hỗ trợ search theo tên, email, MSSV.
- Phân trang server-side.

### B. Thêm thành viên
- Bước 1: Lấy danh sách `users` chưa có trong `member_profiles`.
- Bước 2: Chọn user -> Điền MSSV, khóa học -> Tạo bản ghi trong `member_profiles`.

### C. Cập nhật & Xóa
- Cập nhật thông tin profile.
- Xóa mềm thành viên (set `deleted_at`).
