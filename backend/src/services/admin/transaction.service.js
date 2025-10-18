import { code, message } from '../../common/message/index.js';
import transactionModel from '../../models/admin/transaction.model.js';

const transactionService = {
  createTransaction: async (options) => {
    try {
      const transaction = await transactionModel.create(options);
      if (!transaction || !transaction.insertId) {
        throw new Error(
          message.Transaction.TRANSACTION_CREATE_FAILED,
          code.Transaction.TRANSACTION_CREATE_FAILED_CODE,
          null,
          500,
        );
      }
      return transaction;
    } catch (error) {
      throw error;
    }
  },
  updateTransaction: async (id, data) => {
    try {
      const transaction = await transactionModel.update(id, data);
      return transaction;
    } catch (error) {
      throw error;
    }
  },
  getAll: async (options) => {
    try {
      const transactions = await transactionModel.getAll(options);
      return transactions;
    } catch (error) {
      throw error;
    }
  },
  getById: async (id) => {
    try {
      const transaction = await transactionModel.getById(id);
      if (!transaction) {
        throw new ServiceError(
          message.Transaction.TRANSACTION_NOT_FOUND,
          code.Transaction.TRANSACTION_NOT_FOUND_CODE,
          null,
          404,
        );
      }
      return transaction;
    } catch (error) {
      throw error;
    }
  },
};
export default transactionService;
