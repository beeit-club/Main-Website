import { code, message } from '../../common/message/index.js';
import ServiceError from '../../error/service.error.js';
import founderModel from '../../models/admin/founder.model.js';

const founderService = {
  // Lấy tất cả
  getAll: async (options) => {
    try {
      const items = await founderModel.getAll(options);
      return items;
    } catch (error) {
      throw error;
    }
  },

  // Lấy founder (cho client)
  getFounder: async () => {
    try {
      const founder = await founderModel.getFounder();
      return founder;
    } catch (error) {
      throw error;
    }
  },

  // Lấy core members (cho client)
  getCoreMembers: async () => {
    try {
      const members = await founderModel.getCoreMembers();
      return members;
    } catch (error) {
      throw error;
    }
  },

  // Lấy tất cả active (founder + members) cho client
  getAllActive: async () => {
    try {
      const data = await founderModel.getAllActive();
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy 1 item theo ID
  getItemById: async (id) => {
    try {
      const item = await founderModel.getItemById(id);
      if (!item) {
        throw new ServiceError(
          message.NOT_FOUND || 'Item không tồn tại',
          code.NOT_FOUND_CODE || 'NOT_FOUND',
          'Item không tồn tại',
          404,
        );
      }
      return item;
    } catch (error) {
      throw error;
    }
  },

  // Tạo mới
  createItem: async (data) => {
    try {
      // Nếu không có display_order, set = max + 1
      if (!data.display_order) {
        const allItems = await founderModel.getAll({ limit: 1000 });
        const maxOrder = allItems.data?.length > 0
          ? Math.max(...allItems.data.map((item) => item.display_order || 0))
          : 0;
        data.display_order = maxOrder + 1;
      }

      const result = await founderModel.createItem(data);
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật
  updateItem: async (id, data) => {
    try {
      // Kiểm tra item có tồn tại không
      await founderService.getItemById(id);

      const result = await founderModel.updateItem(id, data);
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Xóa (soft delete)
  deleteItem: async (id) => {
    try {
      await founderService.getItemById(id);
      const result = await founderModel.deleteItem(id);
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Xóa vĩnh viễn
  permanentDeleteItem: async (id) => {
    try {
      await founderService.getItemById(id);
      const result = await founderModel.permanentDeleteItem(id);
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Khôi phục
  restoreItem: async (id) => {
    try {
      const result = await founderModel.restoreItem(id);
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật display_order
  updateOrder: async (id, displayOrder) => {
    try {
      await founderService.getItemById(id);
      const result = await founderModel.updateOrder(id, displayOrder);
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Toggle is_active
  toggleActive: async (id, isActive) => {
    try {
      await founderService.getItemById(id);
      const result = await founderModel.toggleActive(id, isActive);
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Lấy items đã xóa
  getDeletedItems: async (options) => {
    try {
      const items = await founderModel.getDeletedItems(options);
      return items;
    } catch (error) {
      throw error;
    }
  },
};

export default founderService;

