import {
  insert,
  update,
  remove,
  findOne,
  selectWithPagination,
} from '../../utils/database.js';
import db from '../../db.js';

const TABLE = 'roles';

class RoleModel {
  /**
   * Lấy danh sách tất cả roles với phân trang
   */
  static async getAllRoles(option) {
    let baseSql = `
      SELECT 
        id,
        name,
        description,
        created_at,
        updated_at
      FROM ${TABLE}
      WHERE id != 1
    `;
    let params = [];

    if (option?.filters?.search) {
      baseSql += ` AND (name LIKE ? OR description LIKE ?)`;
      params.push(`%${option.filters.search}%`);
      params.push(`%${option.filters.search}%`);
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
   * Lấy thông tin chi tiết role theo ID
   */
  static async getRoleById(id) {
    const sql = `
      SELECT 
        id,
        name,
        description,
        created_at,
        updated_at
      FROM ${TABLE}
      WHERE id = ?
      LIMIT 1
    `;
    return await findOne(sql, [id]);
  }

  /**
   * Tạo mới role
   */
  static async createRole(data) {
    const roleData = {
      ...data,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const result = await insert(TABLE, roleData);
    return {
      id: result.insertId,
      ...roleData,
    };
  }

  /**
   * Cập nhật role
   */
  static async updateRole(id, data) {
    const updateData = {
      ...data,
      updated_at: new Date(),
    };
    const affected = await update(TABLE, updateData, { id });
    return affected > 0;
  }

  /**
   * Xóa role
   */
  static async deleteRole(id) {
    // Không cho phép xóa Super Admin role (id = 1)
    if (id === 1) {
      throw new Error('Không thể xóa vai trò Super Admin');
    }

    // Kiểm tra xem có user nào đang sử dụng role này không
    const [users] = await db.query(
      'SELECT COUNT(*) as count FROM users WHERE role_id = ? AND deleted_at IS NULL',
      [id],
    );

    if (users[0].count > 0) {
      throw new Error(
        `Không thể xóa vai trò này vì có ${users[0].count} người dùng đang sử dụng`,
      );
    }

    const affected = await remove(TABLE, { id });
    return affected > 0;
  }

  /**
   * Kiểm tra role name đã tồn tại chưa
   */
  static async nameExists(name, excludeId = null) {
    let sql = `SELECT id FROM ${TABLE} WHERE name = ?`;
    const params = [name];

    if (excludeId) {
      sql += ` AND id != ?`;
      params.push(excludeId);
    }

    sql += ` LIMIT 1`;
    const role = await findOne(sql, params);
    return role !== false;
  }
}

export default RoleModel;
