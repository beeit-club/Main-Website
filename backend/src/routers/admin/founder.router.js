import express from 'express';
import { founderController } from '../../controllers/admin/index.js';

const router = express.Router();

// Lấy tất cả
router.get('/', founderController.getAll);

// Lấy items đã xóa (trash)
router.get('/trash/list', founderController.getDeletedItems);

// Lấy 1 item theo ID
router.get('/:id', founderController.getItemById);

// Tạo mới
router.post('/', founderController.createItem);

// Cập nhật
router.put('/:id', founderController.updateItem);

// Xóa (soft delete)
router.delete('/:id', founderController.deleteItem);

// Xóa vĩnh viễn
router.delete('/:id/permanent', founderController.permanentDeleteItem);

// Khôi phục
router.patch('/:id/restore', founderController.restoreItem);

// Cập nhật display_order
router.patch('/:id/reorder', founderController.updateOrder);

// Toggle is_active
router.patch('/:id/toggle', founderController.toggleActive);

export default router;

