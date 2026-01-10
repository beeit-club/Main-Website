import {
  insert,
  update,
  remove,
  findOne,
  selectWithPagination,
} from '../../utils/database.js';
import db from '../../db.js';

const TABLE = 'permissions';

class PermissionModel {
  /**
   * Lấy danh sách tất cả permissions với phân trang
   */
  static async getAllPermissions(option) {
    let baseSql = `
      SELECT 
        id,
        name,
        description,
        module,
        created_at
      FROM ${TABLE}
    `;
    let params = [];

    if (option?.filters?.search) {
      baseSql += ` WHERE name LIKE ? OR description LIKE ? OR module LIKE ?`;
      params.push(`%${option.filters.search}%`);
      params.push(`%${option.filters.search}%`);
      params.push(`%${option.filters.search}%`);
    }

    if (option?.filters?.module) {
      if (option?.filters?.search) {
        baseSql += ` AND module = ?`;
      } else {
        baseSql += ` WHERE module = ?`;
      }
      params.push(option.filters.module);
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
   * Lấy thông tin chi tiết permission theo ID
   */
  static async getPermissionById(id) {
    const sql = `
      SELECT 
        id,
        name,
        description,
        module,
        created_at
      FROM ${TABLE}
      WHERE id = ?
      LIMIT 1
    `;
    return await findOne(sql, [id]);
  }

  /**
   * Tạo mới permission
   */
  static async createPermission(data) {
    const permissionData = {
      ...data,
      created_at: new Date(),
    };

    const result = await insert(TABLE, permissionData);
    return {
      id: result.insertId,
      ...permissionData,
    };
  }

  /**
   * Cập nhật permission
   */
  static async updatePermission(id, data) {
    const affected = await update(TABLE, data, { id });
    return affected > 0;
  }

  /**
   * Xóa permission
   */
  static async deletePermission(id) {
    // Kiểm tra xem có user nào đang có permission này không
    const [users] = await db.query(
      'SELECT COUNT(*) as count FROM user_permissions WHERE permission_id = ?',
      [id],
    );

    if (users[0].count > 0) {
      throw new Error(
        `Không thể xóa quyền này vì có ${users[0].count} người dùng đang sử dụng`,
      );
    }

    const affected = await remove(TABLE, { id });
    return affected > 0;
  }

  /**
   * Kiểm tra permission name đã tồn tại chưa
   */
  static async nameExists(name, excludeId = null) {
    let sql = `SELECT id FROM ${TABLE} WHERE name = ?`;
    const params = [name];

    if (excludeId) {
      sql += ` AND id != ?`;
      params.push(excludeId);
    }

    sql += ` LIMIT 1`;
    const permission = await findOne(sql, params);
    return permission !== false;
  }

  /**
   * Lấy permissions của user
   */
  static async getUserPermissions(userId) {
    const sql = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.module,
        up.granted_at,
        up.granted_by
      FROM user_permissions up
      JOIN permissions p ON up.permission_id = p.id
      WHERE up.user_id = ?
      ORDER BY p.module, p.name
    `;
    const [rows] = await db.query(sql, [userId]);
    return rows;
  }

  /**
   * Gán permission cho user
   */
  static async grantPermission(userId, permissionId, grantedBy) {
    // Kiểm tra xem đã có chưa
    const [existing] = await db.query(
      'SELECT * FROM user_permissions WHERE user_id = ? AND permission_id = ?',
      [userId, permissionId],
    );

    if (existing.length > 0) {
      throw new Error('Người dùng đã có quyền này');
    }

    const data = {
      user_id: userId,
      permission_id: permissionId,
      granted_by: grantedBy,
      granted_at: new Date(),
    };

    const result = await insert('user_permissions', data);
    return result.insertId;
  }

  /**
   * Thu hồi permission từ user
   */
  static async revokePermission(userId, permissionId) {
    const affected = await remove('user_permissions', {
      user_id: userId,
      permission_id: permissionId,
    });
    return affected > 0;
  }

  /**
   * Gán nhiều permissions cho user (bulk)
   */
  static async bulkGrantPermissions(userId, permissionIds, grantedBy) {
    const values = permissionIds.map((permissionId) => [
      userId,
      permissionId,
      grantedBy,
      new Date(),
    ]);

    // Xóa các permissions cũ trước
    await db.query('DELETE FROM user_permissions WHERE user_id = ?', [userId]);

    // Thêm các permissions mới
    if (values.length > 0) {
      const sql = `
        INSERT INTO user_permissions (user_id, permission_id, granted_by, granted_at)
        VALUES ?
      `;
      await db.query(sql, [values]);
    }

    return true;
  }
}

export default PermissionModel;
