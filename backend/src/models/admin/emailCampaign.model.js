
import {
  insert,
  update,
  findOne,
  selectWithPagination,
  query,
} from '../../utils/database.js';

class EmailCampaignModel {
  static async create(data) {
    const result = await insert('email_campaigns', data);
    return result.insertId;
  }

  static async update(id, data) {
    return update('email_campaigns', data, { id });
  }

  static async getById(id) {
    const sql = `
      SELECT 
        c.*, 
        t.name as template_name,
        t.subject as template_subject
      FROM email_campaigns c
      LEFT JOIN email_templates t ON c.template_id = t.id
      WHERE c.id = ?
    `;
    return findOne(sql, [id]);
  }

  static async getAll(options = {}) {
    let sql = `
      SELECT 
        c.*, 
        t.name as template_name
      FROM email_campaigns c
      LEFT JOIN email_templates t ON c.template_id = t.id
      WHERE 1=1
    `;
    const params = [];

    if (options.status) {
      sql += ` AND c.status = ?`;
      params.push(options.status);
    }

    if (options.q) {
      sql += ` AND c.name LIKE ?`;
      params.push(`%${options.q}%`);
    }

    options.orderBy = { field: 'created_at', direction: 'DESC' };
    
    return selectWithPagination(sql, params, options);
  }

  // Cập nhật thống kê (success/fail count)
  static async updateStats(campaignId) {
    const sql = `
      UPDATE email_campaigns
      SET 
        success_count = (SELECT COUNT(*) FROM email_queue WHERE campaign_id = ? AND status = 'sent'),
        fail_count = (SELECT COUNT(*) FROM email_queue WHERE campaign_id = ? AND status = 'failed'),
        total_recipients = (SELECT COUNT(*) FROM email_queue WHERE campaign_id = ?),
        status = CASE 
          WHEN (SELECT COUNT(*) FROM email_queue WHERE campaign_id = ? AND status IN ('pending', 'processing')) = 0 THEN 'completed'
          ELSE status
        END,
        completed_at = CASE 
          WHEN (SELECT COUNT(*) FROM email_queue WHERE campaign_id = ? AND status IN ('pending', 'processing')) = 0 THEN NOW()
          ELSE completed_at
        END
      WHERE id = ?
    `;
    return query(sql, [campaignId, campaignId, campaignId, campaignId, campaignId, campaignId]);
  }
}

export default EmailCampaignModel;
