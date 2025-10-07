import { config } from '../../config/index.js';
import { code, message } from '../../common/message/index.js';
import { findOne, insert, update, remove } from '../../utils/database.js';

class AuthModel {
  // Kiểm tra xem email đã tồn tại chưa
  static async isEmail(email, getFullInfo = false) {
    try {
      const query = getFullInfo
        ? `SELECT u.id, u.fullname, u.email, u.avatar_url, u.is_active, r.name AS role_name
           FROM users u
           LEFT JOIN roles r ON u.role_id = r.id
           WHERE u.email = ? AND u.deleted_at IS NULL`
        : `SELECT COUNT(*) AS so_luong FROM users WHERE email = ? AND deleted_at IS NULL`;

      const result = await findOne(query, [email]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Đăng ký user mới
  static async register(fullname, email, avatar_url) {
    try {
      const data = {
        fullname,
        email,
        avatar_url,
        role_id: 1,
        is_active: true,
      };
      const result = await insert('users', data);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Xóa tất cả session cũ của user
  static async deleteSessionById(user_id) {
    try {
      const result = await remove('user_sessions', { user_id });
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
      );

      const data = { user_id, refresh_token, expires_at };
      const result = await insert('user_sessions', data);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Đăng xuất - xóa session
  static async logout(user_id) {
    try {
      const result = await remove('user_sessions', { user_id });
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Kiểm tra session token có hợp lệ không
  static async checkSession(user_id) {
    try {
      const query = `
        SELECT refresh_token, expires_at
        FROM user_sessions
        WHERE user_id = ? AND expires_at > NOW()
      `;
      const result = await findOne(query, [user_id]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Cập nhật thông tin user
  static async updateUser(user_id, updates) {
    try {
      const result = await update('users', updates, { id: user_id });
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Lấy thông tin user theo ID
  static async getUserById(user_id) {
    try {
      const query = `
        SELECT u.id, u.fullname, u.email, u.phone, u.avatar_url, u.bio,
               u.is_active, u.email_verified_at,
               r.name AS role_name, r.description AS role_description
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.id
        WHERE u.id = ? AND u.deleted_at IS NULL
      `;
      const result = await findOne(query, [user_id]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Xóa session theo refresh_token (logout)
  static async deactivateSession(user_id, refresh_token) {
    try {
      const result = await remove('user_sessions', { user_id, refresh_token });
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Lấy danh sách quyền người dùng
  static async getPremiss(user_id) {
    try {
      const query = `
        SELECT p.name
        FROM user_permissions AS up
        JOIN permissions AS p ON up.permission_id = p.id
        WHERE up.user_id = ?
      `;
      const result = await findOne(query, [user_id]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Dọn dẹp session hết hạn
  static async cleanExpiredSessions() {
    try {
      const query = `DELETE FROM user_sessions WHERE expires_at < NOW() OR is_active = FALSE`;
      const result = await remove('user_sessions', { is_active: false }); // có thể thay bằng query trực tiếp nếu cần
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Lưu OTP mới
  static async insertOtp(email, otp) {
    try {
      const query = `
        UPDATE users
        SET otp_code = ?, otp_expires_at = DATE_ADD(NOW(), INTERVAL ? SECOND), otp_attempts = 0
        WHERE email = ?
      `;
      const [result] = await pool.query(query, [
        otp,
        config.JWT_OTP_EXPIRES_IN,
        email,
      ]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Cập nhật OTP
  static async updateOtp(email, otp, check = true) {
    try {
      if (check) {
        const query = `
          UPDATE users
          SET otp_code = ?, otp_expires_at = DATE_ADD(NOW(), INTERVAL ? SECOND), otp_attempts = 0
          WHERE email = ?
        `;
        const [result] = await pool.query(query, [
          otp,
          config.JWT_OTP_EXPIRES_IN,
          email,
        ]);
        return result.affectedRows > 0;
      } else {
        const query = `
          UPDATE users
          SET otp_code = ?, otp_expires_at = NULL, otp_attempts = 0
          WHERE email = ?
        `;
        const [result] = await pool.query(query, [otp, email]);
        return result.affectedRows > 0;
      }
    } catch (error) {
      throw error;
    }
  }

  // Xác minh OTP
  static async verifyOtp(email, otp) {
    try {
      const query = `SELECT otp_code, otp_expires_at, otp_attempts FROM users WHERE email = ?`;
      const result = await findOne(query, [email]);
      if (!result) {
        return {
          valid: false,
          code: code.Auth.USER_NOT_FOUND_CODE,
          msg: message.Auth.USER_NOT_FOUND,
        };
      }

      const user = result;

      if (user.otp_attempts >= config.OTP_MAX_ATTEMPTS) {
        return {
          valid: false,
          code: code.Auth.OTP_ATTEMPTS_EXCEEDED_CODE,
          msg: message.Auth.OTP_ATTEMPTS_EXCEEDED,
        };
      }

      if (!user.otp_expires_at || new Date(user.otp_expires_at) < new Date()) {
        return {
          valid: false,
          code: code.Auth.OTP_EXPIRED_CODE,
          msg: message.Auth.OTP_EXPIRED,
        };
      }

      if (user.otp_code !== otp) {
        await update(
          'users',
          { otp_attempts: user.otp_attempts + 1 },
          { email },
        );
        return {
          valid: false,
          code: code.Auth.OTP_INVALID_CODE,
          msg: message.Auth.OTP_INVALID,
        };
      }

      await update(
        'users',
        { otp_attempts: 0, otp_code: null, otp_expires_at: null },
        { email },
      );
      return {
        valid: true,
        code: code.Auth.OTP_VERIFY_SUCCESS_CODE,
        msg: message.Auth.OTP_VERIFY_SUCCESS,
      };
    } catch (error) {
      return {
        valid: false,
        code: code.Auth.SERVER_ERROR_CODE,
        msg: message.Auth.SERVER_ERROR,
      };
    }
  }

  // Tìm hoặc tạo user bằng Google
  static async findOrCreate(googlePayload) {
    try {
      const { email, sub: googleId, name, picture } = googlePayload;
      const existingUser = await findOne(
        'SELECT * FROM users WHERE email = ?',
        [email],
      );

      if (existingUser) {
        if (!existingUser.google_id) {
          await update(
            'users',
            { google_id: googleId },
            { id: existingUser.id },
          );
        }
        return existingUser;
      }

      const insertData = {
        fullname: name,
        email,
        google_id: googleId,
        avatar_url: picture,
        is_active: true,
        email_verified_at: new Date(),
      };
      const result = await insert('users', insertData);
      return await findOne('SELECT * FROM users WHERE id = ?', [
        result.insertId,
      ]);
    } catch (error) {
      throw error;
    }
  }
}

export default AuthModel;
