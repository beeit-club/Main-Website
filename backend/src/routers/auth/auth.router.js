import express from 'express';
import { authController } from '../../controllers/index.js';
import { middleware } from '../../middlewares/index.js';
const Router = express.Router();
// Đăng ký
Router.post('/register', authController.register);
// Đăng Nhập
Router.post('/login', authController.login);
// Đăng xuất
Router.post('/logout', middleware.verifyToken, authController.logout);
// lấy danh sách quyền
Router.get('/permissions', middleware.verifyToken, authController.permissions);
// cấp lại accessToken
Router.post('/refresh', authController.refreshToken);
// gửi lai email xác minh
Router.post('/resend-verification', authController.resendVerification);
// gửi otp xác minh đăng nhập
Router.post('/sendotp', authController.sendotp);
// đăng nhập bằng gg
Router.post('/google', authController.google);
// Lấy thông tin profile hiện tại
Router.get('/profile', middleware.verifyToken, authController.getProfile);
// Cập nhật profile hiện tại
Router.put('/profile', middleware.verifyToken, authController.updateProfile);

export default Router;
