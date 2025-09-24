import dotenv from 'dotenv';
dotenv.config();
export const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '60';
export const JWT_REFRESH_EXPIRES_IN =
  process.env.JWT_REFRESH_EXPIRES_IN || '604800';
export const JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN || 'kkkkkkkkkkk';
export const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN || 'kkkkkkkkkkk';
export const JWT_REFRESH_TOKEN_IN_DB = process.env.JWT_REFRESH_TOKEN_IN_DB || 7;
