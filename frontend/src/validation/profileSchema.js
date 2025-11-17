import * as yup from "yup";

// Schema để client tự cập nhật profile
export const profileUpdateSchema = yup.object().shape({
  fullname: yup
    .string()
    .min(2, "Họ tên phải có ít nhất 2 ký tự")
    .max(255, "Họ tên tối đa 255 ký tự")
    .required("Họ tên là bắt buộc"),
  phone: yup
    .string()
    .nullable()
    .matches(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ (10-11 số)")
    .max(11, "Số điện thoại tối đa 11 số")
    .transform((value) => (value ? value : null)),
  bio: yup
    .string()
    .nullable()
    .max(1000, "Tiểu sử tối đa 1000 ký tự")
    .transform((value) => (value ? value : null)),
  avatar_url: yup
    .string()
    .url("Avatar URL không đúng định dạng")
    .nullable()
    .max(500, "Avatar URL tối đa 500 ký tự")
    .transform((value) => (value ? value : null)),
});

