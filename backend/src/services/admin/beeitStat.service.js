// services/admin/beeitStat.service.js

import { code, message } from '../../common/message/index.js';
import ServiceError from '../../error/service.error.js';
import { BeeitStatModel } from '../../models/admin/index.js';
import { revalidateBeeit } from '../../utils/revalidateCache.js';

const beeitStatService = {
  // Lấy tất cả stats
  getAllStats: async (options) => {
    try {
      return await BeeitStatModel.getAllStats(options);
    } catch (error) {
      throw error;
    }
  },

  // Lấy stat theo ID
  getStatById: async (id) => {
    const stat = await BeeitStatModel.getStatById(id);
    if (!stat) {
      throw new ServiceError(
        'Stat không tồn tại',
        'STAT_NOT_FOUND',
        'Không tìm thấy Stat với ID này',
        404,
      );
    }
    return stat;
  },

  // Lấy stat theo key
  getStatByKey: async (statKey) => {
    const stat = await BeeitStatModel.getStatByKey(statKey);
    if (!stat) {
      throw new ServiceError(
        'Stat không tồn tại',
        'STAT_NOT_FOUND',
        `Không tìm thấy Stat với key: ${statKey}`,
        404,
      );
    }
    return stat;
  },

  // Tạo stat mới
  createStat: async (statData) => {
    // Kiểm tra stat_key đã tồn tại chưa
    const existing = await BeeitStatModel.getStatByKey(statData.stat_key);
    if (existing) {
      throw new ServiceError(
        'Stat key đã tồn tại',
        'STAT_KEY_EXISTS',
        `Stat key "${statData.stat_key}" đã được sử dụng`,
        409,
      );
    }

    const result = await BeeitStatModel.createStat(statData);
    
    // Revalidate cache ngay lập tức
    revalidateBeeit().catch(err => {
      console.error('Error revalidating BeeIT cache after Stat create:', err);
    });

    return result;
  },

  // Cập nhật stat
  updateStat: async (id, statData) => {
    await beeitStatService.getStatById(id); // Check existence

    // Nếu có thay đổi stat_key, kiểm tra trùng
    if (statData.stat_key) {
      const existing = await BeeitStatModel.getStatByKey(statData.stat_key);
      if (existing && existing.id !== parseInt(id)) {
        throw new ServiceError(
          'Stat key đã tồn tại',
          'STAT_KEY_EXISTS',
          `Stat key "${statData.stat_key}" đã được sử dụng bởi stat khác`,
          409,
        );
      }
    }

    const result = await BeeitStatModel.updateStat(id, statData);
    
    // Revalidate cache ngay lập tức
    revalidateBeeit().catch(err => {
      console.error('Error revalidating BeeIT cache after Stat update:', err);
    });

    return result;
  },

  // Cập nhật stat theo key
  updateStatByKey: async (statKey, statData) => {
    const stat = await beeitStatService.getStatByKey(statKey);
    return await BeeitStatModel.updateStat(stat.id, statData);
  },

  // Xóa stat (soft delete)
  deleteStat: async (id) => {
    await beeitStatService.getStatById(id); // Check existence
    const result = await BeeitStatModel.deleteStat(id);
    
    // Revalidate cache ngay lập tức
    revalidateBeeit().catch(err => {
      console.error('Error revalidating BeeIT cache after Stat delete:', err);
    });

    return result;
  },
};

export default beeitStatService;

