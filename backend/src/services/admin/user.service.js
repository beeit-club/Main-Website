import { code, message } from '../../common/message/index.js';
import ServiceError from '../../error/service.error.js';
import userModel from '../../models/admin/user.model.js';
import bcrypt from 'bcryptjs';

const userService = {
  /**
   * 📋 Lấy danh sách tất cả user (có phân trang)
   */
  getAllUser: async (option) => {
    try {
      const result = await userModel.getAllUsers(option);

      if (!result || !result.data || result.data.length === 0) {
        throw new ServiceError(
          message.User.USER_NOT_FOUND,
          code.User.USER_NOT_FOUND_CODE,
          'Không tìm thấy người dùng nào',
          404,
        );
      }

      return result;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 🔹 Lấy thông tin chi tiết user theo ID
   */
  getUserById: async (id) => {
    try {
      if (!id) {
        throw new ServiceError(
          message.User.INVALID_ID,
          code.User.INVALID_ID_CODE,
          'Thiếu ID để tìm kiếm',
          400,
        );
      }

      const user = await userModel.getUserById(id);
      console.log('🚀 ~ user:', user);

      if (!user) {
        throw new ServiceError(
          message.User.USER_NOT_FOUND,
          code.User.USER_NOT_FOUND_CODE,
          'Người dùng không tồn tại trong hệ thống',
          404,
        );
      }

      return user;
    } catch (error) {
      throw error;
    }
  },

  /**
   * ➕ Tạo user mới
   */
  createUser: async (data) => {
    try {
      const { email, fullname, phone, role_id, bio } = data;

      // Kiểm tra email đã tồn tại chưa
      const existing = await userModel.findByEmail(email);
      if (existing) {
        throw new ServiceError(
          message.User.EMAIL_EXISTS,
          code.User.EMAIL_EXISTS_CODE,
          'Email này đã được sử dụng',
          400,
        );
      }

      // Tạo user data
      const userData = {
        email,
        fullname,
        phone: phone || null,
        role_id: role_id || 2,
        bio: bio || null,
        is_active: 1,
        email_verified_at: null,
      };

      const newUser = await userModel.createUser(userData);

      return newUser;
    } catch (error) {
      throw error;
    }
  },

  /**
   * ✏️ Cập nhật thông tin user
   */
  updateUser: async (id, data) => {
    try {
      // Kiểm tra user tồn tại
      const user = await userModel.getUserById(id);
      if (!user) {
        throw new ServiceError(
          message.User.USER_NOT_FOUND,
          code.User.USER_NOT_FOUND_CODE,
          'Không tìm thấy người dùng để cập nhật',
          404,
        );
      }

      // Kiểm tra email trùng lặp (nếu có update email)
      if (data.email && data.email !== user.email) {
        const emailExists = await userModel.emailExists(data.email, id);
        if (emailExists) {
          throw new ServiceError(
            message.User.EMAIL_EXISTS,
            code.User.EMAIL_EXISTS_CODE,
            'Email đã được sử dụng bởi người dùng khác',
            400,
          );
        }
      }

      // Hash password nếu có update
      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
      }

      // Thực hiện update
      const success = await userModel.updateUser(id, data);
      if (!success) {
        throw new ServiceError(
          message.User.NO_UPDATE,
          code.User.NO_UPDATE_CODE,
          'Không có dữ liệu để cập nhật',
          400,
        );
      }

      // Lấy lại thông tin user sau khi update
      const updatedUser = await userModel.getUserById(id);
      delete updatedUser.password;

      return updatedUser;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 🗑️ Xóa mềm user
   */
  deleteUser: async (id) => {
    try {
      // Kiểm tra user tồn tại
      const user = await userModel.getUserById(id);
      if (!user) {
        throw new ServiceError(
          message.User.USER_NOT_FOUND,
          code.User.USER_NOT_FOUND_CODE,
          'Người dùng không tồn tại',
          404,
        );
      }

      // Thực hiện soft delete
      const success = await userModel.softDeleteUser(id);
      if (!success) {
        throw new ServiceError(
          message.User.DELETE_FAILURE,
          code.User.USER_DELETE_FAILED_CODE,
          'Xóa người dùng thất bại',
          500,
        );
      }

      return true;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 💀 Xóa vĩnh viễn user
   */
  hardDeleteUser: async (id) => {
    try {
      // Kiểm tra user tồn tại (có thể đã bị soft delete)
      const deleted = await userModel.hardDeleteUser(id);
      console.log('🚀 ~ deleted:', deleted);

      if (!deleted) {
        throw new ServiceError(
          message.User.USER_NOT_FOUND,
          code.User.USER_NOT_FOUND_CODE,
          'Không tìm thấy người dùng để xóa',
          404,
        );
      }

      return true;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 🔄 Kích hoạt/vô hiệu hóa user
   */
  toggleUserActive: async (id, isActive) => {
    try {
      // Kiểm tra user tồn tại
      const user = await userModel.getUserById(id);
      if (!user) {
        throw new ServiceError(
          message.User.USER_NOT_FOUND,
          code.User.USER_NOT_FOUND_CODE,
          'Người dùng không tồn tại',
          404,
        );
      }

      // Thực hiện toggle active
      const success = await userModel.toggleActive(id, isActive);
      if (!success) {
        throw new ServiceError(
          message.User.UPDATE_FAILURE,
          code.User.UPDATE_FAILURE_CODE,
          'Cập nhật trạng thái thất bại',
          500,
        );
      }

      return true;
    } catch (error) {
      throw error;
    }
  },

  /**
   * ♻️ Khôi phục user đã xóa
   */
  restoreUser: async (id) => {
    try {
      // Thực hiện restore
      const success = await userModel.restoreUser(id);

      if (!success) {
        throw new ServiceError(
          message.User.USER_NOT_FOUND_DELETED,
          code.User.USER_NOT_FOUND_DELETED_CODE,
          'Không tìm thấy người dùng đã xóa',
          404,
        );
      }

      return true;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 📋 Lấy danh sách user đã xóa
   */
  getDeletedUsers: async (option) => {
    try {
      const result = await userModel.getDeletedUsers(option);

      if (!result || !result.data || result.data.length === 0) {
        throw new ServiceError(
          message.User.NO_DELETED_USERS,
          code.User.NO_DELETED_USERS_CODE,
          'Không có người dùng nào đã bị xóa',
          404,
        );
      }

      return result;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 📊 Thống kê user
   */
  getUserStats: async () => {
    try {
      const stats = await userModel.countUserStats();

      if (!stats) {
        throw new ServiceError(
          message.User.STATS_FAILURE,
          code.User.STATS_FAILURE_CODE,
          'Không thể lấy thống kê người dùng',
          500,
        );
      }

      return stats;
    } catch (error) {
      throw error;
    }
  },
};

export default userService;
