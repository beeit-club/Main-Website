import express from 'express';
import applicationController from '../../controllers/admin/application.controller.js';

const Router = express.Router();

Router.get('/', applicationController.getApplications);
Router.patch('/:id/approve', applicationController.approveApplication);
Router.patch('/:id/reject', applicationController.rejectApplication);
Router.post('/', applicationController.createApplication);
Router.get('/:id', applicationController.getApplicationById);

export default Router;
