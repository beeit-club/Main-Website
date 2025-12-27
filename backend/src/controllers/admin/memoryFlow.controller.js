import asyncWrapper from '../../middlewares/error.handler.js';
import memoryFlowService from '../../services/admin/memoryFlow.service.js';
import { utils } from '../../utils/index.js';
import { MemoryFlowSchema } from '../../validation/admin/memoryFlow.validation.js';
import {
  PaginationSchema,
  params,
} from '../../validation/common/common.schema.js';
import { sanitizeText } from '../../utils/sanitize.js';
import { revalidateLanding } from '../../utils/revalidateCache.js';

const memoryFlowController = {
  // Lấy tất cả items
  getItems: asyncWrapper(async (req, res) => {
    const query = PaginationSchema.cast(req.query);
    const valid = await PaginationSchema.validate(query, {
      stripUnknown: true,
    });
    const { search, is_active } = req.query;

    const items = await memoryFlowService.getAllItems({
      ...valid,
      filters: { search, is_active },
    });

    utils.success(res, 'Lấy danh sách Memory Flow thành công', items);
  }),

  // Lấy 1 item theo ID
  getItemById: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;

    const item = await memoryFlowService.getItemById(id);
    utils.success(res, 'Lấy Memory Flow item thành công', item);
  }),

  // Tạo mới item
  createItem: asyncWrapper(async (req, res) => {
    await MemoryFlowSchema.create.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const { title, caption, image_url, display_order, is_active } = req.body;
    const user = req.user;

    const data = {
      title: sanitizeText(title),
      caption: sanitizeText(caption),
      image_url: image_url.trim(),
      display_order: display_order || null,
      is_active: is_active ?? 1,
      created_by: user.id,
    };

    const result = await memoryFlowService.createItem(data);

    // Revalidate cache
    await revalidateLanding();

    utils.success(res, 'Tạo Memory Flow item thành công', {
      id: result.insertId,
    });
  }),

  // Cập nhật item
  updateItem: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    await MemoryFlowSchema.update.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const { id } = req.params;
    const { title, caption, image_url, display_order, is_active } = req.body;
    const user = req.user;

    const data = {};
    if (title !== undefined) data.title = sanitizeText(title);
    if (caption !== undefined) data.caption = sanitizeText(caption);
    if (image_url !== undefined) data.image_url = image_url.trim();
    if (display_order !== undefined) data.display_order = display_order;
    if (is_active !== undefined) data.is_active = is_active;
    data.updated_by = user.id;

    await memoryFlowService.updateItem(id, data);

    // Revalidate cache
    await revalidateLanding();

    utils.success(res, 'Cập nhật Memory Flow item thành công');
  }),

  // Xóa item (soft delete)
  deleteItem: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;

    await memoryFlowService.deleteItem(id);

    // Revalidate cache
    await revalidateLanding();

    utils.success(res, 'Xóa Memory Flow item thành công');
  }),

  // Xóa vĩnh viễn
  permanentDeleteItem: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;

    await memoryFlowService.permanentDeleteItem(id);

    // Revalidate cache
    await revalidateLanding();

    utils.success(res, 'Xóa vĩnh viễn Memory Flow item thành công');
  }),

  // Khôi phục item
  restoreItem: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;

    await memoryFlowService.restoreItem(id);

    // Revalidate cache
    await revalidateLanding();

    utils.success(res, 'Khôi phục Memory Flow item thành công');
  }),

  // Cập nhật display_order
  updateOrder: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    await MemoryFlowSchema.reorder.validate(req.body, {
      abortEarly: false,
    });

    const { id } = req.params;
    const { display_order } = req.body;

    await memoryFlowService.updateOrder(id, display_order);

    // Revalidate cache
    await revalidateLanding();

    utils.success(res, 'Cập nhật thứ tự thành công');
  }),

  // Toggle is_active
  toggleActive: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    await MemoryFlowSchema.toggle.validate(req.body, {
      abortEarly: false,
    });

    const { id } = req.params;
    const { is_active } = req.body;

    await memoryFlowService.toggleActive(id, is_active);

    // Revalidate cache
    await revalidateLanding();

    utils.success(res, 'Cập nhật trạng thái thành công');
  }),

  // Lấy items đã xóa (trash)
  getDeletedItems: asyncWrapper(async (req, res) => {
    const query = PaginationSchema.cast(req.query);
    const valid = await PaginationSchema.validate(query, {
      stripUnknown: true,
    });

    const items = await memoryFlowService.getDeletedItems(valid);
    utils.success(res, 'Lấy danh sách Memory Flow đã xóa thành công', items);
  }),
};

export default memoryFlowController;

