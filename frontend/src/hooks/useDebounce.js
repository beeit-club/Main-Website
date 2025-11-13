import { useState, useEffect } from "react";

// Hook này dùng để trì hoãn việc gọi API khi người dùng đang gõ
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Đặt hẹn giờ để cập nhật giá trị sau khi hết thời gian delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Hủy hẹn giờ nếu giá trị thay đổi (hoặc component unmount)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Chỉ chạy lại effect nếu value hoặc delay thay đổi

  return debouncedValue;
}
