import db from '../../db.js';

class userModel {
  // Lấy danh sách tất cả user
  static async getAllUsers() {
    try {
      const query = `SELECT 
    u.id,
    u.fullname,
    u.email,
    u.phone,
    u.avatar_url,
    r.name AS role_name,
    u.is_active,
    u.email_verified_at,
    u.created_at,
    u.deleted_at
FROM users u
LEFT JOIN roles r ON u.role_id = r.id;`;
      const [rows] = await db.execute(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }
  // Lấy thông tin chi tiết user theo id (bao gồm cả deleted_at)
  static async getUserById(user_id) {
    try {
      const query = `SELECT 
    u.id,
    u.fullname,
    u.email,
    u.phone,
    u.avatar_url,
    u.bio,
    u.role_id,
    r.name AS role_name,
    u.is_active,
    u.email_verified_at,
    u.created_at,
    u.updated_at,
    u.deleted_at
FROM users u
LEFT JOIN roles r ON u.role_id = r.id
WHERE u.id = ?;`;
      const [rows] = await db.execute(query, [user_id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
  //  Tạo mới một user Và Trả về dữ liệu vừa insert
  static async createUser(data) {
    try {
      const query = `
    INSERT INTO users (fullname, email, phone, avatar_url, bio, role_id, is_active, email_verified_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
      const values = [
        data.fullname,
        data.email,
        data.phone,
        data.avatar_url,
        data.bio,
        data.role_id,
        data.is_active,
        data.email_verified_at,
      ];

      const [result] = await db.execute(query, values);

      return {
        id: result.insertId,
        ...data,
      };
    } catch (error) {
      throw error;
    }
  }
  // Lấy user theo id (loại bỏ user đã xóa mềm)
  static async getUserById(id) {
    try {
      const query = `
      SELECT 
        u.id,
        u.fullname,
        u.email,
        u.phone,
        u.google_id,
        u.otp_code,
        u.otp_expires_at,
        u.otp_attempts,
        u.avatar_url,
        u.bio,
        u.role_id,
        r.name AS role_name,
        u.is_active,
        u.email_verified_at,
        u.created_at,
        u.updated_at,
        u.deleted_at
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.id = ? AND u.deleted_at IS NULL
      LIMIT 1
    `;

      const [rows] = await db.execute(query, [id]);
      return rows[0] || null; // chỉ trả về 1 user, null nếu không tồn tại
    } catch (error) {
      throw error;
    }
  }
  // Update thông tin user
  static async updateUser(id, data) {
    try {
      // Lấy danh sách các field cho phép update
      const allowedFields = [
        'fullname',
        'email',
        'phone',
        'avatar_url',
        'bio',
        'role_id',
        'is_active',
        'email_verified_at',
      ];
      // đoạn này có thể tách ra thành một hàm để tái sử dụng nhiều nơi
      // đầu vào, tên bảng, các trường dữ liệu gửi lên, id , người thực hiện (tùy vào xem bảng đấy có update by ko)
      // đầu ra một câu sql hoàn chỉnh về update tương tự có thể dùng cho delete create
      const updates = [];
      const values = [];

      for (const field of allowedFields) {
        if (data[field] !== undefined) {
          updates.push(`${field} = ?`);
          values.push(data[field]);
        }
      }

      if (updates.length === 0) {
        return false; // không có gì để update
      }

      values.push(id); // id cho WHERE

      const query = `
    UPDATE users
    SET ${updates.join(', ')}, updated_at = NOW()
    WHERE id = ?
  `;

      const [result] = await db.execute(query, values);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
  // Tìm email
  static async findByEmail(email) {
    try {
      const query = `SELECT * FROM users WHERE email = ? LIMIT 1`;
      const [rows] = await db.execute(query, [email]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async deleteUser(id) {
    try {
      const query = `
    UPDATE users 
    SET deleted_at = NOW() 
    WHERE id = ? AND deleted_at IS NULL
  `;
      const [result] = await db.execute(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

export default userModel;
