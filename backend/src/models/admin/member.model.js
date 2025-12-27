import {
  insert,
  update,
  remove,
  findOne,
  selectWithPagination,
} from '../../utils/database.js';
import pool from '../../db.js';

const TABLE = 'member_profiles';

class MemberModel {
  /**
   * Lấy danh sách thành viên với phân trang
   * @param {Object} options - Tùy chọn phân trang và filter
   */
  static async getAllMembers(option) {
    let baseSql = `
      SELECT 
        mp.user_id,
        mp.student_id,
        mp.academic_year,
        mp.course,
        mp.join_date,
        mp.created_by,
        mp.updated_by,
        mp.created_at,
        mp.updated_at,
        u.id,
        u.fullname,
        u.email,
        u.phone,
        u.avatar_url,
        u.bio,
        u.is_active,
        u.role_id
      FROM ${TABLE} mp
      INNER JOIN users u ON mp.user_id = u.id
      WHERE mp.deleted_at IS NULL
        AND u.deleted_at IS NULL
    `;
    let params = [];

    // Filter theo search (tên, email, MSSV)
    if (option?.filters?.search) {
      baseSql += ` AND (u.fullname LIKE ? OR u.email LIKE ? OR mp.student_id LIKE ?)`;
      const searchTerm = `%${option.filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Sắp xếp
    if (option?.filters?.sortBy && option?.filters?.sortDirection) {
      option.orderBy = {
        field: option.filters.sortBy,
        direction: option.filters.sortDirection || 'DESC',
      };
    } else if (!option?.orderBy) {
      // Sắp xếp mặc định: ngày tham gia mới nhất
      option.orderBy = {
        field: 'mp.join_date',
        direction: 'DESC',
      };
    }

    return await selectWithPagination(baseSql, params, option);
  }

  /**
   * Lấy thông tin chi tiết 1 thành viên theo user_id
   */
  static async getMemberByUserId(userId) {
    try {
      const sql = `
        SELECT 
          mp.*,
          u.id as user_id,
          u.fullname,
          u.email,
          u.phone,
          u.avatar_url,
          u.bio,
          u.is_active,
          u.role_id
        FROM ${TABLE} mp
        INNER JOIN users u ON mp.user_id = u.id
        WHERE mp.user_id = ? 
          AND mp.deleted_at IS NULL
          AND u.deleted_at IS NULL
      `;
      return await findOne(sql, [userId]);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Tạo hồ sơ thành viên mới
   */
  static async createMember(data) {
    try {
      return await insert(TABLE, data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cập nhật thông tin thành viên
   */
  static async updateMember(userId, data) {
    try {
      return await update(TABLE, data, { user_id: userId });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Xóa mềm thành viên
   */
  static async deleteMember(userId) {
    try {
      return await update(TABLE, { deleted_at: new Date() }, { user_id: userId });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Kiểm tra user_id đã có member profile chưa
   */
  static async checkMemberExists(userId) {
    try {
      const sql = `
        SELECT user_id 
        FROM ${TABLE} 
        WHERE user_id = ? 
          AND deleted_at IS NULL
      `;
      return await findOne(sql, [userId]);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Kiểm tra student_id đã tồn tại chưa
   */
  static async checkStudentIdExists(studentId, excludeUserId = null) {
    try {
      let sql = `
        SELECT user_id, student_id 
        FROM ${TABLE} 
        WHERE student_id = ? 
          AND deleted_at IS NULL
      `;
      const params = [studentId];
      
      if (excludeUserId) {
        sql += ` AND user_id != ?`;
        params.push(excludeUserId);
      }
      
      return await findOne(sql, params);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy danh sách users chưa có member profile (để chọn khi thêm)
   */
  static async getAvailableUsers(options = {}) {
    try {
      let sql = `
        SELECT 
          u.id,
          u.fullname,
          u.email,
          u.phone,
          u.avatar_url,
          u.is_active,
          r.name as role_name
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.id
        WHERE u.deleted_at IS NULL
          AND u.is_active = 1
          AND u.id NOT IN (
            SELECT user_id 
            FROM ${TABLE} 
            WHERE deleted_at IS NULL
          )
      `;
      let params = [];

      // Filter theo search
      if (options?.filters?.search) {
        sql += ` AND (u.fullname LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)`;
        const searchTerm = `%${options.filters.search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      // Phân trang
      if (options?.page && options?.limit) {
        const offset = (options.page - 1) * options.limit;
        sql += ` LIMIT ? OFFSET ?`;
        params.push(options.limit, offset);
      }

      const [rows] = await pool.query(sql, params);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

export default MemberModel;

