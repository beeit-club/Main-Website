import {
  insert,
  update,
  remove,
  findOne,
  selectWithPagination,
} from '../../utils/database.js';
import pool from '../../db.js';

const TABLE = 'users';

class UserModel {
  /**
   * Lấy danh sách tất cả user với phân trang
   * @param {Object} options - Tùy chọn phân trang
   * @param {number} options.page - Số trang (mặc định: 1)
   * @param {number} options.limit - Số bản ghi mỗi trang (mặc định: 10)
   * @returns {Promise<Object>} Danh sách user với thông tin phân trang
   */
  static async getAllUsers(option) {
    let baseSql = `
      SELECT 
        u.id,
        u.fullname,
        u.email,
        u.phone,
        u.avatar_url,
        u.bio,
        u.role_id,
        r.name AS role_name,
        u.is_active,
        u.email_verified_at,
        u.created_at,
        u.updated_at
      FROM ${TABLE} u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.deleted_at IS NULL
    `;
    let params = [];

    if (option?.filters?.search) {
      baseSql += ` AND u.fullname LIKE ? OR email LIKE ? OR phone LIKE ?  `;

      params.push(`%${option.filters.search}%`);
      params.push(`%${option.filters.search}%`);
      params.push(`%${option.filters.search}%`);
    }
    if (option?.filters?.active) {
      baseSql += ` AND u.is_active = ? `;
      params.push(`${option?.filters?.active}`);
    }
    if (option?.filters?.roleId) {
      baseSql += ` AND u.role_id = ? `;
      params.push(`${option?.filters?.roleId}`);
    }
    if (option?.filters?.sortBy && option?.filters?.sortDirection) {
      option.orderBy = {
        field: option?.filters?.sortBy,
        direction: option?.filters?.sortDirection || 'DESC',
      };
    }

    return await selectWithPagination(baseSql, params, option);
  }
  /**
   * Lấy danh sách thành viên CLB (role_id = 4) với thông tin từ member_profiles
   * @param {Object} option - Tùy chọn phân trang và filter
   * @param {number} option.page - Số trang (mặc định: 1)
   * @param {number} option.limit - Số bản ghi mỗi trang (mặc định: 10)
   * @param {Object} option.filters - Bộ lọc
   * @param {string} option.filters.search - Tìm kiếm theo tên, email, MSSV
   * @param {Object} option.filters.sortBy - Sắp xếp theo field
   * @param {string} option.filters.sortDirection - Hướng sắp xếp (ASC/DESC)
   * @returns {Promise<Object>} Danh sách thành viên với thông tin phân trang
   */
  static async getAllMembers(option) {
    let baseSql = `
      SELECT 
        u.id,
        u.fullname,
        u.email,
        u.phone,
        u.avatar_url,
        u.bio,
        u.is_active,
        u.created_at,
        mp.student_id,
        mp.course,
        mp.academic_year,
        mp.join_date
      FROM ${TABLE} u
      INNER JOIN member_profiles mp ON u.id = mp.user_id
      WHERE u.deleted_at IS NULL 
        AND mp.deleted_at IS NULL
        AND u.role_id = 4
        AND u.is_active = 1
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

  static async getAllRoles() {
    let baseSql = `
      SELECT *
      FROM roles
    `;
    const option = {};
    option.page = 1;
    option.limit = 1000;
    let params = [];
    return await selectWithPagination(baseSql, params, option);
  }

  /**
   * Lấy thông tin chi tiết user theo ID
   * @param {number} id - ID của user
   * @returns {Promise<Object|boolean>} Thông tin user hoặc false nếu không tìm thấy
   */
  static async getUserById(id) {
    const sql = `
      SELECT 
        u.id,
        u.fullname,
        u.email,
        u.phone,
        u.avatar_url,
        u.bio,
        u.role_id,
        r.name AS role_name,
        u.is_active,
        u.email_verified_at,
        u.created_at,
        u.updated_at
      FROM ${TABLE} u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?
      LIMIT 1
    `;
    return await findOne(sql, [id]);
  }

  /**
   * Tạo mới user
   * @param {Object} data - Dữ liệu user
   * @returns {Promise<Object>} User vừa tạo với ID
   */
  static async createUser(data) {
    // Thêm timestamps
    const userData = {
      ...data,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const result = await insert(TABLE, userData);
    return {
      id: result.insertId,
      ...userData,
    };
  }

  /**
   * Cập nhật thông tin user
   * @param {number} id - ID của user
   * @param {Object} data - Dữ liệu cần cập nhật
   * @returns {Promise<boolean>} true nếu cập nhật thành công, false nếu không
   */
  static async updateUser(id, data) {
    const affected = await update(TABLE, data, { id });
    return affected > 0;
  }

  /**
   * Xóa mềm user (soft delete)
   * @param {number} id - ID của user
   * @returns {Promise<boolean>} true nếu xóa thành công, false nếu không
   */
  static async softDeleteUser(id) {
    const deleteData = {
      is_active: 0,
      deleted_at: new Date(),
      updated_at: new Date(),
    };

    const affected = await update(TABLE, deleteData, { id });
    return affected > 0;
  }
  static async restoreUser(id) {
    const deleteData = {
      is_active: 1,
      updated_at: new Date(),
      deleted_at: null,
    };

    const affected = await update(TABLE, deleteData, { id });
    return affected > 0;
  }

  /**
   * Xóa vĩnh viễn user (hard delete)
   * @param {number} id - ID của user
   * @returns {Promise<boolean>} true nếu xóa thành công, false nếu không
   */
  static async hardDeleteUser(id) {
    const affected = await remove(TABLE, { id });
    return affected > 0;
  }

  /**
   * Tìm user theo email (chỉ user chưa bị xóa)
   * @param {string} email - Email cần tìm
   * @returns {Promise<Object|boolean>} Thông tin user hoặc false nếu không tìm thấy
   */
  static async findByEmail(email) {
    const sql = `
      SELECT * 
      FROM ${TABLE} 
      WHERE email = ? AND deleted_at IS NULL 
      LIMIT 1
    `;
    return await findOne(sql, [email]);
  }

  /**
   * Kiểm tra email đã tồn tại chưa (không tính user đã xóa)
   * @param {string} email - Email cần kiểm tra
   * @param {number} excludeId - ID user cần loại trừ (dùng khi update)
   * @returns {Promise<boolean>} true nếu email đã tồn tại, false nếu chưa
   */
  static async emailExists(email, excludeId = null) {
    let sql = `SELECT id FROM ${TABLE} WHERE email = ? AND deleted_at IS NULL`;
    const params = [email];

    if (excludeId) {
      sql += ` AND id != ?`;
      params.push(excludeId);
    }

    sql += ` LIMIT 1`;
    const user = await findOne(sql, params);
    return user !== false;
  }

  /**
   * Kích hoạt/vô hiệu hóa user
   * @param {number} id - ID của user
   * @param {boolean} isActive - Trạng thái kích hoạt
   * @returns {Promise<boolean>} true nếu thành công, false nếu không
   */
  static async toggleActive(id, isActive) {
    const affected = await update(
      TABLE,
      {
        is_active: isActive ? 1 : 0,
        updated_at: new Date(),
      },
      { id },
    );
    return affected > 0;
  }

  /**
   * Lấy danh sách user đã bị xóa mềm
   * @param {Object} options - Tùy chọn phân trang
   * @returns {Promise<Object>} Danh sách user đã xóa với thông tin phân trang
   */
  static async getDeletedUsers(option) {
    let baseSql = `
      SELECT 
        u.id,
        u.fullname,
        u.email,
        u.phone,
        u.avatar_url,
        u.bio,
        u.role_id,
        r.name AS role_name,
        u.is_active,
        u.email_verified_at,
        u.created_at,
        u.updated_at,
        u.deleted_at
      FROM ${TABLE} u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.deleted_at IS NOT NULL
    `;

    let params = [];

    if (option?.filters?.search) {
      baseSql += ` AND u.fullname LIKE ? OR email LIKE ? OR phone LIKE ?  `;

      params.push(`%${option.filters.search}%`);
      params.push(`%${option.filters.search}%`);
      params.push(`%${option.filters.search}%`);
    }
    if (option?.filters?.active) {
      baseSql += ` AND u.is_active = ? `;
      params.push(`${option?.filters?.active}`);
    }
    if (option?.filters?.roleId) {
      baseSql += ` AND u.role_id = ? `;
      params.push(`${option?.filters?.roleId}`);
    }
    if (option?.filters?.sortBy && option?.filters?.sortDirection) {
      option.orderBy = {
        field: option?.filters?.sortBy,
        direction: option?.filters?.sortDirection || 'DESC',
      };
    }

    return await selectWithPagination(baseSql, params, option);
  }

  /**
   * Đếm số lượng user theo trạng thái
   * @returns {Promise<Object>} Thống kê số lượng user
   */
  static async countUserStats() {
    const sql = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN deleted_at IS NULL THEN 1 ELSE 0 END) as active_total,
        SUM(CASE WHEN deleted_at IS NOT NULL THEN 1 ELSE 0 END) as deleted_total,
        SUM(CASE WHEN is_active = 1 AND deleted_at IS NULL THEN 1 ELSE 0 END) as enabled_total,
        SUM(CASE WHEN is_active = 0 AND deleted_at IS NULL THEN 1 ELSE 0 END) as disabled_total,
        SUM(CASE WHEN email_verified_at IS NOT NULL AND deleted_at IS NULL THEN 1 ELSE 0 END) as verified_total
      FROM ${TABLE}
    `;

    return await findOne(sql, []);
  }

