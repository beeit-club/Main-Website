import { code, message } from '../../common/message/index.js';
import ServiceError from '../../error/service.error.js';
import roleModel from '../../models/admin/role.model.js';

const roleService = {
  /**
   * Lấy danh sách tất cả roles
   */
  getAllRoles: async (option) => {
    try {
      const result = await roleModel.getAllRoles(option);
      return result;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Lấy thông tin chi tiết role theo ID
   */
  getRoleById: async (id) => {
    try {
      if (!id) {
        throw new ServiceError(
          message.Role?.INVALID_ID || 'ID không hợp lệ',
          code.Role?.INVALID_ID_CODE || 'INVALID_ID',
          'Thiếu ID để tìm kiếm',
          400,
        );
      }

      const role = await roleModel.getRoleById(id);

      if (!role) {
        throw new ServiceError(
          message.Role?.ROLE_NOT_FOUND || 'Không tìm thấy vai trò',
          code.Role?.ROLE_NOT_FOUND_CODE || 'ROLE_NOT_FOUND',
          'Vai trò không tồn tại trong hệ thống',
          404,
        );
      }

      return role;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Tạo role mới
   */
  createRole: async (data) => {
    try {
      const { name, description } = data;

      // Kiểm tra name đã tồn tại chưa
      const nameExists = await roleModel.nameExists(name);
      if (nameExists) {
        throw new ServiceError(
          message.Role?.NAME_EXISTS || 'Tên vai trò đã tồn tại',
          code.Role?.NAME_EXISTS_CODE || 'NAME_EXISTS',
          'Tên vai trò này đã được sử dụng',
          400,
        );
      }

      const newRole = await roleModel.createRole({ name, description });
      return newRole;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Cập nhật role
   */
  updateRole: async (id, data) => {
    try {
      // Kiểm tra role tồn tại
      const role = await roleModel.getRoleById(id);
      if (!role) {
        throw new ServiceError(
          message.Role?.ROLE_NOT_FOUND || 'Không tìm thấy vai trò',
          code.Role?.ROLE_NOT_FOUND_CODE || 'ROLE_NOT_FOUND',
          'Không tìm thấy vai trò để cập nhật',
          404,
        );
      }

      // Không cho phép sửa Super Admin role (id = 1)
      if (id === 1) {
        throw new ServiceError(
          'Không thể chỉnh sửa vai trò Super Admin',
          'CANNOT_EDIT_SUPER_ADMIN',
          'Vai trò Super Admin không thể chỉnh sửa',
          400,
        );
      }

      // Kiểm tra name trùng lặp (nếu có update name)
      if (data.name && data.name !== role.name) {
        const nameExists = await roleModel.nameExists(data.name, id);
        if (nameExists) {
          throw new ServiceError(
            message.Role?.NAME_EXISTS || 'Tên vai trò đã tồn tại',
            code.Role?.NAME_EXISTS_CODE || 'NAME_EXISTS',
            'Tên vai trò đã được sử dụng bởi vai trò khác',
            400,
          );
        }
      }

      // Thực hiện update
      const success = await roleModel.updateRole(id, data);
      if (!success) {
        throw new ServiceError(
          message.Role?.NO_UPDATE || 'Không có dữ liệu để cập nhật',
          code.Role?.NO_UPDATE_CODE || 'NO_UPDATE',
          'Không có dữ liệu để cập nhật',
          400,
        );
      }

      // Lấy lại thông tin role sau khi update
      const updatedRole = await roleModel.getRoleById(id);
      return updatedRole;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Xóa role
   */
  deleteRole: async (id) => {
    try {
      // Kiểm tra role tồn tại
      const role = await roleModel.getRoleById(id);
      if (!role) {
        throw new ServiceError(
          message.Role?.ROLE_NOT_FOUND || 'Không tìm thấy vai trò',
          code.Role?.ROLE_NOT_FOUND_CODE || 'ROLE_NOT_FOUND',
          'Vai trò không tồn tại',
          404,
        );
      }

      // Thực hiện xóa
      await roleModel.deleteRole(id);
      return true;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Gán role cho user
   */
  assignRole: async (userId, roleId) => {
    try {
      // Kiểm tra role tồn tại
      const role = await roleModel.getRoleById(roleId);
      if (!role) {
        throw new ServiceError(
          message.Role?.ROLE_NOT_FOUND || 'Không tìm thấy vai trò',
          code.Role?.ROLE_NOT_FOUND_CODE || 'ROLE_NOT_FOUND',
          'Vai trò không tồn tại',
          404,
        );
      }

      // Cập nhật role_id cho user
      const { update } = await import('../../utils/database.js');
      const affected = await update(
        'users',
        { role_id: roleId },
        { id: userId },
      );

      if (affected === 0) {
        throw new ServiceError(
          'Không tìm thấy người dùng',
          'USER_NOT_FOUND',
          'Người dùng không tồn tại',
          404,
        );
      }

      return true;
    } catch (error) {
      throw error;
    }
  },
};

export default roleService;
