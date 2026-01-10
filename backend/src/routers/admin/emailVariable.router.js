
import express from 'express';
import emailVariableController from '../../controllers/admin/emailVariable.controller.js';
import { checkAdmin } from '../../middlewares/role.handler.js';

const router = express.Router();

router.use(checkAdmin);
router.get('/', emailVariableController.getAllVariables);

export default router;
