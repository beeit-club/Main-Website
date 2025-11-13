import { date } from 'yup';
import {
  findOne,
  insert,
  remove,
  selectWithPagination,
  update,
} from '../../utils/database.js';
import { dateTime } from '../../utils/datetime.js';
import pool from '../../db.js';
const table = 'posts';
class postModel {
  // lấy toàn bộ
  static async getAllPosts(options = {}) {
    try {
      let sql = `SELECT
    p.id,
    p.title,
    p.slug,
    p.featured_image,
    p.meta_description,
    p.view_count,
    p.published_at,
    p.created_at,
    p.status,
    pc.name AS category_name,
    pc.slug AS category_slug,
    u.fullname AS author_name,
    (
        SELECT
            JSON_ARRAYAGG(
                JSON_OBJECT('id', t.id, 'name', t.name, 'slug', t.slug)
            )
        FROM
            post_tags AS pt
        JOIN
            tags AS t ON pt.tag_id = t.id
        WHERE
            pt.post_id = p.id
    ) AS tags
FROM
    posts AS p
LEFT JOIN
    post_categories AS pc ON p.category_id = pc.id
LEFT JOIN
    users AS u ON p.created_by = u.id
WHERE
    p.deleted_at IS NULL `;
      let params = [];

      if (options?.filters?.title) {
        sql += ` AND title LIKE ?`;
        params.push(`%${options.filters.title}%`);
      }
      if (options?.filters?.status) {
        sql += ` AND status = ?`;
        params.push(`${options.filters.status}`);
      }
      if (options?.filters?.category_id) {
        sql += ` AND category_id = ?`;
        params.push(`${options.filters.category_id}`);
      }
      const post = await selectWithPagination(sql, params, options);
      return post;
    } catch (error) {
      throw error;
    }
  }

