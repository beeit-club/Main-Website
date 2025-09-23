import { utils } from '../utils/index.js';
import { AuthModel } from '../models/index.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

const authController = {
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

  // Đăng ký
  register: async (req, res) => {
    try {
      const { fullname, email, password } = req.body ?? {};
      const validationErrors = {};

      // Validation
      if (!fullname || fullname.length < 4) {
        validationErrors.fullname = ['Vui lòng nhập tên và dài hơn 4 ký tự'];
      }
      if (!email || !utils.isValidEmail(email)) {
        validationErrors.email = ['Vui lòng nhập email và đúng định dạng'];
      }
      if (!password || password.length < 6) {
        validationErrors.password = [
          'Vui lòng nhập mật khẩu và dài hơn 6 ký tự',
        ];
      }

      // Trả về lỗi validation
      if (Object.keys(validationErrors).length > 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Dữ liệu không hợp lệ',
          error: {
            code: 'VALIDATION_ERROR',
            fields: validationErrors,
          },
        });
      }

      // Kiểm tra email đã tồn tại chưa
      const existingEmail = await AuthModel.isEmail(email);
      if (existingEmail[0]?.so_luong > 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Email đã tồn tại trong hệ thống',
          error: {
            code: 'EMAIL_EXISTS',
            details: 'Vui lòng sử dụng email khác',
          },
        });
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

      if (result.affectedRows > 0) {
        return res.status(201).json({
          status: 'success',
          message: 'Đăng ký thành công',
          data: {
            user_id: result.insertId,
            email: email,
            fullname: fullname,
          },
        });
      } else {
        return res.status(400).json({
          status: 'error',
          message: 'Đăng ký thất bại',
          error: {
            code: 'REGISTRATION_FAILED',
            details: 'Không thể tạo tài khoản',
          },
        });
      }
    } catch (error) {
      console.error('Lỗi khi đăng ký:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Đã xảy ra lỗi khi đăng ký',
        error: {
          code: 'SERVER_ERROR',
          details: 'Vui lòng thử lại sau',
        },
      });
    }
  },

  // Đăng nhập
  login: async (req, res) => {
    try {
      const { email, password } = req.body || {};
      const validationErrors = {};

      // Validation
      if (!email || !utils.isValidEmail(email)) {
        validationErrors.email = ['Vui lòng nhập email và đúng định dạng'];
      }
      if (!password || password.length < 6) {
        validationErrors.password = [
          'Vui lòng nhập mật khẩu và dài hơn 6 ký tự',
        ];
      }

      // Trả về lỗi validation
      if (Object.keys(validationErrors).length > 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Dữ liệu không hợp lệ',
          error: {
            code: 'VALIDATION_ERROR',
            fields: validationErrors,
          },
        });
      }

      // Kiểm tra user tồn tại
      const getUser = await AuthModel.isEmail(email, true);
      if (getUser.length <= 0) {
        return res.status(401).json({
          status: 'error',
          message: 'Thông tin đăng nhập không chính xác',
          error: {
            code: 'INVALID_CREDENTIALS',
            details: 'Email hoặc mật khẩu không đúng',
          },
        });
      }

      const user = getUser[0];

      // Kiểm tra tài khoản có bị khóa không
      if (!user.is_active) {
        return res.status(403).json({
          status: 'error',
          message: 'Tài khoản đã bị khóa',
          error: {
            code: 'ACCOUNT_BLOCKED',
            details: 'Vui lòng liên hệ quản trị viên để được hỗ trợ',
          },
        });
      }

      // Kiểm tra mật khẩu
      const isPasswordValid = await bcryptjs.compare(
        password,
        user.password_hash,
      );
      if (!isPasswordValid) {
        return res.status(401).json({
          status: 'error',
          message: 'Thông tin đăng nhập không chính xác',
          error: {
            code: 'INVALID_CREDENTIALS',
            details: 'Email hoặc mật khẩu không đúng',
          },
        });
      }

      // Xóa tất cả session cũ của user này (đảm bảo chỉ đăng nhập 1 máy)
      await AuthModel.deleteSessionById(user.id);

      // Tạo token mới
      const accessToken = authController.createAccessToken(user);
      const refreshToken = authController.createRefreshToken(user);

      // Lưu session mới
      await AuthModel.insertSessionById(user.id, refreshToken);

      // Trả về thông tin user (không bao gồm sensitive data)
      const userData = {
        id: user.id,
        name: user.fullname,
        email: user.email,
        avatar: user.avatar_url,
        role: user.role_name || 'Guest',
      };

      res.cookie('refreshToken', refreshToken, {
        maxAge: Number(config.JWT_REFRESH_EXPIRES_IN),
        httpOnly: true,
        secure: config.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      return res.status(200).json({
        status: 'success',
        message: 'Đăng nhập thành công',
        data: {
          accessToken,
          user: userData,
        },
      });
    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Đã xảy ra lỗi khi đăng nhập',
        error: {
          code: 'SERVER_ERROR',
          details: 'Vui lòng thử lại sau',
        },
      });
    }
  },

  // Đăng xuất
  logout: async (req, res) => {
    try {
      const { id } = req.body || {};
      if (!id) {
        return res.status(400).json({
          status: 'error',
          message: 'Không thể xác định người dùng',
          error: {
            code: 'INVALID_USER',
            details: 'Vui lòng đăng nhập lại',
          },
        });
      }

      // Xóa session

      await AuthModel.logout(id);

      res.clearCookie('refreshToken');

      return res.status(200).json({
        status: 'success',
        message: 'Đăng xuất thành công',
        data: null,
      });
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Đã xảy ra lỗi khi đăng xuất',
        error: {
          code: 'SERVER_ERROR',
          details: 'Vui lòng thử lại sau',
        },
      });
    }
  },

  // Cấp lại access token
  refreshToken: async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          status: 'error',
          message: 'Bạn chưa đăng nhập',
          error: {
            code: 'NO_REFRESH_TOKEN',
            details: 'Vui lòng đăng nhập để tiếp tục',
          },
        });
      }

      // Verify refresh token
      jwt.verify(
        refreshToken,
        config.JWT_REFRESH_TOKEN,
        async (error, decoded) => {
          if (error) {
            return res.status(403).json({
              status: 'error',
              message: 'Token không hợp lệ hoặc đã hết hạn',
              error: {
                code: 'REFRESH_TOKEN_EXPIRED',
                details: 'Vui lòng đăng nhập lại',
              },
            });
          }

          const { id } = decoded;

          // Kiểm tra session trong database
          const sessionData = await AuthModel.checkSession(id);
          if (sessionData.length === 0) {
            return res.status(403).json({
              status: 'error',
              message: 'Phiên đăng nhập không tồn tại',
              error: {
                code: 'SESSION_NOT_FOUND',
                details: 'Vui lòng đăng nhập lại',
              },
            });
          }

          // Kiểm tra refresh token có khớp không
          const storedRefreshToken = sessionData[0].refresh_token;
          if (storedRefreshToken !== refreshToken) {
            return res.status(403).json({
              status: 'error',
              message: 'Token không hợp lệ',
              error: {
                code: 'INVALID_REFRESH_TOKEN',
                details: 'Token không khớp với hệ thống',
              },
            });
          }

          // Lấy thông tin user mới nhất
          const userData = await AuthModel.getUserById(id);
          if (userData.length === 0) {
            return res.status(404).json({
              status: 'error',
              message: 'Người dùng không tồn tại',
              error: {
                code: 'USER_NOT_FOUND',
                details: 'Tài khoản có thể đã bị xóa',
              },
            });
          }

          const user = userData[0];

          // Tạo token mới
          const newAccessToken = authController.createAccessToken(user);
          const newRefreshToken = authController.createRefreshToken(user);

          // Xóa session cũ và tạo session mới
          await AuthModel.deleteSessionById(id);

          await AuthModel.insertSessionById(id, newRefreshToken);

          res.cookie('refreshToken', newRefreshToken, {
            maxAge: Number(config.JWT_REFRESH_EXPIRES_IN),
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: 'lax',
          });

          return res.status(200).json({
            status: 'success',
            message: 'Cấp lại token thành công',
            data: {
              accessToken: newAccessToken,
            },
          });
        },
      );
    } catch (error) {
      console.error('Lỗi khi refresh token:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Đã xảy ra lỗi khi làm mới token',
        error: {
          code: 'SERVER_ERROR',
          details: 'Vui lòng thử lại sau',
        },
      });
    }
  },

  // Lấy thông tin profile user hiện tại
  getProfile: async (req, res) => {
    try {
      const { id } = req.user;

      const userData = await AuthModel.getUserById(id);
      if (userData.length === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'Người dùng không tồn tại',
          error: {
            code: 'USER_NOT_FOUND',
            details: 'Tài khoản có thể đã bị xóa',
          },
        });
      }

      const user = userData[0];
      // Loại bỏ sensitive data
      const { password_hash, ...userProfile } = user;

      return res.status(200).json({
        status: 'success',
        message: 'Lấy thông tin thành công',
        data: {
          user: userProfile,
        },
      });
    } catch (error) {
      console.error('Lỗi khi lấy profile:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Đã xảy ra lỗi khi lấy thông tin profile',
        error: {
          code: 'SERVER_ERROR',
          details: 'Vui lòng thử lại sau',
        },
      });
    }
  },
};

export default authController;
