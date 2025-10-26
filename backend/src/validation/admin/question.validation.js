import * as yup from 'yup';

const QuestionSchema = {
  create: yup.object({
    title: yup
      .string()
      .trim()
      .required('Tiêu đề là bắt buộc')
      .max(500, 'Tiêu đề không được vượt quá 500 ký tự'),
    content: yup.string().trim().required('Nội dung là bắt buộc'),
    meta_description: yup
      .string()
      .trim()
      .max(160, 'Mô tả không được vượt quá 160 ký tự')
      .optional(),
    status: yup.number().oneOf([0, 1, 2], 'Trạng thái không hợp lệ').default(0),
  }),

  update: yup.object({
    title: yup
      .string()
      .trim()
      .max(500, 'Tiêu đề không được vượt quá 500 ký tự')
      .optional(),
    content: yup.string().trim().optional(),
    meta_description: yup
      .string()
      .trim()
      .max(160, 'Mô tả không được vượt quá 160 ký tự')
      .optional(),
    status: yup.number().oneOf([0, 1, 2], 'Trạng thái không hợp lệ').optional(),
  }),
};

export default QuestionSchema;
