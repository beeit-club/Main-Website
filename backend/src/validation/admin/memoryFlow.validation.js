import * as yup from 'yup';

export const MemoryFlowSchema = {
  create: yup.object().shape({
    title: yup
      .string()
      .required('Tiêu đề là bắt buộc')
      .min(3, 'Tiêu đề phải có ít nhất 3 ký tự')
      .max(255, 'Tiêu đề không được vượt quá 255 ký tự'),
    caption: yup
      .string()
      .required('Mô tả là bắt buộc')
      .min(5, 'Mô tả phải có ít nhất 5 ký tự')
      .max(1000, 'Mô tả không được vượt quá 1000 ký tự'),
    image_url: yup
      .string()
      .required('URL ảnh là bắt buộc')
      .url('URL ảnh không hợp lệ')
      .max(500, 'URL không được vượt quá 500 ký tự'),
    display_order: yup
      .number()
      .integer('Thứ tự phải là số nguyên')
      .min(0, 'Thứ tự phải >= 0')
      .optional()
      .nullable(),
    is_active: yup
      .number()
      .oneOf([0, 1], 'Trạng thái không hợp lệ (chỉ 0 hoặc 1)')
      .optional()
      .default(1),
  }),

  update: yup.object().shape({
    title: yup
      .string()
      .optional()
      .min(3, 'Tiêu đề phải có ít nhất 3 ký tự')
      .max(255, 'Tiêu đề không được vượt quá 255 ký tự'),
    caption: yup
      .string()
      .optional()
      .min(5, 'Mô tả phải có ít nhất 5 ký tự')
      .max(1000, 'Mô tả không được vượt quá 1000 ký tự'),
    image_url: yup
      .string()
      .optional()
      .url('URL ảnh không hợp lệ')
      .max(500, 'URL không được vượt quá 500 ký tự'),
    display_order: yup
      .number()
      .integer('Thứ tự phải là số nguyên')
      .min(0, 'Thứ tự phải >= 0')
      .optional()
      .nullable(),
    is_active: yup
      .number()
      .oneOf([0, 1], 'Trạng thái không hợp lệ (chỉ 0 hoặc 1)')
      .optional(),
  }),

  reorder: yup.object().shape({
    display_order: yup
      .number()
      .required('Thứ tự là bắt buộc')
      .integer('Thứ tự phải là số nguyên')
      .min(0, 'Thứ tự phải >= 0'),
  }),

  toggle: yup.object().shape({
    is_active: yup
      .number()
      .required('Trạng thái là bắt buộc')
      .oneOf([0, 1], 'Trạng thái không hợp lệ (chỉ 0 hoặc 1)'),
  }),
};

