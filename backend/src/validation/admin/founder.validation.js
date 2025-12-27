import * as yup from 'yup';

export const FounderSchema = {
  create: yup.object().shape({
    name: yup
      .string()
      .required('Họ tên là bắt buộc')
      .min(3, 'Họ tên phải có ít nhất 3 ký tự')
      .max(255, 'Họ tên không được vượt quá 255 ký tự'),
    role: yup
      .string()
      .required('Vai trò là bắt buộc')
      .min(3, 'Vai trò phải có ít nhất 3 ký tự')
      .max(255, 'Vai trò không được vượt quá 255 ký tự'),
    image_url: yup
      .string()
      .optional()
      .url('URL ảnh không hợp lệ')
      .max(500, 'URL không được vượt quá 500 ký tự')
      .nullable(),
    bio: yup
      .string()
      .optional()
      .max(1000, 'Tiểu sử không được vượt quá 1000 ký tự')
      .nullable(),
    achievements: yup
      .mixed()
      .transform((value, originalValue) => {
        // Nếu null/undefined/empty string, trả về null
        if (value === null || value === undefined || value === '') {
          return null;
        }
        
        // Nếu đã là array, lọc và trả về
        if (Array.isArray(value)) {
          const filtered = value.filter((item) => item && String(item).trim() !== '');
          return filtered.length > 0 ? filtered : null;
        }
        
        // Nếu là string, thử parse JSON
        if (typeof value === 'string') {
          try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
              const filtered = parsed.filter((item) => item && String(item).trim() !== '');
              return filtered.length > 0 ? filtered : null;
            }
          } catch (e) {
            // Nếu không parse được JSON, coi như null
            return null;
          }
        }
        
        return null;
      })
      .test('is-array-or-null', 'achievements must be an array or null', (value) => {
        return value === null || Array.isArray(value);
      })
      .optional()
      .nullable(),
    social_email: yup
      .string()
      .optional()
      .email('Email không hợp lệ')
      .max(255, 'Email không được vượt quá 255 ký tự')
      .nullable(),
    social_linkedin: yup
      .string()
      .optional()
      .url('LinkedIn URL không hợp lệ')
      .max(255, 'URL không được vượt quá 255 ký tự')
      .nullable(),
    social_github: yup
      .string()
      .optional()
      .url('GitHub URL không hợp lệ')
      .max(255, 'URL không được vượt quá 255 ký tự')
      .nullable(),
    display_order: yup
      .number()
      .integer('Thứ tự phải là số nguyên')
      .min(0, 'Thứ tự phải >= 0')
      .optional()
      .nullable(),
    is_active: yup
      .number()
      .oneOf([0, 1], 'Trạng thái không hợp lệ (chỉ 0 hoặc 1)')
      .optional()
      .default(1),
    is_founder: yup
      .number()
      .oneOf([0, 1], 'Loại không hợp lệ (chỉ 0 hoặc 1)')
      .optional()
      .default(0),
  }),

  update: yup.object().shape({
    name: yup
      .string()
      .optional()
      .min(3, 'Họ tên phải có ít nhất 3 ký tự')
      .max(255, 'Họ tên không được vượt quá 255 ký tự'),
    role: yup
      .string()
      .optional()
      .min(3, 'Vai trò phải có ít nhất 3 ký tự')
      .max(255, 'Vai trò không được vượt quá 255 ký tự'),
    image_url: yup
      .string()
      .optional()
      .url('URL ảnh không hợp lệ')
      .max(500, 'URL không được vượt quá 500 ký tự')
      .nullable(),
    bio: yup
      .string()
      .optional()
      .max(1000, 'Tiểu sử không được vượt quá 1000 ký tự')
      .nullable(),
    achievements: yup
      .mixed()
      .transform((value, originalValue) => {
        // Nếu null/undefined/empty string, trả về null
        if (value === null || value === undefined || value === '') {
          return null;
        }
        
        // Nếu đã là array, lọc và trả về
        if (Array.isArray(value)) {
          const filtered = value.filter((item) => item && String(item).trim() !== '');
          return filtered.length > 0 ? filtered : null;
        }
        
        // Nếu là string, thử parse JSON
        if (typeof value === 'string') {
          try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
              const filtered = parsed.filter((item) => item && String(item).trim() !== '');
              return filtered.length > 0 ? filtered : null;
            }
          } catch (e) {
            // Nếu không parse được JSON, coi như null
            return null;
          }
        }
        
        return null;
      })
      .test('is-array-or-null', 'achievements must be an array or null', (value) => {
        return value === null || Array.isArray(value);
      })
      .optional()
      .nullable(),
    social_email: yup
      .string()
      .optional()
      .email('Email không hợp lệ')
      .max(255, 'Email không được vượt quá 255 ký tự')
      .nullable(),
    social_linkedin: yup
      .string()
      .optional()
      .url('LinkedIn URL không hợp lệ')
      .max(255, 'URL không được vượt quá 255 ký tự')
      .nullable(),
    social_github: yup
      .string()
      .optional()
      .url('GitHub URL không hợp lệ')
      .max(255, 'URL không được vượt quá 255 ký tự')
      .nullable(),
    display_order: yup
      .number()
      .integer('Thứ tự phải là số nguyên')
      .min(0, 'Thứ tự phải >= 0')
      .optional()
      .nullable(),
    is_active: yup
      .number()
      .oneOf([0, 1], 'Trạng thái không hợp lệ (chỉ 0 hoặc 1)')
      .optional(),
    is_founder: yup
      .number()
      .oneOf([0, 1], 'Loại không hợp lệ (chỉ 0 hoặc 1)')
      .optional(),
  }),

  reorder: yup.object().shape({
    display_order: yup
      .number()
      .required('Thứ tự là bắt buộc')
      .integer('Thứ tự phải là số nguyên')
      .min(0, 'Thứ tự phải >= 0'),
  }),

  toggle: yup.object().shape({
    is_active: yup
      .number()
      .required('Trạng thái là bắt buộc')
      .oneOf([0, 1], 'Trạng thái không hợp lệ (chỉ 0 hoặc 1)'),
  }),
};

