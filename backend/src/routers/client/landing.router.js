import express from 'express';
import { LandingController } from '../../controllers/client/index.js';

const Router = express.Router();

// Lấy tất cả landing content
Router.get('/content', LandingController.getContent);

// Lấy Memory Flow items
Router.get('/memory-flow', LandingController.getMemoryFlow);

// Lấy Founders & Members
Router.get('/founders', LandingController.getFounders);

export default Router;

