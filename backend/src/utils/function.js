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

export function slugify(str = '') {
  if (!str) return '';

  return str
    .toString()
    .normalize('NFD') // Tách dấu khỏi ký tự (ví dụ: "ấ" -> "a" + "̂")
    .replace(/[\u0300-\u036f]/g, '') // Xóa toàn bộ dấu tiếng Việt
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Xóa ký tự đặc biệt (ngoại trừ khoảng trắng và -)
    .replace(/\s+/g, '-') // Chuyển khoảng trắng thành dấu gạch ngang
    .replace(/-+/g, '-'); // Xóa gạch ngang thừa liên tiếp
}
