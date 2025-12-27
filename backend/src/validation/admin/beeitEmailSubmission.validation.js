// validation/admin/beeitEmailSubmission.validation.js

import * as yup from 'yup';

const BeeitEmailSubmissionSchema = {
  // Tạo Email Submission (từ form)
  create: yup.object({
    email: yup
      .string()
      .trim()
      .required('Email là bắt buộc')
      .email('Email không hợp lệ')
      .max(200),
  }),

  // Cập nhật Email Submission
  update: yup.object({
    status: yup
      .string()
      .oneOf(['new', 'processed', 'archived'], 'Status không hợp lệ')
      .optional(),
    notes: yup.string().trim().optional(),
  }),
};

export default BeeitEmailSubmissionSchema;

