import pool from '../../db.js';
import {
  findOne,
  insert,
  selectWithPagination,
  update,
} from '../../utils/database.js';

class answerModel {
  static async getAnswersForQuestion(questionId, options = {}) {
    console.log(
      '🚀 ~ answerModel ~ getAnswersForQuestion ~ questionId:',
      questionId,
    );
    console.log('🚀 ~ answerModel ~ getAnswersForQuestion ~ options:', options);
    let sql = `SELECT * FROM answers WHERE question_id = ? AND deleted_at IS NULL`;
    let params = [questionId];
    const { status } = options.filters || {};

    if (status !== undefined && status !== '') {
      sql += ` AND status = ?`;
      params.push(status);
    }

    const orderBy = {
      field: options.sort_by || 'created_at',
      direction: options.sort_order || 'DESC',
    };
    return selectWithPagination(sql, params, { ...options, orderBy });
  }

  static async getOneAnswer(id) {
    const sql = `SELECT * FROM answers WHERE id = ? AND deleted_at IS NULL`;
    return findOne(sql, [id]);
  }

  static async createAnswer(data) {
    return insert('answers', data);
  }

  static async updateAnswer(id, data) {
    return update('answers', data, { id });
  }

  static async deleteAnswer(id) {
    const data = { deleted_at: new Date() };
    return update('answers', data, { id });
  }

  static async voteAnswer(id, value) {
    const sql = `UPDATE answers SET vote_score = vote_score + ? WHERE id = ?`;
    const [result] = await pool.query(sql, [value, id]);
    return result.affectedRows;
  }
}

export default answerModel;
