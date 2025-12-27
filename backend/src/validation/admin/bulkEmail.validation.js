// validation/admin/bulkEmail.validation.js

import * as yup from 'yup';

const BulkEmailSchema = {
  // Gửi bulk email (manual recipients)
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

  // Gửi bulk email từ user IDs
  sendBulkFromUsers: yup.object({
    user_ids: yup
      .array()
      .required('User IDs là bắt buộc')
      .min(1, 'Phải có ít nhất 1 user ID')
      .of(
        yup
          .number()
          .integer('User ID phải là số nguyên')
          .positive('User ID phải là số dương')
          .required(),
      ),
    additional_data: yup.object().optional(),
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

  // Gửi bulk email từ filters
  sendBulkFromFilters: yup.object({
    filters: yup
      .object({
        role_id: yup
          .number()
          .integer('Role ID phải là số nguyên')
          .positive('Role ID phải là số dương')
          .optional(),
        search: yup.string().max(255, 'Search tối đa 255 ký tự').optional(),
        is_member_only: yup.boolean().optional(),
      })
      .optional(),
    additional_data: yup.object().optional(),
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
