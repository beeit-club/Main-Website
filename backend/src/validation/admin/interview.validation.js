import * as yup from 'yup';

// Regex cho HH:mm
const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

const InterviewSchema = {
  create: yup.object({
    title: yup.string().trim().required('Tiêu đề là bắt buộc'),
    interview_date: yup
      .string()
      .required('Ngày phỏng vấn là bắt buộc')
      .matches(/^\d{4}-\d{2}-\d{2}$/, 'Định dạng ngày phải là YYYY-MM-DD'),
    start_time: yup
      .string()
      .required('Giờ bắt đầu là bắt buộc')
      .matches(timeRegex, 'Giờ bắt đầu không hợp lệ (HH:mm)'),
    end_time: yup
      .string()
      .required('Giờ kết thúc là bắt buộc')
      .matches(timeRegex, 'Giờ kết thúc không hợp lệ (HH:mm)'),
    location: yup.string().trim().nullable(),
    description: yup.string().trim().nullable(),
  }),
  update: yup.object({
    title: yup.string().trim().optional(),
    interview_date: yup
      .string()
      .optional()
      .matches(/^\d{4}-\d{2}-\d{2}$/, 'Định dạng ngày phải là YYYY-MM-DD'),
    start_time: yup
      .string()
      .optional()
      .matches(timeRegex, 'Giờ bắt đầu không hợp lệ (HH:mm)'),
    end_time: yup
      .string()
      .optional()
      .matches(timeRegex, 'Giờ kết thúc không hợp lệ (HH:mm)'),
    location: yup.string().trim().nullable(),
    description: yup.string().trim().nullable(),
  }),
};
export default InterviewSchema;
