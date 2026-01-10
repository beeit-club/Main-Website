import { message, code } from '../../common/message/index.js'; // Import từ file index tập trung
import ServiceError from '../../error/service.error.js';
import DocumentCategoryModel from '../../models/admin/document_category.model.js';

const documentCategoryService = {
  async getAll(options) {
    try {
      return DocumentCategoryModel.getAll(options);
    } catch (error) {
      throw error;
    }
  },

  async getOne(id) {
    try {
      const category = await DocumentCategoryModel.getOne(id);
      if (!category) {
        throw new ServiceError(
          message.DOCCA.DOC_CATEGORY_NOT_FOUND,
          code.DOCCA.DOC_CATEGORY_NOT_FOUND_CODE,
          404,
        );
      }
      return category;
    } catch (error) {
      throw error;
    }
  },

  async create(data) {
    try {
      const existingSlug = await DocumentCategoryModel.checkBySlug(data.slug);
      if (existingSlug) {
        throw new ServiceError(
          message.DOCCA.DOC_CATEGORY_EXISTS,
          code.DOCCA.DOC_CATEGORY_EXISTS_CODE,
          409,
        );
      }
      return DocumentCategoryModel.create(data);
    } catch (error) {
      throw error;
    }
  },

  async update(id, data) {
    try {
      const category = await this.getOne(id);

      if (data.slug) {
        const existingSlug = await DocumentCategoryModel.checkBySlug(data.slug);
        if (existingSlug && existingSlug.slug !== category.slug) {
          throw new ServiceError(
            message.DOCCA.DOC_CATEGORY_EXISTS,
            code.DOCCA.DOC_CATEGORY_EXISTS_CODE,
            409,
          );
        }
      }

      return DocumentCategoryModel.update(id, data);
    } catch (error) {
      throw error;
    }
  },

  async softDelete(id) {
    try {
      await this.getOne(id);
      return DocumentCategoryModel.softDelete(id);
    } catch (error) {
      throw error;
    }
  },

  async restore(id) {
    try {
      return DocumentCategoryModel.restore(id);
    } catch (error) {
      throw error;
    }
  },
};
export default documentCategoryService;
