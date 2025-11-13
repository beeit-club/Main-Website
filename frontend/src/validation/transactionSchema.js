// src/validation/transactionSchema.js
import * as yup from "yup";

export const transactionSchema = yup.object().shape({
  amount: yup
    .number()
    .typeError("Số tiền phải là một con số")
    .required("Số tiền là bắt buộc")
    .positive("Số tiền phải là số dương"),

  type: yup
    .string()
    .required("Vui lòng chọn loại giao dịch")
    .oneOf(["1", "2"], "Loại giao dịch không hợp lệ"),

  description: yup
    .string()
    .required("Nội dung/Mô tả là bắt buộc")
    .max(500, "Mô tả không quá 500 ký tự"),

  // BE lưu dạng string URL, không phải file upload
  attachment_url: yup
    .string()
    .url("Phải là một URL hợp lệ (VD: https://...)")
    .nullable() // Cho phép rỗng
    .notRequired(),
});
