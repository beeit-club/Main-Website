// validation/admin/document.validation.js

import * as yup from 'yup';

const DocumentSchema = {
  // 🟢 Thêm tài liệu
  create: yup.object({
    title: yup
      .string()
      .trim()
      .required('Tiêu đề là bắt buộc')
      .min(5, 'Tiêu đề phải có ít nhất 5 ký tự')
      .max(500, 'Tiêu đề không được vượt quá 500 ký tự'),
    description: yup.string().trim().optional(),
    file_url: yup.string().trim().url('URL file không hợp lệ').optional(),
    category_id: yup.number().min(1, 'ID danh mục không hợp lệ').nullable(),
    access_level: yup
      .string()
      .oneOf(
        ['public', 'member_only', 'restricted'],
        'Mức độ truy cập không hợp lệ',
      )
      .default('public'),
    status: yup.number().oneOf([0, 1], 'Trạng thái không hợp lệ').default(0),
  }),

  // 🟡 Cập nhật tài liệu
  update: yup.object({
    title: yup
      .string()
      .trim()
      .min(5, 'Tiêu đề phải có ít nhất 5 ký tự')
      .max(500, 'Tiêu đề không được vượt quá 500 ký tự')
      .optional(),
    description: yup.string().trim().optional(),
    file_url: yup.string().trim().url('URL file không hợp lệ').optional(),
    category_id: yup
      .number()
      .min(1, 'ID danh mục không hợp lệ')
      .nullable()
      .optional(),
    access_level: yup
      .string()
      .oneOf(
        ['public', 'member_only', 'restricted'],
        'Mức độ truy cập không hợp lệ',
      )
      .optional(),
    status: yup.number().oneOf([0, 1], 'Trạng thái không hợp lệ').optional(),
  }),

  // 🔵 Gán người dùng
  assignUsers: yup.object({
    userIds: yup
      .array()
      .of(
        yup
          .number()
          .integer('ID người dùng phải là số nguyên')
          .min(1, 'ID người dùng không hợp lệ'),
      )
      .min(1, 'Phải cung cấp ít nhất một ID người dùng')
      .required('Mảng userIds là bắt buộc'),
  }),
};

export default DocumentSchema;
