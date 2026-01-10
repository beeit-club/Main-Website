import {
  findOne,
  insert,
  selectWithPagination,
  update,
} from '../../utils/database.js';

class ApplicationModel {
  // Lấy danh sách đơn (cho Admin)
  static async getAllApplications(options = {}) {
    try {
      let sql = `SELECT * FROM membership_applications WHERE 1=1`;
      let params = [];

      if (options?.filters?.search) {
        sql += ` AND (fullname LIKE ? OR email LIKE ? OR student_id LIKE ?)`;
        const searchTerm = `%${options.filters.search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }
      if (
        options?.filters?.status !== undefined &&
        options.filters.status !== ''
      ) {
        sql += ` AND status = ?`;
        params.push(options.filters.status);
      }

      const applications = await selectWithPagination(sql, params, {
        ...options,
        orderBy: { field: 'created_at', direction: 'DESC' },
      });
      return applications;
    } catch (error) {
      throw error;
    }
  }

  // Lấy chi tiết 1 đơn
  static async getOneApplication(id) {
    try {
      const sql = `SELECT * FROM membership_applications WHERE id = ?`;
      return await findOne(sql, [id]);
    } catch (error) {
      throw error;
    }
  }

  // Nộp đơn (cho Public)
  static async createApplication(applicationData) {
    try {
      return await insert('membership_applications', applicationData);
    } catch (error) {
      throw error;
    }
  }

  // Cập nhật đơn (thay đổi status, thêm notes)
  static async updateApplication(id, data) {
    try {
      return await update('membership_applications', data, { id });
    } catch (error) {
      throw error;
    }
  }

  // Kiểm tra dữ liệu trùng lặp trước khi nộp đơn
  static async checkIfExists({ email, student_id }) {
    try {
      // 1. Kiểm tra MSSV đã là thành viên chưa
      const sqlProfile = `SELECT student_id FROM member_profiles WHERE student_id = ? AND deleted_at IS NULL`;
      const profile = await findOne(sqlProfile, [student_id]);
      if (profile) return { type: 'STUDENT_ID_IS_MEMBER', value: student_id };

      // 2. Kiểm tra Email đã nộp đơn và đang xử lý/thành công chưa (status 0, 1, 2, 3)
      const sqlApp = `SELECT email FROM membership_applications WHERE email = ? AND status IN (0, 1, 2, 3)`;
      const app = await findOne(sqlApp, [email]);
      if (app) return { type: 'APPLICATION_EXISTS', value: email };

      return null;
    } catch (error) {
      throw error;
    }
  }

  // Tìm user theo email
  static async findUserByEmail(email) {
    try {
      const sql = `SELECT id, role_id FROM users WHERE email = ? AND deleted_at IS NULL`;
      return await findOne(sql, [email]);
    } catch (error) {
      throw error;
    }
  }

  // Cập nhật role cho user
  static async updateUserRole(userId, roleId) {
    try {
      return await update('users', { role_id: roleId }, { id: userId });
    } catch (error) {
      throw error;
    }
  }

  // Tạo user mới (khi duyệt đơn)
  static async createUser(userData) {
    try {
      return await insert('users', userData);
    } catch (error) {
      throw error;
    }
  }

  // Tạo hồ sơ thành viên mới (khi duyệt đơn)
  static async createMemberProfile(profileData) {
    try {
      return await insert('member_profiles', profileData);
    } catch (error) {
      throw error;
    }
  }

  // (HÀM MỚI) Lấy đơn kèm thông tin lịch để gửi email
  static async getApplicationWithSchedule(id) {
    const sql = `
      SELECT 
        app.*, 
        sch.title as schedule_title, 
        sch.interview_date, 
        sch.location as schedule_location
      FROM membership_applications app
      LEFT JOIN interview_schedules sch ON app.schedule_id = sch.id
      WHERE app.id = ?
    `;
    return await findOne(sql, [id]);
  }
}

export default ApplicationModel;
