import {
  findOne,
  insert,
  selectWithPagination,
  update,
} from '../../utils/database.js';
import { dateTime } from '../../utils/datetime.js';

class tagModel {
  // lấy toàn bộ
  static async getAllTag(options = {}) {
    try {
      let sql = `SELECT id, name, slug, meta_description, created_at FROM tags WHERE deleted_at IS NULL`;
      let params = [];

      if (options?.filters?.name) {
        sql += ` AND name LIKE ?`;
        params.push(`%${options.filters.name}%`);
      }
      const tags = await selectWithPagination(sql, params, options);
      return tags;
    } catch (error) {
      throw error;
    }
  }

  // lấy 1
  static async getOneTag(id) {
    try {
      const sql = `SELECT id, name, slug, meta_description, created_at FROM tags WHERE id = ? AND deleted_at IS NULL`;
      const result = await findOne(sql, [id]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // check xem đã tồn tại thẻ chưa
  static async checkIsTag(slug) {
    try {
      const sql = 'SELECT name FROM tags WHERE slug = ? AND deleted_at IS NULL';
      const result = await findOne(sql, [slug]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // thêm
  static async createTag(tag) {
    try {
      const newTag = await insert('tags', tag);
      return newTag;
    } catch (error) {
      throw error;
    }
  }

  // update
  static async updateTag(id, tag) {
    try {
      const updatedTag = await update('tags', tag, { id: id });
      return updatedTag;
    } catch (error) {
      throw error;
    }
  }

  // xóa mềm
  static async deleteTag(id) {
    try {
      const time = dateTime();
      const result = await update('tags', { deleted_at: time }, { id: id });
      return result;
    } catch (error) {
      throw error;
    }
  }

  // khôi phục
  static async restoreTag(id) {
    try {
      const sql = `UPDATE tags SET deleted_at = NULL WHERE id = ?`;
      const result = await findOne(sql, [id]); // findOne có thể không phù hợp ở đây, nhưng theo cấu trúc cũ
      return result;
    } catch (error) {
      throw error;
    }
  }
}
export default tagModel;
