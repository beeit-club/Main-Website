import * as yup from 'yup';

const TagSchema = {
  // 🟢 Thêm thẻ
  create: yup.object({
    name: yup
      .string()
      .trim()
      .required('Tên thẻ là bắt buộc')
      .min(2, 'Tên thẻ phải có ít nhất 2 ký tự')
      .max(100, 'Tên thẻ không được vượt quá 100 ký tự'),
    meta_description: yup
      .string()
      .trim()
      .max(160, 'Mô tả meta không được vượt quá 160 ký tự'),
  }),

  // 🟡 Cập nhật thẻ
  update: yup.object({
    name: yup
      .string()
      .trim()
      .min(2, 'Tên thẻ phải có ít nhất 2 ký tự')
      .max(100, 'Tên thẻ không được vượt quá 100 ký tự')
      .optional(),
    meta_description: yup
      .string()
      .trim()
      .max(160, 'Mô tả meta không được vượt quá 160 ký tự')
      .optional(),
  }),
};

export default TagSchema;
