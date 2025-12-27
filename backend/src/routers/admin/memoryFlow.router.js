import express from 'express';
import { memoryFlowController } from '../../controllers/admin/index.js';

const router = express.Router();

// Lấy tất cả items
router.get('/', memoryFlowController.getItems);

// Lấy items đã xóa (trash)
router.get('/trash/list', memoryFlowController.getDeletedItems);

// Lấy 1 item theo ID
router.get('/:id', memoryFlowController.getItemById);

// Tạo mới item
router.post('/', memoryFlowController.createItem);

// Cập nhật item
router.put('/:id', memoryFlowController.updateItem);

// Xóa item (soft delete)
router.delete('/:id', memoryFlowController.deleteItem);

// Xóa vĩnh viễn
router.delete('/:id/permanent', memoryFlowController.permanentDeleteItem);

// Khôi phục item
router.patch('/:id/restore', memoryFlowController.restoreItem);

// Cập nhật display_order
router.patch('/:id/reorder', memoryFlowController.updateOrder);

// Toggle is_active
router.patch('/:id/toggle', memoryFlowController.toggleActive);

export default router;

