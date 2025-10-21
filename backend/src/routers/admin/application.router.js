import express from 'express';
import applicationController from '../../controllers/admin/application.controller.js';

const Router = express.Router();

Router.get('/', applicationController.getApplications);
Router.get();

export default Router;
