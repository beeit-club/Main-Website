// src/controllers/auth.controller.js

import { AuthService } from '../../services/auth/index.js';
import { utils } from '../../utils/index.js';
import { message } from '../../common/message/index.js';
import asyncWrapper from '../../middlewares/error.handler.js';
import { config } from '../../config/index.js';
import AuthSchema from '../../validation/auth/auth.validation.js';

const authController = {
  //  Đăng ký
  register: asyncWrapper(async (req, res) => {
    await AuthSchema.register.validate(req.body, { abortEarly: false });

    const { fullname, email } = req.body;
    const result = await AuthService.registerUser(fullname, email);

    return utils.success(res, message.Auth.REGISTER_SUCCESS, {
      user_id: result.user_id,
      email: result.email,
      fullname: result.fullname,
    });
  }),

  //  Đăng nhập (gửi OTP)
  login: asyncWrapper(async (req, res) => {
    await AuthSchema.login.validate(req.body, { abortEarly: false });

    const { email } = req.body;
    const { TokenOTP } = await AuthService.loginUser(email);

    return utils.success(res, message.Auth.SEND_EMAIL_SUCCESS, { TokenOTP });
  }),

  //  Gửi OTP để xác minh
  sendotp: asyncWrapper(async (req, res) => {
    await AuthSchema.sendOtp.validate(req.body, { abortEarly: false });

    const { email, pin } = req.body;
    const { valid, refreshToken, accessToken, user } =
      await AuthService.isVerryOTP(email, pin);

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
      accessToken,
      user: userData,
    });
  }),

  //  Đăng nhập qua Google OAuth
  google: asyncWrapper(async (req, res) => {
    await AuthSchema.google.validate(req.body, { abortEarly: false });

    const { code, redirect_uri } = req.body;
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
      accessToken,
      user: userData,
    });
  }),

  //  Gửi lại email xác minh
  resendVerification: asyncWrapper(async (req, res) => {
    await AuthSchema.resendVerification.validate(req.body, {
      abortEarly: false,
    });

    const { email } = req.body;
    const result = await AuthService.resendVerification(email);

    return utils.success(res, message.Auth.SEND_EMAIL_SUCCESS, { result });
  }),

  //  Đăng xuất
  logout: asyncWrapper(async (req, res) => {
    const { id } = req.user || {};
    await AuthService.logoutUser(id);

    res.clearCookie('refreshToken');
    return utils.success(res, message.Auth.LOGOUT_SUCCESS, null);
  }),

  //  Lấy quyền của user
  permissions: asyncWrapper(async (req, res) => {
    const { id } = req.user || {};
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

  //  Lấy thông tin profile hiện tại
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
