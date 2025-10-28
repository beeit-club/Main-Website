import {
  findOne,
  insert,
  selectWithPagination,
  update,
  remove,
} from '../../utils/database.js';

class InterviewModel {
  static async getAll(options = {}) {
    let sql = `SELECT * FROM interview_schedules WHERE 1=1`;
    let params = [];
    if (options?.filters?.search) {
      sql += ` AND (title LIKE ?)`;
      params.push(`%${options.filters.search}%`);
    }
    // Cập nhật ORDER BY
    return await selectWithPagination(sql, params, {
      ...options,
      orderBy: { field: 'interview_date', direction: 'DESC' },
    });
  }
  static async getOne(id) {
    return await findOne(`SELECT * FROM interview_schedules WHERE id = ?`, [
      id,
    ]);
  }
  static async create(data) {
    return await insert('interview_schedules', data);
  }
  static async update(id, data) {
    return await update('interview_schedules', data, { id });
  }
  static async delete(id) {
    return await remove('interview_schedules', { id });
  }
}
export default InterviewModel;
