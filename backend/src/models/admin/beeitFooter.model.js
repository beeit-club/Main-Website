// models/admin/beeitFooter.model.js

import pool from '../../db.js';
import { findOne, update } from '../../utils/database.js';

const table = 'beeit_footer_settings';

class BeeitFooterModel {
  // Lấy footer settings (chỉ có 1 record)
  static async getFooterSettings() {
    const sql = `SELECT * FROM ${table} ORDER BY id LIMIT 1`;
    return findOne(sql, []);
  }

  // Lấy footer settings theo ID
  static async getFooterSettingsById(id) {
    const sql = `SELECT * FROM ${table} WHERE id = ?`;
    return findOne(sql, [id]);
  }

  // Cập nhật footer settings
  static async updateFooterSettings(id, data) {
    return update(table, data, { id });
  }

  // Tạo footer settings mới (nếu chưa có)
  static async createFooterSettings(data) {
    const sql = `INSERT INTO ${table} SET ?`;
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(sql, [data]);
      return { id: result.insertId, ...data };
    } finally {
      connection.release();
    }
  }
}

export default BeeitFooterModel;
