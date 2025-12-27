// validation/admin/beeitFooter.validation.js

import * as yup from 'yup';

const BeeitFooterSchema = {
  // Cập nhật Footer Settings
  update: yup.object({
    terminal_prompt: yup.string().trim().max(100).optional(),
    heading_text: yup.string().trim().max(200).optional(),
    subheading_text: yup.string().trim().max(300).optional(),
    command_prompt: yup.string().trim().max(100).optional(),
    command_text: yup.string().trim().max(100).optional(),
    placeholder_text: yup.string().trim().max(200).optional(),
    button_text: yup.string().trim().max(100).optional(),
    contact_email: yup
      .string()
      .trim()
      .email('Email không hợp lệ')
      .max(200)
      .optional(),
    location_text: yup.string().trim().max(200).optional(),
    github_url: yup
      .string()
      .trim()
      .url('URL không hợp lệ')
      .max(500)
      .nullable()
      .optional(),
    facebook_url: yup
      .string()
      .trim()
      .url('URL không hợp lệ')
      .max(500)
      .nullable()
      .optional(),
    instagram_url: yup
      .string()
      .trim()
      .url('URL không hợp lệ')
      .max(500)
      .nullable()
      .optional(),
    copyright_text: yup.string().trim().max(500).optional(),
  }),
};

export default BeeitFooterSchema;

