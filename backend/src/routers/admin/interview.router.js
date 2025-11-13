import express from 'express';
import interviewController from '../../controllers/admin/interview.controller.js';

const Router = express.Router();

Router.get('/', interviewController.getAll);
Router.post('/', interviewController.create);
Router.get('/:id', interviewController.getById);
Router.put('/:id', interviewController.update);
Router.delete('/:id', interviewController.delete);

export default Router;
