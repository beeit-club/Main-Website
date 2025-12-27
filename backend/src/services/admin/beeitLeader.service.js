// services/admin/beeitLeader.service.js

import { code, message } from '../../common/message/index.js';
import ServiceError from '../../error/service.error.js';
import { BeeitLeaderModel } from '../../models/admin/index.js';
import { revalidateBeeit } from '../../utils/revalidateCache.js';

const beeitLeaderService = {
  // Lấy tất cả leaders
  getAllLeaders: async (options) => {
    try {
      return await BeeitLeaderModel.getAllLeaders(options);
    } catch (error) {
      throw error;
    }
  },

  // Lấy leader theo ID
  getLeaderById: async (id) => {
    const leader = await BeeitLeaderModel.getLeaderById(id);
    if (!leader) {
      throw new ServiceError(
        'Leader không tồn tại',
        'LEADER_NOT_FOUND',
        'Không tìm thấy Leader với ID này',
        404,
      );
    }
    return leader;
  },

  // Tạo leader mới
  createLeader: async (leaderData) => {
    const result = await BeeitLeaderModel.createLeader(leaderData);
    
    // Revalidate cache ngay lập tức
    revalidateBeeit().catch(err => {
      console.error('Error revalidating BeeIT cache after Leader create:', err);
    });

    return result;
  },

  // Cập nhật leader
  updateLeader: async (id, leaderData) => {
    await beeitLeaderService.getLeaderById(id); // Check existence
    const result = await BeeitLeaderModel.updateLeader(id, leaderData);
    
    // Revalidate cache ngay lập tức
    revalidateBeeit().catch(err => {
      console.error('Error revalidating BeeIT cache after Leader update:', err);
    });

    return result;
  },

  // Xóa leader (soft delete)
  deleteLeader: async (id) => {
    await beeitLeaderService.getLeaderById(id); // Check existence
    const result = await BeeitLeaderModel.deleteLeader(id);
    
    // Revalidate cache ngay lập tức
    revalidateBeeit().catch(err => {
      console.error('Error revalidating BeeIT cache after Leader delete:', err);
    });

    return result;
  },

  // Cập nhật display order
  updateDisplayOrder: async (leaders) => {
    if (!Array.isArray(leaders) || leaders.length === 0) {
      throw new ServiceError(
        'Dữ liệu không hợp lệ',
        'INVALID_DATA',
        'Leaders phải là một mảng',
        400,
      );
    }

    return await BeeitLeaderModel.updateDisplayOrder(leaders);
  },
};

export default beeitLeaderService;

