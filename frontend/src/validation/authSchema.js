"use client";
import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
});
export const registerSchema = yup.object().shape({
  fullname: yup
    .string()
    .min(6, "Tên tối thiếu 6 ky tự")
    .required("Tên là bắt buộc"),
  email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
});
export const otpSchema = yup.object().shape({
  pin: yup
    .string()
    .length(6, "Mã OTP phải có đúng 6 ký tự.")
    .matches(/^[0-9]+$/, "Mã OTP chỉ được chứa số.")
    .required("Vui lòng nhập mã OTP."),
});
