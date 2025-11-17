import pool from '../../db.js';
import { findOne, selectWithPagination } from '../../utils/database.js';
import postModel from '../admin/post.model.js';

class HomeModel extends postModel {
  // lấy toàn bộ
  static async home() {
    try {
      // 1. Câu SQL lấy sự kiện mới nhất
      // (Đã thêm tác giả. Không thể thêm category, tags, views vì không có trong schema cho events)
      const latestEventSql = `
SELECT
e.id, e.title, e.slug, e.featured_image, e.start_time, e.location,
u.fullname AS author_name
FROM events AS e
LEFT JOIN users AS u ON e.created_by = u.id
WHERE e.deleted_at IS NULL AND e.is_public = 1
ORDER BY e.created_at DESC
LIMIT 1`; // 2. Câu SQL lấy 10 bài viết mới nhất (đã xuất bản) // (Đã thêm view_count và tags dưới dạng mảng JSON)

      const latestPostsSql = `
    SELECT
        p.id, p.title, p.slug, p.featured_image, p.published_at, p.view_count, p.meta_description,
        pc.name AS category_name, pc.slug AS category_slug,
        u.fullname AS author_name,
        COALESCE(
            (SELECT JSON_ARRAYAGG(
                JSON_OBJECT('name', t.name, 'slug', t.slug)
            )
            FROM post_tags AS pt
            JOIN tags AS t ON pt.tag_id = t.id
            WHERE pt.post_id = p.id),
            JSON_ARRAY()
        ) AS tags
    FROM posts AS p
    LEFT JOIN post_categories AS pc ON p.category_id = pc.id
    LEFT JOIN users AS u ON p.created_by = u.id
    WHERE p.deleted_at IS NULL AND p.status = 1
    ORDER BY p.published_at DESC
    LIMIT 10`;

      const mostViewedPostsSql = `
    SELECT
        p.id, p.title, p.slug, p.view_count, p.published_at,
        pc.name AS category_name, pc.slug AS category_slug,
        u.fullname AS author_name,
        COALESCE(
            (SELECT JSON_ARRAYAGG(
                JSON_OBJECT('name', t.name, 'slug', t.slug)
            )
            FROM post_tags AS pt
            JOIN tags AS t ON pt.tag_id = t.id
            WHERE pt.post_id = p.id),
            JSON_ARRAY()
        ) AS tags
    FROM posts AS p
    LEFT JOIN post_categories AS pc ON p.category_id = pc.id
    LEFT JOIN users AS u ON p.created_by = u.id
    WHERE p.deleted_at IS NULL AND p.status = 1
    ORDER BY p.view_count DESC
    LIMIT 5`;

      // Dùng Promise.all để chạy cả 3 truy vấn song song
      const [
        latestEvent, // findOne sẽ trả về 1 object (hoặc false)
        [latestPosts], // pool.query trả về mảng [rows, fields]
        [mostViewedPosts], // pool.query trả về mảng [rows, fields]
      ] = await Promise.all([
        findOne(latestEventSql), // Dùng findOne vì bạn chỉ cần 1
        pool.query(latestPostsSql),
        pool.query(mostViewedPostsSql),
      ]);

      return {
        latestEvent,
        latestPosts,
        mostViewedPosts,
      };
    } catch (error) {
      throw error;
    }
  }

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
  static async getPostDetaill(slug) {
    return super.getPostBySlug(slug);
  }
  static async getAllPost(options = {}) {
    // Client chỉ xem published posts (status = 1)
    if (!options.filters) {
      options.filters = {};
    }
    options.filters.status = 1; // Force published only
    return super.getAllPosts(options);
  }
  /**
   * Lấy tất cả câu hỏi (đã duyệt) để hiển thị public
   */
  static async getAllQuestions(options = {}) {
    try {
      let sql = `
        SELECT
          q.id,
          q.title,
          q.slug,
          q.view_count,
          q.created_at,
          u.fullname AS author_name,
          u.avatar_url AS author_avatar,
          COUNT(a.id) AS answer_count
        FROM questions AS q
        LEFT JOIN users AS u ON q.created_by = u.id
        LEFT JOIN answers AS a ON q.id = a.question_id
        WHERE q.deleted_at IS NULL AND q.status = 1
        GROUP BY q.id
      `;
      let params = [];

      // Thêm bộ lọc (nếu cần, tương tự getAllCategory)
      // if (options?.filters?.title) {
      //   sql += ` HAVING q.title LIKE ? `;
      //   params.push(`%${options.filters.title}%`);
      // }

      // Mặc định sắp xếp theo mới nhất
      if (!options.orderBy) {
        options.orderBy = { field: 'created_at', direction: 'DESC' };
      }

      const questions = await selectWithPagination(sql, params, options);
      return questions;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy chi tiết câu hỏi và các câu trả lời theo slug
   */
  static async getQuestionBySlug(slug) {
    try {
      // 1. Lấy thông tin câu hỏi
      const questionSql = `
        SELECT
          q.id,
          q.title,
          q.slug,
          q.content,
          q.view_count,
          q.created_at,
          u.id AS author_id,
          u.fullname AS author_name,
          u.avatar_url AS author_avatar
        FROM questions AS q
        LEFT JOIN users AS u ON q.created_by = u.id
        WHERE q.deleted_at IS NULL AND q.slug = ? AND q.status = 1
      `;
      const question = await findOne(questionSql, [slug]);

      if (!question) {
        return false; // Không tìm thấy câu hỏi
      }

      // 2. Lấy tất cả câu trả lời (bao gồm cả nested comments)
      const answersSql = `
        SELECT
          a.id,
          a.content,
          a.is_accepted,
          a.parent_id,
          a.created_at,
          u.id AS author_id,
          u.fullname AS author_name,
          u.avatar_url AS author_avatar
        FROM answers AS a
        LEFT JOIN users AS u ON a.created_by = u.id
        WHERE a.deleted_at IS NULL AND a.question_id = ?
        ORDER BY a.created_at ASC
      `;

      const [answers] = await pool.query(answersSql, [question.id]);

      return {
        ...question,
        answers,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy danh sách thành viên CLB (role_id = 4) với thông tin từ member_profiles
   */
  static async getAllMembers(options = {}) {
    try {
      let sql = `
        SELECT 
          u.id,
          u.fullname,
          u.email,
          u.phone,
          u.avatar_url,
          u.bio,
          u.created_at,
          mp.student_id,
          mp.course,
          mp.academic_year,
          mp.join_date
        FROM users u
        INNER JOIN member_profiles mp ON u.id = mp.user_id
        WHERE u.deleted_at IS NULL 
          AND mp.deleted_at IS NULL
          AND u.role_id = 4
          AND u.is_active = 1
      `;
      let params = [];

      // Filter theo search (tên, email, MSSV)
      if (options?.filters?.search) {
        sql += ` AND (u.fullname LIKE ? OR u.email LIKE ? OR mp.student_id LIKE ?)`;
        const searchTerm = `%${options.filters.search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      // Sắp xếp mặc định: ngày tham gia mới nhất
      // Thêm ORDER BY trực tiếp vào SQL vì selectWithPagination không xử lý alias tốt
      if (!options.orderBy) {
        sql += ` ORDER BY mp.join_date DESC`;
        // Xóa orderBy để selectWithPagination không thêm ORDER BY nữa
        options.orderBy = null;
      }

      const members = await selectWithPagination(sql, params, options);
      return members;
    } catch (error) {
      throw error;
    }
  }
}
export default HomeModel;
