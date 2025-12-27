// routers/admin/beeitBehindScene.router.js

import express from 'express';
import { beeitBehindSceneController } from '../../controllers/admin/index.js';

const Router = express.Router();

// Lấy tất cả photos
Router.get('/', beeitBehindSceneController.getPhotos);

// Lấy photo theo ID
Router.get('/:id', beeitBehindSceneController.getPhotoById);

// Tạo photo mới
Router.post('/', beeitBehindSceneController.createPhoto);

// Cập nhật photo
Router.put('/:id', beeitBehindSceneController.updatePhoto);

// Xóa photo
Router.delete('/:id', beeitBehindSceneController.deletePhoto);

// Cập nhật display order
Router.put('/order/update', beeitBehindSceneController.updateDisplayOrder);

export default Router;

