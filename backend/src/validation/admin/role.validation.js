import * as yup from 'yup';

const Schema = {
  /**
   * Validate khi tạo role mới
   */
  createRole: yup.object({
    name: yup
      .string()
      .required('Tên vai trò là bắt buộc')
      .min(2, 'Tên vai trò phải có ít nhất 2 ký tự')
      .max(100, 'Tên vai trò tối đa 100 ký tự')
      .trim(),

    description: yup
      .string()
      .nullable()
      .max(500, 'Mô tả tối đa 500 ký tự'),
  }),

  /**
   * Validate khi cập nhật role
   */
  updateRole: yup.object({
    name: yup
      .string()
      .min(2, 'Tên vai trò phải có ít nhất 2 ký tự')
      .max(100, 'Tên vai trò tối đa 100 ký tự')
      .trim(),

    description: yup
      .string()
      .nullable()
      .max(500, 'Mô tả tối đa 500 ký tự'),
  }).test(
    'at-least-one-field',
    'Phải có ít nhất một trường để cập nhật',
    (value) => Object.keys(value).length > 0,
  ),

  /**
   * Validate khi gán role cho user
   */
  assignRole: yup.object({
    user_id: yup
      .number()
      .positive('User ID phải là số dương')
      .integer('User ID phải là số nguyên')
      .required('User ID là bắt buộc'),
  }),
};

export default Schema;

