import {
  findOne,
  insert,
  remove,
  selectWithPagination,
  update,
} from '../../utils/database.js';
import pool from '../../db.js';

const table = 'memory_flow_items';

class memoryFlowModel {
  // Lấy tất cả items (có pagination và filters)
  static async getAllItems(options = {}) {
    try {
      let sql = `SELECT
        mf.id,
        mf.title,
        mf.caption,
        mf.image_url,
        mf.display_order,
        mf.is_active,
        mf.created_at,
        mf.updated_at,
        u.fullname AS created_by_name
      FROM ${table} AS mf
      LEFT JOIN users AS u ON mf.created_by = u.id
      WHERE mf.deleted_at IS NULL`;

      let params = [];

      if (options?.filters?.is_active !== undefined) {
        sql += ` AND mf.is_active = ?`;
        params.push(options.filters.is_active);
      }

      if (options?.filters?.search) {
        sql += ` AND (mf.title LIKE ? OR mf.caption LIKE ?)`;
        const searchTerm = `%${options.filters.search}%`;
        params.push(searchTerm, searchTerm);
      }

      // Sắp xếp theo display_order
      sql += ` ORDER BY mf.display_order ASC, mf.created_at DESC`;

      const result = await selectWithPagination(sql, params, options);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Lấy items active (cho client API)
  static async getActiveItems(limit = null) {
    try {
      let sql = `SELECT
        id,
        title,
        caption,
        image_url AS src,
        display_order
      FROM ${table}
      WHERE deleted_at IS NULL AND is_active = 1
      ORDER BY display_order ASC, created_at DESC`;

      if (limit) {
        sql += ` LIMIT ?`;
        const [rows] = await pool.execute(sql, [limit]);
        return rows;
      }

      const [rows] = await pool.execute(sql);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Lấy 1 item theo ID
  static async getItemById(id) {
    try {
      const sql = `SELECT
        mf.*,
        u.fullname AS created_by_name,
        u2.fullname AS updated_by_name
      FROM ${table} AS mf
      LEFT JOIN users AS u ON mf.created_by = u.id
      LEFT JOIN users AS u2 ON mf.updated_by = u2.id
      WHERE mf.id = ? AND mf.deleted_at IS NULL`;

      const item = await findOne(sql, [id]);
      return item;
    } catch (error) {
      throw error;
    }
  }

  // Tạo mới item
  static async createItem(data) {
    try {
      const result = await insert(table, data);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Cập nhật item
  static async updateItem(id, data) {
    try {
      const result = await update(table, id, data);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Xóa item (soft delete)
  static async deleteItem(id) {
    try {
      const result = await remove(table, id);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Xóa vĩnh viễn
  static async permanentDeleteItem(id) {
    try {
      const [result] = await pool.execute(
        `DELETE FROM ${table} WHERE id = ?`,
        [id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Khôi phục item
  static async restoreItem(id) {
    try {
      const [result] = await pool.execute(
        `UPDATE ${table} SET deleted_at = NULL WHERE id = ?`,
        [id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Cập nhật display_order
  static async updateOrder(id, displayOrder) {
    try {
      const [result] = await pool.execute(
        `UPDATE ${table} SET display_order = ? WHERE id = ?`,
        [displayOrder, id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Toggle is_active
  static async toggleActive(id, isActive) {
    try {
      const [result] = await pool.execute(
        `UPDATE ${table} SET is_active = ? WHERE id = ?`,
        [isActive, id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Lấy items đã xóa (trash)
  static async getDeletedItems(options = {}) {
    try {
      let sql = `SELECT
        mf.id,
        mf.title,
        mf.caption,
        mf.image_url,
        mf.display_order,
        mf.is_active,
        mf.deleted_at,
        u.fullname AS created_by_name
      FROM ${table} AS mf
      LEFT JOIN users AS u ON mf.created_by = u.id
      WHERE mf.deleted_at IS NOT NULL
      ORDER BY mf.deleted_at DESC`;

      const result = await selectWithPagination(sql, [], options);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

export default memoryFlowModel;

