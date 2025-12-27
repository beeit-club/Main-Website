// routers/admin/beeitEmailSubmission.router.js

import express from 'express';
import { beeitEmailSubmissionController } from '../../controllers/admin/index.js';

const Router = express.Router();

// Lấy tất cả submissions (Admin)
Router.get('/', beeitEmailSubmissionController.getSubmissions);

// Lấy statistics
Router.get('/statistics', beeitEmailSubmissionController.getStatistics);

// Lấy submission theo ID
Router.get('/:id', beeitEmailSubmissionController.getSubmissionById);

// Tạo submission mới (Public - từ form)
Router.post('/', beeitEmailSubmissionController.createSubmission);

// Cập nhật submission
Router.put('/:id', beeitEmailSubmissionController.updateSubmission);

// Mark as processed
Router.patch('/:id/processed', beeitEmailSubmissionController.markAsProcessed);

// Mark as archived
Router.patch('/:id/archived', beeitEmailSubmissionController.markAsArchived);

export default Router;