  /**
   * Lấy danh sách users với member_profiles để gửi email
   * Query tối ưu: 1 query duy nhất cho nhiều users
   *
   * @param {Array<number>} userIds - Danh sách user IDs
   * @returns {Promise<Array>} Danh sách users với thông tin đầy đủ
   *
   * @example
   * const users = await UserModel.getUsersForEmail([1, 2, 3]);
   */
  static async getUsersForEmail(userIds = []) {
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return [];
    }

    // Validate: chỉ lấy số nguyên dương
    const validUserIds = userIds
      .map((id) => parseInt(id))
      .filter((id) => !isNaN(id) && id > 0);

    if (validUserIds.length === 0) {
      return [];
    }

    // Tạo placeholders cho IN clause
    const placeholders = validUserIds.map(() => '?').join(',');

    const sql = `
      SELECT 
        u.id,
        u.fullname,
        u.email,
        u.phone,
        u.avatar_url,
        u.bio,
        u.is_active,
        u.email_verified_at,
        u.created_at,
        r.name AS role_name,
        r.description AS role_description,
        mp.student_id,
        mp.academic_year,
        mp.course,
        mp.join_date
      FROM ${TABLE} u
      LEFT JOIN roles r ON u.role_id = r.id
      LEFT JOIN member_profiles mp ON u.id = mp.user_id AND mp.deleted_at IS NULL
      WHERE u.id IN (${placeholders})
        AND u.deleted_at IS NULL
        AND u.is_active = 1
      ORDER BY u.id
    `;

