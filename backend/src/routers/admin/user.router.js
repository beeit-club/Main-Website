import express from 'express';
import userController from './../../controllers/admin/user.controller.js';

const Router = express.Router();
// sửa lại url ko cần phải /create hay updaet ..vv
// Lấy danh sách người dùng chưa bị xóa mềm
Router.get('/', userController.getAllUser);
// Lấy người dùng theo id
Router.get('/:id', userController.getUserById);
// Tạo người dùng mới
Router.post('/create', userController.createUser);
// Cập nhật người dùng
Router.patch('/update/:id', userController.updateUser);
//Xóa người dùng
Router.delete('/delete/:id', userController.deleteUser);

export default Router;
