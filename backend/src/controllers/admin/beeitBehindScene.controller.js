// controllers/admin/beeitBehindScene.controller.js

import asyncWrapper from '../../middlewares/error.handler.js';
import { beeitBehindSceneService } from '../../services/admin/index.js';
import { utils } from '../../utils/index.js';
import BeeitBehindSceneSchema from '../../validation/admin/beeitBehindScene.validation.js';
import {
  PaginationSchema,
  params,
} from '../../validation/common/common.schema.js';

const beeitBehindSceneController = {
  // Lấy tất cả photos
  getPhotos: asyncWrapper(async (req, res) => {
    const query = PaginationSchema.cast(req.query);
    const valid = await PaginationSchema.validate(query, {
      stripUnknown: true,
    });

    const { status } = req.query;
    const photos = await beeitBehindSceneService.getAllPhotos({
      ...valid,
      filters: { status },
    });
    utils.success(res, 'Lấy danh sách Photos thành công', photos);
  }),

  // Lấy photo theo ID
  getPhotoById: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;

    const photo = await beeitBehindSceneService.getPhotoById(id);
    utils.success(res, 'Lấy thông tin Photo thành công', { photo });
  }),

  // Tạo photo mới
  createPhoto: asyncWrapper(async (req, res) => {
    const valid = await BeeitBehindSceneSchema.create.validate(req.body, {
      stripUnknown: true,
      abortEarly: false,
    });

    const result = await beeitBehindSceneService.createPhoto(valid);
    utils.success(res, 'Tạo Photo thành công', { photo: result });
  }),

  // Cập nhật photo
  updatePhoto: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;

    const valid = await BeeitBehindSceneSchema.update.validate(req.body, {
      stripUnknown: true,
      abortEarly: false,
    });

    await beeitBehindSceneService.updatePhoto(id, valid);
    const photo = await beeitBehindSceneService.getPhotoById(id);
    utils.success(res, 'Cập nhật Photo thành công', { photo });
  }),

  // Xóa photo
  deletePhoto: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;

    await beeitBehindSceneService.deletePhoto(id);
    utils.success(res, 'Xóa Photo thành công');
  }),

  // Cập nhật display order
  updateDisplayOrder: asyncWrapper(async (req, res) => {
    const valid = await BeeitBehindSceneSchema.updateOrder.validate(req.body, {
      stripUnknown: true,
      abortEarly: false,
    });

    await beeitBehindSceneService.updateDisplayOrder(valid.photos);
    utils.success(res, 'Cập nhật thứ tự Photos thành công');
  }),
};

export default beeitBehindSceneController;

