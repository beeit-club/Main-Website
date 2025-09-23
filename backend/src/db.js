// db.js
import mysql from 'mysql2/promise';
import { config } from './config/index.js';
let pool;

try {
  pool = mysql.createPool({
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASS,
    database: config.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
  });

  // Test kết nối ngay khi khởi tạo
} catch (err) {
  console.error('❌ Error creating MySQL pool:', err.message);
}

export default pool;
