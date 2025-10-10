import * as yup from 'yup';

export const PostSchema = {
  // ================================================================
  // Schema cho việc TẠO MỚI bài viết
  // ================================================================
  create: yup.object().shape({
    title: yup
      .string()
      .required('Tiêu đề là bắt buộc')
      .min(10, 'Tiêu đề phải có ít nhất 10 ký tự')
      .max(255, 'Tiêu đề không được vượt quá 255 ký tự'),
    content: yup
      .string()
      .required('Nội dung là bắt buộc')
      .min(50, 'Nội dung phải có ít nhất 50 ký tự'),

    meta_description: yup
      .string()
      .optional()
      .max(160, 'Mô tả meta không được vượt quá 160 ký tự')
      .transform((value) => value || null),

    category_id: yup
      .number()
      .positive('ID danh mục phải là số dương')
      .integer('ID danh mục phải là số nguyên')
      .optional()
      .nullable()
      .transform((value) => (isNaN(value) || value === 0 ? null : value)),

    status: yup
      .number()
      .oneOf([0, 1], 'Trạng thái không hợp lệ (chỉ 0 hoặc 1)')
      .optional(),

    tags: yup
      .array()
      .of(
        yup
          .number()
          .positive('ID của tag phải là số dương')
          .integer('ID của tag phải là số nguyên'),
      )
      .optional(),
  }),

  // ================================================================
  // Schema cho việc CẬP NHẬT bài viết
  // ================================================================
  update: yup.object().shape({
    title: yup
      .string()
      .optional()
      .min(10, 'Tiêu đề phải có ít nhất 10 ký tự')
      .max(255, 'Tiêu đề không được vượt quá 255 ký tự'),

    content: yup
      .string()
      .optional()
      .min(50, 'Nội dung phải có ít nhất 50 ký tự'),

    meta_description: yup
      .string()
      .optional()
      .max(160, 'Mô tả meta không được vượt quá 160 ký tự')
      .transform((value) => value || null),

    category_id: yup
      .number()
      .positive('ID danh mục phải là số dương')
      .integer('ID danh mục phải là số nguyên')
      .optional()
      .nullable()
      .transform((value) => (isNaN(value) || value === 0 ? null : value)),

    status: yup
      .number()
      .oneOf([0, 1], 'Trạng thái không hợp lệ (chỉ 0 hoặc 1)')
      .optional(),

    tags: yup
      .array()
      .of(
        yup
          .number()
          .positive('ID của tag phải là số dương')
          .integer('ID của tag phải là số nguyên'),
      )
      .optional(),
  }),

  status: yup.object({
    status: yup
      .number()
      .oneOf([0, 1], 'Trạng thái không hợp lệ (chỉ 0 hoặc 1)')
      .optional(),
  }),
};
