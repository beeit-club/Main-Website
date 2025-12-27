// models/admin/beeitEmailSubmission.model.js

import pool from '../../db.js';
import {
  findOne,
  insert,
  update,
  selectWithPagination,
} from '../../utils/database.js';

const table = 'beeit_email_submissions';

class BeeitEmailSubmissionModel {
  // Lấy tất cả email submissions
  static async getAllSubmissions(options = {}) {
    let sql = `SELECT * FROM ${table} WHERE 1=1`;
    let params = [];

    if (options?.filters?.email) {
      sql += ` AND email LIKE ?`;
      params.push(`%${options.filters.email}%`);
    }

    if (options?.filters?.status) {
      sql += ` AND status = ?`;
      params.push(options.filters.status);
    }

    sql += ` ORDER BY submitted_at DESC`;

    return selectWithPagination(sql, params, options);
  }

  // Lấy submission theo ID
  static async getSubmissionById(id) {
    const sql = `SELECT * FROM ${table} WHERE id = ?`;
    return findOne(sql, [id]);
  }

  // Tạo submission mới
  static async createSubmission(data) {
    return insert(table, data);
  }

  // Cập nhật submission
  static async updateSubmission(id, data) {
    return update(table, data, { id });
  }

  // Kiểm tra email đã tồn tại chưa (trong vòng 24h)
  static async checkEmailExists(email) {
    const sql = `SELECT * FROM ${table} 
                 WHERE email = ? 
                 AND submitted_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
                 ORDER BY submitted_at DESC LIMIT 1`;
    return findOne(sql, [email]);
  }

  // Đếm tổng số submissions
  static async getTotalCount() {
    const sql = `SELECT COUNT(*) as total FROM ${table}`;
    const [rows] = await pool.query(sql);
    return rows[0]?.total || 0;
  }

  // Đếm theo status
  static async getCountByStatus(status) {
    const sql = `SELECT COUNT(*) as total FROM ${table} WHERE status = ?`;
    const [rows] = await pool.query(sql, [status]);
    return rows[0]?.total || 0;
  }
}

export default BeeitEmailSubmissionModel;
