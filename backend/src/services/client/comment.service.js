import { code, message } from '../../common/message/index.js';
import { serverError } from '../../utils/response.js';
import CommentModel from './../../models/client/comment.model.js';

const commentService = {
  getCommentByPostId: async (post_id, options) => {
    try {
      const comments = await CommentModel.getByPostId(post_id, options);
      if (!comments || comments.length === 0) {
        throw new serverError(
          message.Comment.COMMENT_NOT_FOUND,
          code.Comment.COMMENT_NOT_FOUND_CODE,
          'Không tìm thấy bình luận',
          404,
        );
      }
      return comments;
    } catch (error) {
      throw error;
    }
  },

  createComment: async (data) => {
    try {
      if (!data || !data.post_id || !data.content) {
        throw new serverError(
          message.Comment.COMMENT_CREATE_FAILED,
          code.Comment.COMMENT_CREATE_FAILED_CODE,
          'Dữ liệu bình luận không hợp lệ',
          400,
        );
      }
      const comment = await CommentModel.create(data);
      return {
        data: comment,
        message: message.Comment.COMMENT_CREATE_SUCCESS,
        code: code.Comment.COMMENT_CREATE_SUCCESS_CODE,
      };
    } catch (error) {
      throw error;
    }
  },
  updateComment: async (id, data) => {
    try {
      const comment = await CommentModel.update(id, data);
      return comment;
    } catch (error) {
      throw error;
    }
  },

  // xóa mềm
  deleteComment: async (id) => {
    try {
      const comment = await CommentModel.deleteComment(id);
      return comment;
    } catch (error) {
      throw error;
    }
  },
  // Khôi phục
  restoreComment: async (id) => {
    try {
      const comment = await CommentModel.restoreComment(id);
      return comment;
    } catch (error) {
      throw error;
    }
  },
};

export default commentService;
