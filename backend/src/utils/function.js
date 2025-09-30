import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
// Tạo access token

export function createAccessToken(user) {
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
}
export function createOtpToken(email) {
  return jwt.sign(
    {
      email: email,
    },
    config.JWT_ACCESS_TOKEN,
    { expiresIn: Number(config.JWT_OTP_EXPIRES_IN) },
  );
}
// Tạo refresh token
export function createRefreshToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    config.JWT_REFRESH_TOKEN,
    { expiresIn: Number(config.JWT_REFRESH_EXPIRES_IN) },
  );
}
