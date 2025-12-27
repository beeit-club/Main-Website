// models/admin/beeitBehindScene.model.js

import pool from '../../db.js';
import {
  findOne,
  insert,
  update,
  selectWithPagination,
} from '../../utils/database.js';

const table = 'beeit_behind_scenes';

class BeeitBehindSceneModel {
  // Lấy tất cả photos
  static async getAllPhotos(options = {}) {
    console.log('═══════════════════════════════════════════════════════');
    console.log('📸 [PHOTO MODEL] ===== BẮT ĐẦU LẤY PHOTOS =====');
    console.log('📅 [PHOTO MODEL] Time:', new Date().toISOString());
    console.log('📋 [PHOTO MODEL] Options:', JSON.stringify(options, null, 2));

    let sql = `SELECT * FROM ${table} WHERE 1=1`;
    let params = [];

    if (options?.filters?.status) {
      sql += ` AND status = ?`;
      params.push(options.filters.status);
    } else {
      // Mặc định chỉ lấy active
      sql += ` AND status = 'active'`;
    }

    sql += ` ORDER BY display_order ASC, id ASC`;

    console.log('📝 [PHOTO MODEL] SQL:', sql);
    console.log('📝 [PHOTO MODEL] Params:', params);

    let result;
    if (options?.page || options?.limit) {
      result = await selectWithPagination(sql, params, options);
    } else {
      const [rows] = await pool.query(sql, params);
      result = { data: rows, pagination: null };
    }

    console.log('📊 [PHOTO MODEL] Query executed');
    console.log('📊 [PHOTO MODEL] Result count:', result?.data?.length || 0);
    if (result?.data?.length > 0) {
      console.log('✅ [PHOTO MODEL] Photos found:');
      result.data.forEach((photo, index) => {
        console.log(`  📷 Photo ${index + 1}:`, {
          id: photo.id,
          image_url: photo.image_url?.substring(0, 50) + '...',
          alt_text: photo.alt_text,
          display_order: photo.display_order,
          status: photo.status,
        });
      });
    } else {
      console.log('⚠️  [PHOTO MODEL] No photos found in database');
    }
    console.log('═══════════════════════════════════════════════════════');

    return result;
  }

  // Lấy photo theo ID
  static async getPhotoById(id) {
    const sql = `SELECT * FROM ${table} WHERE id = ?`;
    return findOne(sql, [id]);
  }

  // Tạo photo mới
  static async createPhoto(data) {
    return insert(table, data);
  }

  // Cập nhật photo
  static async updatePhoto(id, data) {
    return update(table, data, { id });
  }

  // Xóa photo (soft delete)
  static async deletePhoto(id) {
    return update(table, { status: 'inactive' }, { id });
  }

  // Cập nhật display order
  static async updateDisplayOrder(photos) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      for (const photo of photos) {
        await update(
          table,
          { display_order: photo.display_order },
          { id: photo.id },
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

export default BeeitBehindSceneModel;
