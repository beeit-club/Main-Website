"use client";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const SOCKET_URL = "http://localhost:8080";

const SocketComponent = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Kết nối đến Socket.IO server
    const socket = io(SOCKET_URL);

    // Lắng nghe sự kiện 'connect'
    socket.on("connect", () => {
      console.log("Đã kết nối thành công đến server!");
      setIsConnected(true);
    });

    // Lắng nghe một sự kiện tùy chỉnh từ server
    socket.on("notification:new_post", (data) => {
      const receivedMessage = `Nhận được thông báo bài viết mới: "${data.title}" của ${data.author}`;
      console.log(receivedMessage);
      setMessage(receivedMessage);
    });

    // Lắng nghe sự kiện 'disconnect'
    socket.on("disconnect", () => {
      console.log("Đã ngắt kết nối với server.");
      setIsConnected(false);
      setMessage("Đã ngắt kết nối.");
    });

    // Hàm dọn dẹp khi component unmount
    return () => {
      socket.disconnect();
    };
  }, []); // [] đảm bảo useEffect chỉ chạy một lần khi component được mount

  return (
    <div>
      <h1>Kết nối Socket.IO với Next.js</h1>
      <p>
        Trạng thái kết nối: **{isConnected ? "Đã kết nối" : "Đã ngắt kết nối"}**
      </p>
      {message && <p>Thông báo từ server: **{message}**</p>}

      <hr />

      <h2>Kiểm tra gửi sự kiện</h2>
      <button
        onClick={() => {
          // Gửi một sự kiện tùy chỉnh đến server
          // Ví dụ: 'chat:message'
          if (isConnected) {
            const testMessage = `Tin nhắn từ client vào lúc ${new Date().toLocaleTimeString()}`;
            socket.emit("chat:message", {
              message: testMessage,
            });
            console.log('Đã gửi sự kiện "chat:message"');
          } else {
            console.log("Chưa kết nối, không thể gửi sự kiện.");
          }
        }}
      >
        Gửi tin nhắn thử nghiệm
      </button>
    </div>
  );
};

export default SocketComponent;
