// utils/jwt.js
import { jwtDecode } from "jwt-decode";
// giải mã lấy playload
export function decodeJWT(token) {
  try {
    // Nếu không có token
    if (!token || typeof token !== "string") return null;

    // Token JWT hợp lệ phải có 3 phần
    const parts = token.split(".");
    if (parts.length !== 3) {
      // console.error("Token không đúng định dạng JWT:", token);
      return null;
    }

    // Decode payload
    return jwtDecode(token);
  } catch (e) {
    // console.error("Invalid JWT:", e);
    return null;
  }
}
// kiểm tra xem token còn tg sống không
export function isTokenAlive(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    // Giải mã payload (base64url -> JSON)
    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
    );

    if (!payload.exp) return false;

    const now = Math.floor(Date.now() / 1000); // giây hiện tại
    return payload.exp > now;
  } catch (err) {
    return false;
  }
}
