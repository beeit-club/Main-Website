// validation/admin/beeitLeader.validation.js

import * as yup from 'yup';

const BeeitLeaderSchema = {
  // Tạo Leader
  create: yup.object({
    name: yup
      .string()
      .trim()
      .required('Tên là bắt buộc')
      .max(200),
    role: yup
      .string()
      .trim()
      .required('Vai trò là bắt buộc')
      .max(200),
    image_url: yup
      .string()
      .trim()
      .url('URL ảnh không hợp lệ')
      .max(500)
      .nullable()
      .optional(),
    bio: yup.string().trim().optional(),
    github_url: yup
      .string()
      .trim()
      .url('URL không hợp lệ')
      .max(500)
      .nullable()
      .optional(),
    linkedin_url: yup
      .string()
      .trim()
      .url('URL không hợp lệ')
      .max(500)
      .nullable()
      .optional(),
    facebook_url: yup
      .string()
      .trim()
      .url('URL không hợp lệ')
      .max(500)
      .nullable()
      .optional(),
    email: yup
      .string()
      .trim()
      .email('Email không hợp lệ')
      .max(200)
      .nullable()
      .optional(),
    display_order: yup.number().integer().min(0).default(0),
    status: yup
      .string()
      .oneOf(['active', 'inactive'], 'Status không hợp lệ')
      .default('active'),
  }),

  // Cập nhật Leader
  update: yup.object({
    name: yup.string().trim().max(200).optional(),
    role: yup.string().trim().max(200).optional(),
    image_url: yup
      .string()
      .trim()
      .url('URL ảnh không hợp lệ')
      .max(500)
      .nullable()
      .optional(),
    bio: yup.string().trim().optional(),
    github_url: yup
      .string()
      .trim()
      .url('URL không hợp lệ')
      .max(500)
      .nullable()
      .optional(),
    linkedin_url: yup
      .string()
      .trim()
      .url('URL không hợp lệ')
      .max(500)
      .nullable()
      .optional(),
    facebook_url: yup
      .string()
      .trim()
      .url('URL không hợp lệ')
      .max(500)
      .nullable()
      .optional(),
    email: yup
      .string()
      .trim()
      .email('Email không hợp lệ')
      .max(200)
      .nullable()
      .optional(),
    display_order: yup.number().integer().min(0).optional(),
    status: yup
      .string()
      .oneOf(['active', 'inactive'], 'Status không hợp lệ')
      .optional(),
  }),

  // Cập nhật display order
  updateOrder: yup.object({
    leaders: yup
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

export default BeeitLeaderSchema;

