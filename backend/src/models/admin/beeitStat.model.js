// models/admin/beeitStat.model.js

import pool from '../../db.js';
import {
  findOne,
  insert,
  update,
  selectWithPagination,
} from '../../utils/database.js';

const table = 'beeit_stats';

class BeeitStatModel {
  // Lấy tất cả stats
  static async getAllStats(options = {}) {
    let sql = `SELECT * FROM ${table} WHERE is_active = TRUE`;
    let params = [];

    if (options?.filters?.stat_key) {
      sql += ` AND stat_key = ?`;
      params.push(options.filters.stat_key);
    }

    sql += ` ORDER BY display_order ASC`;

    if (options?.page || options?.limit) {
      return selectWithPagination(sql, params, options);
    } else {
      const [rows] = await pool.query(sql, params);
      return { data: rows, pagination: null };
    }
  }

  // Lấy stat theo ID
  static async getStatById(id) {
    const sql = `SELECT * FROM ${table} WHERE id = ?`;
    return findOne(sql, [id]);
  }

  // Lấy stat theo key
  static async getStatByKey(statKey) {
    const sql = `SELECT * FROM ${table} WHERE stat_key = ? AND is_active = TRUE`;
    return findOne(sql, [statKey]);
  }

  // Tạo stat mới
  static async createStat(data) {
    return insert(table, data);
  }

  // Cập nhật stat
  static async updateStat(id, data) {
    return update(table, data, { id });
  }

  // Cập nhật stat theo key
  static async updateStatByKey(statKey, data) {
    return update(table, data, { stat_key: statKey });
  }

  // Xóa stat (soft delete)
  static async deleteStat(id) {
    return update(table, { is_active: false }, { id });
  }
}

export default BeeitStatModel;
