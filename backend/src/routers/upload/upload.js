import express from 'express';
const Router = express.Router();
// Upload ảnh tạm (paste/upload trong editor)
Router.post(
  '/upload/temp',
  authenticateToken,
  upload.single('image'),
  uploadController.uploadTempImage,
);

// Upload nhiều ảnh cùng lúc
Router.post(
  '/upload/temp/multiple',
  authenticateToken,
  upload.array('images', 10),
  uploadController.uploadMultipleTempImages,
);

// Xóa ảnh tạm không dùng
Router.post(
  '/upload/cleanup',
  authenticateToken,
  uploadController.cleanupTempImages,
);

// Lấy danh sách ảnh tạm
Router.get(
  '/upload/temp/list',
  authenticateToken,
  uploadController.listTempImages,
);
export default Router;
