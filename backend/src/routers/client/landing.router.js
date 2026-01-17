import express from 'express';
import LandingController from '../../controllers/client/landing.controller.js';

const router = express.Router();

router.get('/', LandingController.getLandingData);

export default router;
