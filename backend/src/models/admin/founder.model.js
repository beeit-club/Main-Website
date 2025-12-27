import {
  findOne,
  insert,
  remove,
  selectWithPagination,
  update,
} from '../../utils/database.js';
import pool from '../../db.js';

const table = 'founders';

class founderModel {
  // Lấy tất cả founders/members (có pagination và filters)
  static async getAll(options = {}) {
    try {
      let sql = `SELECT
        f.id,
        f.name,
        f.role,
        f.image_url,
        f.bio,
        f.achievements,
        f.social_email,
        f.social_linkedin,
        f.social_github,
        f.display_order,
        f.is_active,
        f.is_founder,
        f.created_at,
        f.updated_at,
        u.fullname AS created_by_name
      FROM ${table} AS f
      LEFT JOIN users AS u ON f.created_by = u.id
      WHERE f.deleted_at IS NULL`;

      let params = [];

      if (options?.filters?.is_founder !== undefined) {
        sql += ` AND f.is_founder = ?`;
        params.push(options.filters.is_founder);
      }

      if (options?.filters?.is_active !== undefined) {
        sql += ` AND f.is_active = ?`;
        params.push(options.filters.is_active);
      }

      if (options?.filters?.search) {
        sql += ` AND (f.name LIKE ? OR f.role LIKE ?)`;
        const searchTerm = `%${options.filters.search}%`;
        params.push(searchTerm, searchTerm);
      }

      // Sắp xếp: Founder trước, sau đó theo display_order
      sql += ` ORDER BY f.is_founder DESC, f.display_order ASC, f.created_at DESC`;

      const result = await selectWithPagination(sql, params, options);
      
      // Parse achievements JSON
      if (result.data) {
        result.data = result.data.map((item) => {
          if (item.achievements) {
            try {
              item.achievements = JSON.parse(item.achievements);
            } catch (e) {
              item.achievements = [];
            }
          }
          return item;
        });
      }
      
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Lấy founder (cho client API)
  static async getFounder() {
    try {
      const sql = `SELECT
        id,
        name,
        role,
        image_url AS image,
        bio,
        achievements,
        social_email,
        social_linkedin,
        social_github
      FROM ${table}
      WHERE deleted_at IS NULL 
        AND is_active = 1 
        AND is_founder = 1
      ORDER BY display_order ASC
      LIMIT 1`;

      const [rows] = await pool.execute(sql);
      if (rows[0] && rows[0].achievements) {
        try {
          rows[0].achievements = JSON.parse(rows[0].achievements);
        } catch (e) {
          rows[0].achievements = [];
        }
      }
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Lấy core members (cho client API)
  static async getCoreMembers() {
    try {
      const sql = `SELECT
        id,
        name,
        role,
        image_url AS image,
        bio,
        social_email,
        social_linkedin,
        social_github,
        display_order
      FROM ${table}
      WHERE deleted_at IS NULL 
        AND is_active = 1 
        AND is_founder = 0
      ORDER BY display_order ASC`;

      const [rows] = await pool.execute(sql);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Lấy tất cả active (founder + members) cho client API
  static async getAllActive() {
    try {
      const founder = await this.getFounder();
      const members = await this.getCoreMembers();
      return {
        founder,
        members,
      };
    } catch (error) {
      throw error;
    }
  }

  // Lấy 1 item theo ID
  static async getItemById(id) {
    try {
      const sql = `SELECT
        f.*,
        u.fullname AS created_by_name,
        u2.fullname AS updated_by_name
      FROM ${table} AS f
      LEFT JOIN users AS u ON f.created_by = u.id
      LEFT JOIN users AS u2 ON f.updated_by = u2.id
      WHERE f.id = ? AND f.deleted_at IS NULL`;

      const item = await findOne(sql, [id]);
      if (item && item.achievements) {
        try {
          item.achievements = JSON.parse(item.achievements);
        } catch (e) {
          item.achievements = [];
        }
      }
      return item;
    } catch (error) {
      throw error;
    }
  }

  // Tạo mới
  static async createItem(data) {
    try {
      const result = await insert(table, data);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Cập nhật
  static async updateItem(id, data) {
    try {
      const result = await update(table, id, data);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Xóa (soft delete)
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

  // Khôi phục
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
        f.id,
        f.name,
        f.role,
        f.image_url,
        f.is_founder,
        f.is_active,
        f.deleted_at,
        u.fullname AS created_by_name
      FROM ${table} AS f
      LEFT JOIN users AS u ON f.created_by = u.id
      WHERE f.deleted_at IS NOT NULL
      ORDER BY f.deleted_at DESC`;

      const result = await selectWithPagination(sql, [], options);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

export default founderModel;

