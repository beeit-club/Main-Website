import {
  insert,
  update,
  findOne,
  selectWithPagination,
  query,
} from '../../utils/database.js';

class EmailTemplateModel {
  static async create(data) {
    const sql = `
      INSERT INTO email_templates 
      (name, slug, subject, mjml_content, html_content, variables, category, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await query(sql, [
      data.name,
      data.slug,
      data.subject,
      data.mjml_content,
      data.html_content,
      JSON.stringify(data.variables || []),
      data.category,
      // data.description, // Bỏ trường này do DB không có
      data.created_by
    ]);
    return result.insertId;
  }

  static async update(id, data) {
    // Xử lý JSON fields trước khi update
    const updateData = { ...data };
    
    // Convert JSON fields
    if (updateData.variables) updateData.variables = JSON.stringify(updateData.variables);
    
    // Loại bỏ các trường không có trong DB để tránh lỗi Unknown column
    delete updateData.default_variables;
    delete updateData.body; // Frontend form field
    delete updateData.creator_name; // Joined field
    delete updateData.created_at;
    delete updateData.updated_at;
    delete updateData.id;

    return update('email_templates', updateData, { id });
  }

  static async getById(id) {
    const sql = `
      SELECT t.*, u.fullname as creator_name 
      FROM email_templates t
      LEFT JOIN users u ON t.created_by = u.id
      WHERE t.id = ? AND t.deleted_at IS NULL
    `;
    const result = await findOne(sql, [id]);
    
    // Parse JSON khi lấy ra
    if (result) {
        if (typeof result.variables === 'string') result.variables = JSON.parse(result.variables);
    }
    return result;
  }

  static async getBySlug(slug) {
    const sql = `SELECT * FROM email_templates WHERE slug = ? AND deleted_at IS NULL`;
    const result = await findOne(sql, [slug]);
    if (result) {
        if (typeof result.variables === 'string') result.variables = JSON.parse(result.variables);
    }
    return result;
  }

  static async delete(id) {
    // Hard delete (Xóa vĩnh viễn)
    // Các bảng liên quan (system_email_mappings, email_batch_jobs) đã có FK ON DELETE SET NULL
    const sql = `DELETE FROM email_templates WHERE id = ?`;
    return query(sql, [id]);
  }

  static async getAll(options = {}) {
    let sql = `
      SELECT t.id, t.name, t.slug, t.category, t.is_active, t.created_at, t.updated_at
      FROM email_templates t
      WHERE t.deleted_at IS NULL
    `;
    const params = [];

    if (options.q) {
      sql += ` AND (t.name LIKE ? OR t.slug LIKE ?)`;
      params.push(`%${options.q}%`, `%${options.q}%`);
    }

    if (options.category) {
      sql += ` AND t.category = ?`;
      params.push(options.category);
    }

    options.orderBy = { field: 'updated_at', direction: 'DESC' };
    
    return selectWithPagination(sql, params, options);
  }
}

export default EmailTemplateModel;