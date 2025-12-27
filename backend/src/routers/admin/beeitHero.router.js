// routers/admin/beeitHero.router.js

import express from 'express';
import { beeitHeroController } from '../../controllers/admin/index.js';

const Router = express.Router();

// Lấy Hero
Router.get('/', beeitHeroController.getHero);

// Cập nhật Hero
Router.put('/:id', beeitHeroController.updateHero);

export default Router;

