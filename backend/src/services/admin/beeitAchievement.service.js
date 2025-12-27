// services/admin/beeitAchievement.service.js

import { code, message } from '../../common/message/index.js';
import ServiceError from '../../error/service.error.js';
import { BeeitAchievementModel } from '../../models/admin/index.js';
import { revalidateBeeit } from '../../utils/revalidateCache.js';

const beeitAchievementService = {
  // Lấy tất cả achievements
  getAllAchievements: async (options) => {
    try {
      console.log(
        '🔄 [ACHIEVEMENT SERVICE] Calling Model.getAllAchievements...',
      );
      console.log(
        '📋 [ACHIEVEMENT SERVICE] Options:',
        JSON.stringify(options, null, 2),
      );

      const result = await BeeitAchievementModel.getAllAchievements(options);

      console.log('✅ [ACHIEVEMENT SERVICE] Model returned:');
      console.log('  📊 Data count:', result?.data?.length || 0);
      console.log('  📄 Pagination:', result?.pagination || 'null');

      return result;
    } catch (error) {
      console.error('❌ [ACHIEVEMENT SERVICE] Error:', error.message);
      console.error('❌ [ACHIEVEMENT SERVICE] Stack:', error.stack);
      throw error;
    }
  },

  // Lấy achievement theo ID
  getAchievementById: async (id) => {
    const achievement = await BeeitAchievementModel.getAchievementById(id);
    if (!achievement) {
      throw new ServiceError(
        'Achievement không tồn tại',
        'ACHIEVEMENT_NOT_FOUND',
        'Không tìm thấy Achievement với ID này',
        404,
      );
    }
    return achievement;
  },

  // Tạo achievement mới
  createAchievement: async (achievementData) => {
    const result = await BeeitAchievementModel.createAchievement(
      achievementData,
    );

    // Revalidate cache ngay lập tức
    revalidateBeeit().catch((err) => {
      console.error(
        'Error revalidating BeeIT cache after Achievement create:',
        err,
      );
    });

    return result;
  },

  // Cập nhật achievement
  updateAchievement: async (id, achievementData) => {
    await beeitAchievementService.getAchievementById(id); // Check existence
    const result = await BeeitAchievementModel.updateAchievement(
      id,
      achievementData,
    );

    // Revalidate cache ngay lập tức
    revalidateBeeit().catch((err) => {
      console.error(
        'Error revalidating BeeIT cache after Achievement update:',
        err,
      );
    });

    return result;
  },

  // Xóa achievement (soft delete)
  deleteAchievement: async (id) => {
    await beeitAchievementService.getAchievementById(id); // Check existence
    const result = await BeeitAchievementModel.deleteAchievement(id);

    // Revalidate cache ngay lập tức
    revalidateBeeit().catch((err) => {
      console.error(
        'Error revalidating BeeIT cache after Achievement delete:',
        err,
      );
    });

    return result;
  },

  // Cập nhật display order
  updateDisplayOrder: async (achievements) => {
    if (!Array.isArray(achievements) || achievements.length === 0) {
      throw new ServiceError(
        'Dữ liệu không hợp lệ',
        'INVALID_DATA',
        'Achievements phải là một mảng',
        400,
      );
    }

    const result = await BeeitAchievementModel.updateDisplayOrder(achievements);

    // Revalidate cache ngay lập tức
    revalidateBeeit().catch((err) => {
      console.error(
        'Error revalidating BeeIT cache after Achievement order update:',
        err,
      );
    });

    return result;
  },
};

export default beeitAchievementService;
