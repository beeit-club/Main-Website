import express from 'express';
import { categoryControler } from '../../controllers/admin/index.js';

const Router = express.Router();
// Lấy danh sách categories
Router.get('/', categoryControler.getCategories);

// // Lấy category theo ID
Router.get('/:id', categoryControler.getCategoryById);

// // Tạo category mới
Router.post('/', categoryControler.createCategory);

// // Cập nhật category
Router.put('/:id', categoryControler.updateCategory);

// // Xóa category (soft delete)
Router.delete('/:id', categoryControler.deleteCategory);

// // Khôi phục category
Router.patch('/:id/restore', categoryControler.restoreCategory);
export default Router;
