import { code, message } from '../../common/message/index.js';
import ServiceError from '../../error/service.error.js';
import memoryFlowModel from '../../models/admin/memoryFlow.model.js';

const memoryFlowService = {
  // Lấy tất cả items
  getAllItems: async (options) => {
    try {
      const items = await memoryFlowModel.getAllItems(options);
      return items;
    } catch (error) {
      throw error;
    }
  },

  // Lấy active items (cho client)
  getActiveItems: async (limit = null) => {
    try {
      const items = await memoryFlowModel.getActiveItems(limit);
      return items;
    } catch (error) {
      throw error;
    }
  },

  // Lấy 1 item theo ID
  getItemById: async (id) => {
    try {
      const item = await memoryFlowModel.getItemById(id);
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

  // Tạo mới item
  createItem: async (data) => {
    try {
      // Nếu không có display_order, set = max + 1
      if (!data.display_order) {
        const allItems = await memoryFlowModel.getAllItems({ limit: 1000 });
        const maxOrder = allItems.data?.length > 0
          ? Math.max(...allItems.data.map((item) => item.display_order || 0))
          : 0;
        data.display_order = maxOrder + 1;
      }

      const result = await memoryFlowModel.createItem(data);
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật item
  updateItem: async (id, data) => {
    try {
      // Kiểm tra item có tồn tại không
      await memoryFlowService.getItemById(id);

      const result = await memoryFlowModel.updateItem(id, data);
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Xóa item (soft delete)
  deleteItem: async (id) => {
    try {
      await memoryFlowService.getItemById(id);
      const result = await memoryFlowModel.deleteItem(id);
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Xóa vĩnh viễn
  permanentDeleteItem: async (id) => {
    try {
      await memoryFlowService.getItemById(id);
      const result = await memoryFlowModel.permanentDeleteItem(id);
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Khôi phục item
  restoreItem: async (id) => {
    try {
      const result = await memoryFlowModel.restoreItem(id);
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật display_order
  updateOrder: async (id, displayOrder) => {
    try {
      await memoryFlowService.getItemById(id);
      const result = await memoryFlowModel.updateOrder(id, displayOrder);
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Toggle is_active
  toggleActive: async (id, isActive) => {
    try {
      await memoryFlowService.getItemById(id);
      const result = await memoryFlowModel.toggleActive(id, isActive);
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Lấy items đã xóa
  getDeletedItems: async (options) => {
    try {
      const items = await memoryFlowModel.getDeletedItems(options);
      return items;
    } catch (error) {
      throw error;
    }
  },
};

export default memoryFlowService;

