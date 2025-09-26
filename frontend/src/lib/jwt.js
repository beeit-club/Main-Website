// utils/jwt.js
import { jwtDecode } from "jwt-decode";

export function decodeJWT(token) {
  try {
    if (!token) return null;
    return jwtDecode(token);
    // Tự động parse payload ra object { id, email, role, exp, ... }
  } catch (e) {
    console.error("Invalid JWT:", e);
    return null;
  }
}
