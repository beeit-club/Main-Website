
import express from 'express';
import LandingController from '../../controllers/admin/landing.controller.js';

const router = express.Router();

// Get all items for a section
router.get('/:section', LandingController.getSectionData);

// Create new item
router.post('/:section', LandingController.createItem);

// Update order
router.patch('/:section/reorder', LandingController.reorderItems);

// Update item
router.put('/:section/:id', LandingController.updateItem);

// Delete item
router.delete('/:section/:id', LandingController.deleteItem);

export default router;
