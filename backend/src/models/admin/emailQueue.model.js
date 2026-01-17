// models/admin/emailQueue.model.js
import { query } from '../../utils/database.js';

class EmailQueueModel {
  async create(data) {
    const sql = `
      INSERT INTO email_queue 
      (batch_job_id, recipient_email, recipient_name, variables, status, attempts)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await query(sql, [
      data.batch_job_id || null, // Allow null for system emails
      data.recipient_email,
      data.recipient_name,
      JSON.stringify(data.variables),
      data.status || 'pending',
      data.attempts || 0
    ]);
    return result;
  }

  async getPendingItems(limit = 10) {
    const sql = `
      SELECT 
        eq.*,
        ebj.template_id
      FROM email_queue eq
      LEFT JOIN email_batch_jobs ebj ON eq.batch_job_id = ebj.id
      WHERE eq.status = 'pending'
      LIMIT ?
    `;
    const [rows] = await query(sql, [limit]);
    return rows;
  }

  async update(id, data) {
    if (!id || !data || Object.keys(data).length === 0) return;

    const keys = Object.keys(data);
    const values = Object.values(data);

    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const sql = `UPDATE email_queue SET ${setClause} WHERE id = ?`;

    const [result] = await query(sql, [...values, id]);
    return result;
  }

  // Hỗ trợ bulk create cũ (nếu còn dùng, cần sửa lại column name)
  async bulkCreate(items) {
    if (items.length === 0) return;
    // ... logic bulk insert tương tự service ...
  }
}

export default new EmailQueueModel();