// src/validation/userSchema.js (Hoặc thêm vào file validation có sẵn)
import * as yup from "yup";

// Schema để TẠO user
export const userCreateSchema = yup.object().shape({
  fullname: yup.string().required("Họ tên là bắt buộc."),
  email: yup
    .string()
    .email("Email không hợp lệ.")
    .required("Email là bắt buộc."),
  phone: yup
    .string()
    .matches(/^[0-9]+$/, "Số điện thoại chỉ được chứa số")
    .min(10, "Số điện thoại phải có ít nhất 10 số")
    .max(12, "Số điện thoại không quá 12 số")
    .nullable()
    .transform((value) => (value ? value : null)), // Chuyển "" thành null
  role_id: yup.string().required("Vui lòng chọn vai trò."),
  // Admin tạo user thì không cần nhập password,
  // hệ thống nên tự gửi email kích hoạt
});

// Schema để CẬP NHẬT user (Admin có thể không cần đổi email)
export const userUpdateSchema = yup.object().shape({
  fullname: yup.string().required("Họ tên là bắt buộc."),
  phone: yup
    .string()
    .matches(/^[0-9]+$/, "Số điện thoại chỉ được chứa số")
    .min(10, "Số điện thoại phải có ít nhất 10 số")
    .max(12, "Số điện thoại không quá 12 số")
    .nullable()
    .transform((value) => (value ? value : null)),
  role_id: yup.string().required("Vui lòng chọn vai trò."),
  bio: yup
    .string()
    .max(500, "Tiểu sử không quá 500 ký tự.")
    .nullable()
    .transform((value) => (value ? value : null)),
  // Email thường không cho phép admin tự ý thay đổi
  // email: yup.string().email("Email không hợp lệ.").required("Email là bắt buộc."),
});
