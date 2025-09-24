// src/services/auth.service.js

import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthModel } from '../../models/auth/index.js';
import { config } from '../../config/index.js';
import { code, message } from '../../common/message/index.js';
import ServiceError from '../../error/service.error.js';

const AuthService = {
  // Logic đăng ký user mới
  registerUser: async (fullname, email, password) => {
    // Kiểm tra email đã tồn tại chưa
    const existingEmail = await AuthModel.isEmail(email);
    if (existingEmail[0]?.so_luong > 0) {
      throw new ServiceError(
        message.Auth.EMAIL_EXISTS,
        code.Auth.EMAIL_EXISTS,
        'Email đã tồn tại.',
        400,
      );
    }

    // Mã hóa mật khẩu
    const salt = await bcryptjs.genSalt(10);
    const password_hash = await bcryptjs.hash(password, salt);

    // Avatar mặc định
    const avatar_url =
      'https://s3.ap-southeast-1.amazonaws.com/cdn.vntre.vn/default/avatar-mac-dinh-12-1724862391.jpg';

    // Đăng ký user mới
    const result = await AuthModel.register(
      fullname,
      email,
      password_hash,
      avatar_url,
    );

    if (result.affectedRows === 0) {
      throw new ServiceError(
        message.Auth.REGISTRATION_FAILED,
        code.Auth.REGISTRATION_FAILED,
        'Không thể tạo tài khoản lúc này',
        500,
      );
    }

    return {
      user_id: result.insertId,
      email: email,
      fullname: fullname,
    };
  },

  // Logic đăng nhập
  loginUser: async (email, password) => {
    // Kiểm tra user tồn tại
    const getUser = await AuthModel.isEmail(email, true);
    if (getUser.length <= 0) {
      throw new ServiceError(
        message.Auth.INVALID_CREDENTIALS,
        code.Auth.INVALID_CREDENTIALS,
        'Email hoặc password không đúng',
        401,
      );
    }

    const user = getUser[0];

    // Kiểm tra tài khoản có bị khóa không
    if (!user.is_active) {
      throw new ServiceError(
        message.Auth.ACCOUNT_BLOCKED,
        code.Auth.ACCOUNT_BLOCKED,
        'Tài khoản của bạn đã bị khóa',
        403,
      );
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcryptjs.compare(
      password,
      user.password_hash,
    );
    if (!isPasswordValid) {
      throw new ServiceError(
        message.Auth.INVALID_CREDENTIALS,
        code.Auth.INVALID_CREDENTIALS,
        'Mật khẩu không khớp',
        401,
      );
    }

    // Xóa tất cả session cũ và tạo session mới
    await AuthModel.deleteSessionById(user.id);
    const refreshToken = AuthService.createRefreshToken(user);
    const accessToken = AuthService.createAccessToken(user);
    await AuthModel.insertSessionById(user.id, refreshToken);

    return {
      user,
      accessToken,
      refreshToken,
    };
  },

  // Logic đăng xuất
  logoutUser: async (user_id) => {
    if (!user_id) {
      throw new ServiceError(
        message.Auth.INVALID_USER,
        code.Auth.INVALID_USER,
        'Không thể xác định người dùng',
        400,
      );
    }

    const result = await AuthModel.logout(user_id);
    if (result.affectedRows === 0) {
      throw new ServiceError(
        message.Auth.LOGOUT_FAILED,
        code.Auth.LOGOUT_FAILED,
        'Đăng xuất thất bại',
        500,
      );
    }
  },

  // Logic cấp lại access token
  refreshUserToken: async (refreshToken) => {
    if (!refreshToken) {
      throw new ServiceError(
        message.Auth.NO_REFRESH_TOKEN,
        code.Auth.NO_REFRESH_TOKEN,
        'Bạn chưa đăng nhập',
        401,
      );
    }

    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_TOKEN);
      const { id } = decoded;

      // Kiểm tra session trong database
      const sessionData = await AuthModel.checkSession(id);
      if (sessionData.length === 0) {
        throw new ServiceError(
          message.Auth.SESSION_NOT_FOUND,
          code.Auth.SESSION_NOT_FOUND,
          'Phiên đăng nhập không tồn tại',
          403,
        );
      }

      // Kiểm tra refresh token có khớp không
      const storedRefreshToken = sessionData[0].refresh_token;
      if (storedRefreshToken !== refreshToken) {
        throw new ServiceError(
          message.Auth.INVALID_REFRESH_TOKEN,
          code.Auth.INVALID_REFRESH_TOKEN,
          'Phiên đăng nhập không hợp lệ',
          403,
        );
      }

      // Lấy thông tin user mới nhất
      const userData = await AuthModel.getUserById(id);
      if (userData.length === 0) {
        throw new ServiceError(
          message.Auth.USER_NOT_FOUND,
          code.Auth.USER_NOT_FOUND,
          'Không tìm thấy người dùng',
          404,
        );
      }

      const user = userData[0];

      // Xóa session cũ và tạo session mới
      await AuthModel.deleteSessionById(id);
      const newAccessToken = AuthService.createAccessToken(user);
      const newRefreshToken = AuthService.createRefreshToken(user);
      await AuthModel.insertSessionById(id, newRefreshToken);

      return {
        accessToken: newAccessToken,
        newRefreshToken,
      };
    } catch (error) {
      // Bắt lỗi khi JWT hết hạn hoặc không hợp lệ
      if (
        error.name === 'TokenExpiredError' ||
        error.name === 'JsonWebTokenError'
      ) {
        throw new ServiceError(
          message.Auth.REFRESH_TOKEN_EXPIRED,
          code.Auth.REFRESH_TOKEN_EXPIRED,
          'Token không hợp lệ hoặc đã hết hạn',
          403,
        );
      }
      // Ném lại các lỗi khác để controller bắt và xử lý như lỗi hệ thống
      throw error;
    }
  },

  // Logic lấy thông tin profile
  getProfile: async (user_id) => {
    const userData = await AuthModel.getUserById(user_id);
    if (userData.length === 0) {
      throw new ServiceError(
        message.Auth.USER_NOT_FOUND,
        code.Auth.USER_NOT_FOUND,
        'Không tìm thấy người dùng',
        404,
      );
    }
    return userData[0];
  },

  // Tạo access token
  createAccessToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role_name || 'Guest',
        fullname: user.fullname,
      },
      config.JWT_ACCESS_TOKEN,
      { expiresIn: Number(config.JWT_ACCESS_EXPIRES_IN) },
    );
  },

  // Tạo refresh token
  createRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      config.JWT_REFRESH_TOKEN,
      { expiresIn: Number(config.JWT_REFRESH_EXPIRES_IN) },
    );
  },
};

export { AuthService };
