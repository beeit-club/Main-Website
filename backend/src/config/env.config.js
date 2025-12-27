// config/env.config.js
// File tập trung để load biến môi trường một lần duy nhất
// Import file này ở đầu server.js trước tất cả các import khác

import dotenv from 'dotenv';

// Load biến môi trường từ .env file
dotenv.config();

// Export để các file khác có thể sử dụng nếu cần
export default process.env;

