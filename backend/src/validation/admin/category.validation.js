import * as yup from 'yup';

const CategorySchema = {
  // 🟢 Thêm danh mục
  create: yup.object({
    name: yup
      .string()
      .trim()
      .required('Tên danh mục là bắt buộc')
      .min(2, 'Tên danh mục phải có ít nhất 2 ký tự')
      .max(100, 'Tên danh mục không được vượt quá 100 ký tự'),
    parent_id: yup
      .number()
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? null : value,
      )
      .min(1, 'parent_id không hợp lệ'),

    status: yup.number().oneOf([0, 1], 'Trạng thái không hợp lệ').default(1),
  }),

  // 🟡 Cập nhật danh mục
  update: yup.object({
    name: yup
      .string()
      .trim()
      .min(2, 'Tên danh mục phải có ít nhất 2 ký tự')
      .max(100, 'Tên danh mục không được vượt quá 100 ký tự')
      .optional(),

    parent_id: yup
      .number()
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? null : value,
      )
      .min(1, 'parent_id không hợp lệ')
      .optional(),

    status: yup.number().oneOf([0, 1], 'Trạng thái không hợp lệ').optional(),
  }),

  // 🔴 Xóa danh mục
  delete: yup.object({
    id: yup
      .number()
      .required('ID danh mục là bắt buộc')
      .integer('ID phải là số nguyên')
      .min(1, 'ID không hợp lệ'),
  }),
};

export default CategorySchema;
