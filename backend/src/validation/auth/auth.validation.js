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
};

export default AuthSchema;
