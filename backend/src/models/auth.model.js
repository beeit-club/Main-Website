import { config } from '../config/index.js';
import db from '../db.js';

class AuthModel {
  // Kiểm tra xem đã tồn tại email chưa
  static async isEmail(email, getFullInfo = false) {
    try {
      let query;
      if (getFullInfo) {
        query = `SELECT u.id, u.fullname, u.email, u.password_hash, u.avatar_url, u.is_active, r.name as role_name
                 FROM users u 
                 LEFT JOIN roles r ON u.role_id = r.id 
                 WHERE u.email = ? AND u.deleted_at IS NULL`;
      } else {
        query = `SELECT COUNT(*) as so_luong FROM users WHERE email = ? AND deleted_at IS NULL`;
      }
      const [rows] = await db.execute(query, [email]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Đăng ký user mới
  static async register(fullname, email, password_hash, avatar_url) {
    try {
      // Mặc định role_id = 1 (Guest) khi đăng ký
      const query = `INSERT INTO users 
                     (fullname, email, password_hash, avatar_url, role_id, is_active) 
                     VALUES (?, ?, ?, ?, 1, TRUE)`;
      const [result] = await db.execute(query, [
        fullname,
        email,
        password_hash,
        avatar_url,
      ]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Xóa tất cả session cũ của user
  static async deleteSessionById(user_id) {
    try {
      const query = `DELETE FROM user_sessions WHERE user_id = ?`;
      const [result] = await db.execute(query, [user_id]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Thêm session mới cho user
  static async insertSessionById(user_id, refresh_token) {
    try {
      const expires_at = new Date();
      expires_at.setDate(
        expires_at.getDate() + Number(config.JWT_REFRESH_TOKEN_IN_DB),
      ); // Hết hạn sau 7 ngày

      const query = `INSERT INTO user_sessions 
                     (user_id, refresh_token, expires_at) 
                     VALUES (?, ?, ?)`;
      const [result] = await db.execute(query, [
        user_id,
        refresh_token,
        expires_at,
      ]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Đăng xuất - xóa session
  static async logout(user_id) {
    try {
      const query = `DELETE FROM user_sessions WHERE user_id = ?`;
      const [result] = await db.execute(query, [user_id]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Kiểm tra session token có hợp lệ không
  static async checkSession(user_id) {
    try {
      const query = `SELECT refresh_token, expires_at 
                     FROM user_sessions 
                     WHERE user_id = ?  AND expires_at > NOW()`;
      const [rows] = await db.execute(query, [user_id]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Cập nhật thông tin user
  static async updateUser(user_id, updates) {
    try {
      const fields = Object.keys(updates)
        .map((key) => `${key} = ?`)
        .join(', ');
      const values = Object.values(updates);
      values.push(user_id);

      const query = `UPDATE users SET ${fields} WHERE id = ? AND deleted_at IS NULL`;
      const [result] = await db.execute(query, values);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Lấy thông tin user theo ID
  static async getUserById(user_id) {
    try {
      const query = `SELECT u.id, u.fullname, u.email, u.phone, u.avatar_url, u.bio, 
                            u.is_active, u.email_verified_at, r.name as role_name, r.description as role_description
                     FROM users u 
                     LEFT JOIN roles r ON u.role_id = r.id 
                     WHERE u.id = ? AND u.deleted_at IS NULL`;
      const [rows] = await db.execute(query, [user_id]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Cập nhật session - đánh dấu inactive khi logout
  static async deactivateSession(user_id, refresh_token) {
    try {
      const query = `DELETE from user_sessions 
                     WHERE user_id = ? AND refresh_token = ?`;
      const [result] = await db.execute(query, [user_id, refresh_token]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Clean up expired sessions (có thể chạy định kỳ)
  static async cleanExpiredSessions() {
    try {
      const query = `DELETE FROM user_sessions WHERE expires_at < NOW() OR is_active = FALSE`;
      const [result] = await db.execute(query);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

export default AuthModel;
