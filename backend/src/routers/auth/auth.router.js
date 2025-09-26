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

export default Router;
