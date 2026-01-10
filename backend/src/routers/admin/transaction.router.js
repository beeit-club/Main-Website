import express from 'express';
import transactionController from '../../controllers/admin/transantion.controller.js';

const router = express.Router();

router.post('/', transactionController.createTransaction);
router.get('/balance', transactionController.getBalance);
router.get('/', transactionController.getAll);
router.patch('/:id', transactionController.updateTransaction);
router.get('/:id', transactionController.getById);

export default router;
