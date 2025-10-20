import * as yup from 'yup';

const ApplicationSchema = {
  // 🟢 Nộp đơn (Public)
  create: yup.object({
    fullname: yup
      .string()
      .trim()
      .required('Họ và tên là bắt buộc')
      .min(5, 'Họ tên phải có ít nhất 5 ký tự')
      .max(255, 'Họ tên không được vượt quá 255 ký tự'),
    email: yup
      .string()
      .trim()
      .required('Email là bắt buộc')
      .email('Email không đúng định dạng'),
    phone: yup
      .string()
      .trim()
      .required('Số điện thoại là bắt buộc')
      .matches(/^(0[3|5|7|8|9])+([0-9]{8})$/, 'Số điện thoại không hợp lệ'),
    student_id: yup
      .string()
      .trim()
      .required('Mã số sinh viên là bắt buộc')
      .max(20, 'MSSV không được vượt quá 20 ký tự'),
    student_year: yup
      .string()
      .trim()
      .required('Năm học là bắt buộc')
      .max(10, 'Năm học không được vượt quá 10 ký tự'),
    major: yup
      .string()
      .trim()
      .required('Chuyên ngành là bắt buộc')
      .max(100, 'Chuyên ngành không được vượt quá 100 ký tự'),
  }),

  // 🟡 Admin cập nhật ghi chú
  update: yup.object({
    interview_notes: yup.string().trim().nullable(),
  }),
};

export default ApplicationSchema;
