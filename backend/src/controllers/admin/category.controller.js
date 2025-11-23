import asyncWrapper from '../../middlewares/error.handler.js';
import categoryModel from '../../models/admin/category.model.js';
import categoryService from '../../services/admin/category.service.js';
import { slugify } from '../../utils/function.js';
import { utils } from '../../utils/index.js';
import CategorySchema from '../../validation/admin/category.validation.js';
import {
  PaginationSchema,
  params,
} from '../../validation/common/common.schema.js';

const categoryControler = {
  // lấy toàn bộ
  getCategories: asyncWrapper(async (req, res) => {
    // Ép apply default trước khi validate
    const query = PaginationSchema.cast(req.query);

    // Validate (nhưng sẽ không lỗi vì transform đã fallback)
    const valid = await PaginationSchema.validate(query, {
      stripUnknown: true,
    });
    const { name, status } = req.query;
    const categories = await categoryService.getAllCategory({
      ...valid,
      filters: { name, status },
    });
    utils.success(res, 'Lấy danh sách thành công', {
      categories,
    });
  }),
  getCategoriesDelete: asyncWrapper(async (req, res) => {
    // Ép apply default trước khi validate
    const query = PaginationSchema.cast(req.query);

    // Validate (nhưng sẽ không lỗi vì transform đã fallback)
    const valid = await PaginationSchema.validate(query, {
      stripUnknown: true,
    });
    const { name, status } = req.query;
    const categories = await categoryService.getCategoriesDelete({
      ...valid,
      filters: { name, status },
    });
    utils.success(res, 'Lấy danh sách thành công', {
      categories,
    });
  }),
  //   lấy 1
  getCategoryById: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;
    const category = await categoryService.getOneCategory(id);
    utils.success(res, 'Lấy Danh mục thành công', {
      category,
    });
  }),
  //   thêm
  createCategory: asyncWrapper(async (req, res) => {
    await CategorySchema.create.validate(req.body, { abortEarly: false });
    const { name, parent_id } = req.body;
    const slug = slugify(name);
    const cate = {
      name,
      slug,
      parent_id: parent_id ?? null,
    };
    const category = await categoryService.createCategory(cate);

    utils.success(res, 'Thêm danh mục thành công', {
      id: category.insertId,
      name,
      slug,
    });
  }),
  // cập nhật
  updateCategory: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    await CategorySchema.update.validate(req.body, { abortEarly: false });
    const { id } = req.params;
    const { name, parent_id } = req.body;
    const slug = slugify(name);
    const cate = {
      name,
      slug,
      parent_id: parent_id ?? null,
    };
    const category = await categoryService.updateCategory(id, cate);

    utils.success(res, 'Cập nhật danh mục thành công', {
      id: category.insertId,
      name,
      slug,
    });
  }),
  // xóa mềm
  deleteCategory: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;
    const category = await categoryService.deleteCategory(id);
    utils.success(res, 'Xóa mềm danh mục thành công', {
      id: category.insertId,
    });
  }),
  // khôi phục
  restoreCategory: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;
    const category = await categoryService.restoreCategory(id);
    utils.success(res, 'Khôi phục danh mục thành công', {
      id: category.insertId,
    });
  }),
  // xóa vĩnh viễn
  permanentDeleteCategory: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;
    await categoryService.permanentDeleteCategory(id);
    utils.success(res, 'Xóa vĩnh viễn danh mục thành công');
  }),
};
export default categoryControler;
