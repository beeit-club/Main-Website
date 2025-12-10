// validation/admin/emailTemplate.validation.js

import * as yup from 'yup';

const EmailTemplateSchema = {
  // Tạo template mới
  create: yup.object({
    name: yup
      .string()
      .required('Tên template là bắt buộc')
      .max(255, 'Tên template tối đa 255 ký tự'),
    slug: yup
      .string()
      .max(255, 'Slug tối đa 255 ký tự')
      .matches(/^[a-z0-9-]+$/, 'Slug chỉ chứa chữ thường, số và dấu gạch ngang')
      .optional(),
    subject: yup
      .string()
      .required('Subject là bắt buộc')
      .max(500, 'Subject tối đa 500 ký tự'),
    html_content: yup
      .string()
      .required('Nội dung HTML là bắt buộc')
      .min(10, 'Nội dung HTML quá ngắn'),
    text_content: yup.string().optional(),
    category: yup
      .string()
      .oneOf(
        ['authentication', 'application', 'event', 'document', 'system', 'custom'],
        'Category không hợp lệ',
      )
      .optional(),
    description: yup.string().max(1000, 'Mô tả tối đa 1000 ký tự').optional(),
    variables: yup.array().optional(),
    default_variables: yup.object().optional(),
    is_active: yup.boolean().optional(),
  }),

  // Cập nhật template
  update: yup.object({
    name: yup.string().max(255, 'Tên template tối đa 255 ký tự').optional(),
    slug: yup
      .string()
      .max(255, 'Slug tối đa 255 ký tự')
      .matches(/^[a-z0-9-]+$/, 'Slug chỉ chứa chữ thường, số và dấu gạch ngang')
      .optional(),
    subject: yup.string().max(500, 'Subject tối đa 500 ký tự').optional(),
    html_content: yup.string().min(10, 'Nội dung HTML quá ngắn').optional(),
    text_content: yup.string().optional(),
    category: yup
      .string()
      .oneOf(
        ['authentication', 'application', 'event', 'document', 'system', 'custom'],
        'Category không hợp lệ',
      )
      .optional(),
    description: yup.string().max(1000, 'Mô tả tối đa 1000 ký tự').optional(),
    variables: yup.array().optional(),
    default_variables: yup.object().optional(),
    is_active: yup.boolean().optional(),
  }),

  // Preview template
  preview: yup.object({
    variables: yup.object().optional(),
  }),

  // Test send template
  testSend: yup.object({
    recipient_email: yup
      .string()
      .email('Email không hợp lệ')
      .required('Email người nhận là bắt buộc'),
    variables: yup.object().optional(),
  }),
};

export default EmailTemplateSchema;

