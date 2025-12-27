// models/admin/beeitAchievement.model.js

import pool from '../../db.js';
import {
  findOne,
  insert,
  update,
  selectWithPagination,
} from '../../utils/database.js';

const table = 'beeit_achievements';

class BeeitAchievementModel {
  // Lấy tất cả achievements
  static async getAllAchievements(options = {}) {
    console.log('═══════════════════════════════════════════════════════');
    console.log('🏆 [ACHIEVEMENT MODEL] ===== BẮT ĐẦU LẤY ACHIEVEMENTS =====');
    console.log('📅 [ACHIEVEMENT MODEL] Time:', new Date().toISOString());
    console.log(
      '📋 [ACHIEVEMENT MODEL] Options:',
      JSON.stringify(options, null, 2),
    );

    let sql = `SELECT * FROM ${table} WHERE 1=1`;
    let params = [];

    if (options?.filters?.status) {
      sql += ` AND status = ?`;
      params.push(options.filters.status);
    } else {
      // Mặc định chỉ lấy active
      sql += ` AND status = 'active'`;
    }

    if (options?.filters?.row_number) {
      sql += ` AND row_number = ?`;
      params.push(options.filters.row_number);
    }

    if (options?.filters?.year) {
      sql += ` AND year = ?`;
      params.push(options.filters.year);
    }

    // Thêm ORDER BY vào SQL
    sql += ` ORDER BY \`row_number\` ASC, \`display_order\` ASC, \`id\` ASC`;

    console.log('📝 [ACHIEVEMENT MODEL] SQL:', sql);
    console.log('📝 [ACHIEVEMENT MODEL] Params:', params);

    let result;
    if (options?.page || options?.limit) {
      // Gọi selectWithPagination với SQL đã có ORDER BY
      // selectWithPagination sẽ tự động xử lý ORDER BY và thêm LIMIT
      result = await selectWithPagination(sql, params, options);
    } else {
      const [rows] = await pool.query(sql, params);
      result = { data: rows, pagination: null };
    }

    console.log('📊 [ACHIEVEMENT MODEL] Query executed');
    console.log(
      '📊 [ACHIEVEMENT MODEL] Result count:',
      result?.data?.length || 0,
    );
    if (result?.data?.length > 0) {
      console.log('✅ [ACHIEVEMENT MODEL] Achievements found:');
      result.data.forEach((achievement, index) => {
        console.log(`  🏅 Achievement ${index + 1}:`, {
          id: achievement.id,
          title: achievement.title,
          year: achievement.year,
          row_number: achievement.row_number,
          display_order: achievement.display_order,
          status: achievement.status,
          image_url: achievement.image_url?.substring(0, 50) + '...',
        });
      });
    } else {
      console.log('⚠️  [ACHIEVEMENT MODEL] No achievements found in database');
    }
    console.log('═══════════════════════════════════════════════════════');

    return result;
  }

  // Lấy achievement theo ID
  static async getAchievementById(id) {
    const sql = `SELECT * FROM ${table} WHERE id = ?`;
    return findOne(sql, [id]);
  }

  // Tạo achievement mới
  static async createAchievement(data) {
    return insert(table, data);
  }

  // Cập nhật achievement
  static async updateAchievement(id, data) {
    return update(table, data, { id });
  }

  // Xóa achievement (soft delete)
  static async deleteAchievement(id) {
    return update(table, { status: 'inactive' }, { id });
  }

  // Cập nhật display order
  static async updateDisplayOrder(achievements) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      for (const achievement of achievements) {
        await update(
          table,
          {
            display_order: achievement.display_order,
            row_number: achievement.row_number,
          },
          { id: achievement.id },
        );
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

export default BeeitAchievementModel;
