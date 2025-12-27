// models/admin/beeitLeader.model.js

import pool from '../../db.js';
import {
  findOne,
  insert,
  update,
  selectWithPagination,
} from '../../utils/database.js';

const table = 'beeit_leaders';

class BeeitLeaderModel {
  // Lấy tất cả leaders
  static async getAllLeaders(options = {}) {
    let sql = `SELECT * FROM ${table} WHERE 1=1`;
    let params = [];

    if (options?.filters?.status) {
      sql += ` AND status = ?`;
      params.push(options.filters.status);
    } else {
      // Mặc định chỉ lấy active
      sql += ` AND status = 'active'`;
    }

    if (options?.filters?.role) {
      sql += ` AND role LIKE ?`;
      params.push(`%${options.filters.role}%`);
    }

    sql += ` ORDER BY display_order ASC, id ASC`;

    if (options?.page || options?.limit) {
      return selectWithPagination(sql, params, options);
    } else {
      const [rows] = await pool.query(sql, params);
      return { data: rows, pagination: null };
    }
  }

  // Lấy leader theo ID
  static async getLeaderById(id) {
    const sql = `SELECT * FROM ${table} WHERE id = ?`;
    return findOne(sql, [id]);
  }

  // Tạo leader mới
  static async createLeader(data) {
    return insert(table, data);
  }

  // Cập nhật leader
  static async updateLeader(id, data) {
    return update(table, data, { id });
  }

  // Xóa leader (soft delete)
  static async deleteLeader(id) {
    return update(table, { status: 'inactive' }, { id });
  }

  // Cập nhật display order
  static async updateDisplayOrder(leaders) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      for (const leader of leaders) {
        await update(
          table,
          { display_order: leader.display_order },
          { id: leader.id },
        );
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

export default BeeitLeaderModel;
