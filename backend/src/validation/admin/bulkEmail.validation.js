// validation/admin/bulkEmail.validation.js

import * as yup from 'yup';

const BulkEmailSchema = {
  // Gửi bulk email
  sendBulk: yup.object({
    recipients: yup
      .array()
      .required('Recipients là bắt buộc')
      .min(1, 'Phải có ít nhất 1 recipient')
      .of(
        yup.object({
          email: yup
            .string()
            .email('Email không hợp lệ')
            .required('Email là bắt buộc'),
          variables: yup.object().optional(),
        }),
      ),
    options: yup
      .object({
        batchSize: yup
          .number()
          .integer('Batch size phải là số nguyên')
          .min(1, 'Batch size tối thiểu là 1')
          .max(100, 'Batch size tối đa là 100')
          .optional(),
        delay: yup
          .number()
          .min(0, 'Delay không được âm')
          .max(60000, 'Delay tối đa là 60000ms (60s)')
          .optional(),
        jobName: yup.string().max(255, 'Tên job tối đa 255 ký tự').optional(),
      })
      .optional(),
  }),
};

export default BulkEmailSchema;

