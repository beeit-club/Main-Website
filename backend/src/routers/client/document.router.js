// src/routers/client/document.router.js
import express from 'express';
import documentController from '../../controllers/client/document.controller.js';
import { middleware } from '../../middlewares/index.js';
import { verifyTokenOptional } from '../../middlewares/jwt.js'; // Cần import middleware optional này

const Router = express.Router();

Router.get('/categories', documentController.getCategories);
Router.get('/my-documents', middleware.verifyToken, documentController.getMyDocuments);
Router.get('/', verifyTokenOptional, documentController.getDocuments);
// Route chi tiết cần verifyTokenOptional để check role nếu là member_only document
Router.get('/:slug', verifyTokenOptional, documentController.getDocumentBySlug);

export default Router;
