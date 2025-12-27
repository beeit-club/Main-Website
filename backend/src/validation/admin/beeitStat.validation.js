// validation/admin/beeitStat.validation.js

import * as yup from 'yup';

const BeeitStatSchema = {
  // Tạo Stat
  create: yup.object({
    stat_key: yup
      .string()
      .trim()
      .required('Stat key là bắt buộc')
      .matches(/^[a-z_]+$/, 'Stat key chỉ được chứa chữ thường và dấu gạch dưới')
      .max(50),
    label: yup
      .string()
      .trim()
      .required('Label là bắt buộc')
      .max(100),
    value: yup
      .number()
      .required('Value là bắt buộc')
      .min(0)
      .integer(),
    suffix: yup.string().trim().max(10).default(''),
    display_order: yup.number().integer().min(0).default(0),
    is_active: yup.boolean().default(true),
  }),

  // Cập nhật Stat
  update: yup.object({
    stat_key: yup
      .string()
      .trim()
      .matches(/^[a-z_]+$/, 'Stat key chỉ được chứa chữ thường và dấu gạch dưới')
      .max(50)
      .optional(),
    label: yup.string().trim().max(100).optional(),
    value: yup.number().min(0).integer().optional(),
    suffix: yup.string().trim().max(10).optional(),
    display_order: yup.number().integer().min(0).optional(),
    is_active: yup.boolean().optional(),
  }),
};

export default BeeitStatSchema;

