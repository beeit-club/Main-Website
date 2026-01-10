import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

export function DataTableToolbar({
  table,
  globalFilter,
  onGlobalFilterChange,
  customFilter, // <-- Nhận filter từ page.jsx
}) {
  return (
    <div className="flex items-center justify-between py-4 gap-4">
      <div className="flex items-center gap-2">
        {/* Input tìm kiếm (nhận state từ props) */}
        <Input
          placeholder="Tìm kiếm nội dung, người tạo..."
          value={globalFilter ?? ""}
          onChange={(e) => onGlobalFilterChange(e.target.value)}
          className="max-w-sm"
        />

        {/* Filter tùy chỉnh (VD: Lọc Thu/Chi) */}
        {customFilter}

        {/* Select Page Size */}
        <div>
          <select
            className="border rounded px-2 py-1"
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Nút Ẩn/Hiện Cột (giữ nguyên) */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Columns</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table
            .getAllColumns()
            .filter((col) => col.getCanHide())
            .map((col) => (
              <DropdownMenuCheckboxItem
                key={col.id}
                checked={col.getIsVisible()}
                onCheckedChange={(val) => col.toggleVisibility(!!val)}
              >
                {col.id}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
