// src/controllers/auth.controller.js

import { AuthService } from '../../services/auth/index.js';
import { utils } from '../../utils/index.js';
import { message } from '../../common/message/index.js';
import asyncWrapper from '../../middlewares/error.handler.js';
import { config } from '../../config/index.js';

const authController = {
  // Đăng ký
  register: asyncWrapper(async (req, res) => {
    const { fullname, email, password } = req.body ?? {};
    const validationErrors = {};

    // Validation ở controller
    if (!fullname || fullname.length < 4) {
      validationErrors.fullname = ['Vui lòng nhập tên và dài hơn 4 ký tự'];
    }
    if (!email || !utils.isValidEmail(email)) {
      validationErrors.email = ['Vui lòng nhập email và đúng định dạng'];
    }
    if (!password || password.length < 6) {
      validationErrors.password = ['Vui lòng nhập mật khẩu và dài hơn 6 ký tự'];
    }

    if (Object.keys(validationErrors).length > 0) {
      return utils.validationError(
        res,
        validationErrors,
        message.Auth.VALIDATION_FAILED,
      );
    }

    const result = await AuthService.registerUser(fullname, email, password);

    return utils.success(res, message.Auth.REGISTER_SUCCESS, {
      user_id: result.user_id,
      email: result.email,
      fullname: result.fullname,
    });
  }),

  // Đăng nhập
  login: asyncWrapper(async (req, res) => {
    const { email, password } = req.body || {};
    const validationErrors = {};

    // Validation ở controller
    if (!email || !utils.isValidEmail(email)) {
      validationErrors.email = ['Vui lòng nhập email và đúng định dạng'];
    }
    if (!password || password.length < 6) {
      validationErrors.password = ['Vui lòng nhập mật khẩu và dài hơn 6 ký tự'];
    }

    if (Object.keys(validationErrors).length > 0) {
      return utils.validationError(
        res,
        validationErrors,
        message.Auth.VALIDATION_FAILED,
      );
    }

    const result = await AuthService.loginUser(email, password);

    const userData = {
      id: result.user.id,
      name: result.user.fullname,
      email: result.user.email,
      avatar: result.user.avatar_url,
      role: result.user.role_name || 'Guest',
    };

    res.cookie('refreshToken', result.refreshToken, {
      maxAge: Number(config.JWT_REFRESH_EXPIRES_IN),
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return utils.success(res, message.Auth.LOGIN_SUCCESS, {
      accessToken: result.accessToken,
      user: userData,
    });
  }),

  // Đăng xuất
  logout: asyncWrapper(async (req, res) => {
    const { id } = req.body || {};
    await AuthService.logoutUser(id);
    res.clearCookie('refreshToken');
    return utils.success(res, message.Auth.LOGOUT_SUCCESS, null);
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
