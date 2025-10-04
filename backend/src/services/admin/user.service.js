import { code, message } from '../../common/message/index.js';
import ServiceError from '../../error/service.error.js';
import userModel from './../../models/admin/user.model.js';
const userService = {
  getAllUser: async () => {
    try {
      const users = await userModel.getAllUsers();
      if (!users || users.length === 0) {
        throw new ServiceError(
          message.User.USER_NOT_FOUND,
          code.User.USER_NOT_FOUND_CODE,
          'Không tìm thấy người dùng nào',
          404,
        );
      }
      return users;
    } catch (error) {
      throw error;
    }
  },

  getUserById: async (user_id) => {
    try {
      if (!user_id) {
        throw new ServiceError(
          message.User.INVALID_ID,
          code.User.INVALID_ID_CODE,
          'Thiếu user_id để tìm kiếm',
          400,
        );
      }
      const user = await userModel.getUserById(user_id);
      if (!user) {
        throw new ServiceError(
          message.User.USER_NOT_FOUND, // thông báo lỗi
          code.User.USER_NOT_FOUND_CODE, // mã lỗi
          'Người dùng không tồn tại trong hệ thống',
          404, // HTTP status code
        );
      }
      return user;
    } catch (error) {
      throw error;
    }
  },

  createUser: async (data) => {
    try {
      const existing = await userModel.findByEmail(email);
      if (existing) {
        throw new ServiceError(
          message.User.EMAIL_EXISTS,
          code.User.EMAIL_EXISTS_CODE,
          'Đã có người dùng sự dụng email này',
          400,
        );
      }
      const user = await userModel.createUser(data);
      return user;
    } catch (error) {
      throw error;
    }
  },

  updateUser: async (id, data) => {
    try {
      const user = await userModel.getUserById(id);
      if (!user) {
        throw new ServiceError(
          message.User.USER_NOT_FOUND,
          code.User.USER_NOT_FOUND_CODE,
          'Không tìm thấy người dùng để cập nhật',
          404,
        );
      }

      const success = await userModel.updateUser(id, data);
      if (!success) {
        throw new ServiceError(
          message.User.NO_UPDATE,
          code.User.NO_UPDATE_CODE,
          'Không nhận được dữ liệu để cập nhật',
          400,
        );
      }

      return await userModel.getById(id);
    } catch (error) {
      throw error;
    }
  },
  deleteUser: async (id) => {
    try {
      const user = await userModel.getUserById(id);
      if (!user) {
        throw new ServiceError(
          message.User.USER_NOT_FOUND,
          code.User.USER_NOT_FOUND_CODE,
          'Người dùng không tồn tại',
          404,
        );
      }

      const success = await userModel.deleteUser(id);
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
};

export default userService;
