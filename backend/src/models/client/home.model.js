import { selectWithPagination } from '../../utils/database.js';

class HomeModel {
  // lấy toàn bộ
  static async getAllCategory(options = {}) {
    try {
      let sql = `SELECT id,name,slug,parent_id FROM post_categories Where 1=1  AND deleted_at is NULL `;
      let params = [];

      if (options?.filters?.name) {
        sql += ` AND name LIKE ? `;
        params.push(`%${options.filters.name}%`);
      }
      options.limit = 10000;
      options.page = 1;
      const category = await selectWithPagination(sql, params, options);
      return category;
    } catch (error) {
      throw error;
    }
  }
  static async getAllTag(options = {}) {
    try {
      let sql = `SELECT id, name, slug, meta_description FROM tags WHERE deleted_at IS NULL`;
      let params = [];

      if (options?.filters?.name) {
        sql += ` AND name LIKE ?`;
        params.push(`%${options.filters.name}%`);
      }
      options.limit = 10000;
      options.page = 1;
      const tags = await selectWithPagination(sql, params, options);
      return tags;
    } catch (error) {
      throw error;
    }
  }
}
export default HomeModel;
