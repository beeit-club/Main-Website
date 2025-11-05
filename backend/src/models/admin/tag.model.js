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
      let sql = `SELECT
  t.id,
  t.name,
  t.slug,
  t.meta_description,
  t.created_at,
  t.updated_at,
  t.created_by,
  t.updated_by,
  u.fullname AS created_by_name 
FROM
  tags AS t 
 LEFT JOIN users AS u ON t.created_by = u.id 
WHERE
  t.deleted_at IS NULL`;
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
  static async getTagsDelete(options = {}) {
    try {
      let sql = `SELECT
  t.id,
  t.name,
  t.slug,
  t.meta_description,
  t.created_at,
  t.updated_at,
  t.created_by,
  t.updated_by,
  u.fullname AS created_by_name 
FROM
  tags AS t 
 LEFT JOIN users AS u ON t.created_by = u.id 
WHERE
  t.deleted_at IS NOT NULL`;
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
      const sql = `SELECT
  t.id,
  t.name,
  t.slug,
  t.meta_description,
  t.created_at,
  t.updated_at,
  t.created_by,
  t.updated_by,
  u.fullname AS created_by_name 
FROM
  tags AS t 
 LEFT JOIN users AS u ON t.created_by = u.id 
WHERE t.id = ?  `;
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
