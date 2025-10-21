import asyncWrapper from '../../middlewares/error.handler.js';
import commentService from '../../services/client/comment.service.js';
import { utils } from '../../utils/index.js';
import CommentSchema from '../../validation/client/comment.validation.js';
import xss from 'xss';
import { params } from '../../validation/common/common.schema.js';

const commentController = {
  // Lấy bình luật heeo bài viết
  getByPostId: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;
    const comments = await commentService.getCommentByPostId(id, {});
    utils.success(res, 'Lấy bình luận thành công', { comments });
  }),
  // tạo bình luận
  createComment: asyncWrapper(async (req, res) => {
    await CommentSchema.create.validate(req.body, { abortEarly: false });
    const { content, author_id, post_id, parent_id } = req.body;

    const cleanContent = xss(content);
    const commentData = {
      author_id,
      post_id,
      content: cleanContent,
      parent_id: parent_id || null,
    };
    const comment = await commentService.createComment(commentData);
    utils.success(res, 'Bình luận đã được gửi', {
      id: comment.insertId,
      ...commentData,
    });
  }),
  // cập nhật bình luận
  updateComment: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, {
      abortEarly: false,
    });
    await CommentSchema.update.validate(req.body, {
      abortEarly: false,
    });
    const { id } = req.params;
    const { content } = req.body;
    const cleanData = xss(content);
    const updateData = {
      content: cleanData,
    };
    await commentService.updateComment(id, updateData);
    utils.success(res, 'Cập nhật thành công');
  }),
  // xóa mềm
  deleteComment: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;
    await commentService.deleteComment(id);
    utils.success(res, 'Xóa mềm bình luật thành công');
  }),
  // Khôi phục
  restoreComment: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;
    await commentService.restoreComment(id);
    utils.success(res, 'Khôi phục bình luật thành công');
  }),
};

export default commentController;
