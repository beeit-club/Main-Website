import * as yup from "yup";

export const documentCategorySchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("Tên danh mục là bắt buộc")
    .max(255, "Tên không quá 255 ký tự"),

  parent_id: yup
    .number()
    .nullable()
    .transform((value, originalValue) =>
      // Chuyển rỗng ("") hoặc "null" string thành null
      String(originalValue).trim() === "" ||
      String(originalValue).trim() === "null"
        ? null
        : Number(value)
    ),
});