  // lấy 1
  static async getPostBySlug(slug) {
    try {
      const sql = `SELECT
    p.id,
    p.title,
    p.slug,
    p.content,
    p.featured_image,
    p.meta_description,
    p.view_count,
    p.published_at,
    p.created_at,
    p.status,
    p.category_id,
    pc.name AS category_name,
    pc.slug AS category_slug,
    u.fullname AS author_name,
    u.avatar_url AS author_avatar,
    (
        SELECT
            JSON_ARRAYAGG(
                JSON_OBJECT('id', t.id, 'name', t.name, 'slug', t.slug)
            )
        FROM
            post_tags AS pt
        JOIN
            tags AS t ON pt.tag_id = t.id
        WHERE
            pt.post_id = p.id
    ) AS tags
FROM
    posts AS p
LEFT JOIN
    post_categories AS pc ON p.category_id = pc.id
LEFT JOIN
    users AS u ON p.created_by = u.id
WHERE
    p.slug = ? AND p.deleted_at IS NULL;`;
      const result = await findOne(sql, [slug]);
      return result;
    } catch (error) {
      throw error;
    }
  }
  static async getPostById(id) {
    try {
      const sql = `SELECT
    p.id,
    p.title,
    p.slug,
    p.content,
    p.featured_image,
    p.meta_description,
    p.view_count,
    p.published_at,
    p.created_at,
    p.status,
    p.category_id,
    pc.name AS category_name,
    pc.slug AS category_slug,
    u.fullname AS author_name,
    u.avatar_url AS author_avatar,
    (
        SELECT
            JSON_ARRAYAGG(
                JSON_OBJECT('id', t.id, 'name', t.name, 'slug', t.slug)
            )
        FROM
            post_tags AS pt
        JOIN
            tags AS t ON pt.tag_id = t.id
        WHERE
            pt.post_id = p.id
    ) AS tags
FROM
    posts AS p
LEFT JOIN
    post_categories AS pc ON p.category_id = pc.id
LEFT JOIN
    users AS u ON p.created_by = u.id
WHERE
    p.id = ? AND p.deleted_at IS NULL;`;
      const result = await findOne(sql, [id]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // check xem đã tồn tại thẻ chưa
  static async checkIsPost(slug) {
    try {
      const sql = `SELECT title FROM ${table} WHERE slug = ? AND deleted_at IS NULL`;
      const result = await findOne(sql, [slug]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // thêm
  static async createPost(data) {
    try {
      const post = await insert(table, data);
      return post;
    } catch (error) {
      throw error;
    }
  }
  //   thêm mối liên hệ post tag
  static async addTagsPost(data = [], post_id) {
    // Giữ lại bước kiểm tra mảng rỗng, nó rất tốt.
    if (!data || data.length === 0) {
      return;
    }

    try {
      const values = data.map((tag_id) => [post_id, tag_id]);
      const sql = `INSERT INTO post_tags (post_id, tag_id) VALUES ?`;
      const result = await pool.query(sql, [values]);
      return result;
    } catch (error) {
      throw error;
    }
  }
  /**
   * Cập nhật tags cho bài viết bằng cách xóa tất cả rồi chèn lại.
   * Toàn bộ thao tác được bọc trong một transaction.
   */
  static async updateTagsPost(data = [], post_id) {
    // Lấy một kết nối từ pool để sử dụng cho transaction
    const connection = await pool.getConnection();

    try {
      // Bắt đầu một transaction
      await connection.beginTransaction();

      // 1. Xóa tất cả các tag cũ của bài viết
      const deleteSql = 'DELETE FROM post_tags WHERE post_id = ?';
      await connection.query(deleteSql, [post_id]); // Sửa lỗi: dùng post_id

      // 2. Nếu có tag mới thì chèn vào
      // Sửa logic: chỉ chèn khi mảng data không rỗng
      if (data && data.length > 0) {
        const values = data.map((tag_id) => [post_id, tag_id]);
        const insertSql = `INSERT INTO post_tags (post_id, tag_id) VALUES ?`;
        await connection.query(insertSql, [values]);
      }

      // Nếu mọi thứ thành công, commit transaction
      await connection.commit();
    } catch (error) {
      // Nếu có bất kỳ lỗi nào, rollback tất cả thay đổi
      await connection.rollback();
      throw error; // Ném lỗi ra ngoài để xử lý
    } finally {
      // Luôn luôn giải phóng kết nối về lại pool
      connection.release();
    }
  }

  // update
  static async updatePost(id, data) {
    try {
      const post = await update(table, data, { id: id });
      return post;
    } catch (error) {
      throw error;
    }
  }

  // xóa mềm
  static async deletePost(id) {
    try {
      const time = dateTime();
      const result = await update(table, { deleted_at: time }, { id: id });
      return result;
    } catch (error) {
      throw error;
    }
  }

  // khôi phục
  static async restorePost(id) {
    try {
      const sql = `UPDATE ${table} SET deleted_at = NULL WHERE id = ?`;
      const result = await findOne(sql, [id]);
      return result;
    } catch (error) {
      throw error;
    }
  }
  // toggle
  static async changePostStatus(id, status) {
    try {
      const sql = `UPDATE ${table} SET status = ? WHERE id = ?`;
      const result = await findOne(sql, [, status, id]);
      return result;
    } catch (error) {
      throw error;
    }
  }
  // danh sách bài viết đã xóa
  static async getDeletedPosts(options = {}) {
    try {
      let sql = `SELECT
    p.id,
    p.title,
    p.slug,
    p.featured_image,
    p.meta_description,
    p.view_count,
    p.published_at,
    p.created_at,
    pc.name AS category_name,
    pc.slug AS category_slug,
    u.fullname AS author_name,
    (
        SELECT
            JSON_ARRAYAGG(
                JSON_OBJECT('id', t.id, 'name', t.name, 'slug', t.slug)
            )
        FROM
            post_tags AS pt
        JOIN
            tags AS t ON pt.tag_id = t.id
        WHERE
            pt.post_id = p.id
    ) AS tags
FROM
    posts AS p
LEFT JOIN
    post_categories AS pc ON p.category_id = pc.id
LEFT JOIN
    users AS u ON p.created_by = u.id
WHERE
    p.deleted_at IS NOT NULL `;
      let params = [];

      if (options?.filters?.title) {
        sql += ` AND title LIKE ?`;
        params.push(`%${options.filters.title}%`);
      }
      if (options?.filters?.status) {
        sql += ` AND status = ?`;
        params.push(`${options.filters.status}`);
      }
      if (options?.filters?.category_id) {
        sql += ` AND category_id = ?`;
        params.push(`${options.filters.category_id}`);
      }
      const post = await selectWithPagination(sql, params, options);
      return post;
    } catch (error) {
      throw error;
    }
  }
  // xóa vĩnh viễn
  static async permanentDeletePost(id) {
    try {
      const result = await remove(table, { id: id });
      return result;
    } catch (error) {
      throw error;
    }
  }
}
export default postModel;
