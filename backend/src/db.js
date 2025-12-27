// db.js
import mysql from 'mysql2/promise';
import { config } from './config/index.js';
let pool;

try {
  pool = mysql.createPool({
    host: config.DB_HOST,
    port: config.DB_PORT || 3306,
    user: config.DB_USER,
    password: config.DB_PASS,
    database: config.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });

  // Test kết nối ngay khi khởi tạo
  pool
    .getConnection()
    .then((connection) => {
      connection.release();
    })
    .catch((err) => {
      console.error('❌ Error connecting to database:', err.message);
      console.error('   Please check your database configuration in .env file');
      console.error(
        '   Required variables: DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT',
      );
    });
} catch (err) {
  console.error('❌ Error creating MySQL pool:', err.message);
}

export default pool;
