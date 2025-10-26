import dotenv from 'dotenv';
dotenv.config();
export const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '60';
export const JWT_REFRESH_EXPIRES_IN =
  process.env.JWT_REFRESH_EXPIRES_IN || '604800';
export const JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN || 'kkkkkkkkkkk';
export const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN || 'kkkkkkkkkkk';
export const JWT_REFRESH_TOKEN_IN_DB = process.env.JWT_REFRESH_TOKEN_IN_DB || 7;
export const JWT_OTP_EXPIRES_IN = process.env.JWT_OTP_EXPIRES_IN || 300;
export const OTP_MAX_ATTEMPTS = process.env.OTP_MAX_ATTEMPTS || 5;

// gg

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 5;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 5;
export const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 5;
