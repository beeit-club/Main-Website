import express from 'express';
import { postController } from '../../controllers/admin/index.js';

const Router = express.Router();
// lấy toàn bộ danh sách
Router.get('/', postController.getPosts);

// // Lấy bài viết theo slug
// Router.get('/:slug', postController.getPostBySlug);

// // Tạo bài viết mới
// Router.post('/', postController.createPost);

// // Cập nhật bài viết
// Router.put('/:id', postController.updatePost);

// // Xóa bài viết (soft delete)
// Router.delete('/:id', postController.deletePost);

// // Xóa vĩnh viễn bài viết
// Router.delete('/:id/permanent', postController.permanentDeletePost);

// // Khôi phục bài viết
// Router.patch('/:id/restore', postController.restorePost);

// // Thay đổi trạng thái bài viết
// Router.patch('/:id/status', postController.changePostStatus);

// // Lấy bài viết đã xóa (trash)
// Router.get('/trash/list', postController.getDeletedPosts);

export default Router;
