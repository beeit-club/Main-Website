export const success = (res, message = 'Thành công', data = {}) => {
  return res.json({ status: 'success', message, data });
};
export const validationError = (
  res,
  fields = {},
  message = 'Dữ liệu không hợp lệ',
) => {
  return res.status(400).json({
    status: 'error',
    message,
    error: { code: 'VALIDATION_ERROR', fields },
  });
};
// ❌ Lỗi nghiệp vụ

export const businessError = (
  res,
  message = 'Có lỗi nghiệp vụ',
  code = 'BUSINESS_ERROR',
  details = null,
  statusCode = 400,
) => {
  return res
    .status(statusCode)
    .json({ status: 'error', message, error: { code, details } });
};
// ❌ Lỗi server
export const serverError = (
  res,
  message = 'Lỗi hệ thống, vui lòng thử lại sau',
) => {
  return res
    .status(500)
    .json({ status: 'error', message, error: { code: 'SERVER_ERROR' } });
};
