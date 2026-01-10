import React from "react";
import { Button } from "@/components/ui/button";

// --- 1. IMPORT CÁC COMPONENT CỦA SELECT ---
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Component Phân Trang Tái Sử Dụng
 * @param {object} props
 * @param {object} props.pagination - State pagination từ component cha ({ pageIndex, pageSize })
 * @param {object} props.meta - Đối tượng meta từ API ({ totalPages, total })
 * @param {function} props.setPagination - Hàm setter state pagination từ cha
 */
export function PaginationControls({ pagination, meta, setPagination }) {
  // Lấy state từ props
  const { pageIndex, pageSize } = pagination;
  // Lấy dữ liệu phân trang từ API
  const { totalPages = 0, total = 0 } = meta;

  // Tính toán trạng thái các nút
  const canPreviousPage = pageIndex > 0;
  const canNextPage = pageIndex < totalPages - 1;

  // Hàm điều hướng
  const goToPage = (index) => {
    const newPageIndex = Math.max(0, Math.min(index, totalPages - 1));
    setPagination((prev) => ({ ...prev, pageIndex: newPageIndex }));
  };

  const setPageSize = (size) => {
    // Khi đổi page size, luôn quay về trang 1
    setPagination((prev) => ({ ...prev, pageSize: size, pageIndex: 0 }));
  };

  // Nếu không có dữ liệu, không cần render
  if (total === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-between py-4">
      {/* Phía trái: Đếm số items & Select Page Size */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>
          Trang <strong>{pageIndex + 1}</strong> /{" "}
          <strong>{totalPages || 1}</strong>
          {" • "}
          Tổng: {total} items
        </span>

        {/* --- 2. THAY THẾ <select> BẰNG <Select> CỦA SHADCN/UI --- */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline">Số hàng:</span>
          <Select
            // value của Select phải là string
            value={`${pageSize}`}
            onValueChange={(value) => {
              // onValueChange trả về string, cần đổi lại thành Number
              setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="w-[100px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 50, 100].map((size) => (
                <SelectItem
                  key={size}
                  // value của SelectItem cũng phải là string
                  value={`${size}`}
                >
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Phía phải: Các nút điều hướng */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(0)}
          disabled={!canPreviousPage}
        >
          {"<<"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(pageIndex - 1)}
          disabled={!canPreviousPage}
        >
          Prev
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(pageIndex + 1)}
          disabled={!canNextPage}
        >
          Next
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(totalPages - 1)}
          disabled={!canNextPage || totalPages === 0}
        >
          {">>"}
        </Button>
      </div>
    </div>
  );
}
