"use client";
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

/**
 * Component để hiển thị thời gian relative (ví dụ: "2 giờ trước")
 * Chỉ format trên client để tránh hydration error
 * 
 * @param {string|Date} date - Ngày cần format
 * @param {string} className - CSS class tùy chọn
 * @param {string} prefix - Text prefix (ví dụ: "Đã hỏi")
 * @param {boolean} showFallback - Có hiển thị "..." khi đang load không
 */
export function ClientTimeAgo({ 
  date, 
  className = "", 
  prefix = "",
  showFallback = false 
}) {
  const [timeAgo, setTimeAgo] = useState(showFallback ? "..." : "");

  useEffect(() => {
    if (!date) return;
    
    try {
      const formatted = formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: vi,
      });
      setTimeAgo(formatted);
    } catch (error) {
      console.error("Error formatting date:", error);
      setTimeAgo("");
    }
  }, [date]);

  if (!timeAgo && !showFallback) return null;

  return (
    <span className={className} title={date ? new Date(date).toLocaleString() : ""}>
      {prefix && timeAgo ? `${prefix} ` : ""}
      {timeAgo}
    </span>
  );
}

