import * as yup from "yup";

export const questionSchema = yup.object().shape({
  title: yup.string().required("Tiêu đề không được để trống"),
  meta_description: yup
    .string()
    .max(160, "Mô tả meta không quá 160 ký tự")
    .optional(),
  status: yup.string().required("Vui lòng chọn trạng thái"),
  // 'content' sẽ được validate riêng vì nó từ TinyMCE
});
