import asyncWrapper from '../../middlewares/error.handler.js';
import founderService from '../../services/admin/founder.service.js';
import { utils } from '../../utils/index.js';
import { FounderSchema } from '../../validation/admin/founder.validation.js';
import {
  PaginationSchema,
  params,
} from '../../validation/common/common.schema.js';
import { sanitizeText } from '../../utils/sanitize.js';
import { revalidateLanding } from '../../utils/revalidateCache.js';

const founderController = {
  // Lấy tất cả
  getAll: asyncWrapper(async (req, res) => {
    const query = PaginationSchema.cast(req.query);
    const valid = await PaginationSchema.validate(query, {
      stripUnknown: true,
    });
    const { search, is_founder, is_active } = req.query;

    const items = await founderService.getAll({
      ...valid,
      filters: { search, is_founder, is_active },
    });

    utils.success(res, 'Lấy danh sách Founders/Members thành công', items);
  }),

  // Lấy 1 item theo ID
  getItemById: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;

    const item = await founderService.getItemById(id);
    utils.success(res, 'Lấy Founder/Member thành công', item);
  }),

  // Tạo mới
  createItem: asyncWrapper(async (req, res) => {
    await FounderSchema.create.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const {
      name,
      role,
      image_url,
      bio,
      achievements,
      social_email,
      social_linkedin,
      social_github,
      display_order,
      is_active,
      is_founder,
    } = req.body;
    const user = req.user;

    // Xử lý achievements: nếu đã là string (JSON) thì giữ nguyên, nếu là array thì stringify
    let achievementsValue = null;
    if (achievements) {
      if (typeof achievements === 'string') {
        // Đã là JSON string, giữ nguyên
        achievementsValue = achievements;
      } else if (Array.isArray(achievements)) {
        // Là array, stringify
        achievementsValue = JSON.stringify(achievements);
      }
    }

    const data = {
      name: sanitizeText(name),
      role: sanitizeText(role),
      image_url: image_url ? image_url.trim() : null,
      bio: bio ? sanitizeText(bio) : null,
      achievements: achievementsValue,
      social_email: social_email ? social_email.trim() : null,
      social_linkedin: social_linkedin ? social_linkedin.trim() : null,
      social_github: social_github ? social_github.trim() : null,
      display_order: display_order || null,
      is_active: is_active ?? 1,
      is_founder: is_founder ?? 0,
      created_by: user.id,
    };

    const result = await founderService.createItem(data);

    // Revalidate cache
    await revalidateLanding();

    utils.success(res, 'Tạo Founder/Member thành công', {
      id: result.insertId,
    });
  }),

  // Cập nhật
  updateItem: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    await FounderSchema.update.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const { id } = req.params;
    const {
      name,
      role,
      image_url,
      bio,
      achievements,
      social_email,
      social_linkedin,
      social_github,
      display_order,
      is_active,
      is_founder,
    } = req.body;
    const user = req.user;

    const data = {};
    if (name !== undefined) data.name = sanitizeText(name);
    if (role !== undefined) data.role = sanitizeText(role);
    if (image_url !== undefined) data.image_url = image_url ? image_url.trim() : null;
    if (bio !== undefined) data.bio = bio ? sanitizeText(bio) : null;
    
    // Xử lý achievements: nếu đã là string (JSON) thì giữ nguyên, nếu là array thì stringify
    if (achievements !== undefined) {
      if (achievements === null) {
        data.achievements = null;
      } else if (typeof achievements === 'string') {
        // Đã là JSON string, giữ nguyên
        data.achievements = achievements;
      } else if (Array.isArray(achievements)) {
        // Là array, stringify
        data.achievements = JSON.stringify(achievements);
      } else {
        data.achievements = null;
      }
    }
    
    if (social_email !== undefined) data.social_email = social_email ? social_email.trim() : null;
    if (social_linkedin !== undefined) data.social_linkedin = social_linkedin ? social_linkedin.trim() : null;
    if (social_github !== undefined) data.social_github = social_github ? social_github.trim() : null;
    if (display_order !== undefined) data.display_order = display_order;
    if (is_active !== undefined) data.is_active = is_active;
    if (is_founder !== undefined) data.is_founder = is_founder;
    data.updated_by = user.id;

    await founderService.updateItem(id, data);

    // Revalidate cache
    await revalidateLanding();

    utils.success(res, 'Cập nhật Founder/Member thành công');
  }),

  // Xóa (soft delete)
  deleteItem: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;

    await founderService.deleteItem(id);

    // Revalidate cache
    await revalidateLanding();

    utils.success(res, 'Xóa Founder/Member thành công');
  }),

  // Xóa vĩnh viễn
  permanentDeleteItem: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;

    await founderService.permanentDeleteItem(id);

    // Revalidate cache
    await revalidateLanding();

    utils.success(res, 'Xóa vĩnh viễn Founder/Member thành công');
  }),

  // Khôi phục
  restoreItem: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;

    await founderService.restoreItem(id);

    // Revalidate cache
    await revalidateLanding();

    utils.success(res, 'Khôi phục Founder/Member thành công');
  }),

  // Cập nhật display_order
  updateOrder: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    await FounderSchema.reorder.validate(req.body, {
      abortEarly: false,
    });

    const { id } = req.params;
    const { display_order } = req.body;

    await founderService.updateOrder(id, display_order);

    // Revalidate cache
    await revalidateLanding();

    utils.success(res, 'Cập nhật thứ tự thành công');
  }),

  // Toggle is_active
  toggleActive: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    await FounderSchema.toggle.validate(req.body, {
      abortEarly: false,
    });

    const { id } = req.params;
    const { is_active } = req.body;

    await founderService.toggleActive(id, is_active);

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

    const items = await founderService.getDeletedItems(valid);
    utils.success(res, 'Lấy danh sách Founders/Members đã xóa thành công', items);
  }),
};

export default founderController;

