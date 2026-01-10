import * as yup from 'yup';

const AnswerSchema = {
  create: yup.object({
    // 👇 THÊM DÒNG NÀY
    question_id: yup.number().required('ID câu hỏi là bắt buộc').min(1),
    content: yup.string().trim().required('Nội dung là bắt buộc'),
    parent_id: yup
      .number()
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? null : value,
      )
      .min(1, 'parent_id không hợp lệ'),
    status: yup.number().oneOf([0, 1], 'Trạng thái không hợp lệ').default(1),
  }),

  update: yup
    .object({
      content: yup.string().trim().optional(),
      status: yup.number().oneOf([0, 1], 'Trạng thái không hợp lệ').optional(),
    })
    .test(
      'at-least-one-field', // Tên của test
      'Yêu cầu ít nhất một trường để cập nhật', // Thông báo lỗi
      (value) => Object.keys(value).length > 0, // Logic test
    ),

  vote: yup.object({
    vote_type: yup
      .string()
      .oneOf(['upvote', 'downvote'], 'Loại vote không hợp lệ')
      .required('Loại vote là bắt buộc'),
  }),
};

export default AnswerSchema;
