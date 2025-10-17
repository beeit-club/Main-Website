import {
  findOne,
  insert,
  selectWithPagination,
  update,
} from '../../utils/database.js';

class questionModel {
  static async getAllQuestions(options = {}) {
    let sql = `SELECT q.id, q.title, q.slug, q.status, q.view_count, q.created_at, EXISTS(SELECT 1 FROM answers a WHERE a.question_id = q.id AND a.is_accepted = 1) as has_accepted_answer FROM questions q WHERE q.deleted_at IS NULL`;
    let params = [];
    const { q, status, created_by, has_accepted_answer } =
      options.filters || {};

    if (q) {
      sql += ` AND (q.title LIKE ? OR q.content LIKE ?)`;
      params.push(`%${q}%`, `%${q}%`);
    }
    if (status !== undefined && status !== '') {
      sql += ` AND q.status = ?`;
      params.push(status);
    }
    if (created_by) {
      sql += ` AND q.created_by = ?`;
      params.push(created_by);
    }
    if (has_accepted_answer !== undefined && has_accepted_answer !== '') {
      const hasAccepted =
        has_accepted_answer === 'true' || has_accepted_answer === true ? 1 : 0;
      sql += ` HAVING has_accepted_answer = ?`;
      params.push(hasAccepted);
    }

    const orderBy = {
      field: options.sort_by || 'created_at',
      direction: options.sort_order || 'DESC',
    };

    return selectWithPagination(sql, params, { ...options, orderBy });
  }

  static async getOneQuestion(id) {
    const sql = `SELECT * FROM questions WHERE id = ? AND deleted_at IS NULL`;
    return findOne(sql, [id]);
  }

  static async createQuestion(data) {
    return insert('questions', data);
  }

  static async updateQuestion(id, data) {
    return update('questions', data, { id });
  }

  static async deleteQuestion(id) {
    const data = { deleted_at: new Date() };
    return update('questions', data, { id });
  }
}

export default questionModel;
