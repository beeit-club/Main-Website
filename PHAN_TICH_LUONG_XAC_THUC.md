# Phân Tích Luồng Xác Thực và Cấp Lại Access Token

## 📋 Mục Lục
1. [Luồng Đăng Nhập Qua OTP](#1-luồng-đăng-nhập-qua-otp)
2. [Luồng Đăng Nhập Qua Google OAuth](#2-luồng-đăng-nhập-qua-google-oauth)
3. [Luồng Cấp Lại Access Token (Refresh Token)](#3-luồng-cấp-lại-access-token-refresh-token)
4. [Luồng Đăng Xuất](#4-luồng-đăng-xuất)
5. [Luồng Đăng Ký](#5-luồng-đăng-ký)
6. [Luồng Quên Mật Khẩu](#6-luồng-quên-mật-khẩu)
7. [Các Trường Hợp Xử Lý Lỗi](#7-các-trường-hợp-xử-lý-lỗi)

---

## 1. Luồng Đăng Nhập Qua OTP

### 1.1. Frontend - Bước 1: Gửi Email Để Nhận OTP

**File:** `frontend/src/hooks/useAuth.js` (dòng 14-30)

```javascript
const login = async (payload) => {
  // Gọi API POST /auth/login với email
  const res = await authServices.login(payload);
  // Nhận TokenOTP và redirect đến trang nhập OTP
  router.push(`/login?token=${TokenOTP}`);
}
```

**File:** `frontend/src/services/auth.js` (dòng 5-13)

```javascript
login: async (data) => {
  const res = await axiosClient.post("/auth/login", data);
  return res.data;
}
```

### 1.2. Backend - Bước 1: Xử Lý Yêu Cầu Đăng Nhập

**File:** `backend/src/controllers/auth/auth.controller.js` (dòng 29-36)

```javascript
login: asyncWrapper(async (req, res) => {
  const { email } = req.body;
  const { TokenOTP } = await AuthService.loginUser(email);
  return utils.success(res, message.Auth.SEND_EMAIL_SUCCESS, { TokenOTP });
})
```

**File:** `backend/src/services/auth/auth.service.js` (dòng 77-106)

**Quy trình:**
1. ✅ Kiểm tra email có tồn tại trong database
2. ✅ Kiểm tra tài khoản có bị khóa (`is_active`)
3. ✅ Tạo và gửi OTP qua email (`resendVerification`)
4. ✅ Tạo `TokenOTP` (JWT token chứa email, hết hạn sau thời gian cấu hình)
5. ✅ Trả về `TokenOTP` cho frontend

**Chi tiết:**
- `AuthModel.isEmail(email, true)` - Lấy thông tin user đầy đủ
- `utils.generateOTP()` - Tạo mã OTP 6 chữ số
- `AuthModel.insertOtp(email, otp)` - Lưu OTP vào database với thời gian hết hạn
- `emailService.sendLoginOtp(info)` - Gửi email chứa OTP
- `utils.createOtpToken(email)` - Tạo JWT token chứa email

### 1.3. Frontend - Bước 2: Nhập OTP

**File:** `frontend/src/hooks/useAuth.js` (dòng 58-77)

```javascript
const sendOtp = async (payload) => {
  const res = await authServices.sendOtp(payload);
  const { accessToken, user } = data ?? {};
  localStorage.setItem("accessToken", accessToken);
  setUser(user);
  // Lấy permissions
  const permRes = await authServices.getPremiss();
  useAuthStore.getState().setPermissions(permRes?.data?.permissions);
}
```

### 1.4. Backend - Bước 2: Xác Minh OTP

**File:** `backend/src/controllers/auth/auth.controller.js` (dòng 39-65)

```javascript
sendotp: asyncWrapper(async (req, res) => {
  const { email, pin } = req.body;
  const { valid, refreshToken, accessToken, user } = 
    await AuthService.isVerryOTP(email, pin);
  
  // Lưu refreshToken vào cookie (httpOnly, secure)
  res.cookie('refreshToken', refreshToken, {
    maxAge: Number(config.JWT_REFRESH_EXPIRES_IN),
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  
  return utils.success(res, message.Auth.LOGIN_SUCCESS, {
    accessToken,
    user: userData,
  });
})
```

**File:** `backend/src/services/auth/auth.service.js` (dòng 128-152)

**Quy trình xác minh OTP:**
1. ✅ Kiểm tra email có tồn tại
2. ✅ Gọi `AuthModel.verifyOtp(email, otp)` để xác minh:
   - Kiểm tra số lần thử (`otp_attempts >= OTP_MAX_ATTEMPTS`)
   - Kiểm tra OTP có hết hạn không (`otp_expires_at`)
   - Kiểm tra OTP có khớp không (`otp_code === otp`)
   - Nếu sai: tăng `otp_attempts` lên 1
   - Nếu đúng: reset `otp_attempts = 0` và xóa OTP
3. ✅ Xóa tất cả session cũ của user (`deleteSessionById`)
4. ✅ Tạo access token mới (`createAccessToken`)
5. ✅ Tạo refresh token mới (`createRefreshToken`)
6. ✅ Lưu refresh token vào database (`insertSessionById`)
7. ✅ Trả về `accessToken`, `refreshToken`, và `user`

**File:** `backend/src/models/auth/auth.model.js` (dòng 205-265)

**Chi tiết verifyOtp:**
- Kiểm tra `otp_attempts >= OTP_MAX_ATTEMPTS` → Trả về lỗi `OTP_ATTEMPTS_EXCEEDED`
- Kiểm tra `otp_expires_at < NOW()` → Trả về lỗi `OTP_EXPIRED`
- Kiểm tra `otp_code !== otp` → Tăng `otp_attempts` và trả về lỗi `OTP_INVALID`
- Nếu hợp lệ → Reset OTP và trả về `valid: true`

### 1.5. Tạo Token

**File:** `backend/src/utils/function.js`

**Access Token:**
```javascript
createAccessToken(user) {
  return jwt.sign({
    id: user.id,
    email: user.email,
    role: user.role_name || 'Guest',
    fullname: user.fullname,
  }, config.JWT_ACCESS_TOKEN, {
    expiresIn: Number(config.JWT_ACCESS_EXPIRES_IN)
  });
}
```

**Refresh Token:**
```javascript
createRefreshToken(user) {
  return jwt.sign({
    id: user.id,
    email: user.email,
  }, config.JWT_REFRESH_TOKEN, {
    expiresIn: Number(config.JWT_REFRESH_EXPIRES_IN)
  });
}
```

**OTP Token:**
```javascript
createOtpToken(email) {
  return jwt.sign({
    email: email,
  }, config.JWT_ACCESS_TOKEN, {
    expiresIn: Number(config.JWT_OTP_EXPIRES_IN)
  });
}
```

---

## 2. Luồng Đăng Nhập Qua Google OAuth

### 2.1. Frontend - Gửi Code Từ Google

**File:** `frontend/src/hooks/useAuth.js` (dòng 78-97)

```javascript
const loginGoogle = async (payload) => {
  const res = await authServices.loginGoogle(payload);
  const { accessToken, user } = data ?? {};
  localStorage.setItem("accessToken", accessToken);
  setUser(user);
  const permRes = await authServices.getPremiss();
  useAuthStore.getState().setPermissions(permRes?.data?.permissions);
}
```

### 2.2. Backend - Xử Lý Google OAuth

**File:** `backend/src/controllers/auth/auth.controller.js` (dòng 68-96)

```javascript
google: asyncWrapper(async (req, res) => {
  const { code, redirect_uri } = req.body;
  const { refreshToken, accessToken, user } = 
    await AuthService.googleLogin(code, redirect_uri);
  
  // Lưu refreshToken vào cookie
  res.cookie('refreshToken', refreshToken, {...});
  
  return utils.success(res, message.Auth.LOGIN_SUCCESS, {
    accessToken,
    user: userData,
  });
})
```

**File:** `backend/src/services/auth/auth.service.js` (dòng 54-74)

**Quy trình:**
1. ✅ Nhận `code` từ Google OAuth callback
2. ✅ Đổi `code` lấy `tokens` từ Google (`client.getToken`)
3. ✅ Verify `id_token` từ Google (`client.verifyIdToken`)
4. ✅ Lấy thông tin user từ payload (email, name, picture, sub)
5. ✅ Tìm hoặc tạo user trong database (`AuthModel.findOrCreate`)
6. ✅ Xóa session cũ (`deleteSessionById`)
7. ✅ Tạo access token và refresh token mới
8. ✅ Lưu refresh token vào database (`insertSessionById`)
9. ✅ Trả về tokens và user

**File:** `backend/src/models/auth/auth.model.js` (dòng 268-305)

**Chi tiết findOrCreate:**
- Tìm user theo email
- Nếu tồn tại: Cập nhật `google_id` nếu chưa có
- Nếu không tồn tại: Tạo user mới với:
  - `fullname`: từ Google
  - `email`: từ Google
  - `google_id`: từ Google
  - `avatar_url`: từ Google
  - `is_active`: true
  - `email_verified_at`: ngày hiện tại

---

## 3. Luồng Cấp Lại Access Token (Refresh Token)

### 3.1. Frontend - Interceptor Tự Động Refresh Token

**File:** `frontend/src/services/api.js` (dòng 12-83)

**Cơ chế hoạt động:**

#### 3.1.1. Request Interceptor (dòng 30-42)
```javascript
axiosClient.interceptors.request.use((config) => {
  // Không thêm token cho các endpoint: login, register, refresh
  if (config.url !== "auth/login" && 
      config.url !== "auth/register" && 
      config.url !== "auth/refresh") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
```

#### 3.1.2. Response Interceptor (dòng 46-83)

**Khi nhận lỗi `TOKEN_EXPIRED`:**

1. **Kiểm tra đã retry chưa:**
   - Nếu `originalReq._retry === true` → Không retry nữa
   - Nếu `originalReq._retry === false` → Đánh dấu `_retry = true`

2. **Kiểm tra đang refresh chưa:**
   - Nếu `isRefreshing === false`:
     - Set `isRefreshing = true`
     - Xóa accessToken cũ khỏi localStorage
     - Gọi `refreshToken()` để lấy token mới
     - Lưu token mới vào localStorage
     - Set `isRefreshing = false`
     - Thực hiện tất cả requests trong queue với token mới
     - Retry request ban đầu với token mới
   
   - Nếu `isRefreshing === true`:
     - Thêm request vào queue
     - Đợi token mới được refresh xong
     - Tự động retry request với token mới

3. **Xử lý lỗi refresh:**
   - Nếu refresh thất bại → Xóa queue
   - Hiển thị alert "hết phiên vui lòng đăng nhập lại"
   - Redirect về `/login`

**Code chi tiết:**
```javascript
let isRefreshing = false;
let queue = [];

axiosClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const originalReq = error.config;
    const code = error.response?.data?.errorCode;
    
    if (code === "TOKEN_EXPIRED") {
      if (!originalReq._retry) {
        originalReq._retry = true;
        
        if (!isRefreshing) {
          // Bắt đầu refresh token
          localStorage.removeItem("accessToken");
          isRefreshing = true;
          
          return refreshToken()
            .then((newToken) => {
              localStorage.setItem("accessToken", newToken);
              isRefreshing = false;
              
              // Thực hiện tất cả requests trong queue
              queue.forEach((cb) => cb(newToken));
              queue = [];
              
              // Retry request ban đầu
              originalReq.headers.Authorization = `Bearer ${newToken}`;
              return axiosClient(originalReq);
            })
            .catch((err) => {
              queue = [];
              alert("hết phiên vui lòng đăng nhập lại");
              window.location.href = "/login";
              return Promise.reject(err);
            });
        }
        
        // Nếu đang refresh, thêm vào queue
        return new Promise((resolve) => {
          queue.push((token) => {
            originalReq.headers.Authorization = `Bearer ${token}`;
            resolve(axiosClient(originalReq));
          });
        });
      }
    }
    
    return Promise.reject(error);
  }
);
```

**Hàm refreshToken (dòng 12-28):**
```javascript
const refreshToken = async () => {
  try {
    const res = await axiosClient.post("auth/refresh");
    const accessToken = res.data?.accessToken;
    if (!accessToken) {
      throw new Error("No access token returned");
    }
    localStorage.setItem("accessToken", accessToken);
    return accessToken;
  } catch (error) {
    console.error("Refresh token failed:", error);
    if (error.code === "ECONNABORTED") {
      alert("Máy chủ không phản hồi sau 10 giây. Vui lòng thử lại sau.");
    }
    throw error;
  }
};
```

**Lưu ý:** Refresh token được gửi tự động qua cookie (`withCredentials: true`)

### 3.2. Backend - Xử Lý Refresh Token

**File:** `backend/src/routers/auth/auth.router.js` (dòng 14)
```javascript
Router.post('/refresh', authController.refreshToken);
```

**File:** `backend/src/controllers/auth/auth.controller.js` (dòng 139-154)

```javascript
refreshToken: asyncWrapper(async (req, res) => {
  // Lấy refreshToken từ cookie
  const { accessToken, newRefreshToken } = 
    await AuthService.refreshUserToken(req.cookies.refreshToken);
  
  // Cập nhật refreshToken trong cookie
  res.cookie('refreshToken', newRefreshToken, {
    maxAge: Number(config.JWT_REFRESH_EXPIRES_IN),
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  
  return utils.success(res, message.Auth.REFRESH_TOKEN_SUCCESS, {
    accessToken,
  });
})
```

**File:** `backend/src/services/auth/auth.service.js` (dòng 192-268)

**Quy trình refresh token:**

1. ✅ **Kiểm tra refreshToken có tồn tại:**
   - Nếu không có → Trả về lỗi `NO_REFRESH_TOKEN`

2. ✅ **Verify refreshToken:**
   ```javascript
   const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_TOKEN);
   const { id } = decoded;
   ```
   - Nếu token hết hạn hoặc không hợp lệ → Trả về lỗi `REFRESH_TOKEN_EXPIRED`

3. ✅ **Kiểm tra session trong database:**
   ```javascript
   const sessionData = await AuthModel.checkSession(id);
   ```
   - Kiểm tra session có tồn tại và chưa hết hạn (`expires_at > NOW()`)
   - Nếu không tồn tại → Trả về lỗi `SESSION_NOT_FOUND`

4. ✅ **Kiểm tra refreshToken có khớp:**
   ```javascript
   if (storedRefreshToken !== refreshToken) {
     throw new ServiceError(INVALID_REFRESH_TOKEN);
   }
   ```
   - So sánh refreshToken từ cookie với refreshToken trong database
   - Nếu không khớp → Trả về lỗi `INVALID_REFRESH_TOKEN`

5. ✅ **Lấy thông tin user mới nhất:**
   ```javascript
   const userData = await AuthModel.getUserById(id);
   ```
   - Nếu không tìm thấy → Trả về lỗi `USER_NOT_FOUND`

6. ✅ **Xóa session cũ và tạo session mới:**
   ```javascript
   await AuthModel.deleteSessionById(id);
   const newAccessToken = utils.createAccessToken(user);
   const newRefreshToken = utils.createRefreshToken(user);
   await AuthModel.insertSessionById(id, newRefreshToken);
   ```
   - Xóa session cũ để đảm bảo chỉ có 1 session active
   - Tạo access token mới
   - Tạo refresh token mới
   - Lưu refresh token mới vào database

7. ✅ **Trả về tokens:**
   - `accessToken`: Token mới để sử dụng
   - `newRefreshToken`: Refresh token mới (được lưu vào cookie)

**File:** `backend/src/models/auth/auth.model.js` (dòng 77-89)

**Chi tiết checkSession:**
```javascript
static async checkSession(user_id) {
  const query = `
    SELECT refresh_token, expires_at
    FROM user_sessions
    WHERE user_id = ? AND expires_at > NOW()
  `;
  return await findOne(query, [user_id]);
}
```

---

## 4. Luồng Đăng Xuất

### 4.1. Frontend

**File:** `frontend/src/hooks/useAuth.js` (dòng 45-57)

```javascript
const logoutUser = async () => {
  setLogoutLoading(true);
  try {
    const res = await authServices.logout();
    logout(); // Xóa user khỏi store
    toast.success(message);
  } catch (err) {
    throw err;
  } finally {
    setLogoutLoading(false);
  }
}
```

**File:** `frontend/src/stores/authStore.js` (dòng 20-29)

```javascript
logout: () => {
  localStorage.removeItem("accessToken");
  set({
    user: null,
    roles: [],
    permissions: [],
    isLogin: false,
    isLoading: false,
  });
}
```

### 4.2. Backend

**File:** `backend/src/controllers/auth/auth.controller.js` (dòng 111-117)

```javascript
logout: asyncWrapper(async (req, res) => {
  const { id } = req.user || {};
  await AuthService.logoutUser(id);
  
  res.clearCookie('refreshToken');
  return utils.success(res, message.Auth.LOGOUT_SUCCESS, null);
})
```

**File:** `backend/src/services/auth/auth.service.js` (dòng 154-173)

```javascript
logoutUser: async (user_id) => {
  if (!user_id) {
    throw new ServiceError(INVALID_USER);
  }
  
  const result = await AuthModel.logout(user_id);
  if (result.affectedRows === 0) {
    throw new ServiceError(LOGOUT_FAILED);
  }
}
```

**File:** `backend/src/models/auth/auth.model.js` (dòng 67-74)

```javascript
static async logout(user_id) {
  // Xóa tất cả session của user
  const result = await remove('user_sessions', { user_id });
  return result;
}
```

**Quy trình:**
1. ✅ Lấy `user_id` từ JWT token (middleware `verifyToken`)
2. ✅ Xóa tất cả session của user trong database
3. ✅ Xóa cookie `refreshToken` ở client
4. ✅ Trả về success message

---

## 5. Luồng Đăng Ký

### 5.1. Frontend

**File:** `frontend/src/hooks/useAuth.js` (dòng 33-42)

```javascript
const registerF = async (payload) => {
  const res = await authServices.register(payload);
  toast.success(message);
  return res;
}
```

### 5.2. Backend

**File:** `backend/src/controllers/auth/auth.controller.js` (dòng 13-26)

```javascript
register: asyncWrapper(async (req, res) => {
  await AuthSchema.register.validate(req.body, { abortEarly: false });
  
  const { fullname, email } = req.body;
  const sanitizedFullname = sanitizeText(fullname);
  const result = await AuthService.registerUser(sanitizedFullname, email);
  
  return utils.success(res, message.Auth.REGISTER_SUCCESS, {
    user_id: result.user_id,
    email: result.email,
    fullname: result.fullname,
  });
})
```

**File:** `backend/src/services/auth/auth.service.js` (dòng 19-53)

**Quy trình:**
1. ✅ Kiểm tra email đã tồn tại chưa (`AuthModel.isEmail`)
2. ✅ Tạo avatar mặc định
3. ✅ Đăng ký user mới với:
   - `fullname`: đã sanitize
   - `email`
   - `avatar_url`: mặc định
   - `role_id`: 5 (Guest)
4. ✅ Trả về thông tin user đã đăng ký

**Lưu ý:** Sau khi đăng ký, user cần đăng nhập để nhận OTP và xác minh.

---

## 6. Luồng Quên Mật Khẩu

### 6.1. Yêu Cầu Reset Password

**File:** `backend/src/controllers/auth/auth.controller.js` (dòng 185-196)

```javascript
requestPasswordReset: asyncWrapper(async (req, res) => {
  const { email } = req.body;
  const result = await AuthService.requestPasswordReset(email);
  
  return utils.success(res, 'Nếu email tồn tại, bạn sẽ nhận được mã OTP', {
    result,
  });
})
```

**File:** `backend/src/services/auth/auth.service.js` (dòng 307-357)

**Quy trình:**
1. ✅ Kiểm tra email có tồn tại
2. ✅ Tạo mã OTP reset password
3. ✅ Lưu OTP vào database (`insertOtp`)
4. ✅ Tạo reset token (JWT, hết hạn sau 15 phút)
5. ✅ Gửi email chứa OTP và link reset (nếu có)
6. ✅ Trả về message chung (không tiết lộ email có tồn tại hay không - bảo mật)

### 6.2. Reset Password

**File:** `backend/src/controllers/auth/auth.controller.js` (dòng 199-210)

```javascript
resetPassword: asyncWrapper(async (req, res) => {
  const { email, reset_code, new_password } = req.body;
  const result = await AuthService.resetPassword(
    email,
    reset_code,
    new_password
  );
  
  return utils.success(res, 'Đặt lại mật khẩu thành công', { result });
})
```

**File:** `backend/src/services/auth/auth.service.js` (dòng 360-409)

**Quy trình:**
1. ✅ Kiểm tra email có tồn tại
2. ✅ Xác minh OTP (`verifyOtp`)
3. ✅ Hash password mới (`bcrypt.hash`)
4. ✅ Cập nhật `password_hash` trong database
5. ✅ Xóa OTP sau khi reset thành công
6. ✅ Trả về success message

**Lưu ý:** Cần có cột `password_hash` trong bảng `users`:
```sql
ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) NULL;
```

---

## 7. Các Trường Hợp Xử Lý Lỗi

### 7.1. Middleware Verify Token

**File:** `backend/src/middlewares/jwt.js`

**Các lỗi có thể xảy ra:**

1. **NO_TOKEN** (dòng 8-13)
   - Không có token trong header `Authorization`
   - Status: 401

2. **TOKEN_EXPIRED** (dòng 22-27)
   - Token đã hết hạn (`TokenExpiredError`)
   - Status: 401
   - ErrorCode: `TOKEN_EXPIRED` → Frontend sẽ tự động refresh

3. **INVALID_TOKEN** (dòng 29-34)
   - Token không hợp lệ (`JsonWebTokenError`)
   - Status: 401

4. **TOKEN_NOT_ACTIVE** (dòng 36-41)
   - Token chưa tới thời gian có hiệu lực (`NotBeforeError`)
   - Status: 401

### 7.2. Refresh Token Errors

**File:** `backend/src/services/auth/auth.service.js` (dòng 192-268)

**Các lỗi có thể xảy ra:**

1. **NO_REFRESH_TOKEN** (dòng 193-200)
   - Không có refreshToken trong cookie
   - Status: 401

2. **REFRESH_TOKEN_EXPIRED** (dòng 254-264)
   - RefreshToken hết hạn hoặc không hợp lệ
   - Status: 403

3. **SESSION_NOT_FOUND** (dòng 209-216)
   - Session không tồn tại trong database hoặc đã hết hạn
   - Status: 403

4. **INVALID_REFRESH_TOKEN** (dòng 220-227)
   - RefreshToken không khớp với token trong database
   - Status: 403

5. **USER_NOT_FOUND** (dòng 231-238)
   - User không tồn tại trong database
   - Status: 404

### 7.3. OTP Verification Errors

**File:** `backend/src/models/auth/auth.model.js` (dòng 205-265)

**Các lỗi có thể xảy ra:**

1. **OTP_ATTEMPTS_EXCEEDED**
   - Số lần thử OTP vượt quá giới hạn (`otp_attempts >= OTP_MAX_ATTEMPTS`)
   - Tăng `otp_attempts` mỗi lần nhập sai

2. **OTP_EXPIRED**
   - OTP đã hết hạn (`otp_expires_at < NOW()`)

3. **OTP_INVALID**
   - OTP không khớp (`otp_code !== otp`)
   - Tăng `otp_attempts` lên 1

4. **USER_NOT_FOUND**
   - Email không tồn tại trong database

### 7.4. Login Errors

**File:** `backend/src/services/auth/auth.service.js` (dòng 77-106)

**Các lỗi có thể xảy ra:**

1. **INVALID_CREDENTIALS** (dòng 81-87)
   - Email không tồn tại
   - Status: 401

2. **ACCOUNT_BLOCKED** (dòng 91-98)
   - Tài khoản bị khóa (`is_active === false`)
   - Status: 403

---

## 📊 Sơ Đồ Luồng Tổng Quan

### Đăng Nhập OTP:
```
Frontend → POST /auth/login (email)
         ← TokenOTP
         
Frontend → POST /auth/sendotp (email, pin)
         ← accessToken, user
         → Lưu accessToken vào localStorage
         → Lưu refreshToken vào cookie (httpOnly)
```

### Refresh Token:
```
Frontend → API Request với accessToken
         ← 401 TOKEN_EXPIRED
         
Frontend → POST /auth/refresh (refreshToken từ cookie)
         ← accessToken mới
         → Retry request ban đầu với token mới
```

### Đăng Xuất:
```
Frontend → POST /auth/logout (accessToken trong header)
         ← Success
         → Xóa accessToken khỏi localStorage
         → Xóa refreshToken cookie
         → Xóa user khỏi store
```

---

## 🔐 Bảo Mật

### 1. Token Storage
- **Access Token**: Lưu trong `localStorage` (có thể bị XSS)
- **Refresh Token**: Lưu trong `httpOnly cookie` (bảo mật hơn, không thể truy cập từ JavaScript)

### 2. Token Rotation
- Mỗi lần refresh token, cả access token và refresh token đều được tạo mới
- Session cũ bị xóa trước khi tạo session mới

### 3. Session Management
- Mỗi user chỉ có 1 session active tại một thời điểm
- Session có thời gian hết hạn (`expires_at`)
- Session được lưu trong database để có thể revoke

### 4. OTP Security
- OTP có thời gian hết hạn
- Giới hạn số lần thử (`OTP_MAX_ATTEMPTS`)
- OTP được xóa sau khi sử dụng thành công

### 5. Input Sanitization
- Sanitize text input để tránh XSS (`sanitizeText`)

---

## 📝 Ghi Chú Quan Trọng

1. **Refresh Token Queue**: Frontend sử dụng queue để tránh refresh token nhiều lần đồng thời
2. **Single Session**: Mỗi user chỉ có 1 session active (xóa session cũ khi login/refresh)
3. **Cookie Security**: Refresh token cookie có `httpOnly`, `secure` (production), `sameSite: 'lax'`
4. **Token Expiry**: 
   - Access token: Ngắn hạn (thường vài phút đến vài giờ)
   - Refresh token: Dài hạn (thường vài ngày đến vài tuần)
5. **OTP Expiry**: OTP thường hết hạn sau vài phút (15 phút trong code)

---

## 🔄 Tóm Tắt Luồng Chính

1. **Đăng nhập**: Email → OTP → Access Token + Refresh Token
2. **Sử dụng API**: Access Token trong header → Nếu hết hạn → Tự động refresh
3. **Refresh Token**: Refresh Token từ cookie → Access Token mới + Refresh Token mới
4. **Đăng xuất**: Xóa session trong DB + Xóa tokens ở client

