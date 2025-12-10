// models/admin/emailBatchRecipient.model.js

import {
  findOne,
  insert,
  selectWithPagination,
  update,
} from '../../utils/database.js';
import pool from '../../db.js';

class EmailBatchRecipientModel {
  // Tạo recipient
  static async createRecipient(data) {
    const recipientData = { ...data };
    
    // Parse JSON fields nếu là string
    if (recipientData.variables && typeof recipientData.variables === 'string') {
      recipientData.variables = JSON.parse(recipientData.variables);
    }

    // Convert JSON objects to JSON strings for database
    if (recipientData.variables && typeof recipientData.variables === 'object') {
      recipientData.variables = JSON.stringify(recipientData.variables);
    }

    const result = await insert('email_batch_recipients', recipientData);
    return result.insertId;
  }

  // Bulk create recipients
  static async bulkCreate(recipients) {
    if (!recipients || recipients.length === 0) {
      return [];
    }

    // Prepare data
    const values = recipients.map(rec => {
      const variables = typeof rec.variables === 'object' 
        ? JSON.stringify(rec.variables) 
        : rec.variables || null;
      
      return [
        rec.batch_job_id,
        rec.recipient_email,
        rec.status || 'pending',
        variables,
        rec.error_message || null,
        rec.retry_count || 0,
      ];
    });

    const sql = `
      INSERT INTO email_batch_recipients 
      (batch_job_id, recipient_email, status, variables, error_message, retry_count)
      VALUES ?
    `;

    const [result] = await pool.query(sql, [values]);
    return result.insertId;
  }

  // Lấy recipients theo job ID
  static async getRecipientsByJobId(jobId, options = {}) {
    let sql = `
      SELECT * FROM email_batch_recipients
      WHERE batch_job_id = ?
    `;
    const params = [jobId];

    // Filter by status
    if (options.status) {
      sql += ` AND status = ?`;
      params.push(options.status);
    }

    // Sort
    options.orderBy = {
      field: options.sort_by || 'created_at',
      direction: options.sort_order === 'asc' ? 'ASC' : 'DESC',
    };

    return selectWithPagination(sql, params, options);
  }

  // Lấy pending recipients
  static async getPendingByJobId(jobId) {
    const sql = `
      SELECT * FROM email_batch_recipients
      WHERE batch_job_id = ? AND status = 'pending'
      ORDER BY id ASC
    `;
    const [rows] = await pool.query(sql, [jobId]);
    return rows;
  }

  // Lấy failed recipients
  static async getFailedByJobId(jobId) {
    const sql = `
      SELECT * FROM email_batch_recipients
      WHERE batch_job_id = ? AND status = 'failed'
      ORDER BY id ASC
    `;
    const [rows] = await pool.query(sql, [jobId]);
    return rows;
  }

  // Cập nhật recipient
  static async updateRecipient(id, data) {
    const recipientData = { ...data };
    
    // Parse JSON fields nếu là string
    if (recipientData.variables && typeof recipientData.variables === 'string') {
      recipientData.variables = JSON.parse(recipientData.variables);
    }

    // Convert JSON objects to JSON strings for database
    if (recipientData.variables && typeof recipientData.variables === 'object') {
      recipientData.variables = JSON.stringify(recipientData.variables);
    }

    await update('email_batch_recipients', recipientData, { id });
    return true;
  }

  // Reset status (cho retry)
  static async resetStatus(recipientIds) {
    if (!recipientIds || recipientIds.length === 0) {
      return 0;
    }

    const placeholders = recipientIds.map(() => '?').join(',');
    const sql = `
      UPDATE email_batch_recipients
      SET status = 'pending', error_message = NULL, retry_count = retry_count + 1
      WHERE id IN (${placeholders})
    `;

    const [result] = await pool.query(sql, recipientIds);
    return result.affectedRows;
  }

  // Thống kê theo job
  static async getStatsByJobId(jobId) {
    const sql = `
      SELECT 
        COUNT(*) AS total,
        SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) AS sent,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) AS failed,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending
      FROM email_batch_recipients
      WHERE batch_job_id = ?
    `;
    return findOne(sql, [jobId]);
  }
}

export default EmailBatchRecipientModel;

