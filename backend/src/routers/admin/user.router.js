import express from 'express';
import userController from './../../controllers/admin/user.controller.js';
import { checkPermission } from '../../middlewares/permission.handler.js';

const Router = express.Router();
// sửa lại url ko cần phải /create hay updaet ..vv
// Lấy danh sách người dùng chưa bị xóa mềm
Router.get('/', checkPermission('users.view_all'), userController.getAllUser);
// Lấy người dùng theo id
Router.get('/:id', checkPermission('users.view'), userController.getUserById);
// Tạo người dùng mới
Router.post(
  '/create',
  checkPermission('users.create'),
  userController.createUser,
);
// Cập nhật người dùng
Router.patch(
  '/update/:id',
  checkPermission('users.edit'),
  userController.updateUser,
);
//Xóa người dùng
Router.delete(
  '/delete/:id',
  checkPermission('users.delete'),
  userController.deleteUser,
);

export default Router;
