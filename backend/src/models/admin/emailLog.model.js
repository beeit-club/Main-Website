// models/admin/emailLog.model.js

import {
  findOne,
  insert,
  selectWithPagination,
  update,
} from '../../utils/database.js';
import pool from '../../db.js';

class EmailLogModel {
  // Tạo log mới
  static async createLog(data) {
    // Parse JSON fields nếu là string
    const logData = { ...data };
    if (logData.variables_used && typeof logData.variables_used === 'string') {
      logData.variables_used = JSON.parse(logData.variables_used);
    }

    // Convert JSON objects to JSON strings for database
    if (logData.variables_used && typeof logData.variables_used === 'object') {
      logData.variables_used = JSON.stringify(logData.variables_used);
    }

    const result = await insert('email_logs', logData);
    return this.getLogById(result.insertId);
  }

  // Cập nhật log
  static async updateLog(id, data) {
    const logData = { ...data };
    
    // Parse JSON fields nếu là string
    if (logData.variables_used && typeof logData.variables_used === 'string') {
      logData.variables_used = JSON.parse(logData.variables_used);
    }

    // Convert JSON objects to JSON strings for database
    if (logData.variables_used && typeof logData.variables_used === 'object') {
      logData.variables_used = JSON.stringify(logData.variables_used);
    }

    await update('email_logs', logData, { id });
    return this.getLogById(id);
  }

  // Lấy log theo ID
  static async getLogById(id) {
    const sql = `
      SELECT 
        el.*,
        et.name AS template_name,
        et.slug AS template_slug
      FROM email_logs el
      LEFT JOIN email_templates et ON el.template_id = et.id
      WHERE el.id = ?
    `;
    return findOne(sql, [id]);
  }

  // Lấy danh sách logs
  static async getAllLogs(options = {}) {
    let sql = `
      SELECT 
        el.id,
        el.template_id,
        el.template_name,
        el.template_slug,
        el.recipient_email,
        el.subject,
        el.status,
        el.error_message,
        el.sent_at,
        el.created_at,
        et.name AS template_name_current,
        et.slug AS template_slug_current
      FROM email_logs el
      LEFT JOIN email_templates et ON el.template_id = et.id
      WHERE 1=1
    `;
    const params = [];

    // Filter by template_id
    if (options.template_id) {
      sql += ` AND el.template_id = ?`;
      params.push(options.template_id);
    }

    // Filter by status
    if (options.status) {
      sql += ` AND el.status = ?`;
      params.push(options.status);
    }

    // Filter by recipient_email
    if (options.recipient_email) {
      sql += ` AND el.recipient_email LIKE ?`;
      params.push(`%${options.recipient_email}%`);
    }

    // Filter by date_from
    if (options.date_from) {
      sql += ` AND DATE(el.created_at) >= ?`;
      params.push(options.date_from);
    }

    // Filter by date_to
    if (options.date_to) {
      sql += ` AND DATE(el.created_at) <= ?`;
      params.push(options.date_to);
    }

    // Sort
    options.orderBy = {
      field: options.sort_by || 'created_at',
      direction: options.sort_order === 'asc' ? 'ASC' : 'DESC',
    };

    return selectWithPagination(sql, params, options);
  }

  // Thống kê
  static async getStats(options = {}) {
    let sql = `
      SELECT 
        COUNT(*) AS total_emails,
        SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) AS sent_count,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) AS failed_count,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_count
      FROM email_logs
      WHERE 1=1
    `;
    const params = [];

    // Filter by template_id
    if (options.template_id) {
      sql += ` AND template_id = ?`;
      params.push(options.template_id);
    }

    // Filter by date_from
    if (options.date_from) {
      sql += ` AND DATE(created_at) >= ?`;
      params.push(options.date_from);
    }

    // Filter by date_to
    if (options.date_to) {
      sql += ` AND DATE(created_at) <= ?`;
      params.push(options.date_to);
    }

    const result = await findOne(sql, params);
    
    // Stats by template
    let statsByTemplateSql = `
      SELECT 
        et.id,
        et.name,
        et.slug,
        COUNT(el.id) AS total,
        SUM(CASE WHEN el.status = 'sent' THEN 1 ELSE 0 END) AS sent,
        SUM(CASE WHEN el.status = 'failed' THEN 1 ELSE 0 END) AS failed
      FROM email_templates et
      LEFT JOIN email_logs el ON et.id = el.template_id
      WHERE et.deleted_at IS NULL
    `;
    const statsByTemplateParams = [];

    if (options.date_from) {
      statsByTemplateSql += ` AND (el.created_at IS NULL OR DATE(el.created_at) >= ?)`;
      statsByTemplateParams.push(options.date_from);
    }
    if (options.date_to) {
      statsByTemplateSql += ` AND (el.created_at IS NULL OR DATE(el.created_at) <= ?)`;
      statsByTemplateParams.push(options.date_to);
    }

    statsByTemplateSql += ` GROUP BY et.id, et.name, et.slug ORDER BY total DESC LIMIT 10`;

    const [statsByTemplate] = await pool.query(statsByTemplateSql, statsByTemplateParams);

    return {
      ...result,
      stats_by_template: statsByTemplate,
    };
  }
}

export default EmailLogModel;

