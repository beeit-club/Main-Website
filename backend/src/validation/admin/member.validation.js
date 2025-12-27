import * as yup from 'yup';

const Schema = {
  /**
   * Validate khi tạo thành viên mới
   */
  createMember: yup.object({
    user_id: yup
      .number()
      .positive('user_id phải là số dương')
      .integer('user_id phải là số nguyên')
      .required('user_id là bắt buộc'),

    student_id: yup
      .string()
      .required('MSSV là bắt buộc')
      .max(20, 'MSSV tối đa 20 ký tự')
      .trim(),

    academic_year: yup
      .date()
      .nullable()
      .typeError('Năm học phải là định dạng ngày hợp lệ'),

    course: yup
      .string()
      .nullable()
      .max(50, 'Khóa học tối đa 50 ký tự')
      .trim(),

    join_date: yup
      .date()
      .nullable()
      .typeError('Ngày tham gia phải là định dạng ngày hợp lệ'),
  }),

  /**
   * Validate khi cập nhật thành viên
   */
  updateMember: yup.object({
    student_id: yup
      .string()
      .max(20, 'MSSV tối đa 20 ký tự')
      .trim(),

    academic_year: yup
      .date()
      .nullable()
      .typeError('Năm học phải là định dạng ngày hợp lệ'),

    course: yup
      .string()
      .nullable()
      .max(50, 'Khóa học tối đa 50 ký tự')
      .trim(),

    join_date: yup
      .date()
      .nullable()
      .typeError('Ngày tham gia phải là định dạng ngày hợp lệ'),
  }),
};

export default Schema;

