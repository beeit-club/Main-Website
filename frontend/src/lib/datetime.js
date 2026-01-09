export const formatDate = (dateString, includeTime = false) => {
  if (!dateString) return "-";
  const date = new Date(dateString);

  if (includeTime) {
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const OTP_LOCK_KEY = "otp_lock_until";

// 🔹 Hàm lưu thời gian khóa 1 phút (60s)
export function setOtpLock(durationMs = 60 * 1000) {
  if (typeof window === "undefined") return;
  const lockUntil = Date.now() + durationMs;
  localStorage.setItem(OTP_LOCK_KEY, lockUntil.toString());
}

// 🔹 Hàm kiểm tra còn thời gian khóa không
export function getOtpLockStatus() {
  if (typeof window === "undefined") return { locked: false, remaining: 0 };

  const lockUntil = parseInt(localStorage.getItem(OTP_LOCK_KEY) || "0", 10);
  const now = Date.now();

  // Thêm vùng đệm 500ms để tránh hiển thị "0 giây" mà vẫn khóa
  if (!lockUntil || lockUntil <= now + 500) {
    // Hết thời gian => xóa khóa
    localStorage.removeItem(OTP_LOCK_KEY);
    return { locked: false, remaining: 0 };
  }

  return {
    locked: true,
    remaining: lockUntil - now, // thời gian còn lại (ms)
  };
}

// 🔹 Xóa khóa thủ công (nếu cần reset)
export function clearOtpLock() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(OTP_LOCK_KEY);
  }
}
