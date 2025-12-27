// validation/admin/beeitHero.validation.js

import * as yup from 'yup';

const BeeitHeroSchema = {
  // Cập nhật Hero
  update: yup.object({
    background_image_url: yup
      .string()
      .trim()
      .nullable()
      .test('is-url', 'URL ảnh không hợp lệ', function(value) {
        if (!value || value.trim() === '') return true;
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      })
      .optional(),
    background_image_alt: yup.string().trim().max(200).optional(),
    overlay_opacity: yup
      .number()
      .min(0)
      .max(1)
      .optional(),
    title_line1: yup.string().trim().max(100).optional(),
    title_line2: yup.string().trim().max(100).optional(),
    subtitle: yup.string().trim().optional(),
    is_active: yup.boolean().optional(),
  }),
};

export default BeeitHeroSchema;

