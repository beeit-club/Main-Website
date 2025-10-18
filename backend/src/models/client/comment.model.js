import { insert, selectWithPagination, update } from '../../utils/database.js';
import { dateTime } from '../../utils/datetime.js';

const TABLE = 'post_comments';

class CommentModel {
  static async getByPostId(postId, options = {}) {
    try {
      let sql = `
        SELECT 
          c.id, 
          c.content, 
          c.author_id, 
          c.post_id, 
          c.parent_id, 
          c.status,
          c.created_at, 
          c.updated_at,
          u.id as user_id,
          u.fullname as author_name,
          u.avatar_url as author_avatar,
          u.email as author_email
        FROM ${TABLE} c
        LEFT JOIN users u ON c.author_id = u.id
        WHERE c.post_id = ? AND c.deleted_at IS NULL
      `;
      const params = [postId];

      return selectWithPagination(sql, params, options);
    } catch (error) {}
  }

  static async create(data) {
    try {
      const newComment = await insert(TABLE, data);
      return newComment;
    } catch (error) {
      throw error;
    }
  }
  // update
  static async update(id, data) {
    console.log('🚀 ~ CommentModel ~ update ~ data:', data);
    try {
      const updatedComment = await update(TABLE, data, { id });
      return updatedComment;
    } catch (error) {
      throw error;
    }
  }

  // xóa mềm
  static async deleteComment(id) {
    try {
      const time = dateTime();
      const result = await update(TABLE, { deleted_at: time }, { id: id });
      return result;
    } catch (error) {
      throw error;
    }
  }
  // Khôi phục
  static async restoreComment(id) {
    try {
      const result = await update(TABLE, { deleted_at: null }, { id: id });
      return result;
    } catch (error) {
      throw error;
    }
  }
}
export default CommentModel;
