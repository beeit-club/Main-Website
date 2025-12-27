// routers/admin/beeitFooter.router.js

import express from 'express';
import { beeitFooterController } from '../../controllers/admin/index.js';

const Router = express.Router();

// Lấy Footer Settings
Router.get('/', beeitFooterController.getFooterSettings);

// Cập nhật Footer Settings
Router.put('/:id', beeitFooterController.updateFooterSettings);

export default Router;

