// src/services/auth.service.js

import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AuthModel } from '../../models/auth/index.js';
import { config } from '../../config/index.js';
import { code, message } from '../../common/message/index.js';
import ServiceError from '../../error/service.error.js';
import { utils } from '../../utils/index.js';
import emailService from '../email/emailService.js';
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

      // ✅ FIX #2: Kiểm tra tài khoản có bị khóa không
      // Điều này quan trọng để đảm bảo user bị khóa không thể refresh token
      if (!userData.is_active) {
        // Xóa session để user không thể refresh nữa
        await AuthModel.deleteSessionById(id);
        throw new ServiceError(
          message.Auth.ACCOUNT_BLOCKED,
          code.Auth.ACCOUNT_BLOCKED,
          'Tài khoản của bạn đã bị khóa',
          403,
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
    if (!userData) {
      throw new ServiceError(
        message.Auth.USER_NOT_FOUND,
        code.Auth.USER_NOT_FOUND,
        'Không tìm thấy người dùng',
        404,
      );
    }
    return userData;
  },

  // Logic cập nhật profile (client tự update)
  updateProfile: async (user_id, updateData) => {
    // Kiểm tra user tồn tại
    const userData = await AuthModel.getUserById(user_id);
    if (!userData) {
      throw new ServiceError(
        message.Auth.USER_NOT_FOUND,
        code.Auth.USER_NOT_FOUND,
        'Không tìm thấy người dùng',
        404,
      );
    }

    // Cập nhật thông tin
    // Lưu ý: Bảng users không có cột updated_by, chỉ có updated_at (tự động cập nhật)
    const result = await AuthModel.updateUser(user_id, updateData);

    // Lấy lại thông tin user sau khi update
    const updatedUser = await AuthModel.getUserById(user_id);
    return updatedUser;
  },

  // Yêu cầu đặt lại mật khẩu
  requestPasswordReset: async (email) => {
    try {
      const getUser = await AuthModel.isEmail(email, true);

      // isEmail trả về object, không phải array
      if (!getUser || !getUser.id) {
        // Không báo lỗi chi tiết để tránh email enumeration attack
        // Trả về success message để không tiết lộ email có tồn tại hay không
        return {
          message: 'Nếu email tồn tại, bạn sẽ nhận được mã OTP',
          expires_in: 15,
        };
      }

      const user = getUser;
      const resetCode = utils.generateOTP();

      // Lưu OTP vào database (sử dụng cùng cơ chế OTP như login)
      await AuthModel.insertOtp(email, resetCode);

      // Tạo reset token (optional - có thể dùng link thay vì chỉ OTP)
      const resetToken = jwt.sign(
        { email, type: 'password_reset' },
        config.JWT_ACCESS_TOKEN,
        { expiresIn: '15m' },
      );
      const resetLink = config.API_FRONTEND
        ? `${config.API_FRONTEND}/reset-password?token=${resetToken}`
        : null;

      // Gửi email
      try {
        await emailService.sendPasswordReset(user, resetCode, resetLink, 15);
      } catch (emailError) {
        console.error('Lỗi khi gửi email reset password:', emailError);
        // Không throw error để không tiết lộ email có tồn tại
      }

      return {
        message: 'Nếu email tồn tại, bạn sẽ nhận được mã OTP',
        expires_in: 15, // phút
      };
    } catch (error) {
      // Nếu có lỗi, vẫn trả về message chung để không tiết lộ email có tồn tại
      console.error('Lỗi khi yêu cầu reset password:', error);
      return {
        message: 'Nếu email tồn tại, bạn sẽ nhận được mã OTP',
        expires_in: 15,
      };
    }
  },

  // Đặt lại mật khẩu
  resetPassword: async (email, resetCode, newPassword) => {
    const getUser = await AuthModel.isEmail(email, true);
    if (!getUser || !getUser.id) {
      throw new ServiceError(
        message.Auth.INVALID_CREDENTIALS,
        code.Auth.INVALID_CREDENTIALS,
        'Email không tồn tại',
        401,
      );
    }

    // Xác minh OTP
    const {
      valid,
      code: errorCode,
      msg,
    } = (await AuthModel.verifyOtp(email, resetCode)) ?? {};
    if (!valid) {
      throw new ServiceError(msg, errorCode, msg, 402);
    }

    // Hash password mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật password trong database
    // LƯU Ý: Bảng users hiện tại không có cột password_hash
    // Cần thêm cột này vào database nếu muốn sử dụng password
    // ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) NULL;
    try {
      await AuthModel.updateUser(getUser.id, { password_hash: hashedPassword });
    } catch (dbError) {
      // Nếu cột password_hash chưa tồn tại, báo lỗi rõ ràng
      if (dbError.message?.includes('password_hash')) {
        throw new ServiceError(
          'Cột password_hash chưa được tạo trong database',
          'DATABASE_SCHEMA_ERROR',
          'Vui lòng thêm cột password_hash vào bảng users: ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) NULL;',
          500,
        );
      }
      throw dbError;
    }

    // ✅ FIX #4: Xóa tất cả session cũ để vô hiệu hóa refresh token
    // Điều này quan trọng để đảm bảo kẻ tấn công không thể dùng refresh token cũ
    // sau khi user reset password
    await AuthModel.deleteSessionById(getUser.id);

    // Xóa OTP sau khi đặt lại thành công
    await AuthModel.updateOtp(email, 'null', false);

    return {
      message: 'Đặt lại mật khẩu thành công',
    };
  },
};

export { AuthService };
