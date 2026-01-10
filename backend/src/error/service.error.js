// src/errors/service.error.js

/**
 * @class ServiceError
 * @description Lớp lỗi tùy chỉnh cho các lỗi nghiệp vụ.
 */
class ServiceError extends Error {
  constructor(message, code, details, status = 400) {
    super(message);
    this.name = 'ServiceError';
    this.code = code;
    this.details = details;
    this.status = status;
  }
}

export default ServiceError;
