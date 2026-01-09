# Auth Module Description (As-Is)

## 1. Overview
Module Authentication hiện tại sử dụng cơ chế **Passwordless (OTP via Email)** và **Google OAuth**. Hệ thống không sử dụng mật khẩu truyền thống cho user thường (dù có code xử lý reset password nhưng database thiếu cột).

## 2. Authentication Flow

### A. Login via Email (OTP)
1. **Request Login**:
   - Client gửi `email`.
   - Server kiểm tra email tồn tại trong DB `users`.
   - Nếu tồn tại -> Sinh OTP (4-6 số) -> Lưu vào DB `users.otp_code` -> Gửi email qua `emailService`.
   - **Response**: Trả về `TokenOTP` (JWT chứa email để verify bước sau).

2. **Verify OTP**:
   - Client gửi `email`, `pin` (OTP).
   - Server kiểm tra OTP trong DB.
   - Nếu đúng:
     - Xóa OTP cũ.
     - Xóa session cũ trong `user_sessions`.
     - Tạo cặp Token mới (Access + Refresh).
     - Lưu Refresh Token vào DB `user_sessions`.
     - Set Cookie `refreshToken`.
   - **Response**: `accessToken`, `user` info.

### B. Google Login
1. Client gửi `code` (từ Google Consent Screen) và `redirect_uri`.
2. Server trao đổi `code` lấy `id_token` từ Google.
3. Verify `id_token` -> Lấy `email`, `name`, `avatar`.
4. **Find or Create**:
   - Nếu email chưa có -> Tạo user mới (Insert vào `users`).
   - Nếu có -> Lấy user info.
5. Tạo Session (tương tự Verify OTP).

### C. Refresh Token
1. Client gửi request với Cookie `refreshToken`.
2. Server verify signature của token.
3. Server check token trong DB `user_sessions`.
4. Nếu hợp lệ -> Cấp lại `accessToken` mới + `refreshToken` mới (Rotation).

## 3. Key Components
- **Middleware**: `jwt.js` (Verify AccessToken).
- **Service**: `auth.service.js` (Logic nghiệp vụ).
- **Controller**: `auth.controller.js`.
- **Database Tables**:
  - `users`: Lưu thông tin cơ bản, OTP.
  - `user_sessions`: Lưu refresh token.
  - `roles`: RBAC cơ bản.
