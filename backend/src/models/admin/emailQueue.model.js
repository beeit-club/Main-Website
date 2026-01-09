
import {
  insert,
  update,
  query,
  selectWithPagination
} from '../../utils/database.js';

class EmailQueueModel {
  // Insert nhiều dòng cùng lúc (Batch Insert)
  static async bulkCreate(items) {
    if (!items || items.length === 0) return;

    const values = [];
    const placeholders = items.map(item => {
      values.push(
        item.campaign_id,
        item.recipient_email,
        item.recipient_name,
        JSON.stringify(item.variables || {})
      );
      return '(?, ?, ?, ?)';
    });

    const sql = `
      INSERT INTO email_queue (campaign_id, recipient_email, recipient_name, variables)
      VALUES ${placeholders.join(', ')}
    `;

    return query(sql, values);
  }

  static async update(id, data) {
    // Stringify JSON fields
    if (data.variables && typeof data.variables === 'object') {
      data.variables = JSON.stringify(data.variables);
    }
    return update('email_queue', data, { id });
  }

  // Lấy các item đang pending để xử lý
  static async getPendingItems(limit = 10) {
    const sql = `
      SELECT q.*, c.template_id
      FROM email_queue q
      JOIN email_campaigns c ON q.campaign_id = c.id
      WHERE q.status = 'pending' AND c.status != 'paused'
      ORDER BY q.created_at ASC
      LIMIT ?
    `;
    const [rows] = await query(sql, [limit]);
    return rows;
  }

  // Lấy danh sách queue của 1 campaign
  static async getByCampaignId(campaignId, options = {}) {
    let sql = `SELECT * FROM email_queue WHERE campaign_id = ?`;
    const params = [campaignId];

    if (options.status) {
      sql += ` AND status = ?`;
      params.push(options.status);
    }

    // Default sort
    options.orderBy = { field: 'id', direction: 'ASC' };

    return selectWithPagination(sql, params, options);
  }
}

export default EmailQueueModel;
