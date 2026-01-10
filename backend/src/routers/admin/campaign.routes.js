
import express from 'express';
import campaignController from '../../controllers/admin/campaign.controller.js';
import { checkAdmin } from '../../middlewares/role.handler.js';

const router = express.Router();

// Tất cả routes admin đều yêu cầu Admin
router.use(checkAdmin);

router.post('/', campaignController.create);
router.get('/', campaignController.getAll);
router.get('/:id', campaignController.getDetail);

export default router;
