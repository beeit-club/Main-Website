// src/socket/index.js

export const initSocket = (io) => {
  // Lắng nghe sự kiện kết nối mới
  io.on('connection', (socket) => {
    console.log(`Một người dùng đã kết nối: ${socket.id}`);

    // // Đăng ký các module xử lý sự kiện
    // chatModule(io, socket);
    // notificationsModule(io, socket);

    // Xử lý sự kiện ngắt kết nối
    socket.on('disconnect', () => {
      console.log(`Người dùng đã ngắt kết nối: ${socket.id}`);
    });
  });
};
