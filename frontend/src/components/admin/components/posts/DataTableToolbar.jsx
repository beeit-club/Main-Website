// src/components/DataTableToolbar.jsx
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { useDebouncedSearch } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DataTableToolbar({ table, categoryList }) {
  const statusColumn = table.getColumn("status");
  const categoryColumn = table.getColumn("category_name");
  // useDebouncedSearch một hook tự custom để sử dụng làm độ trễ khi search
  const [searchValue, setSearchValue] = useDebouncedSearch(
    table.getState().globalFilter || "",
    table.setGlobalFilter,
    500 // 500ms delay
  );

  return (
    <div className="flex items-center justify-between py-4 gap-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Tìm kiếm..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="max-w-xs w-full sm:w-64"
        />
        {categoryColumn && (
          <Select
            value={categoryColumn.getFilterValue() || "all"}
            onValueChange={(value) => {
              categoryColumn.setFilterValue(value === "all" ? undefined : value);
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Trạng thái bài viết" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {categoryList.map((cate) => { return <SelectItem value={cate.id} key={cate.id}>{cate.name}</SelectItem> })}
            </SelectContent>
          </Select>
        )}
        {statusColumn && (
          <Select
            value={statusColumn.getFilterValue() || "all"}
            onValueChange={(value) => {
              statusColumn.setFilterValue(value === "all" ? undefined : value);
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Trạng thái bài viết" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="1">Hoạt động</SelectItem>
              <SelectItem value="0">Nháp</SelectItem>
            </SelectContent>
          </Select>
        )}
        <div>
        </div>
      </div>

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
