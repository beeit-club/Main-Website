import express from 'express';
import commentController from '../../controllers/client/comment.controller.js';
const Router = express.Router();

Router.get('/:id', commentController.getByPostId);
Router.post('/', commentController.createComment);
Router.patch('/:id', commentController.updateComment);
Router.delete('/:id', commentController.deleteComment);
Router.patch('/:id/restore', commentController.restoreComment);

export default Router;
