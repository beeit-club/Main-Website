import express from 'express';
import { tagController } from '../../controllers/admin/index.js'; // Giả sử có file index

const Router = express.Router();
// Lấy danh sách tags
Router.get('/', tagController.getTags);

// Lấy tag theo ID
Router.get('/:id', tagController.getTagById);

// Tạo tag mới
Router.post('/', tagController.createTag);

// Cập nhật tag
Router.put('/:id', tagController.updateTag);

// Xóa tag (soft delete)
Router.delete('/:id', tagController.deleteTag);

// Khôi phục tag
Router.patch('/:id/restore', tagController.restoreTag);

// // Lấy tags đã xóa (trash)
Router.get('/trash/list', tagController.getTagsDelete);

export default Router;
