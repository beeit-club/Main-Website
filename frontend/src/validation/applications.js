// src/validation/admin/applicationSchema.js
import * as yup from "yup";

// Schema cho Dialog Đặt Lịch
export const scheduleSchema = yup.object().shape({
  schedule_id: yup
    .string() // Dùng string vì value của Select là string
    .required("Vui lòng chọn một lịch phỏng vấn"),
});

// Schema cho Dialog Phê Duyệt / Từ Chối
export const decisionSchema = yup.object().shape({
  interview_notes: yup.string().trim().nullable(),
});
// src/validation/admin/interviewSchema.js

// Regex cho HH:mm
const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

export const interviewSchema = yup.object().shape({
  title: yup.string().trim().required("Tiêu đề là bắt buộc"),
  interview_date: yup.string().required("Vui lòng chọn ngày"),
  start_time: yup
    .string()
    .required("Vui lòng chọn giờ bắt đầu")
    .matches(timeRegex, "Giờ không hợp lệ"),
  end_time: yup
    .string()
    .required("Vui lòng chọn giờ kết thúc")
    .matches(timeRegex, "Giờ không hợp lệ")
    .test("is-greater", "Giờ kết thúc phải sau giờ bắt đầu", function (value) {
      const { start_time } = this.parent;
      return !start_time || !value || value > start_time;
    }),
  location: yup.string().trim().nullable(),
  description: yup.string().trim().nullable(),
});
