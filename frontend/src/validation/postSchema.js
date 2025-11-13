import * as yup from "yup";

const FILE_SIZE = 5 * 1024 * 1024; // 5MB
const SUPPORTED_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const postSchema = yup.object().shape({
  title: yup
    .string()
    .required("Tiêu đề là bắt buộc")
    .min(10, "Tiêu đề phải có ít nhất 10 ký tự")
    .max(500, "Tiêu đề không được vượt quá 500 ký tự"),

  meta_description: yup
    .string()
    .notRequired()
    .max(160, "Mô tả meta không được vượt quá 160 ký tự")
    .nullable(),

  category_id: yup
    .string() // Giá trị từ <Select> của shadcn thường là string
    .required("Vui lòng chọn một danh mục"),

  status: yup
    .string() // 0 (Draft) hoặc 1 (Published)
    .required("Vui lòng chọn trạng thái"),

  tags: yup
    .array()
    .of(yup.string())
    .min(1, "Vui lòng chọn ít nhất một thẻ")
    .notRequired(), // Bạn có thể đổi thành .required() nếu muốn

  featured_image: yup
    .mixed()
    .notRequired() // Đổi thành .required("Ảnh đại diện là bắt buộc") nếu bạn muốn
    .test("fileSize", "Tệp quá lớn, kích thước tối đa là 5MB", (value) => {
      if (!value || !value.length) return true; // Bỏ qua nếu không có file
      return value[0].size <= FILE_SIZE;
    })
    .test("fileFormat", "Định dạng tệp không được hỗ trợ", (value) => {
      if (!value || !value.length) return true; // Bỏ qua nếu không có file
      return SUPPORTED_FORMATS.includes(value[0].type);
    })
    .nullable(),
});

// src/lib/validations/tag-schema.js

export const tagSchema = yup.object().shape({
  name: yup
    .string()
    .required("Tên tag là bắt buộc.")
    .max(100, "Tên tag không quá 100 ký tự."),
  meta_description: yup
    .string()
    .max(160, "Mô tả meta không quá 160 ký tự.")
    .nullable(), // Cho phép giá trị rỗng (null hoặc undefined)
});
export const categorySchema = yup.object().shape({
  name: yup
    .string()
    .required("Tên danh mục là bắt buộc.")
    .max(255, "Tên không quá 255 ký tự."),
  parent_id: yup
    .mixed() // Dùng mixed để chấp nhận cả number và string (từ select)
    .nullable()
    .transform((value) =>
      // Chuyển rỗng ("") thành null, giữ nguyên số
      value === "" || value === null ? null : Number(value)
    ),
});
