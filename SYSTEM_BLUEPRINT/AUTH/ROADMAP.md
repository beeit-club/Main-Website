# Auth Module Roadmap

## Phase 1: Clean & Fix (Refactoring Backend)
1. **Remove Dead Code**:
   - Loại bỏ hoàn toàn logic `resetPassword`, `requestPasswordReset` nếu quyết định giữ nguyên Passwordless.
   - Hoặc: Migration thêm cột `password_hash` nếu muốn support password.
   - *Đề xuất*: Giữ Passwordless cho đơn giản và hiện đại, xóa logic Password cũ.

2. **Standardize Naming**:
   - Rename: `isVerryOTP` -> `verifyOtp`.
   - Rename: `getPremiss` -> `getUserPermissions`.
   - Rename variable: `TokenOTP` -> `otpToken`.

3. **Enhance Security**:
   - Review `AuthModel` để chuyển hết sang `mysql2` Prepared Statements (?. ?).
   - Implement `RateLimit` cho API gửi OTP (tránh spam email).
   - Implement `RateLimit` cho API verify OTP (tránh brute-force).

4. **Optimize Session**:
   - Thêm logic xóa session cũ/hết hạn khi user login mới.

## Phase 2: Client Upgrade (Frontend)
1. **Shadcn UI Integration**:
   - Rebuild Login Form dùng `react-hook-form` + `zod` + Shadcn Components.
   - Form nhập OTP: Dùng `InputOTP` của Shadcn.

2. **State Management**:
   - Move auth logic từ component vào `zustand` store hoặc `Context` (nếu chưa có).
   - Xử lý `axios interceptor` để tự động refresh token khi 401.

## Phase 3: Advanced Features
1. **Role-Based Access Control (RBAC)**:
   - Hoàn thiện middleware `checkPermission` dựa trên bảng `permissions`.
   - Viết API gán quyền động trong Admin Panel.
