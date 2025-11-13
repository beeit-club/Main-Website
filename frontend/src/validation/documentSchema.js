import * as yup from "yup";

export const documentSchema = yup.object().shape({
  title: yup
    .string()
    .trim()
    .required("Tiêu đề là bắt buộc")
    .min(5, "Tiêu đề phải có ít nhất 5 ký tự")
    .max(500, "Tiêu đề không được vượt quá 500 ký tự"),

  description: yup.string().trim().notRequired().nullable(),

  file_url: yup
    .string()
    .trim()
    .url("URL file không hợp lệ (VD: https://...)")
    .notRequired()
    .nullable(),

  category_id: yup
    .number()
    .typeError("Vui lòng chọn danh mục")
    .required("Vui lòng chọn danh mục")
    .nullable(),

  access_level: yup
    .string()
    .oneOf(
      ["public", "member_only", "restricted"],
      "Mức độ truy cập không hợp lệ"
    )
    .required("Vui lòng chọn mức độ truy cập"),

  status: yup
    .number()
    .oneOf([0, 1], "Trạng thái không hợp lệ")
    .required("Vui lòng chọn trạng thái"),
});
