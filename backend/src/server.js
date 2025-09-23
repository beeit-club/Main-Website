import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/index.js';
import cookieParser from 'cookie-parser';
import pool from './db.js';
import routers from './routers/index.js';
// cấu hình đường dẫn thư mục
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Khởi tạo Express app
const app = express();

// Middleware
app.use(
  cors({
    origin: config.API_FRONTEND,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(
  '/uploads/public',
  express.static(path.join(__dirname, 'uploads/public')),
);

// Route mặc định test DB
app.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT NOW() AS currentTime');
    res.json({ message: 'Hello world', dbTime: rows[0].currentTime });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Router
app.use('/', routers);

// Lắng nghe port
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});
