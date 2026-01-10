// models/admin/emailCustomVariable.model.js

import { findOne } from '../../utils/database.js';
import pool from '../../db.js';

class EmailCustomVariableModel {
  // Lấy tất cả custom variables (global + template-specific)
  static async getAllVariables(options = {}) {
    let sql = `
      SELECT 
        ecv.id,
        ecv.template_id,
        ecv.name,
        ecv.type,
        ecv.description,
        ecv.expression,
        ecv.dependencies,
        ecv.helper_name,
        ecv.helper_params,
        ecv.function_code,
        ecv.return_type,
        ecv.is_active,
        ecv.created_at,
        ecv.updated_at,
        et.name AS template_name
      FROM email_custom_variables ecv
      LEFT JOIN email_templates et ON ecv.template_id = et.id
      WHERE ecv.deleted_at IS NULL
    `;
    const params = [];

    // Filter by template_id
    if (options.template_id !== undefined) {
      if (options.template_id === null) {
        sql += ` AND ecv.template_id IS NULL`; // Global variables
      } else {
        sql += ` AND (ecv.template_id = ? OR ecv.template_id IS NULL)`; // Template-specific + global
        params.push(options.template_id);
      }
    }

    // Filter by type
    if (options.type) {
      sql += ` AND ecv.type = ?`;
      params.push(options.type);
    }

    // Search by name
    if (options.q) {
      sql += ` AND ecv.name LIKE ?`;
      params.push(`%${options.q}%`);
    }

    sql += ` ORDER BY ecv.template_id ASC, ecv.name ASC`;

    const [rows] = await pool.query(sql, params);
    return rows;
  }

  // Lấy custom variable theo ID
  static async getVariableById(id) {
    const sql = `
      SELECT 
        ecv.*,
        et.name AS template_name
      FROM email_custom_variables ecv
      LEFT JOIN email_templates et ON ecv.template_id = et.id
      WHERE ecv.id = ?
    `;
    return findOne(sql, [id]);
  }

  // Lấy custom variable theo name và template_id
  static async getVariableByName(name, templateId = null) {
    const sql = `
      SELECT * FROM email_custom_variables
      WHERE name = ? AND (template_id = ? OR (template_id IS NULL AND ? IS NULL))
      LIMIT 1
    `;
    return findOne(sql, [name, templateId, templateId]);
  }

  // Tạo custom variable mới
  static async createVariable(data) {
    const sql = `
      INSERT INTO email_custom_variables (
        template_id,
        name,
        type,
        description,
        expression,
        dependencies,
        helper_name,
        helper_params,
        function_code,
        return_type,
        is_active,
        created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      data.template_id || null,
      data.name,
      data.type || 'expression',
      data.description || null,
      data.expression || null,
      data.dependencies ? JSON.stringify(data.dependencies) : null,
      data.helper_name || null,
      data.helper_params ? JSON.stringify(data.helper_params) : null,
      data.function_code || null,
      data.return_type || 'string',
      data.is_active !== undefined ? data.is_active : 1,
      data.created_by || null,
    ];

    const [result] = await pool.query(sql, params);
    return result;
  }

  // Cập nhật custom variable
  static async updateVariable(id, data) {
    const fields = [];
    const params = [];

    if (data.name !== undefined) {
      fields.push('name = ?');
      params.push(data.name);
    }
    if (data.type !== undefined) {
      fields.push('type = ?');
      params.push(data.type);
    }
    if (data.description !== undefined) {
      fields.push('description = ?');
      params.push(data.description);
    }
    if (data.expression !== undefined) {
      fields.push('expression = ?');
      params.push(data.expression);
    }
    if (data.dependencies !== undefined) {
      fields.push('dependencies = ?');
      params.push(data.dependencies ? JSON.stringify(data.dependencies) : null);
    }
    if (data.helper_name !== undefined) {
      fields.push('helper_name = ?');
      params.push(data.helper_name);
    }
    if (data.helper_params !== undefined) {
      fields.push('helper_params = ?');
      params.push(
        data.helper_params ? JSON.stringify(data.helper_params) : null,
      );
    }
    if (data.function_code !== undefined) {
      fields.push('function_code = ?');
      params.push(data.function_code);
    }
    if (data.return_type !== undefined) {
      fields.push('return_type = ?');
      params.push(data.return_type);
    }
    if (data.is_active !== undefined) {
      fields.push('is_active = ?');
      params.push(data.is_active);
    }

    if (fields.length === 0) {
      return { affectedRows: 0 };
    }

    params.push(id);
    const sql = `UPDATE email_custom_variables SET ${fields.join(
      ', ',
    )} WHERE id = ?`;

    const [result] = await pool.query(sql, params);
    return result;
  }

  // Xóa custom variable
  static async deleteVariable(id) {
    const sql = `DELETE FROM email_custom_variables WHERE id = ?`;
    const [result] = await pool.query(sql, [id]);
    return result;
  }

  // Lấy variables cho một template (global + template-specific)
  static async getVariablesForTemplate(templateId) {
    const sql = `
      SELECT * FROM email_custom_variables
      WHERE is_active = 1 AND (template_id = ? OR template_id IS NULL)
      ORDER BY template_id ASC, name ASC
    `;
    const [rows] = await pool.query(sql, [templateId]);
    return rows;
  }
}

export default EmailCustomVariableModel;
