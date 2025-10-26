import express from 'express';
import { documentCategoryController } from '../../controllers/admin/index.js';

const Router = express.Router();

Router.get('/', documentCategoryController.getAll);
Router.get('/:id', documentCategoryController.getOne);
Router.post('/', documentCategoryController.create);
Router.put('/:id', documentCategoryController.update);
Router.delete('/:id', documentCategoryController.softDelete);
Router.patch('/:id/restore', documentCategoryController.restore);

export default Router;
