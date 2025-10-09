import {
  findOne,
  insert,
  selectWithPagination,
  update,
} from '../../utils/database.js';
import { dateTime } from '../../utils/datetime.js';

const TABLE = 'document_categories';

class DocumentCategoryModel {
  static async getAll(options = {}) {
    try {
      let sql = `SELECT id, name, slug, parent_id, created_at FROM ${TABLE} WHERE deleted_at IS NULL`;
      const params = [];

      if (options?.filters?.name) {
        sql += ` AND name LIKE ?`;
        params.push(`%${options.filters.name}%`);
      }
      return selectWithPagination(sql, params, options);
    } catch (error) {
      throw error;
    }
  }

  static async getOne(id) {
    try {
      const sql = `SELECT * FROM ${TABLE} WHERE id = ? AND deleted_at IS NULL`;
      return findOne(sql, [id]);
    } catch (error) {
      throw error;
    }
  }

  static async checkBySlug(slug) {
    try {
      const sql = `SELECT slug FROM ${TABLE} WHERE slug = ? AND deleted_at IS NULL`;
      return findOne(sql, [slug]);
    } catch (error) {
      throw error;
    }
  }

  static async create(data) {
    try {
      return insert(TABLE, data);
    } catch (error) {
      throw error;
    }
  }

  static async update(id, data) {
    try {
      return update(TABLE, data, { id });
    } catch (error) {
      throw error;
    }
  }

  static async softDelete(id) {
    try {
      return update(TABLE, { deleted_at: dateTime() }, { id });
    } catch (error) {
      throw error;
    }
  }

  static async restore(id) {
    try {
      return update(TABLE, { deleted_at: null }, { id });
    } catch (error) {
      throw error;
    }
  }
}
export default DocumentCategoryModel;
