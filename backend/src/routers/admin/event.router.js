// routers/admin/event.router.js

import express from 'express';
import { eventController } from '../../controllers/admin/index.js';
// Giả sử bạn có middleware để xác thực admin
// import { isAdmin } from '../../middlewares/auth.handler.js';

const Router = express.Router();

// --- Event Routes ---
Router.get('/', eventController.getEvents);
Router.post('/', eventController.createEvent);
Router.get('/:id', eventController.getEventById);
Router.put('/:id', eventController.updateEvent);
Router.delete('/:id', eventController.deleteEvent);

// --- Event Registration Routes ---
Router.get('/:id/registrations', eventController.getRegistrations);
Router.post('/:id/registrations', eventController.createRegistration);

// --- Event Attendance Routes ---
Router.get('/:id/attendances', eventController.getAttendances);
Router.post('/:id/attendances/check-in', eventController.performCheckIn);

export default Router;
