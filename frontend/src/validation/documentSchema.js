import * as yup from "yup";

export const documentSchema = yup.object().shape({
  title: yup
    .string()
    .trim()
    .required("Tiêu đề là bắt buộc")
    .min(5, "Tiêu đề phải có ít nhất 5 ký tự")
    .max(500, "Tiêu đề không được vượt quá 500 ký tự"),

  description: yup
    .string()
    .trim()
    .transform((value, originalValue) => {
      if (
        originalValue === "" ||
        originalValue === null ||
        originalValue === undefined
      ) {
        return null;
      }
      return value;
    })
    .nullable()
    .notRequired(),

  file_url: yup
    .string()
    .trim()
    .transform((value, originalValue) => {
      if (
        originalValue === "" ||
        originalValue === null ||
        originalValue === undefined
      ) {
        return null;
      }
      return value;
    })
    .nullable()
    .test(
      "is-url",
      "URL file không hợp lệ (VD: https://...)",
      function (value) {
        if (!value || value.trim() === "") return true; // Cho phép null/empty
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      }
    )
    .notRequired(),

  preview_url: yup
    .string()
    .trim()
    .transform((value, originalValue) => {
      if (
        originalValue === "" ||
        originalValue === null ||
        originalValue === undefined
      ) {
        return null;
      }
      return value;
    })
    .nullable()
    .test(
      "is-url",
      "URL preview không hợp lệ (VD: https://...)",
      function (value) {
        if (!value || value.trim() === "") return true; // Cho phép null/empty
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      }
    )
    .notRequired(),

  category_id: yup
    .number()
    .typeError("Vui lòng chọn danh mục")
    .transform((value, originalValue) => {
      // Cho phép null nếu không chọn danh mục (để khớp với backend)
      if (
        originalValue === "" ||
        originalValue === null ||
        originalValue === undefined ||
        originalValue === 0
      ) {
        return null;
      }
      return value;
    })
    .nullable()
    .notRequired(),

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
