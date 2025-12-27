// models/admin/beeitHero.model.js

import pool from '../../db.js';
import { findOne, update, insert } from '../../utils/database.js';

const table = 'beeit_hero';

class BeeitHeroModel {
  // Lấy thông tin Hero (chỉ có 1 record)
  static async getHero() {
    try {
      const sql = `SELECT * FROM ${table} WHERE is_active = TRUE ORDER BY id LIMIT 1`;
      console.log('🔍 [HERO MODEL] Executing SQL query...');
      console.log('📝 [HERO MODEL] SQL:', sql);
      console.log('📝 [HERO MODEL] Table:', table);
      console.log('📝 [HERO MODEL] Params: []');
      
      const result = await findOne(sql, []);
      
      console.log('📊 [HERO MODEL] Query executed');
      console.log('📊 [HERO MODEL] Result type:', typeof result);
      console.log('📊 [HERO MODEL] Result:', result ? 'Found' : 'Not found (false)');
      
      if (result) {
        console.log('✅ [HERO MODEL] Hero data found:');
        console.log('  📋 ID:', result.id);
        console.log('  📋 Title Line 1:', result.title_line1);
        console.log('  📋 Title Line 2:', result.title_line2);
        console.log('  ✅ Is Active:', result.is_active);
        console.log('  📅 Updated At:', result.updated_at);
      } else {
        console.log('⚠️  [HERO MODEL] No hero found in database');
      }
      
      // findOne trả về false nếu không tìm thấy, convert thành null để dễ xử lý
      return result || null;
    } catch (error) {
      console.error('❌ [HERO MODEL] Error querying hero:');
      console.error('  💥 Error Message:', error.message);
      console.error('  💥 Error Code:', error.code);
      console.error('  💥 Error SQL State:', error.sqlState);
      console.error('  💥 Error Stack:', error.stack);
      throw error;
    }
  }

  // Lấy Hero theo ID
  static async getHeroById(id) {
    const sql = `SELECT * FROM ${table} WHERE id = ?`;
    return findOne(sql, [id]);
  }

  // Cập nhật Hero
  static async updateHero(id, data) {
    return update(table, data, { id });
  }

  // Tạo Hero mới (nếu chưa có)
  static async createHero(data) {
    return insert(table, data);
  }
}

export default BeeitHeroModel;
