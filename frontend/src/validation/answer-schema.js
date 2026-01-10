import * as yup from "yup";
export const answerSchema = yup.object().shape({
  content: yup
    .string()
    .required("Nội dung trả lời là bắt buộc.")
    .min(10, "Nội dung trả lời cần ít nhất 10 ký tự."),
});
