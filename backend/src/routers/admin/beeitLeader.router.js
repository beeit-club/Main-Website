// routers/admin/beeitLeader.router.js

import express from 'express';
import { beeitLeaderController } from '../../controllers/admin/index.js';

const Router = express.Router();

// Lấy tất cả leaders
Router.get('/', beeitLeaderController.getLeaders);

// Lấy leader theo ID
Router.get('/:id', beeitLeaderController.getLeaderById);

// Tạo leader mới
Router.post('/', beeitLeaderController.createLeader);

// Cập nhật leader
Router.put('/:id', beeitLeaderController.updateLeader);

// Xóa leader
Router.delete('/:id', beeitLeaderController.deleteLeader);

// Cập nhật display order
Router.patch('/order', beeitLeaderController.updateDisplayOrder);

export default Router;

