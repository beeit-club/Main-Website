# Auth Module Issues

## 1. Critical Bugs (Code chết)
- **Password Reset Fail**: Service `resetPassword` thực hiện update cột `password_hash` trong bảng `users`, nhưng bảng `users` trong `nes.sql` **KHÔNG** có cột này.
  - *Hậu quả*: Chức năng Reset Password sẽ luôn gây lỗi 500.

## 2. Security Risks
- **OTP Leak Risk**: Cần kiểm tra kỹ `emailService.sendLoginOtp`. Nếu hàm này trả về cả mã OTP ra controller và controller trả về client, hacker có thể chặn request để lấy OTP.
- **Session Cleanup**: Bảng `user_sessions` chỉ insert mà chưa thấy cơ chế dọn dẹp (Cronjob) các token hết hạn. Dễ gây phình to database.
- **Raw SQL Injection**: Cần review `AuthModel` (chưa đọc file này nhưng mô hình chung dự án dùng raw SQL). Nếu nối chuỗi trực tiếp -> Lỗ hổng nghiêm trọng.

## 3. Architecture & Code Quality
- **Logic Password lẫn lộn**: Hệ thống thiết kế Passwordless nhưng lại giữ code Reset Password thừa thãi.
- **Variable Naming**: `TokenOTP` (PascalCase), `isVerryOTP` (Typo: Verify), `getPremiss` (Typo: Permissions).
- **Error Handling**: `try-catch` rải rác, một số chỗ throw error string thay vì `Error` object chuẩn.
- **Hardcoded URLs**: Avatar mặc định đang hardcode URL S3.

## 4. Database Design
- **Missing Indexes**: Bảng `user_sessions` query theo `refresh_token` nhưng chưa rõ có index column này không (cần check lại SQL).
