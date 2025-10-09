import * as yup from 'yup';

const Schema = {
  /**
   * Validate khi tạo user mới
   */
  createUser: yup.object({
    email: yup
      .string()
      .email('Email không đúng định dạng')
      .required('Email là bắt buộc')
      .max(255, 'Email tối đa 255 ký tự'),

    fullname: yup
      .string()
      .required('Họ tên là bắt buộc')
      .min(2, 'Họ tên phải có ít nhất 2 ký tự')
      .max(255, 'Họ tên tối đa 255 ký tự')
      .trim(),

    phone: yup
      .string()
      .nullable()
      .matches(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ (10-11 số)')
      .max(11, 'Số điện thoại tối đa 11 số'),

    role_id: yup
      .number()
      .positive('Role ID phải là số dương')
      .integer('Role ID phải là số nguyên')
      .nullable()
      .default(2), // Default là user

    bio: yup.string().nullable().max(1000, 'Bio tối đa 1000 ký tự'),

    avatar_url: yup
      .string()
      .url('Avatar URL không đúng định dạng')
      .nullable()
      .max(500, 'Avatar URL tối đa 500 ký tự'),
  }),

  /**
   * Validate khi cập nhật user
   * Tất cả các trường đều optional, nhưng nếu có thì phải hợp lệ
   */
  updateUser: yup
    .object({
      email: yup
        .string()
        .email('Email không đúng định dạng')
        .max(255, 'Email tối đa 255 ký tự'),

      password: yup
        .string()
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
        .max(100, 'Mật khẩu tối đa 100 ký tự'),

      fullname: yup
        .string()
        .min(2, 'Họ tên phải có ít nhất 2 ký tự')
        .max(255, 'Họ tên tối đa 255 ký tự')
        .trim(),

      phone: yup
        .string()
        .nullable()
        .matches(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ (10-11 số)')
        .max(11, 'Số điện thoại tối đa 11 số'),

      role_id: yup
        .number()
        .positive('Role ID phải là số dương')
        .integer('Role ID phải là số nguyên'),

      bio: yup.string().nullable().max(1000, 'Bio tối đa 1000 ký tự'),

      avatar_url: yup
        .string()
        .url('Avatar URL không đúng định dạng')
        .nullable()
        .max(500, 'Avatar URL tối đa 500 ký tự'),

      is_active: yup.number().oneOf([0, 1], 'is_active phải là 0 hoặc 1'),
    })
    .test(
      'at-least-one-field',
      'Phải có ít nhất một trường để cập nhật',
      (value) => Object.keys(value).length > 0,
    ),

  /**
   * Validate khi toggle active
   */
  toggleActive: yup.object({
    is_active: yup
      .number()
      .oneOf([0, 1], 'is_active phải là 0 hoặc 1')
      .required('is_active là bắt buộc'),
  }),

  /**
   * Validate khi tìm kiếm user
   */
  searchUser: yup.object({
    keyword: yup
      .string()
      .required('Từ khóa tìm kiếm là bắt buộc')
      .min(1, 'Từ khóa phải có ít nhất 1 ký tự')
      .max(255, 'Từ khóa tối đa 255 ký tự')
      .trim(),

    page: yup
      .number()
      .positive('Page phải là số dương')
      .integer('Page phải là số nguyên')
      .default(1),

    limit: yup
      .number()
      .positive('Limit phải là số dương')
      .integer('Limit phải là số nguyên')
      .max(100, 'Limit tối đa 100')
      .default(10),
  }),
};

export default Schema;
