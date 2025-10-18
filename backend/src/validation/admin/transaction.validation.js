import * as yup from 'yup';

/**
 * Validation schema - Tạo giao dịch mới
 */
export const createTransactionSchema = yup.object().shape({
  amount: yup
    .number('Amount phải là số')
    .required('Amount là bắt buộc')
    .positive('Amount phải lớn hơn 0')
    .typeError('Amount phải là số'),

  type: yup
    .number('Type phải là số')
    .required('Type là bắt buộc')
    .oneOf([1, 2], 'Type phải là 1 (income) hoặc 2 (expense)')
    .typeError('Type phải là số'),

  description: yup
    .string('Description phải là chuỗi')
    .required('Description là bắt buộc')
    .min(5, 'Description phải có ít nhất 5 ký tự')
    .max(500, 'Description không được vượt quá 500 ký tự')
    .trim(),

  attachment_url: yup
    .string('Attachment URL phải là chuỗi')
    .url('Attachment URL không hợp lệ')
    .nullable()
    .optional(),
});

/**
 * Validation schema - Cập nhật giao dịch
 */
export const updateTransactionSchema = yup.object().shape({
  amount: yup
    .number('Amount phải là số')
    .positive('Amount phải lớn hơn 0')
    .typeError('Amount phải là số')
    .optional(),

  type: yup
    .number('Type phải là số')
    .oneOf([1, 2], 'Type phải là 1 (income) hoặc 2 (expense)')
    .typeError('Type phải là số')
    .optional(),

  description: yup
    .string('Description phải là chuỗi')
    .min(5, 'Description phải có ít nhất 5 ký tự')
    .max(500, 'Description không được vượt quá 500 ký tự')
    .trim()
    .optional(),

  attachment_url: yup
    .string('Attachment URL phải là chuỗi')
    .url('Attachment URL không hợp lệ')
    .nullable()
    .optional(),
});
