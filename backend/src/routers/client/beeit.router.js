// routers/client/beeit.router.js

import express from 'express';
import { BeeitController } from '../../controllers/client/index.js';

const Router = express.Router();

// Lấy tất cả dữ liệu BeeIT Landing Page (Public)
Router.get('/', BeeitController.getBeeitData);

// Submit email từ Footer form (Public)
Router.post('/email-submit', BeeitController.submitEmail);

export default Router;

