// validation/admin/beeitAchievement.validation.js

import * as yup from 'yup';

const BeeitAchievementSchema = {
  // Tạo Achievement
  create: yup.object({
    title: yup
      .string()
      .trim()
      .required('Tiêu đề là bắt buộc')
      .max(200),
    year: yup
      .string()
      .trim()
      .required('Năm là bắt buộc')
      .max(20),
    description: yup.string().trim().optional(),
    image_url: yup
      .string()
      .trim()
      .url('URL ảnh không hợp lệ')
      .max(500)
      .nullable()
      .optional(),
    row_number: yup
      .number()
      .integer()
      .oneOf([1, 2], 'Row number phải là 1 hoặc 2')
      .default(1),
    display_order: yup.number().integer().min(0).default(0),
    status: yup
      .string()
      .oneOf(['active', 'inactive'], 'Status không hợp lệ')
      .default('active'),
  }),

  // Cập nhật Achievement
  update: yup.object({
    title: yup.string().trim().max(200).optional(),
    year: yup.string().trim().max(20).optional(),
    description: yup.string().trim().optional(),
    image_url: yup
      .string()
      .trim()
      .url('URL ảnh không hợp lệ')
      .max(500)
      .nullable()
      .optional(),
    row_number: yup
      .number()
      .integer()
      .oneOf([1, 2], 'Row number phải là 1 hoặc 2')
      .optional(),
    display_order: yup.number().integer().min(0).optional(),
    status: yup
      .string()
      .oneOf(['active', 'inactive'], 'Status không hợp lệ')
      .optional(),
  }),

  // Cập nhật display order
  updateOrder: yup.object({
    achievements: yup
      .array()
      .of(
        yup.object({
          id: yup.number().integer().required(),
          display_order: yup.number().integer().min(0).required(),
          row_number: yup.number().integer().oneOf([1, 2]).required(),
        }),
      )
      .required(),
  }),
};

export default BeeitAchievementSchema;

