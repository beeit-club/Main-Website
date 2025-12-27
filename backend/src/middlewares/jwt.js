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

/**
 * Middleware JWT tùy chọn - không bắt buộc đăng nhập
 * Nếu có token thì parse và gán vào req.user, nếu không có thì tiếp tục (req.user = undefined)
 */
export const verifyTokenOptional = async (req, res, next) => {
  // Lấy token từ header Authorization
  const authHeader = req.headers.authorization;
  
  console.log('=== DEBUG: verifyTokenOptional ===');
  console.log('Authorization header:', authHeader);
  console.log('Has auth header:', !!authHeader);
  
  // Nếu không có token thì tiếp tục (không bắt buộc đăng nhập)
  if (!authHeader) {
    console.log('No authorization header found, setting req.user = undefined');
    req.user = undefined;
    return next();
  }

  // Tách lấy phần token thật sự (bỏ chữ "Bearer ")
  let accessToken;
  if (authHeader.startsWith('Bearer ')) {
    accessToken = authHeader.substring(7); // Bỏ "Bearer "
  } else {
    accessToken = authHeader; // Nếu không có "Bearer " thì lấy nguyên
  }
  
  console.log('Access token extracted:', accessToken ? 'Yes (length: ' + accessToken.length + ')' : 'No');
  
  if (!accessToken) {
    console.log('No access token found after extraction');
    req.user = undefined;
    return next();
  }
  
  // Xác thực token bằng secret key trong file .env
  jwt.verify(accessToken, config.JWT_ACCESS_TOKEN, (error, user) => {
    // Nếu có lỗi khi verify, bỏ qua (không bắt buộc đăng nhập)
    if (error) {
      console.log('Token verification failed:', error.name, error.message);
      req.user = undefined;
      return next();
    }

    // Nếu verify thành công, gán thông tin user (payload trong token) vào req
    console.log('Token verified successfully');
    console.log('User payload:', JSON.stringify(user, null, 2));
    console.log('User ID:', user?.id);
    req.user = user;
    console.log('req.user set successfully');
    console.log('================================');
    next();
  });
};
