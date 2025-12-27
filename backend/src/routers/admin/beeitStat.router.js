// routers/admin/beeitStat.router.js

import express from 'express';
import { beeitStatController } from '../../controllers/admin/index.js';

const Router = express.Router();

// Lấy tất cả stats
Router.get('/', beeitStatController.getStats);

// Lấy stat theo ID
Router.get('/:id', beeitStatController.getStatById);

// Tạo stat mới
Router.post('/', beeitStatController.createStat);

// Cập nhật stat
Router.put('/:id', beeitStatController.updateStat);

// Xóa stat
Router.delete('/:id', beeitStatController.deleteStat);

export default Router;

