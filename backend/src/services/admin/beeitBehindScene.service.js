// services/admin/beeitBehindScene.service.js

import { code, message } from '../../common/message/index.js';
import ServiceError from '../../error/service.error.js';
import { BeeitBehindSceneModel } from '../../models/admin/index.js';
import { revalidateBeeit } from '../../utils/revalidateCache.js';

const beeitBehindSceneService = {
  // Lấy tất cả photos
  getAllPhotos: async (options) => {
    try {
      console.log('🔄 [PHOTO SERVICE] Calling Model.getAllPhotos...');
      console.log(
        '📋 [PHOTO SERVICE] Options:',
        JSON.stringify(options, null, 2),
      );

      const result = await BeeitBehindSceneModel.getAllPhotos(options);

      console.log('✅ [PHOTO SERVICE] Model returned:');
      console.log('  📊 Data count:', result?.data?.length || 0);
      console.log('  📄 Pagination:', result?.pagination || 'null');

      return result;
    } catch (error) {
      console.error('❌ [PHOTO SERVICE] Error:', error.message);
      console.error('❌ [PHOTO SERVICE] Stack:', error.stack);
      throw error;
    }
  },

  // Lấy photo theo ID
  getPhotoById: async (id) => {
    const photo = await BeeitBehindSceneModel.getPhotoById(id);
    if (!photo) {
      throw new ServiceError(
        'Photo không tồn tại',
        'PHOTO_NOT_FOUND',
        'Không tìm thấy Photo với ID này',
        404,
      );
    }
    return photo;
  },

  // Tạo photo mới
  createPhoto: async (photoData) => {
    const result = await BeeitBehindSceneModel.createPhoto(photoData);

    // Revalidate cache ngay lập tức
    revalidateBeeit().catch((err) => {
      console.error('Error revalidating BeeIT cache after Photo create:', err);
    });

    return result;
  },

  // Cập nhật photo
  updatePhoto: async (id, photoData) => {
    await beeitBehindSceneService.getPhotoById(id); // Check existence
    const result = await BeeitBehindSceneModel.updatePhoto(id, photoData);

    // Revalidate cache ngay lập tức
    revalidateBeeit().catch((err) => {
      console.error('Error revalidating BeeIT cache after Photo update:', err);
    });

    return result;
  },

  // Xóa photo (soft delete)
  deletePhoto: async (id) => {
    await beeitBehindSceneService.getPhotoById(id); // Check existence
    const result = await BeeitBehindSceneModel.deletePhoto(id);

    // Revalidate cache ngay lập tức
    revalidateBeeit().catch((err) => {
      console.error('Error revalidating BeeIT cache after Photo delete:', err);
    });

    return result;
  },

  // Cập nhật display order
  updateDisplayOrder: async (photos) => {
    if (!Array.isArray(photos) || photos.length === 0) {
      throw new ServiceError(
        'Dữ liệu không hợp lệ',
        'INVALID_DATA',
        'Photos phải là một mảng',
        400,
      );
    }

    const result = await BeeitBehindSceneModel.updateDisplayOrder(photos);

    // Revalidate cache ngay lập tức
    revalidateBeeit().catch((err) => {
      console.error(
        'Error revalidating BeeIT cache after Photo order update:',
        err,
      );
    });

    return result;
  },
};

export default beeitBehindSceneService;
