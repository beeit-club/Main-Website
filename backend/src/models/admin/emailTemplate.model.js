// models/admin/emailTemplate.model.js

import {
  findOne,
  insert,
  selectWithPagination,
  update,
  remove,
} from '../../utils/database.js';
import pool from '../../db.js';

class EmailTemplateModel {
  // Lấy danh sách templates (có pagination, filter)
  static async getAllTemplates(options = {}) {
    let sql = `
      SELECT 
        et.id,
        et.name,
        et.subject,
        et.header,
        et.body,
        et.footer,
        et.category,
        et.is_active,
        et.is_system,
        et.created_at,
        et.updated_at,
        u1.fullname AS created_by_name,
        u2.fullname AS updated_by_name
      FROM email_templates et
      LEFT JOIN users u1 ON et.created_by = u1.id
      LEFT JOIN users u2 ON et.updated_by = u2.id
      WHERE et.deleted_at IS NULL
    `;
    const params = [];

    // Filter by category
    if (options.category) {
      sql += ` AND et.category = ?`;
      params.push(options.category);
    }

    // Filter by is_active
    if (options.is_active !== undefined) {
      sql += ` AND et.is_active = ?`;
      params.push(options.is_active === 'true' || options.is_active === 1 ? 1 : 0);
    }

    // Search by name
    if (options.q) {
      sql += ` AND (et.name LIKE ?)`;
      params.push(`%${options.q}%`);
    }

    // Sort
    const validSortFields = ['created_at', 'name', 'updated_at'];
    options.orderBy = {
      field: validSortFields.includes(options.sort_by)
        ? options.sort_by
        : 'created_at',
      direction: options.sort_order === 'asc' ? 'ASC' : 'DESC',
    };

    return selectWithPagination(sql, params, options);
  }

  // Lấy template theo ID
  static async getTemplateById(id) {
    const sql = `
      SELECT 
        et.*,
        u1.fullname AS created_by_name,
        u2.fullname AS updated_by_name
      FROM email_templates et
      LEFT JOIN users u1 ON et.created_by = u1.id
      LEFT JOIN users u2 ON et.updated_by = u2.id
      WHERE et.id = ? AND et.deleted_at IS NULL
    `;
    return findOne(sql, [id]);
  }

  // Lấy template theo name
  static async getTemplateByName(name) {
    const sql = `
      SELECT * FROM email_templates 
      WHERE name = ? AND deleted_at IS NULL AND is_active = 1
    `;
    return findOne(sql, [name]);
  }

  // Kiểm tra name tồn tại
  static async checkNameExists(name, excludeId = null) {
    let sql = `SELECT id FROM email_templates WHERE name = ? AND deleted_at IS NULL`;
    const params = [name];

    if (excludeId) {
      sql += ` AND id != ?`;
      params.push(excludeId);
    }

    const result = await findOne(sql, params);
    return !!result;
  }

  // Tạo template mới
  static async createTemplate(data) {
    // Parse JSON fields nếu là string
    const templateData = { ...data };
    // Map html_content to body if present (legacy support)
    if (templateData.html_content && !templateData.body) {
      templateData.body = templateData.html_content;
      delete templateData.html_content;
    }

    if (templateData.variables && typeof templateData.variables === 'string') {
      templateData.variables = JSON.parse(templateData.variables);
    }
    if (templateData.default_variables && typeof templateData.default_variables === 'string') {
      templateData.default_variables = JSON.parse(templateData.default_variables);
    }

    // Convert JSON objects to JSON strings for database
    if (templateData.variables && typeof templateData.variables === 'object') {
      templateData.variables = JSON.stringify(templateData.variables);
    }
    if (templateData.default_variables && typeof templateData.default_variables === 'object') {
      templateData.default_variables = JSON.stringify(templateData.default_variables);
    }

    const result = await insert('email_templates', templateData);
    return this.getTemplateById(result.insertId);
  }

  // Cập nhật template
  static async updateTemplate(id, data) {
    // Parse JSON fields nếu là string
    const templateData = { ...data };
    // Map html_content to body if present (legacy support)
    if (templateData.html_content && !templateData.body) {
      templateData.body = templateData.html_content;
      delete templateData.html_content;
    }

    if (templateData.variables && typeof templateData.variables === 'string') {
      templateData.variables = JSON.parse(templateData.variables);
    }
    if (templateData.default_variables && typeof templateData.default_variables === 'string') {
      templateData.default_variables = JSON.parse(templateData.default_variables);
    }

    // Convert JSON objects to JSON strings for database
    if (templateData.variables && typeof templateData.variables === 'object') {
      templateData.variables = JSON.stringify(templateData.variables);
    }
    if (templateData.default_variables && typeof templateData.default_variables === 'object') {
      templateData.default_variables = JSON.stringify(templateData.default_variables);
    }

    await update('email_templates', templateData, { id });
    return this.getTemplateById(id);
  }

  // Xóa mềm template
  static async deleteTemplate(id) {
    return update('email_templates', { deleted_at: new Date() }, { id });
  }

  // Lấy danh sách categories
  static async getCategories() {
    const sql = `SELECT * FROM email_template_categories ORDER BY name ASC`;
    const [rows] = await pool.query(sql);
    return rows;
  }
}

export default EmailTemplateModel;

