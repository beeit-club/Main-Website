import asyncWrapper from '../../middlewares/error.handler.js';
import transactionService from '../../services/admin/transaction.service.js';
import { utils } from '../../utils/index.js';
import {
  createTransactionSchema,
  updateTransactionSchema,
} from '../../validation/admin/transaction.validation.js';
import {
  PaginationSchema,
  params,
} from '../../validation/common/common.schema.js';

const transactionController = {
  getAll: asyncWrapper(async (req, res) => {
    const query = PaginationSchema.cast(req.query);
    const valid = await PaginationSchema.validate(query, {
      stripUnknown: true,
    });
    const { type, sortBy, sortDirection } = req.query;
    const result = await transactionService.getAll({
      ...valid,
      filters: {
        type,
        sortBy,
        sortDirection,
      },
    });
    return utils.success(res, 'Lấy danh sách giao dịch thành công', result);
  }),
  getById: asyncWrapper(async (req, res) => {
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;
    const transaction = await transactionService.getById(id);
    return utils.success(res, 'Lấy thông tin giao dịch thành công', {
      transaction,
    });
  }),
  createTransaction: asyncWrapper(async (req, res) => {
    await createTransactionSchema.validate(req.body, { abortEarly: false });
    const { amount, type, description, attachment_url } = req.body;
    const created_by = req.user.id;
    const transactionData = {
      amount,
      type,
      description,
      attachment_url,
      created_by,
    };
    const transaction = await transactionService.createTransaction(
      transactionData,
    );
    utils.success(res, 'Tạo giao dịch thành công', {
      id: transaction.insertId,
      ...transactionData,
    });
  }),
  updateTransaction: asyncWrapper(async (req, res) => {
    await updateTransactionSchema.validate(req.body, { abortEarly: false });
    await params.id.validate(req.params, { abortEarly: false });
    const { id } = req.params;
    const { amount, type, description, attachment_url } = req.body;
    const updated_by = req.user.id;
    const transactionData = {
      ...(amount && { amount }),
      ...(type && { type }),
      ...(description && { description }),
      ...(attachment_url && { attachment_url }),
      updated_by,
    };
    const transaction = await transactionService.updateTransaction(
      id,
      transactionData,
    );
    utils.success(res, 'Tạo giao dịch thành công', {
      id: transaction.insertId,
      ...transactionData,
    });
  }),
};
export default transactionController;
