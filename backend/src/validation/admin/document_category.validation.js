import * as yup from 'yup';

const DocumentCategorySchema = {
  // 🟢 Thêm danh mục tài liệu
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
  }),

  // 🟡 Cập nhật danh mục tài liệu
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
  }),
};

export default DocumentCategorySchema;
