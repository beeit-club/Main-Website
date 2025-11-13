import { code, message } from '../../common/message/index.js';
import ServiceError from '../../error/service.error.js';
import { tagModel } from '../../models/admin/index.js'; // Giả sử bạn có file index export model

const tagService = {
  // lấy toàn bộ
  getAllTag: async (option) => {
    try {
      const tags = await tagModel.getAllTag(option);
      return tags;
    } catch (error) {
      throw error;
    }
  },
  getTagsDelete: async (option) => {
    try {
      const tags = await tagModel.getTagsDelete(option);
      return tags;
    } catch (error) {
      throw error;
    }
  },
  //   lấy 1
  getOneTag: async (id) => {
    try {
      const tag = await tagModel.getOneTag(id);
      if (!tag) {
        throw new ServiceError(
          message.Tag.TAG_NOT_FOUND, // Bạn cần định nghĩa message này
          code.Tag.TAG_NOT_FOUND_CODE, // và code này
          'Thẻ không tồn tại',
          404,
        );
      }
      return tag;
    } catch (error) {
      throw error;
    }
  },
  // thêm
  createTag: async (tagData) => {
    try {
      // check xem đã có thẻ này chưa
      const isCheck = await tagModel.checkIsTag(tagData?.slug);
      if (isCheck) {
        throw new ServiceError(
          message.Tag.TAG_EXISTS, // Bạn cần định nghĩa message này
          code.Tag.TAG_EXISTS_CODE, // và code này
          'Thẻ đã tồn tại',
          409,
        );
      }
      // thêm thẻ
      const tag = await tagModel.createTag(tagData);
      return tag;
    } catch (error) {
      throw error;
    }
  },
  // update
  updateTag: async (id, tagData) => {
    try {
      // check xem thẻ có tồn tại không
      const existingTag = await tagModel.getOneTag(id);
      if (!existingTag) {
        throw new ServiceError(
          'Not Found',
          'TAG_NOT_FOUND',
          'Thẻ không tồn tại',
          404,
        );
      }

      // check slug mới (nếu có) đã tồn tại chưa
      if (tagData.slug) {
        const isCheck = await tagModel.checkIsTag(tagData.slug);
        // Nếu slug đã tồn tại và không phải là của chính tag đang update
        if (isCheck && isCheck.slug !== existingTag.slug) {
          throw new ServiceError(
            'Conflict',
            'TAG_EXISTS',
            'Thẻ đã tồn tại',
            409,
          );
        }
      }
      // cập nhật thẻ
      const tag = await tagModel.updateTag(id, tagData);
      return tag;
    } catch (error) {
      throw error;
    }
  },
  // xóa mềm
  deleteTag: async (id) => {
    try {
      const tag = await tagModel.deleteTag(id);
      return tag;
    } catch (error) {
      throw error;
    }
  },
  // khôi phục
  restoreTag: async (id) => {
    try {
      const tag = await tagModel.restoreTag(id);
      return tag;
    } catch (error) {
      throw error;
    }
  },

  // Xoá vĩnh viễn
  permanentDeleteTag: async (id) => {
    return await tagModel.permanentDeleteTag(id);
  },
};
export default tagService;
