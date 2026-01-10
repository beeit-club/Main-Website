import express from 'express';
import { authController } from '../../controllers/index.js';
import { middleware } from '../../middlewares/index.js';

const Router = express.Router();

// Đăng ký
Router.post('/register', authController.register);

// Đăng Nhập (Gửi OTP)
Router.post('/login', authController.login);

// Xác minh OTP để lấy token (Login Step 2)
Router.post('/sendotp', authController.sendotp);

// Đăng nhập bằng Google
Router.post('/google', authController.google);

// Gửi lại OTP
Router.post('/resend-verification', authController.resendVerification);

// Cấp lại accessToken (Refresh Token)
Router.post('/refresh', authController.refreshToken);

// --- Các route yêu cầu đăng nhập ---

// Đăng xuất
Router.post('/logout', middleware.verifyToken, authController.logout);

// Lấy danh sách quyền & thông tin user
Router.get('/permissions', middleware.verifyToken, authController.permissions);

// Lấy thông tin profile hiện tại
Router.get('/profile', middleware.verifyToken, authController.getProfile);

// Cập nhật profile hiện tại
Router.put('/profile', middleware.verifyToken, authController.updateProfile);

export default Router;