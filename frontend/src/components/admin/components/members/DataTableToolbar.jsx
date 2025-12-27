import React from "react";
import { Input } from "@/components/ui/input";
import { useDebouncedSearch } from "@/hooks/useDebounce";

export function DataTableToolbar({ table }) {
  const isFiltered = table.getState().columnFilters.length > 0;

  // useDebouncedSearch một hook tự custom để sử dụng làm độ trễ khi search
  const [searchValue, setSearchValue] = useDebouncedSearch(
    table.getState().globalFilter || "",
    table.setGlobalFilter,
    500 // 500ms delay
  );

  return (
    <div className="flex items-center justify-between py-4 gap-4">
      {/* Phía bên trái: Tìm kiếm */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Lọc Tìm kiếm (Chung) */}
        <Input
          placeholder="Tìm kiếm theo tên, email hoặc MSSV..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="max-w-xs w-full sm:w-64"
        />
      </div>
    </div>
  );
}

