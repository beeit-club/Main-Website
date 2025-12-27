// controllers/admin/beeitHero.controller.js

import asyncWrapper from '../../middlewares/error.handler.js';
import { beeitHeroService } from '../../services/admin/index.js';
import { utils } from '../../utils/index.js';
import BeeitHeroSchema from '../../validation/admin/beeitHero.validation.js';
import { params } from '../../validation/common/common.schema.js';

const beeitHeroController = {
  // Lấy Hero
  getHero: asyncWrapper(async (req, res) => {
    const hero = await beeitHeroService.getHero();
    utils.success(res, 'Lấy thông tin Hero thành công', { hero });
  }),

  // Cập nhật Hero
  updateHero: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;

    const valid = await BeeitHeroSchema.update.validate(req.body, {
      stripUnknown: true,
      abortEarly: false,
    });

    await beeitHeroService.updateHero(id, valid);
    const hero = await beeitHeroService.getHero();
    utils.success(res, 'Cập nhật Hero thành công', { hero });
  }),
};

export default beeitHeroController;

