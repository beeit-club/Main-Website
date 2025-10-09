import {
  findOne,
  insert,
  selectWithPagination,
  update,
} from '../../utils/database.js';
import { dateTime } from '../../utils/datetime.js';

class categoryModel {
  // lấy toàn bộ
  static async getAllCategory(options = {}) {
    try {
      let sql = `SELECT * FROM post_categories Where 1=1 `;
      let params = [];

      if (options?.filters?.name) {
        sql += ` AND name LIKE ? `;
        params.push(`%${options.filters.name}%`);
      }
      if (options?.filters?.status) {
        sql += ` AND status = ? `;
        params.push(`${options?.filters?.status}`);
      }
      const category = await selectWithPagination(sql, params, options);
      return category;
    } catch (error) {
      throw error;
    }
  }
  // lấy 1
  static async getOneCategory(id) {
    try {
      const sql = `SELECT * FROM post_categories where id = ?`;
      const result = await findOne(sql, [id]);
      return result;
    } catch (error) {
      throw error;
    }
  }
  // /check xem đã tồn tại danh mục chưa

  static async checkIsCategory(slug) {
    try {
      const sql = 'Select name from post_categories where slug = ?';
      const result = await findOne(sql, [slug]);
      return result;
    } catch (error) {
      throw error;
    }
  }
  // thêm
  static async createCategory(category) {
    try {
      const cate = await insert('post_categories', category);
      return cate;
    } catch (error) {
      throw error;
    }
  }
  // update
  static async updateCategory(id, category) {
    try {
      const cate = await update('post_categories', category, { id: id });
      return cate;
    } catch (error) {
      throw error;
    }
  }
  // xóa mềm
  static async deleteCategory(id) {
    try {
      const sql = `UPDATE post_categories set deleted_at = ? where id = ?`;
      const time = dateTime();
      const result = await findOne(sql, [time, id]);
      return result;
    } catch (error) {
      throw error;
    }
  }
  // khôi phục
  static async restoreCategory(id) {
    try {
      const sql = `UPDATE post_categories set deleted_at = null where id = ?`;
      const result = await findOne(sql, [id]);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
export default categoryModel;
