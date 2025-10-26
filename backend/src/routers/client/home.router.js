import express from 'express';
import { HomeControler } from '../../controllers/client/index.js';

const Router = express.Router();

Router.get('/category', HomeControler.getCategories);
Router.get('/tags', HomeControler.getTags);

export default Router;
