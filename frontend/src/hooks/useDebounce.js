import { useState, useEffect } from "react";

// Hook này dùng để trì hoãn việc gọi API khi người dùng đang gõ
export function useDebouncedSearch(globalFilter, setGlobalFilter, delay = 500) {
  // 1. State local để lưu giá trị gõ ngay lập tức
  const [searchValue, setSearchValue] = useState(globalFilter);

  // 2. useEffect để debounce (gọi hàm setGlobalFilter thật)
  useEffect(() => {
    // Đặt một bộ đếm thời gian
    const timer = setTimeout(() => {
      // Chỉ gọi khi giá trị local khác giá trị "thật"
      if (searchValue !== globalFilter) {
        setGlobalFilter(searchValue);
      }
    }, delay);

    // Hàm cleanup: Hủy bộ đếm nếu user gõ tiếp
    return () => {
      clearTimeout(timer);
    };
  }, [searchValue, globalFilter, setGlobalFilter, delay]); // Dependencies

  // 3. useEffect để đồng bộ ngược (khi bấm Reset)
  useEffect(() => {
    // Nếu globalFilter "thật" thay đổi (vd: bị reset về ""),
    // cập nhật lại state local
    setSearchValue(globalFilter);
  }, [globalFilter]);

  // 4. Trả về state local và setter của nó
  return [searchValue, setSearchValue];
}

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
