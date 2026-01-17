
import { query } from '../../utils/database.js';
import ServiceError from '../../error/service.error.js';

class BulkEmailService {
  /**
   * Tạo chiến dịch gửi email hàng loạt
   * @param {Object} data
   * @param {number} data.templateId
   * @param {string} data.jobName
   * @param {Object} data.filters - { role_id, is_active, search }
   * @param {Object} data.inputVariables - Các biến nhập tay { dia_diem: 'A', ... }
   * @param {number} userId - Người tạo
   */
  async createBatchJob({ templateId, jobName, filters, inputVariables }, userId) {
    try {
      // 1. Validate Template
      const [templates] = await query('SELECT id, name FROM email_templates WHERE id = ?', [templateId]);
      if (!templates || templates.length === 0) {
        throw new ServiceError('Mẫu email không tồn tại', 'TEMPLATE_NOT_FOUND', null, 404);
      }

      // 2. Query Users (Target Audience)
      let userSql = `SELECT u.id, u.email, u.fullname, u.role_id FROM users u LEFT JOIN member_profiles mp ON u.id = mp.user_id WHERE u.deleted_at IS NULL`;
      const params = [];

      // Filter: Role
      if (filters.role_id && filters.role_id !== 'all') {
        userSql += ` AND u.role_id = ?`;
        params.push(filters.role_id);
      }

      // Filter: Active Status
      // filters.is_active có thể là boolean hoặc string '1'/'0'
      const isActive = filters.is_active === true || filters.is_active === '1' || filters.is_active === 1;
      // Nếu user không tích chọn "active only" (tức là active=false), thì có thể là họ muốn gửi cho cả inactive? 
      // Nhưng logic cũ là `is_active = ?`. Thường là tích vào -> chỉ active. Bỏ tích -> ALL (hoặc chỉ inactive?).
      // Logic chuẩn UI thường là: Checkbox "Chỉ gửi user Active" -> active = 1.
      if (isActive) {
        userSql += ` AND u.is_active = 1`;
      }

      // Filter: Search Keyword
      if (filters.search && filters.search.trim() !== '') {
        const keyword = `%${filters.search.trim()}%`;
        userSql += ` AND (u.email LIKE ? OR u.fullname LIKE ? OR mp.student_id LIKE ?)`;
        params.push(keyword, keyword, keyword);
      }
      
      const [users] = await query(userSql, params);
      
      if (!users || users.length === 0) {
        throw new ServiceError('Không tìm thấy người dùng nào thỏa mãn điều kiện lọc', 'NO_RECIPIENTS', null, 400);
      }

      // 3. Create Batch Job Record
      const jobSql = `
        INSERT INTO email_batch_jobs 
        (template_id, job_name, status, total_recipients, options, created_by)
        VALUES (?, ?, 'pending', ?, ?, ?)
      `;
      
      const optionsJson = JSON.stringify({
        filters,
        inputVariables
      });

      const [jobResult] = await query(jobSql, [
        templateId, 
        jobName || `Chiến dịch gửi ${templates[0].name} - ${new Date().toLocaleDateString('vi-VN')}`,
        users.length,
        optionsJson,
        userId
      ]);

      const batchJobId = jobResult.insertId;

      // 4. Chunk Insert to Queue (Batch Size = 500)
      const BATCH_SIZE = 500;
      for (let i = 0; i < users.length; i += BATCH_SIZE) {
        const chunk = users.slice(i, i + BATCH_SIZE);
        
        const queueValues = [];
        const placeholders = [];
        
        for (const user of chunk) {
          const variables = {
            ...inputVariables, // Custom global vars
            fullname: user.fullname,
            email: user.email,
            user_id: user.id
          };

          // (batch_job_id, recipient_email, recipient_name, variables, status)
          queueValues.push(batchJobId, user.email, user.fullname, JSON.stringify(variables), 'pending');
          placeholders.push('(?, ?, ?, ?, ?)');
        }

        if (queueValues.length > 0) {
          const queueSql = `
            INSERT INTO email_queue (batch_job_id, recipient_email, recipient_name, variables, status)
            VALUES ${placeholders.join(', ')}
          `;
          await query(queueSql, queueValues);
        }
      }

      return {
        jobId: batchJobId,
        total: users.length,
        message: `Đã tạo chiến dịch thành công. ${users.length} email đang được xếp hàng gửi.`
      };

    } catch (error) {
      console.error('[BulkEmailService] Create Job Error:', error);
      if (error instanceof ServiceError) throw error;
      throw new ServiceError('Lỗi hệ thống khi tạo chiến dịch', 'INTERNAL_ERROR', error.message);
    }
  }

  // Lấy danh sách jobs
  async getAllJobs({ page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    const sql = `
        SELECT j.*, t.name as template_name, u.fullname as creator_name
        FROM email_batch_jobs j
        LEFT JOIN email_templates t ON j.template_id = t.id
        LEFT JOIN users u ON j.created_by = u.id
        ORDER BY j.created_at DESC
        LIMIT ? OFFSET ?
    `;
    const [rows] = await query(sql, [parseInt(limit), parseInt(offset)]);
    
    // Count total
    const [countRows] = await query(`SELECT COUNT(*) as total FROM email_batch_jobs`);
    
    return {
        data: rows,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: countRows[0].total
        }
    };
  }

  // Retry Failed Emails
  async retryJob(jobId) {
    // Reset status failed -> pending trong queue
    const sql = `UPDATE email_queue SET status = 'pending', attempts = 0 WHERE batch_job_id = ? AND status = 'failed'`;
    const [result] = await query(sql, [jobId]);
    return { updated: result.affectedRows };
  }
}

export default new BulkEmailService();
