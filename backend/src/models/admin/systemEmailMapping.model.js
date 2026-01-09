// models/admin/systemEmailMapping.model.js
import { findOne, update, selectWithPagination } from '../../utils/database.js';

class SystemEmailMappingModel {
  static async getMappingByAction(actionKey) {
    const sql = 'SELECT * FROM system_email_mappings WHERE action_key = ?';
    return findOne(sql, [actionKey]);
  }

  static async getAllMappings(options = {}) {
    const sql = `
      SELECT 
        m.id,
        m.action_key,
        m.description,
        m.template_id,
        t.name as template_name
      FROM system_email_mappings m
      LEFT JOIN email_templates t ON m.template_id = t.id
      WHERE t.deleted_at IS NULL OR m.template_id IS NULL
    `;
    return selectWithPagination(sql, [], options);
  }

  static async updateMapping(actionKey, templateId) {
    return update('system_email_mappings', { template_id: templateId }, { action_key: actionKey });
  }
}

export default SystemEmailMappingModel;
