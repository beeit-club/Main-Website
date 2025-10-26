// validation/admin/event.validation.js

import * as yup from 'yup';

const EventSchema = {
  // 🟢 Tạo sự kiện
  create: yup.object({
    title: yup.string().trim().required('Tiêu đề là bắt buộc').max(500),
    content: yup.string().trim().required('Nội dung là bắt buộc'),
    start_time: yup.date().required('Thời gian bắt đầu là bắt buộc'),
    end_time: yup
      .date()
      .required('Thời gian kết thúc là bắt buộc')
      .min(
        yup.ref('start_time'),
        'Thời gian kết thúc phải sau thời gian bắt đầu',
      ),
    location: yup.string().trim().optional(),
    featured_image: yup.string().trim().url('URL ảnh không hợp lệ').optional(),
    max_participants: yup
      .number()
      .integer()
      .min(1, 'Số người tham gia phải lớn hơn 0')
      .nullable(),
    registration_deadline: yup.date().nullable(),
    status: yup.number().oneOf([0, 1, 2, 3]).default(0),
    is_public: yup.boolean().default(true),
  }),

  // 🟡 Cập nhật sự kiện
  update: yup.object({
    title: yup.string().trim().max(500).optional(),
    content: yup.string().trim().optional(),
    start_time: yup.date().optional(), // Giữ nguyên
    end_time: yup
      .date()
      .when('start_time', {
        // is: (value) => value instanceof Date && !isNaN(value), // Cách kiểm tra chặt chẽ
        is: (start_time) => !!start_time, // Chỉ cần kiểm tra `start_time` có tồn tại
        // `then` chỉ chạy khi điều kiện `is` là true
        then: (schema) =>
          schema.min(
            yup.ref('start_time'),
            'Thời gian kết thúc phải sau thời gian bắt đầu',
          ),
        // `otherwise` chạy khi điều kiện `is` là false
        otherwise: (schema) => schema,
      })
      .optional(),
    location: yup.string().trim().optional(),
    featured_image: yup.string().trim().url('URL ảnh không hợp lệ').optional(),
    max_participants: yup.number().integer().min(1).nullable().optional(),
    registration_deadline: yup.date().nullable().optional(),
    status: yup.number().oneOf([0, 1, 2, 3]).optional(),
    is_public: yup.boolean().optional(),
  }),

  // 🔵 Đăng ký sự kiện
  createRegistration: yup.object({
    user_id: yup.number().integer().min(1).optional(),
    guest_name: yup
      .string()
      .trim()
      .when('user_id', {
        is: (val) => !val,
        then: (schema) => schema.required('Tên khách mời là bắt buộc'),
        otherwise: (schema) => schema.optional(),
      }),
    guest_email: yup
      .string()
      .email('Email không hợp lệ')
      .trim()
      .when('user_id', {
        is: (val) => !val,
        then: (schema) => schema.required('Email khách mời là bắt buộc'),
        otherwise: (schema) => schema.optional(),
      }),
    guest_phone: yup.string().trim().optional(),
    notes: yup.string().trim().optional(),
  }),

  // 🔴 Check-in
  checkIn: yup.object({
    registration_id: yup
      .number()
      .integer()
      .min(1)
      .required('ID đăng ký là bắt buộc'),
    notes: yup.string().trim().optional(),
  }),
};

export default EventSchema;
