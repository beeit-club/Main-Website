// models/admin/emailBatchJob.model.js

import {
  findOne,
  insert,
  selectWithPagination,
  update,
} from '../../utils/database.js';
import pool from '../../db.js';

class EmailBatchJobModel {
  // Tạo batch job mới
  static async createJob(data) {
    // Parse JSON fields nếu là string
    const jobData = { ...data };
    if (jobData.options && typeof jobData.options === 'string') {
      jobData.options = JSON.parse(jobData.options);
    }

    // Convert JSON objects to JSON strings for database
    if (jobData.options && typeof jobData.options === 'object') {
      jobData.options = JSON.stringify(jobData.options);
    }

    const result = await insert('email_batch_jobs', jobData);
    return this.getJobById(result.insertId);
  }

  // Lấy job theo ID
  static async getJobById(id) {
    const sql = `
      SELECT 
        ebj.*,
        et.name AS template_name,
        et.slug AS template_slug,
        u.fullname AS created_by_name
      FROM email_batch_jobs ebj
      LEFT JOIN email_templates et ON ebj.template_id = et.id
      LEFT JOIN users u ON ebj.created_by = u.id
      WHERE ebj.id = ?
    `;
    return findOne(sql, [id]);
  }

  // Lấy danh sách jobs
  static async getAllJobs(options = {}) {
    let sql = `
      SELECT 
        ebj.id,
        ebj.template_id,
        ebj.template_slug,
        ebj.job_name,
        ebj.status,
        ebj.total_recipients,
        ebj.sent_count,
        ebj.failed_count,
        ebj.progress_percent,
        ebj.started_at,
        ebj.completed_at,
        ebj.created_at,
        et.name AS template_name,
        u.fullname AS created_by_name
      FROM email_batch_jobs ebj
      LEFT JOIN email_templates et ON ebj.template_id = et.id
      LEFT JOIN users u ON ebj.created_by = u.id
      WHERE 1=1
    `;
    const params = [];

    // Filter by status
    if (options.status) {
      sql += ` AND ebj.status = ?`;
      params.push(options.status);
    }

    // Filter by template_id
    if (options.template_id) {
      sql += ` AND ebj.template_id = ?`;
      params.push(options.template_id);
    }

    // Filter by created_by
    if (options.created_by) {
      sql += ` AND ebj.created_by = ?`;
      params.push(options.created_by);
    }

    // Search by job_name
    if (options.q) {
      sql += ` AND ebj.job_name LIKE ?`;
      params.push(`%${options.q}%`);
    }

    // Sort
    options.orderBy = {
      field: options.sort_by || 'created_at',
      direction: options.sort_order === 'asc' ? 'ASC' : 'DESC',
    };

    return selectWithPagination(sql, params, options);
  }

  // Cập nhật job
  static async updateJob(id, data) {
    const jobData = { ...data };
    
    // Parse JSON fields nếu là string
    if (jobData.options && typeof jobData.options === 'string') {
      jobData.options = JSON.parse(jobData.options);
    }

    // Convert JSON objects to JSON strings for database
    if (jobData.options && typeof jobData.options === 'object') {
      jobData.options = JSON.stringify(jobData.options);
    }

    await update('email_batch_jobs', jobData, { id });
    return this.getJobById(id);
  }

  // Lấy jobs theo status
  static async getJobsByStatus(status) {
    const sql = `
      SELECT * FROM email_batch_jobs 
      WHERE status = ? 
      ORDER BY created_at DESC
    `;
    const [rows] = await pool.query(sql, [status]);
    return rows;
  }
}

export default EmailBatchJobModel;

