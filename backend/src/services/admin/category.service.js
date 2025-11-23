import { code, message } from '../../common/message/index.js';
import ServiceError from '../../error/service.error.js';
import { categoryModel } from '../../models/admin/index.js';

const categoryService = {
  // lấy toàn bộ
  getAllCategory: async (option) => {
    try {
      const categories = await categoryModel.getAllCategory(option);
      return categories;
    } catch (error) {
      throw error;
    }
  },
  getCategoriesDelete: async (option) => {
    try {
      const categories = await categoryModel.getCategoriesDelete(option);
      return categories;
    } catch (error) {
      throw error;
    }
  },
  //   lấy 1
  getOneCategory: async (id) => {
    try {
      const category = await categoryModel.getOneCategory(id);
      return category;
    } catch (error) {
      throw error;
    }
  },
  // thêm
  createCategory: async (cate) => {
    try {
      // /check xem đã có danh mục này chưa
      const ischeck = await categoryModel.checkIsCategory(cate?.slug);
      if (ischeck) {
        throw new ServiceError(
          message.Cate.CATEGORY_EXISTS,
          code.Cate.CATEGORY_EXISTS_CODE,
          'Danh mục đã tồn tại',
          409,
        );
      }
      // thêm danh mục
      const category = await categoryModel.createCategory(cate);
      return category;
    } catch (error) {
      throw error;
    }
  },
  // update
  updateCategory: async (id, cate) => {
    try {
      // /check xem đã có danh mục này chưa
      const ischeck = await categoryModel.checkIsCategory(cate?.slug);
      if (ischeck) {
        throw new ServiceError(
          message.Cate.CATEGORY_EXISTS,
          code.Cate.CATEGORY_EXISTS_CODE,
          'Danh mục đã tồn tại',
          409,
        );
      }
      // thêm danh mục
      const category = await categoryModel.updateCategory(id, cate);
      return category;
    } catch (error) {
      throw error;
    }
  },
  // xóa mềm
  deleteCategory: async (id) => {
    try {
      const category = await categoryModel.deleteCategory(id);
      return category;
    } catch (error) {
      throw error;
    }
  },
  // khôi phục
  restoreCategory: async (id) => {
    try {
      const category = await categoryModel.restoreCategory(id);
      return category;
    } catch (error) {
      throw error;
    }
  },
  permanentDeleteCategory: async (id) => {
    try {
      const category = await categoryModel.permanentDeleteCategory(id);
      return category;
    } catch (error) {
      throw error;
    }
  },
};
export default categoryService;
