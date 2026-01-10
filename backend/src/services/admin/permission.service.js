import { code, message } from '../../common/message/index.js';
import ServiceError from '../../error/service.error.js';
import permissionModel from '../../models/admin/permission.model.js';

const permissionService = {
  /**
   * Lấy danh sách tất cả permissions
   */
  getAllPermissions: async (option) => {
    try {
      const result = await permissionModel.getAllPermissions(option);
      return result;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Lấy thông tin chi tiết permission theo ID
   */
  getPermissionById: async (id) => {
    try {
      if (!id) {
        throw new ServiceError(
          message.Permission?.INVALID_ID || 'ID không hợp lệ',
          code.Permission?.INVALID_ID_CODE || 'INVALID_ID',
          'Thiếu ID để tìm kiếm',
          400,
        );
      }

      const permission = await permissionModel.getPermissionById(id);

      if (!permission) {
        throw new ServiceError(
          message.Permission?.PERMISSION_NOT_FOUND || 'Không tìm thấy quyền',
          code.Permission?.PERMISSION_NOT_FOUND_CODE || 'PERMISSION_NOT_FOUND',
          'Quyền không tồn tại trong hệ thống',
          404,
        );
      }

      return permission;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Tạo permission mới
   */
  createPermission: async (data) => {
    try {
      const { name, description, module } = data;

      // Kiểm tra name đã tồn tại chưa
      const nameExists = await permissionModel.nameExists(name);
      if (nameExists) {
        throw new ServiceError(
          message.Permission?.NAME_EXISTS || 'Tên quyền đã tồn tại',
          code.Permission?.NAME_EXISTS_CODE || 'NAME_EXISTS',
          'Tên quyền này đã được sử dụng',
          400,
        );
      }

      const newPermission = await permissionModel.createPermission({
        name,
        description,
        module,
      });
      return newPermission;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Cập nhật permission
   */
  updatePermission: async (id, data) => {
    try {
      // Kiểm tra permission tồn tại
      const permission = await permissionModel.getPermissionById(id);
      if (!permission) {
        throw new ServiceError(
          message.Permission?.PERMISSION_NOT_FOUND || 'Không tìm thấy quyền',
          code.Permission?.PERMISSION_NOT_FOUND_CODE || 'PERMISSION_NOT_FOUND',
          'Không tìm thấy quyền để cập nhật',
          404,
        );
      }

      // Kiểm tra name trùng lặp (nếu có update name)
      if (data.name && data.name !== permission.name) {
        const nameExists = await permissionModel.nameExists(data.name, id);
        if (nameExists) {
          throw new ServiceError(
            message.Permission?.NAME_EXISTS || 'Tên quyền đã tồn tại',
            code.Permission?.NAME_EXISTS_CODE || 'NAME_EXISTS',
            'Tên quyền đã được sử dụng bởi quyền khác',
            400,
          );
        }
      }

      // Thực hiện update
      const success = await permissionModel.updatePermission(id, data);
      if (!success) {
        throw new ServiceError(
          message.Permission?.NO_UPDATE || 'Không có dữ liệu để cập nhật',
          code.Permission?.NO_UPDATE_CODE || 'NO_UPDATE',
          'Không có dữ liệu để cập nhật',
          400,
        );
      }

      // Lấy lại thông tin permission sau khi update
      const updatedPermission = await permissionModel.getPermissionById(id);
      return updatedPermission;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Xóa permission
   */
  deletePermission: async (id) => {
    try {
      // Kiểm tra permission tồn tại
      const permission = await permissionModel.getPermissionById(id);
      if (!permission) {
        throw new ServiceError(
          message.Permission?.PERMISSION_NOT_FOUND || 'Không tìm thấy quyền',
          code.Permission?.PERMISSION_NOT_FOUND_CODE || 'PERMISSION_NOT_FOUND',
          'Quyền không tồn tại',
          404,
        );
      }

      // Thực hiện xóa
      await permissionModel.deletePermission(id);
      return true;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Lấy permissions của user
   */
  getUserPermissions: async (userId) => {
    try {
      const permissions = await permissionModel.getUserPermissions(userId);
      return permissions;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Gán permission cho user
   */
  grantPermission: async (userId, permissionId, grantedBy) => {
    try {
      await permissionModel.grantPermission(userId, permissionId, grantedBy);
      return true;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Thu hồi permission từ user
   */
  revokePermission: async (userId, permissionId) => {
    try {
      const success = await permissionModel.revokePermission(
        userId,
        permissionId,
      );
      if (!success) {
        throw new ServiceError(
          'Không tìm thấy quyền để thu hồi',
          'PERMISSION_NOT_FOUND',
          'Người dùng không có quyền này',
          404,
        );
      }
      return true;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Gán nhiều permissions cho user (bulk)
   */
  bulkGrantPermissions: async (userId, permissionIds, grantedBy) => {
    try {
      await permissionModel.bulkGrantPermissions(
        userId,
        permissionIds,
        grantedBy,
      );
      return true;
    } catch (error) {
      throw error;
    }
  },
};

export default permissionService;
