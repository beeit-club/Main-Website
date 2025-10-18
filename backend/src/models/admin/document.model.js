// models/admin/document.model.js

import pool from '../../db.js';
import {
  findOne,
  insert,
  remove,
  selectWithPagination,
  update,
} from '../../utils/database.js';
import { dateTime } from '../../utils/datetime.js';

class documentModel {
  // Lấy toàn bộ
  static async getAllDocuments(options = {}) {
    let sql = `SELECT id, title, slug, category_id, access_level, status, created_at FROM documents WHERE deleted_at IS NULL`;
    let params = [];

    const filters = options?.filters || {};
    if (filters.title) {
      sql += ` AND title LIKE ?`;
      params.push(`%${filters.title}%`);
    }
    if (filters.category_id) {
      sql += ` AND category_id = ?`;
      params.push(filters.category_id);
    }

    return await selectWithPagination(sql, params, options);
  }
  // Lấy toàn bộ tài liệu đã xóa
  static async getDeletedDocuments(options = {}) {
    const sql = `SELECT id, title, slug, deleted_at FROM documents WHERE deleted_at IS NOT NULL`;
    return await selectWithPagination(sql, [], options);
  }

  // Lấy 1
  static async getOneDocument(id) {
    const sql = `SELECT * FROM documents WHERE id = ? AND deleted_at IS NULL`;
    return await findOne(sql, [id]);
  } // Lấy 1 tài liệu đã xóa (để kiểm tra)
  static async getOneDeletedDocument(id) {
    const sql = `SELECT id FROM documents WHERE id = ? AND deleted_at IS NOT NULL`;
    return await findOne(sql, [id]);
  }

  // Check slug đã tồn tại chưa (trừ chính nó khi update)
  static async checkIsDocument(slug, excludeId = null) {
    let sql = 'SELECT id FROM documents WHERE slug = ? AND deleted_at IS NULL';
    const params = [slug];
    if (excludeId) {
      sql += ' AND id != ?';
      params.push(excludeId);
    }
    return await findOne(sql, params);
  }

  // Thêm
  static async createDocument(docData) {
    return await insert('documents', docData);
  }

  // Cập nhật
  static async updateDocument(id, docData) {
    return await update('documents', docData, { id });
  }

  // Xóa mềm
  static async deleteDocument(id) {
    const data = { deleted_at: dateTime() };
    return await update('documents', data, { id });
  }

  // Gán người dùng (có thể gán nhiều)
  static async assignUsers(documentId, userIds) {
    // ON DUPLICATE KEY UPDATE để tránh lỗi nếu đã tồn tại cặp (document_id, user_id)
    const sql = `
      INSERT INTO document_restricted_users (document_id, user_id) 
      VALUES ? 
      ON DUPLICATE KEY UPDATE document_id=VALUES(document_id)
    `;
    const values = userIds.map((userId) => [documentId, userId]);
    const [result] = await pool.query(sql, [values]);
    return result;
  }

  // Xóa một người dùng
  static async removeUser(documentId, userId) {
    return await remove('document_restricted_users', {
      document_id: documentId,
      user_id: userId,
    });
  }
  // Khôi phục tài liệu
  static async restoreDocument(id) {
    const data = { deleted_at: null };
    return await update('documents', data, { id });
  }
}

export default documentModel;
