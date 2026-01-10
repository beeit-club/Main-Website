import * as yup from 'yup';

const Schema = {
  /**
   * Validate khi tạo permission mới
   */
  createPermission: yup.object({
    name: yup
      .string()
      .required('Tên quyền là bắt buộc')
      .min(2, 'Tên quyền phải có ít nhất 2 ký tự')
      .max(100, 'Tên quyền tối đa 100 ký tự')
      .trim(),

    description: yup
      .string()
      .required('Mô tả là bắt buộc')
      .min(5, 'Mô tả phải có ít nhất 5 ký tự')
      .max(500, 'Mô tả tối đa 500 ký tự'),

    module: yup
      .string()
      .nullable()
      .max(50, 'Module tối đa 50 ký tự'),
  }),

  /**
   * Validate khi cập nhật permission
   */
  updatePermission: yup.object({
    name: yup
      .string()
      .min(2, 'Tên quyền phải có ít nhất 2 ký tự')
      .max(100, 'Tên quyền tối đa 100 ký tự')
      .trim(),

    description: yup
      .string()
      .min(5, 'Mô tả phải có ít nhất 5 ký tự')
      .max(500, 'Mô tả tối đa 500 ký tự'),

    module: yup
      .string()
      .nullable()
      .max(50, 'Module tối đa 50 ký tự'),
  }).test(
    'at-least-one-field',
    'Phải có ít nhất một trường để cập nhật',
    (value) => Object.keys(value).length > 0,
  ),

  /**
   * Validate khi gán permission cho user
   */
  grantPermission: yup.object({
    permission_id: yup
      .number()
      .positive('Permission ID phải là số dương')
      .integer('Permission ID phải là số nguyên')
      .required('Permission ID là bắt buộc'),
  }),

  /**
   * Validate khi gán nhiều permissions cho user (bulk)
   */
  bulkGrantPermissions: yup.object({
    permission_ids: yup
      .array()
      .of(
        yup
          .number()
          .positive('Permission ID phải là số dương')
          .integer('Permission ID phải là số nguyên'),
      )
      .required('Danh sách permission IDs là bắt buộc')
      .min(1, 'Phải có ít nhất 1 permission'),
  }),
};

export default Schema;

