import * as yup from "yup";

export const documentCategorySchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("Tên danh mục là bắt buộc")
    .max(255, "Tên không quá 255 ký tự"),
});