    try {
      const [rows] = await pool.query(sql, validUserIds);
      return rows;
    } catch (error) {
      console.error('Error in getUsersForEmail:', error);
      throw error;
    }
  }

  /**
   * Lấy users theo filter để gửi email
   * Hỗ trợ filter: role_id, search, is_member_only
   *
   * @param {Object} filters - Filters
   * @param {number} filters.role_id - Filter theo role ID
   * @param {string} filters.search - Search theo tên, email, MSSV
   * @param {boolean} filters.is_member_only - Chỉ lấy members (có member_profiles)
   * @returns {Promise<Array>} Danh sách users
   *
   * @example
   * const users = await UserModel.getUsersForEmailByFilter({
   *   is_member_only: true,
   *   search: "Nguyễn"
   * });
   */
  static async getUsersForEmailByFilter(filters = {}) {
    let sql = `
      SELECT 
        u.id,
        u.fullname,
        u.email,
        u.phone,
        u.avatar_url,
        u.bio,
        u.is_active,
        u.email_verified_at,
        u.created_at,
        r.name AS role_name,
        r.description AS role_description,
        mp.student_id,
        mp.academic_year,
        mp.course,
        mp.join_date
      FROM ${TABLE} u
      LEFT JOIN roles r ON u.role_id = r.id
      LEFT JOIN member_profiles mp ON u.id = mp.user_id AND mp.deleted_at IS NULL
      WHERE u.deleted_at IS NULL
        AND u.is_active = 1
    `;
    const params = [];

    // Filter: chỉ lấy members (có member_profiles)
    if (filters.is_member_only) {
      sql += ` AND mp.user_id IS NOT NULL`;
    }

    // Filter: role_id
    if (filters.role_id) {
      const roleId = parseInt(filters.role_id);
      if (!isNaN(roleId) && roleId > 0) {
        sql += ` AND u.role_id = ?`;
        params.push(roleId);
      }
    }

    // Filter: search (tên, email, MSSV)
    if (filters.search && typeof filters.search === 'string') {
      const searchTerm = `%${filters.search.trim()}%`;
      sql += ` AND (
        u.fullname LIKE ? 
        OR u.email LIKE ? 
        OR mp.student_id LIKE ?
      )`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    sql += ` ORDER BY u.id`;

    try {
      const [rows] = await pool.query(sql, params);
      return rows;
    } catch (error) {
      console.error('Error in getUsersForEmailByFilter:', error);
      throw error;
    }
  }
}

export default UserModel;
