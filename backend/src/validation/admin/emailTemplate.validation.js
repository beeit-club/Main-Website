// validation/admin/emailTemplate.validation.js

import * as yup from 'yup';

const EmailTemplateSchema = {
  // Tạo template mới
  create: yup.object({
    name: yup.string().required('Tên template là bắt buộc').max(255),
    subject: yup.string().required('Subject là bắt buộc').max(500),
    body: yup.string().optional(), // Allow optional temporarily for legacy
    html_content: yup.string().optional(),
    header: yup.string().optional(),
    footer: yup.string().optional(),
    category: yup
      .string()
      .oneOf(
        [
          'Authentication',
          'Recruitment',
          'Events',
          'Documents',
          'System',
          'Finance',
          'custom'
        ],
        'Category không hợp lệ',
      )
      .optional(),
    variables: yup.mixed().optional(),
    default_variables: yup.mixed().optional(),
    is_active: yup.boolean().optional(),
  }),

  update: yup.object({
    name: yup.string().max(255).optional(),
    subject: yup.string().max(500).optional(),
    body: yup.string().optional(),
    html_content: yup.string().optional(),
    header: yup.string().optional(),
    footer: yup.string().optional(),
    category: yup
      .string()
      .oneOf(
        [
          'Authentication',
          'Recruitment',
          'Events',
          'Documents',
          'System',
          'Finance',
          'custom'
        ],
        'Category không hợp lệ',
      )
      .optional(),
    variables: yup.mixed().optional(),
    default_variables: yup.mixed().optional(),
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

