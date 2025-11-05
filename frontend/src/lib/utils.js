import { clsx } from "clsx";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export const formatCurrency = (value) => {
  if (isNaN(value)) {
    value = 0;
  }
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};
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
