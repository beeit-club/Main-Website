// routers/admin/document.router.js

import express from 'express';
import { documentController } from '../../controllers/admin/index.js';

const Router = express.Router();

// Lấy danh sách tài liệu (có filter)
Router.get('/', documentController.getDocuments);
// Lấy danh sách tài liệu ĐÃ XÓA
Router.get('/deleted', documentController.getDeletedDocuments);
// Lấy tài liệu theo ID
Router.get('/:id', documentController.getDocumentById);

// Tạo tài liệu mới
Router.post('/', documentController.createDocument);

// Cập nhật tài liệu
Router.put('/:id', documentController.updateDocument);

// Xóa tài liệu (soft delete)
Router.delete('/:id', documentController.deleteDocument);
// Khôi phục tài liệu đã xóa
Router.patch('/:id/restore', documentController.restoreDocument);

// Gán quyền truy cập cho một hoặc nhiều người dùng
Router.post('/:id/assign-users', documentController.assignUsersToDocument);

// Xóa quyền truy cập của một người dùng khỏi tài liệu
Router.delete(
  '/:id/remove-user/:userId',
  documentController.removeUserFromDocument,
);

export default Router;
