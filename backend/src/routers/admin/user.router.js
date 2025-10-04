import express from 'express';
import userController from './../../controllers/admin/user.controller.js';

const router = express.Router();

// Lấy danh sách người dùng chưa bị xóa mềm
router.get('/', userController.getUsers);
// Lấy danh sách người dùng
router.get('/all', userController.getAllUser);
// Lấy người dùng theo id
router.get('/:id', userController.getUserById);
// Tạo người dùng mới
router.post('/create', userController.createUser);
// Cập nhật người dùng
router.patch('/update/:id', userController.updateUser);
//Xóa người dùng
router.delete('/delete/:id', userController.deleteUser);

export default router;
