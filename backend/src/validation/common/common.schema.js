// src/validations/common.schema.js
import * as yup from 'yup';

export const PaginationSchema = yup
  .object({
    page: yup
      .number()
      .transform((value, originalValue) => {
        const num = Number(originalValue);
        // Nếu không phải số hoặc nhỏ hơn 1 → trả về 1 (default)
        if (isNaN(num) || num < 1) return 1;
        return num;
      })
      .default(1),

    limit: yup
      .number()
      .transform((value, originalValue) => {
        const num = Number(originalValue);
        // Nếu không phải số hoặc nhỏ hơn 1 hoặc lớn hơn 100 → trả về 10 (default)
        if (isNaN(num) || num < 1 || num > 100) return 10;
        return num;
      })
      .default(10),
  })
  .default({ page: 1, limit: 10 });

export const params = {
  id: yup.object({
    id: yup
      .number()
      .typeError('Id phải là số')
      .integer('Id phải là số nguyên')
      .min(1, 'Id phải lớn hơn 1')
      .required('Thiếu id'),
  }),
};
