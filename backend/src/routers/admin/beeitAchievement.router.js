// routers/admin/beeitAchievement.router.js

import express from 'express';
import { beeitAchievementController } from '../../controllers/admin/index.js';

const Router = express.Router();

// Lấy tất cả achievements
Router.get('/', beeitAchievementController.getAchievements);

// Lấy achievement theo ID
Router.get('/:id', beeitAchievementController.getAchievementById);

// Tạo achievement mới
Router.post('/', beeitAchievementController.createAchievement);

// Cập nhật achievement
Router.put('/:id', beeitAchievementController.updateAchievement);

// Xóa achievement
Router.delete('/:id', beeitAchievementController.deleteAchievement);

// Cập nhật display order
Router.put('/order/update', beeitAchievementController.updateDisplayOrder);

export default Router;

