import * as yup from 'yup';

const CommentSchema = {
  // Tạo comment mới
  create: yup.object({
    content: yup
      .string()
      .trim()
      .required('Nội dung bình luận là bắt buộc')
      .min(1, 'Nội dung bình luận phải có ít nhất 1 ký tự')
      .max(5000, 'Nội dung bình luận không được vượt quá 5000 ký tự'),

    author_id: yup
      .number()
      .integer('ID tác giả phải là số nguyên')
      .positive('ID tác giả phải là số dương')
      .required('ID tác giả là bắt buộc'),

    post_id: yup
      .number()
      .integer('ID bài viết phải là số nguyên')
      .positive('ID bài viết phải là số dương')
      .required('ID bài viết là bắt buộc'),

    parent_id: yup
      .number()
      .integer('ID comment cha phải là số nguyên')
      .positive('ID comment cha phải là số dương')
      .nullable()
      .optional(),

    status: yup
      .number()
      .integer('Trạng thái phải là số nguyên')
      .oneOf([0, 1, 2], 'Trạng thái chỉ được là 0, 1 hoặc 2')
      .default(1)
      .optional(),
  }),

  // Cập nhật comment
  update: yup.object({
    content: yup
      .string()
      .trim()
      .min(1, 'Nội dung bình luận phải có ít nhất 1 ký tự')
      .max(5000, 'Nội dung bình luận không được vượt quá 5000 ký tự')
      .optional(),

    status: yup
      .number()
      .integer('Trạng thái phải là số nguyên')
      .oneOf([0, 1, 2], 'Trạng thái chỉ được là 0, 1 hoặc 2')
      .optional(),

    updated_by: yup
      .number()
      .integer('ID người cập nhật phải là số nguyên')
      .positive('ID người cập nhật phải là số dương')
      .optional(),
  }),

  // Validate comment ID trong params
  commentId: yup.object({
    id: yup
      .number()
      .integer('ID comment phải là số nguyên')
      .positive('ID comment phải là số dương')
      .required('ID comment là bắt buộc'),
  }),

  // Query params khi lấy danh sách comments
  getList: yup.object({
    post_id: yup
      .number()
      .integer('ID bài viết phải là số nguyên')
      .positive('ID bài viết phải là số dương')
      .optional(),

    parent_id: yup
      .number()
      .integer('ID comment cha phải là số nguyên')
      .positive('ID comment cha phải là số dương')
      .nullable()
      .optional(),

    author_id: yup
      .number()
      .integer('ID tác giả phải là số nguyên')
      .positive('ID tác giả phải là số dương')
      .optional(),

    status: yup
      .number()
      .integer('Trạng thái phải là số nguyên')
      .oneOf([0, 1, 2], 'Trạng thái chỉ được là 0, 1 hoặc 2')
      .optional(),

    page: yup
      .number()
      .integer('Số trang phải là số nguyên')
      .positive('Số trang phải là số dương')
      .default(1)
      .optional(),

    limit: yup
      .number()
      .integer('Giới hạn phải là số nguyên')
      .positive('Giới hạn phải là số dương')
      .max(100, 'Giới hạn không được vượt quá 100')
      .default(10)
      .optional(),

    sort_by: yup
      .string()
      .oneOf(['created_at', 'updated_at', 'id'], 'Trường sắp xếp không hợp lệ')
      .default('created_at')
      .optional(),

    order: yup
      .string()
      .oneOf(
        ['asc', 'desc', 'ASC', 'DESC'],
        'Thứ tự sắp xếp phải là asc hoặc desc',
      )
      .default('desc')
      .optional(),
  }),
};

export default CommentSchema;
