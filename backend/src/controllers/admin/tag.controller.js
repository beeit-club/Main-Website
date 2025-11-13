import asyncWrapper from '../../middlewares/error.handler.js';
import tagService from '../../services/admin/tag.service.js';
import { slugify } from '../../utils/function.js';
import { utils } from '../../utils/index.js';
import TagSchema from '../../validation/admin/tag.validation.js';
import {
  PaginationSchema,
  params,
} from '../../validation/common/common.schema.js';

const tagController = {
  // lấy toàn bộ
  getTags: asyncWrapper(async (req, res) => {
    const query = PaginationSchema.cast(req.query);
    const valid = await PaginationSchema.validate(query, {
      stripUnknown: true,
    });
    const { name } = req.query;
    const tags = await tagService.getAllTag({
      ...valid,
      filters: { name },
    });
    utils.success(res, 'Lấy danh sách thẻ thành công', tags);
  }),
  getTagsDelete: asyncWrapper(async (req, res) => {
    const query = PaginationSchema.cast(req.query);
    const valid = await PaginationSchema.validate(query, {
      stripUnknown: true,
    });
    const { name } = req.query;
    const tags = await tagService.getTagsDelete({
      ...valid,
      filters: { name },
    });
    utils.success(res, 'Lấy danh sách thẻ thành công', tags);
  }),
  //   lấy 1
  getTagById: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;
    const tag = await tagService.getOneTag(id);
    utils.success(res, 'Lấy thông tin thẻ thành công', { tag });
  }),
  //   thêm
  createTag: asyncWrapper(async (req, res) => {
    await TagSchema.create.validate(req.body, { abortEarly: false });
    const { name, meta_description } = req.body;
    const slug = slugify(name);
    const user = req.user;
    console.log('🚀 ~ user:', user);
    const { id } = user;
    const tagData = {
      name,
      slug,
      meta_description,
      created_by: id, // Sẽ cập nhật sau
      updated_by: null,
    };
    const tag = await tagService.createTag(tagData);
    utils.success(res, 'Thêm thẻ thành công', {
      id: tag.insertId,
      name,
      slug,
    });
  }),
  // cập nhật
  updateTag: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    await TagSchema.update.validate(req.body, { abortEarly: false });
    const { id } = req.params;
    const { name, meta_description } = req.body;
    const user = req.user;
    const { id: userID } = user;
    const tagData = {};
    if (name) {
      tagData.name = name;
      tagData.slug = slugify(name);
    }
    if (meta_description) {
      tagData.meta_description = meta_description;
    }
    tagData.updated_by = userID;

    await tagService.updateTag(id, tagData);
    utils.success(res, 'Cập nhật thẻ thành công');
  }),
  // xóa mềm
  deleteTag: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;
    await tagService.deleteTag(id);
    utils.success(res, 'Xóa mềm thẻ thành công');
  }),
  // khôi phục
  restoreTag: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;
    await tagService.restoreTag(id);
    utils.success(res, 'Khôi phục thẻ thành công');
  }),
  // xóa vĩnh viễn
  permanentDeleteTag: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;
    await tagService.permanentDeleteTag(id);
    utils.success(res, 'Xóa vĩnh viễn thẻ thành công');
  }),
};
export default tagController;
