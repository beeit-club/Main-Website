// src/validations/auth.schema.js
import * as yup from 'yup';

const AuthSchema = {
  // Đăng ký
  register: yup.object({
    fullname: yup
      .string()
      .required('Vui lòng nhập tên')
      .min(4, 'Tên tối thiểu 4 ký tự')
      .max(25, 'Tên tối đa 25 ký tự'),
    email: yup
      .string()
      .email('Email không hợp lệ')
      .required('Vui lòng nhập email'),
  }),

  // Đăng nhập (gửi OTP)
  login: yup.object({
    email: yup
      .string()
      .email('Email không hợp lệ')
      .required('Vui lòng nhập email'),
  }),

  // Gửi OTP để xác minh
  sendOtp: yup.object({
    email: yup
      .string()
      .email('Email không hợp lệ')
      .required('Vui lòng nhập email'),
    pin: yup
      .string()
      .required('Vui lòng nhập mã pin')
      .matches(/^[0-9]{4,6}$/, 'Mã OTP phải là 6 chữ số'),
  }),

  // Đăng nhập qua Google
  google: yup.object({
    code: yup.string().required('Thiếu mã xác thực Google'),
    redirect_uri: yup.string().required('Thiếu redirect_uri'),
  }),

  // Gửi lại email xác minh
  resendVerification: yup.object({
    email: yup
      .string()
      .email('Email không hợp lệ')
      .required('Vui lòng nhập email'),
  }),

  // Cập nhật profile (client tự update)
  updateProfile: yup.object({
    fullname: yup
      .string()
      .min(2, 'Họ tên phải có ít nhất 2 ký tự')
      .max(255, 'Họ tên tối đa 255 ký tự')
      .trim()
      .optional(),
    phone: yup
      .string()
      .nullable()
      .matches(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ (10-11 số)')
      .max(11, 'Số điện thoại tối đa 11 số')
      .optional(),
    bio: yup
      .string()
      .nullable()
      .max(1000, 'Bio tối đa 1000 ký tự')
      .optional(),
    avatar_url: yup
      .string()
      .url('Avatar URL không đúng định dạng')
      .nullable()
      .max(500, 'Avatar URL tối đa 500 ký tự')
      .optional(),
  })
    .test(
      'at-least-one-field',
      'Phải có ít nhất một trường để cập nhật',
      (value) => Object.keys(value).length > 0,
    ),
};

export default AuthSchema;
