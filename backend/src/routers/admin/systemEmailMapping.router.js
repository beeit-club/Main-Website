// routers/admin/systemEmailMapping.router.js
import express from 'express';
import SystemEmailMappingController from '../../controllers/admin/systemEmailMapping.controller.js';

const router = express.Router();

router.get('/', SystemEmailMappingController.getAllMappings);
router.patch('/:actionKey', SystemEmailMappingController.updateMapping);

export default router;
