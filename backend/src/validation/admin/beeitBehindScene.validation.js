// validation/admin/beeitBehindScene.validation.js

import * as yup from 'yup';

const BeeitBehindSceneSchema = {
  // Tạo Photo
  create: yup.object({
    image_url: yup
      .string()
      .trim()
      .required('URL ảnh là bắt buộc')
      .url('URL ảnh không hợp lệ')
      .max(500),
    alt_text: yup.string().trim().max(200).optional(),
    display_order: yup.number().integer().min(0).default(0),
    status: yup
      .string()
      .oneOf(['active', 'inactive'], 'Status không hợp lệ')
      .default('active'),
  }),

  // Cập nhật Photo
  update: yup.object({
    image_url: yup
      .string()
      .trim()
      .url('URL ảnh không hợp lệ')
      .max(500)
      .optional(),
    alt_text: yup.string().trim().max(200).optional(),
    display_order: yup.number().integer().min(0).optional(),
    status: yup
      .string()
      .oneOf(['active', 'inactive'], 'Status không hợp lệ')
      .optional(),
  }),

  // Cập nhật display order
  updateOrder: yup.object({
    photos: yup
      .array()
      .of(
        yup.object({
          id: yup.number().integer().required(),
          display_order: yup.number().integer().min(0).required(),
        }),
      )
      .required(),
  }),
};

export default BeeitBehindSceneSchema;

