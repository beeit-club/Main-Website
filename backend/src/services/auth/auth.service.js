// src/services/auth.service.js

import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { AuthModel } from '../../models/auth/index.js';
import { config } from '../../config/index.js';
import { code, message } from '../../common/message/index.js';
import ServiceError from '../../error/service.error.js';
import { utils } from '../../utils/index.js';
import { emailService } from '../email/emailService.js';
const client = new OAuth2Client({
  clientId: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_CLIENT_SECRET,
  redirectUri: config.GOOGLE_REDIRECT_URI,
});
const AuthService = {
  // Logic đăng ký user mới
  registerUser: async (fullname, email) => {
    // Kiểm tra email đã tồn tại chưa
    const existingEmail = await AuthModel.isEmail(email);
    if (existingEmail?.so_luong > 0) {
      throw new ServiceError(
        message.Auth.EMAIL_EXISTS,
        code.Auth.EMAIL_EXISTS,
        'Email đã tồn tại.',
        400,
      );
    }

    // Mã hóa mật khẩu
    // Avatar mặc định
    const avatar_url =
      'https://s3.ap-southeast-1.amazonaws.com/cdn.vntre.vn/default/avatar-mac-dinh-12-1724862391.jpg';

    // Đăng ký user mới
    const result = await AuthModel.register(fullname, email, avatar_url);

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
  googleLogin: async (code, redirect_uri) => {
    const { tokens } = await client.getToken({ code, redirect_uri });

    if (!tokens.id_token) throw new Error('No id_token returned from Google');

    // 2. Verify token
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload(); // { email, name, picture, sub }

    // 3. Tìm hoặc tạo user trong DB
    const user = await AuthModel.findOrCreate(payload);
    await AuthModel.deleteSessionById(user.id);
    const accessToken = utils.createAccessToken(user);
    const refreshToken = utils.createRefreshToken(user);
    await AuthModel.insertSessionById(user.id, refreshToken);

    return { refreshToken, accessToken, user };
  },

  // Logic đăng nhập
  loginUser: async (email) => {
    // Kiểm tra user tồn tại
    const getUser = await AuthModel.isEmail(email, true);
    if (!getUser) {
      throw new ServiceError(
        message.Auth.INVALID_CREDENTIALS,
        code.Auth.INVALID_CREDENTIALS,
        'Email không tồn tại',
        401,
      );
    }

    const user = getUser;
    // Kiểm tra tài khoản có bị khóa không
    if (!user.is_active) {
      throw new ServiceError(
        message.Auth.ACCOUNT_BLOCKED,
        code.Auth.ACCOUNT_BLOCKED,
        'Tài khoản của bạn đã bị khóa',
        403,
      );
    }
    await AuthService.resendVerification(email);
    const TokenOTP = utils.createOtpToken(user.email);

    return {
      user,
      TokenOTP,
    };
  },
  resendVerification: async (email) => {
    // tạo otp
    const getUser = await AuthModel.isEmail(email, true);
    if (getUser.length <= 0) {
      throw new ServiceError(
        message.Auth.INVALID_CREDENTIALS,
        code.Auth.INVALID_CREDENTIALS,
        'Email không tồn tại',
        401,
      );
    }
    const otp = utils.generateOTP();
    // lưu opt vào db
    await AuthModel.insertOtp(email, otp);
    const info = {
      email,
      otp,
    };
    const res = await emailService.sendLoginOtp(info);
    return res;
  },
  isVerryOTP: async (email, otp) => {
    const getUser = await AuthModel.isEmail(email, true);
    if (getUser.length <= 0) {
      throw new ServiceError(
        message.Auth.INVALID_CREDENTIALS,
        code.Auth.INVALID_CREDENTIALS,
        'Email không tồn tại',
        401,
      );
    }

    // kiểm tra vs db
    const { valid, code, msg } = (await AuthModel.verifyOtp(email, otp)) ?? {};
    if (!valid) {
      throw new ServiceError(msg, code, msg, 402);
    }
    await AuthModel.updateOtp(email, 'null', false);
    // // Xóa tất cả session cũ và tạo session mới
    const user = getUser;
    await AuthModel.deleteSessionById(user.id);
    const accessToken = utils.createAccessToken(user);
    const refreshToken = utils.createRefreshToken(user);
    await AuthModel.insertSessionById(user.id, refreshToken);
    return { valid, refreshToken, accessToken, user };
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

  // lấy danh sách quyền
  getPremiss: async (user_id) => {
    if (!user_id) {
      throw new ServiceError(
        message.Auth.INVALID_USER,
        code.Auth.INVALID_USER,
        'Không thể xác định người dùng',
        400,
      );
    }
    const permissions = await AuthModel.getPremiss(user_id);
    const getUser = await AuthModel.getUserById(user_id);
    const user = getUser;
    return { user, permissions };
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
      if (!sessionData) {
        throw new ServiceError(
          message.Auth.SESSION_NOT_FOUND,
          code.Auth.SESSION_NOT_FOUND,
          'Phiên đăng nhập không tồn tại',
          403,
        );
      }

      // Kiểm tra refresh token có khớp không
      const storedRefreshToken = sessionData.refresh_token;
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
      if (!userData) {
        throw new ServiceError(
          message.Auth.USER_NOT_FOUND,
          code.Auth.USER_NOT_FOUND,
          'Không tìm thấy người dùng',
          404,
        );
      }

      const user = userData;

      // Xóa session cũ và tạo session mới
      await AuthModel.deleteSessionById(id);
      const newAccessToken = utils.createAccessToken(user);
      const newRefreshToken = utils.createRefreshToken(user);
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
};

export { AuthService };
