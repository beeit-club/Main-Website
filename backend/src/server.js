import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/index.js';
import cookieParser from 'cookie-parser';
import pool from './db.js';
import routers from './routers/index.js';
import { initSocket } from './socket/index.js';

// cấu hình đường dẫn thư mục
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Khởi tạo Express app
const app = express();
const httpServer = createServer(app);

// Middleware
app.use(
  cors({
    origin: config.API_FRONTEND,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const io = new Server(httpServer, {
  cors: {
    origin: `${config.API_FRONTEND}`,
    methods: ['GET', 'POST'],
  },
});
initSocket(io);
app.set('socketio', io);
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
const PORT = config.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});
