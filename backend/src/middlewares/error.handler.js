// src/middlewares/error.handler.js

import { utils } from '../utils/index.js';
import { message } from '../common/message/index.js';
import ServiceError from '../error/service.error.js';

// Hàm Higher-Order để bọc các hàm controller async
const asyncWrapper = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((error) => {
    // Bắt lỗi nghiệp vụ (ServiceError)
    // Bây giờ, kiểm tra này sẽ hoạt động cho mọi lỗi từ bất kỳ service nào
    if (error instanceof ServiceError) {
      return utils.businessError(
        res,
        error.message,
        error.code,
        error.details ?? null,
        error.status,
      );
    }
    // Bắt các lỗi hệ thống khác không lường trước được
    console.error('Lỗi hệ thống không xác định:', error);
    return utils.serverError(res, message.Auth.SERVER_ERROR);
  });
};

export default asyncWrapper;
