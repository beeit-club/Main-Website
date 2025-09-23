import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

export const verifyToken = async (req, res, next) => {
  // Lấy token từ header Authorization (thường có dạng "Bearer <token>")
  const token = req.headers.authorization;
  // Nếu không có token thì trả về lỗi 401 (chưa đăng nhập)
  if (!token) {
    return res.status(401).json({
      message: 'Bạn chưa đăng nhập.',
      errorCode: 'NO_TOKEN',
    });
  }

  // Tách lấy phần token thật sự (bỏ chữ "Bearer")
  const accessToken = token.split(' ')[1];
  // Xác thực token bằng secret key trong file .env
  jwt.verify(accessToken, config.JWT_ACCESS_TOKEN, (error, user) => {
    // Nếu có lỗi khi verify
    if (error) {
      // Trường hợp token hết hạn
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          message: 'Token đã hết hạn.',
          errorCode: 'TOKEN_EXPIRED',
        });
      }
      // Trường hợp token không hợp lệ (sai định dạng, sai chữ ký...)
      else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          message: 'Token không hợp lệ.',
          errorCode: 'INVALID_TOKEN',
        });
      }
      // Trường hợp token chưa tới thời gian có hiệu lực (nbf claim)
      else if (error.name === 'NotBeforeError') {
        return res.status(401).json({
          message: 'Token chưa có hiệu lực.',
          errorCode: 'TOKEN_NOT_ACTIVE',
        });
      }
      // Các lỗi khác
      else {
        return res.status(400).json({
          message: 'Lỗi xác thực token.',
          error: error.message,
        });
      }
    }

    // Nếu verify thành công, gán thông tin user (payload trong token) vào req
    req.user = user;

    // Cho phép request đi tiếp tới middleware hoặc route handler tiếp theo
    next();
  });
};
