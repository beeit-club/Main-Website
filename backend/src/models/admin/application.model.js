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
      let sql = `SELECT id, fullname, email, major, status, created_at FROM membership_applications WHERE 1=1`;
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

  // Kiểm tra email hoặc MSSV đã tồn tại trong hệ thống chưa
  static async checkIfExists({ email, student_id }) {
    try {
      const sql = `
            SELECT email FROM users WHERE email = ?
            UNION
            SELECT student_id FROM member_profiles WHERE student_id = ?
        `;
      return await findOne(sql, [email, student_id]);
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
}

export default ApplicationModel;
