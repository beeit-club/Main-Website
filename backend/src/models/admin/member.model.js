import pool from '../../db.js';
import { findOne, insert, update, remove } from '../../utils/database.js';

const MemberModel = {
  // Lấy danh sách thành viên
  getAllMembers: async ({ search, sortBy, sortDirection, limit, offset }) => {
    try {
      let query = `
        SELECT mp.*, u.fullname, u.email, u.phone, u.avatar_url
        FROM member_profiles mp
        JOIN users u ON mp.user_id = u.id
        WHERE u.deleted_at IS NULL
      `;
      const params = [];

      if (search) {
        query += ` AND (u.fullname LIKE ? OR u.email LIKE ? OR mp.student_id LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }

      // Sorting
      if (sortBy) {
        // Map sortBy to actual columns if needed, or assume safe
        query += ` ORDER BY ${sortBy} ${sortDirection === 'desc' ? 'DESC' : 'ASC'}`;
      } else {
        // Default sort by user creation time (u.created_at) as it is guaranteed to exist.
        query += ` ORDER BY u.created_at DESC`;
      }

      // Pagination
      query += ` LIMIT ? OFFSET ?`;
      params.push(limit, offset);

      const [rows] = await pool.query(query, params);

      // Count total
      let countQuery = `
        SELECT COUNT(*) as total
        FROM member_profiles mp
        JOIN users u ON mp.user_id = u.id
        WHERE u.deleted_at IS NULL
      `;
      const countParams = [];
      if (search) {
        countQuery += ` AND (u.fullname LIKE ? OR u.email LIKE ? OR mp.student_id LIKE ?)`;
        countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }
      const [countResult] = await pool.query(countQuery, countParams);

      return {
        data: rows,
        total: countResult[0].total,
      };
    } catch (error) {
      throw error;
    }
  },

  // Lấy chi tiết thành viên
  getMemberByUserId: async (user_id) => {
    try {
      const query = `
        SELECT mp.*, u.fullname, u.email, u.phone, u.avatar_url
        FROM member_profiles mp
        JOIN users u ON mp.user_id = u.id
        WHERE mp.user_id = ?
      `;
      return await findOne(query, [user_id]);
    } catch (error) {
      throw error;
    }
  },

  // Lấy thành viên theo student_id
  getMemberByStudentId: async (student_id) => {
    try {
      const query = `SELECT * FROM member_profiles WHERE student_id = ?`;
      return await findOne(query, [student_id]);
    } catch (error) {
      throw error;
    }
  },

  // Tạo thành viên
  createMember: async (data) => {
    try {
      return await insert('member_profiles', data);
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật thành viên
  updateMember: async (user_id, data) => {
    try {
      return await update('member_profiles', data, { user_id });
    } catch (error) {
      throw error;
    }
  },

  // Xóa thành viên
  deleteMember: async (user_id) => {
    try {
      return await remove('member_profiles', { user_id });
    } catch (error) {
      throw error;
    }
  },

  // Lấy user chưa là thành viên
  getAvailableUsers: async ({ search, limit, offset }) => {
    try {
      let query = `
        SELECT u.id, u.fullname, u.email, u.avatar_url
        FROM users u
        LEFT JOIN member_profiles mp ON u.id = mp.user_id
        WHERE u.deleted_at IS NULL AND mp.user_id IS NULL
      `;
      const params = [];

      if (search) {
        query += ` AND (u.fullname LIKE ? OR u.email LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
      }

      query += ` LIMIT ? OFFSET ?`;
      params.push(limit, offset);

      const [rows] = await pool.query(query, params);
      
      let countQuery = `
        SELECT COUNT(*) as total
        FROM users u
        LEFT JOIN member_profiles mp ON u.id = mp.user_id
        WHERE u.deleted_at IS NULL AND mp.user_id IS NULL
      `;
      const countParams = [];
      if (search) {
        countQuery += ` AND (u.fullname LIKE ? OR u.email LIKE ?)`;
        countParams.push(`%${search}%`, `%${search}%`);
      }
      const [countResult] = await pool.query(countQuery, countParams);

      return { data: rows, total: countResult[0].total };
    } catch (error) {
      throw error;
    }
  },

  // --- REQUESTS HANDLING ---

  // Lấy danh sách yêu cầu (pending)
  getPendingRequests: async ({ limit, offset }) => {
    try {
      const query = `
        SELECT r.*, u.fullname, u.email, u.avatar_url
        FROM member_edit_requests r
        JOIN users u ON r.user_id = u.id
        WHERE r.status = 'pending'
        ORDER BY r.created_at ASC
        LIMIT ? OFFSET ?
      `;
      const [rows] = await pool.query(query, [limit, offset]);
      
      const countQuery = `SELECT COUNT(*) as total FROM member_edit_requests WHERE status = 'pending'`;
      const [countResult] = await pool.query(countQuery);

      return { data: rows, total: countResult[0].total };
    } catch (error) {
      throw error;
    }
  },

  getRequestById: async (id) => {
    try {
      return await findOne(`SELECT * FROM member_edit_requests WHERE id = ?`, [id]);
    } catch (error) {
      throw error;
    }
  },

  updateRequestStatus: async (id, status, admin_note, processed_by) => {
    try {
      const query = `
        UPDATE member_edit_requests
        SET status = ?, admin_note = ?, processed_by = ?, processed_at = NOW()
        WHERE id = ?
      `;
      const [result] = await pool.query(query, [status, admin_note, processed_by, id]);
      return result;
    } catch (error) {
      throw error;
    }
  }
};

export default MemberModel;
