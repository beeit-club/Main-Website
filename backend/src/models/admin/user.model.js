import {
  insert,
  update,
  remove,
  findOne,
  selectWithPagination,
} from '../../utils/database.js';

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
    option.orderBy = { field: 'id', direction: 'DESC' };

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
      WHERE u.id = ? AND u.deleted_at IS NULL
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
    const allowedFields = [
      'fullname',
      'email',
      'phone',
      'avatar_url',
      'bio',
      'role_id',
      'is_active',
      'email_verified_at',
    ];

    // Lọc chỉ các trường được phép
    const updateData = {};
    for (const key of allowedFields) {
      if (data[key] !== undefined) {
        updateData[key] = data[key];
      }
    }

    // Không có gì để update
    if (Object.keys(updateData).length === 0) {
      return false;
    }

    // Tự động cập nhật updated_at
    updateData.updated_at = new Date();

    const affected = await update(TABLE, updateData, { id });
    return affected > 0;
  }

  /**
   * Xóa mềm user (soft delete)
   * @param {number} id - ID của user
   * @returns {Promise<boolean>} true nếu xóa thành công, false nếu không
   */
  static async softDeleteUser(id) {
    const deleteData = {
      deleted_at: new Date(),
      updated_at: new Date(),
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
  static async getDeletedUsers({ page = 1, limit = 10 } = {}) {
    const baseSql = `
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

    return await selectWithPagination(baseSql, [], {
      page: Math.max(1, parseInt(page) || 1),
      limit: Math.max(1, Math.min(100, parseInt(limit) || 10)),
      orderBy: { field: 'deleted_at', direction: 'DESC' },
    });
  }

  /**
   * Tìm kiếm user theo từ khóa (fullname, email, phone)
   * @param {string} keyword - Từ khóa tìm kiếm
   * @param {Object} options - Tùy chọn phân trang
   * @returns {Promise<Object>} Danh sách user tìm được với thông tin phân trang
   */
  static async searchUsers(keyword, { page = 1, limit = 10 } = {}) {
    const baseSql = `
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
        AND (
          u.fullname LIKE ?
          OR u.email LIKE ?
          OR u.phone LIKE ?
        )
    `;

    const searchPattern = `%${keyword}%`;
    const params = [searchPattern, searchPattern, searchPattern];

    return await selectWithPagination(baseSql, params, {
      page: Math.max(1, parseInt(page) || 1),
      limit: Math.max(1, Math.min(100, parseInt(limit) || 10)),
      orderBy: { field: 'created_at', direction: 'DESC' },
    });
  }

  /**
   * Lấy danh sách user theo role
   * @param {number} roleId - ID của role
   * @param {Object} options - Tùy chọn phân trang
   * @returns {Promise<Object>} Danh sách user theo role với thông tin phân trang
   */
  static async getUsersByRole(roleId, { page = 1, limit = 10 } = {}) {
    const baseSql = `
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
      WHERE u.deleted_at IS NULL AND u.role_id = ?
    `;

    return await selectWithPagination(baseSql, [roleId], {
      page: Math.max(1, parseInt(page) || 1),
      limit: Math.max(1, Math.min(100, parseInt(limit) || 10)),
      orderBy: { field: 'created_at', direction: 'DESC' },
    });
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
}

export default UserModel;
