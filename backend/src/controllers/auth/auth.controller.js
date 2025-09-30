// src/controllers/auth.controller.js

import { AuthService } from '../../services/auth/index.js';
import { utils } from '../../utils/index.js';
import { message } from '../../common/message/index.js';
import asyncWrapper from '../../middlewares/error.handler.js';
import { config } from '../../config/index.js';
import { isValidEmail } from '../../utils/validate.js';

const authController = {
  // Đăng ký
  register: asyncWrapper(async (req, res) => {
    const { fullname, email } = req.body ?? {};
    const validationErrors = {};

    // Validation ở controller
    if (!fullname || fullname.length < 4) {
      validationErrors.fullname = ['Vui lòng nhập tên và dài hơn 4 ký tự'];
    }
    if (!email || !utils.isValidEmail(email)) {
      validationErrors.email = ['Vui lòng nhập email và đúng định dạng'];
    }

    if (Object.keys(validationErrors).length > 0) {
      return utils.validationError(
        res,
        validationErrors,
        message.Auth.VALIDATION_FAILED,
      );
    }

    const result = await AuthService.registerUser(fullname, email);

    return utils.success(res, message.Auth.REGISTER_SUCCESS, {
      user_id: result.user_id,
      email: result.email,
      fullname: result.fullname,
    });
  }),

  // Đăng nhập
  login: asyncWrapper(async (req, res) => {
    const { email } = req.body || {};

    const validationErrors = {};

    // Validation ở controller
    if (!email || !utils.isValidEmail(email)) {
      validationErrors.email = ['Vui lòng nhập email và đúng định dạng'];
    }
    if (Object.keys(validationErrors).length > 0) {
      return utils.validationError(
        res,
        validationErrors,
        message.Auth.VALIDATION_FAILED,
      );
    }

    const { TokenOTP } = (await AuthService.loginUser(email)) ?? {};

    return utils.success(res, message.Auth.SEND_EMAIL_SUCCESS, {
      TokenOTP: TokenOTP,
    });
  }),
  sendotp: asyncWrapper(async (req, res) => {
    const { email, pin } = req.body || {};
    const validationErrors = {};
    // Validation ở controller
    if (!email || !utils.isValidEmail(email)) {
      validationErrors.email = ['Vui lòng nhập email và đúng định dạng'];
    }
    if (!pin) {
      validationErrors.pin = ['Vui Lòng nhập mã pin'];
    }
    if (Object.keys(validationErrors).length > 0) {
      return utils.validationError(
        res,
        validationErrors,
        message.Auth.VALIDATION_FAILED,
      );
    }
    // kiểm tra opt xem có khớp không
    const { valid, refreshToken, accessToken, user } =
      (await AuthService.isVerryOTP(email, pin)) ?? {};
    res.cookie('refreshToken', refreshToken, {
      maxAge: Number(config.JWT_REFRESH_EXPIRES_IN),
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    const userData = {
      id: user.id,
      name: user.fullname,
      email: user.email,
      avatar: user.avatar_url,
      role: user.role_name || 'Guest',
    };
    return utils.success(res, message.Auth.LOGIN_SUCCESS, {
      accessToken: accessToken,
      user: userData,
    });
  }),
  // đăng nhạp bằng gg
  google: asyncWrapper(async (req, res) => {
    const { code, redirect_uri } = req.body ?? {};
    const validationErrors = {};
    if (!code || !redirect_uri) {
      validationErrors.code = ['Lỗi server thử lại '];
    }

    if (Object.keys(validationErrors).length > 0) {
      return utils.validationError(
        res,
        validationErrors,
        message.Auth.VALIDATION_FAILED,
      );
    }
    const { refreshToken, accessToken, user } = await AuthService.googleLogin(
      code,
      redirect_uri,
    );
    res.cookie('refreshToken', refreshToken, {
      maxAge: Number(config.JWT_REFRESH_EXPIRES_IN),
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    const userData = {
      id: user.id,
      name: user.fullname,
      email: user.email,
      avatar: user.avatar_url,
      role: user.role_name || 'Guest',
    };
    return utils.success(res, message.Auth.LOGIN_SUCCESS, {
      accessToken: accessToken,
      user: userData,
    });
  }),

  resendVerification: asyncWrapper(async (req, res) => {
    const { email } = req.body ?? {};
    const validationErrors = {};

    // Validation ở controller
    if (!email || !utils.isValidEmail(email)) {
      validationErrors.email = ['Vui lòng nhập email và đúng định dạng'];
    }
    if (Object.keys(validationErrors).length > 0) {
      return utils.validationError(
        res,
        validationErrors,
        message.Auth.VALIDATION_FAILED,
      );
    }
    const a = await AuthService.resendVerification(email);
    return utils.success(res, message.Auth.SEND_EMAIL_SUCCESS, {
      a,
    });
  }),

  // Đăng xuất
  logout: asyncWrapper(async (req, res) => {
    const { id } = req.user || {};
    await AuthService.logoutUser(id);
    res.clearCookie('refreshToken');
    return utils.success(res, message.Auth.LOGOUT_SUCCESS, null);
  }),

  permissions: asyncWrapper(async (req, res) => {
    const { id } = req.user ?? {};
    const { user, permissions } = await AuthService.getPremiss(id);

    const userData = {
      id: user.id,
      name: user.fullname,
      email: user.email,
      avatar: user.avatar_url,
      role: user.role_name || 'Guest',
    };
    return utils.success(res, message.Auth.GET_PERMISSIONS, {
      permissions,
      userData,
    });
  }),

  // Cấp lại access token
  refreshToken: asyncWrapper(async (req, res) => {
    const { accessToken, newRefreshToken } = await AuthService.refreshUserToken(
      req.cookies.refreshToken,
    );

    res.cookie('refreshToken', newRefreshToken, {
      maxAge: Number(config.JWT_REFRESH_EXPIRES_IN),
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return utils.success(res, message.Auth.REFRESH_TOKEN_SUCCESS, {
      accessToken,
    });
  }),

  // Lấy thông tin profile user hiện tại
  getProfile: asyncWrapper(async (req, res) => {
    const { id } = req.user;

    const user = await AuthService.getProfile(id);
    const { password_hash, ...userProfile } = user;

    return utils.success(res, message.Auth.PROFILE_SUCCESS, {
      user: userProfile,
    });
  }),
};

export default authController;
